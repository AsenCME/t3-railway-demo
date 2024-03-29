import type { NextPage } from "next";
import { useRouter } from "next/router";
import { Field, Form, Formik } from "formik";
import { toast } from "react-toastify";
import { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { Category } from "@prisma/client";

import Layout from "../../../layouts";
import { Price } from "../../../components/price";
import Dialog from "../../../components/dialog";
import PageControls from "../../../components/page-controls";

import { trpc } from "../../../utils/trpc";
import { CATEGORY_TYPES, DEFAULT_LIMIT } from "../../../utils/constants";
import { OneProductReturnType } from "../../../server/router/product";
import Link from "next/link";

interface AddCategoryDialogProps {
  dialog: boolean;
  setDialog: (b: boolean) => void;
  product_id: string | undefined;
  product_categories: string[];
}
function AddCategoryDialog({
  dialog,
  setDialog,
  product_id,
  product_categories,
}: AddCategoryDialogProps) {
  const [page, setPage] = useState(0);
  const [lastVars, setLastVars] = useState({ name: "", type: "" });

  // Made-up query
  const client = useQueryClient();
  const { data: results } = useQuery<Map<number, Category[]>>(
    "add_category_to_product",
    { enabled: false }
  );

  // search in categories (saves to made-up query)
  const { mutateAsync } = trpc.useMutation(["categories.search"], {
    onSuccess(data, variables, context) {
      client.setQueryData(
        "add_category_to_product",
        (oldData: Map<number, Category[]> | undefined) => {
          let map = oldData;
          if (!map) map = new Map<number, Category[]>();
          map.set(variables.page || 0, data);
          return map;
        }
      );
    },
  });

  // adds category to product (invalides product query)
  const utils = trpc.useContext();
  const { mutateAsync: addToProduct } = trpc.useMutation(
    ["categories.addToProduct"],
    {
      onSuccess() {
        if (product_id)
          utils.invalidateQueries(["products.one", { id: product_id }]);
      },
    }
  );

  if (!dialog) return null;
  return (
    <Dialog title="Search categories" onClose={() => setDialog(false)}>
      <Formik
        initialValues={{ name: "", type: "all" }}
        onSubmit={async (data) => {
          if (!data.name)
            return toast(
              "Must enter at least one character for the category name",
              { type: "error" }
            );

          setLastVars(data);
          const promise = mutateAsync({ ...data, page: 0 });
          toast.promise(promise, {
            pending: "Fetching categories...",
            success: "Fetched categories",
            error: "Could not fetch categories",
          });
        }}
      >
        {(props) => (
          <Form className="flex gap-4">
            <Field name="name" placeholder="Category name" />
            <Field name="type" placeholder="Category type" as="select">
              <option value={"all"}>All</option>
              {CATEGORY_TYPES.map((x) => (
                <option value={x} key={x}>
                  {x}
                </option>
              ))}
            </Field>
            <button type="submit">Search</button>
          </Form>
        )}
      </Formik>

      <h6>Results</h6>
      {!results || !results.has(page) ? (
        <p>Results will appear here</p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-2">
            {results.get(page)?.map((x) => (
              <div
                key={x.id}
                onClick={() => {
                  if (product_categories.includes(x.id))
                    return toast("Category already attached to product");

                  if (!product_id) return toast("Something is wrong...");
                  const promise = addToProduct({
                    category_id: x.id,
                    product_id,
                  });
                  toast.promise(promise, {
                    pending: "Adding...",
                    success: "Added to product",
                    error: "Could not add to product",
                  });
                }}
                className="p-2 rounded bg-gray-50 hover:bg-gray-100 cursor-pointer"
              >
                <div className="font-bold">
                  {x.name} {product_categories.includes(x.id) ? "(Added)" : ""}
                </div>
              </div>
            ))}
          </div>
          {page === 0 && results.get(page)?.length !== DEFAULT_LIMIT ? null : (
            <PageControls
              page={page}
              onPrev={() => {
                if (page === 0) return toast("You're at the first page");
                setPage(page - 1);
                mutateAsync({ ...lastVars, page: page - 1 });
              }}
              onNext={() => {
                if (results.get(page)?.length !== DEFAULT_LIMIT)
                  return toast("No more categories");
                setPage(page + 1);
                mutateAsync({ ...lastVars, page: page + 1 });
              }}
            />
          )}
        </>
      )}
    </Dialog>
  );
}

// ! one product is only in a couple categories
// ! but one category can have many, many products
function RenderPage(props: OneProductReturnType) {
  const [dialog, setDialog] = useState(false);

  const router = useRouter();

  const utils = trpc.useContext();
  const { mutateAsync: removeFromProduct } = trpc.useMutation(
    ["categories.removeFromProduct"],
    {
      onSuccess(data, variables, context) {
        utils.invalidateQueries(["products.one", { id: variables.product_id }]);
      },
    }
  );

  if (!props) return <div>Product not found</div>;
  return (
    <div>
      <h6>Basic Details</h6>
      <div>{props.name}</div>
      <div>{props.desc}</div>
      <div>SKU: {props.SKU || "No SKU specified"}</div>
      <Price
        price={props.price}
        discount_percent={props.discount?.discount_percent}
      />

      <h6>Categories</h6>
      {!props.categories?.length ? (
        <p>This product has no categories.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 mb-4">
          {props.categories?.map((x) => (
            <div
              key={x.category?.id}
              className="p-2 rounded transition bg-gray-50 hover:ring-2 hover:ring-gray-400 cursor-pointer"
            >
              <div className="font-bold">{x.category?.name}</div>
              <div className="text-gray-600">{x.category?.desc}</div>
              <div className="flex gap-2 justify-end mt-2">
                <button
                  className="small"
                  onClick={() =>
                    router.push(`/categories/details/${x.category?.id}`)
                  }
                >
                  View
                </button>
                <button
                  className="small bg-red-700"
                  onClick={() => {
                    if (!x.category?.id || !props.id)
                      return toast("Insufficient data.");
                    const promise = removeFromProduct({
                      category_id: x.category.id,
                      product_id: props.id,
                    });
                    toast.promise(promise, {
                      pending: "Removing...",
                      error: "Could not remove.",
                      success: "Removed!",
                    });
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <button className="text-sm" onClick={() => setDialog(true)}>
        Add category
      </button>

      <AddCategoryDialog
        {...{ dialog, setDialog }}
        product_id={props.id}
        product_categories={
          props.categories?.map((x) => x.category?.id || "") || []
        }
      />

      <h6>Inventory</h6>
      <div className="flex gap-1 items-baseline">
        <span className="text-2xl font-bold text-gray-600">
          {props.inventory?.qty}
        </span>
        <span className="text-sm">Units</span>
      </div>
      <button className="small bg-amber-500 mt-2">Edit inventory</button>

      <h6>Discount</h6>
      {!props.discount ? (
        <>
          <p>No discount</p>
          <button className="small bg-green-500 mt-2">Add Discount</button>
        </>
      ) : (
        <>
          <div>
            <b>{props.discount.name}</b>
          </div>
          <div>{props.discount.desc}</div>
          <div>{props.discount.discount_percent}%</div>
          <button className="small bg-amber-500">Edit Discount</button>
        </>
      )}
    </div>
  );
}

const ProductDetails: NextPage = () => {
  const { query } = useRouter();
  const id = query.id as string;
  const { data, isLoading } = trpc.useQuery(["products.one", { id }]);
  return (
    <Layout title="Product Details">
      <div className="flex justify-between">
        <div>
          <h1>Product Details</h1>
          <p>Information about {data?.name}</p>
        </div>
        <Link href={`/products/edit/${id}`}>
          <button className="small bg-amber-500">Edit Product</button>
        </Link>
      </div>
      {isLoading ? "Loading..." : <RenderPage {...data} />}
    </Layout>
  );
};
export default ProductDetails;
