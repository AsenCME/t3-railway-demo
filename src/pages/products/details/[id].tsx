import type { NextPage } from "next";
import { useRouter } from "next/router";
import { Field, Form, Formik } from "formik";
import { toast } from "react-toastify";
import { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { Category } from "@prisma/client";
import Link from "next/link";

import Layout from "../../../layouts";
import { Price } from "../../../components/price";
import Dialog from "../../../components/dialog";
import PageControls from "../../../components/page-controls";

import { trpc } from "../../../utils/trpc";
import { CATEGORY_TYPES, DEFAULT_LIMIT } from "../../../utils/constants";
import { OneProductReturnType } from "../../../server/router/product";

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

function RenderPage(props: OneProductReturnType) {
  const [dialog, setDialog] = useState(false);
  if (!props) return <div>Product not found</div>;
  return (
    <div>
      <h6>Basic Details</h6>
      <div>{props.name}</div>
      <div>{props.desc}</div>
      <Price
        price={props.price}
        discount_percent={props.discount?.discount_percent}
      />

      <h6>Categories</h6>
      {!props.categories?.length ? (
        <p>This product has no categories.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
          {props.categories?.map((x) => (
            <Link
              key={x.category?.id}
              href={`/categories/details/${x.category?.id}`}
            >
              <div className="p-2 rounded transition bg-gray-50 hover:ring-2 hover:ring-gray-400 cursor-pointer">
                <div className="text-gray-600 font-bold">
                  {x.category?.name}
                </div>
              </div>
            </Link>
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
    </div>
  );
}

const Products: NextPage = () => {
  const { query } = useRouter();
  const id = query.id as string;
  const { data, isLoading } = trpc.useQuery(["products.one", { id }]);
  return (
    <Layout title={`Product ${data?.name}`}>
      <h1>Product #{id}</h1>
      {isLoading ? "Loading..." : <RenderPage {...data} />}
    </Layout>
  );
};
export default Products;
