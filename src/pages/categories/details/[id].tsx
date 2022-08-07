import { Product } from "@prisma/client";
import { Field, Form, Formik } from "formik";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import * as yup from "yup";

import Dialog from "../../../components/dialog";
import PageControls from "../../../components/page-controls";
import Layout from "../../../layouts";
import { DEFAULT_LIMIT } from "../../../utils/constants";
import { trpc } from "../../../utils/trpc";

type ResultsQuery = Map<number, Product[]>;
interface AddProductDialogProps {
  product_categories: string[];
  category_id: string;
  dialog: boolean;
  setDialog: (v: boolean) => void;
  onAddProduct: () => void;
}
function AddProductDialog(props: AddProductDialogProps) {
  const [page, setPage] = useState(0);
  const [lastName, setLastName] = useState("");

  const client = useQueryClient();
  const utils = trpc.useContext();
  const { data: results } = useQuery<ResultsQuery>([
    "add_product_dialog",
    lastName,
  ]);
  const products = useMemo(() => results?.get(page) || [], [results]);

  const { mutateAsync } = trpc.useMutation(["products.search"], {
    onSuccess(data, variables, context) {
      client.setQueryData(
        ["add_product_dialog", variables.name],
        (previousData?: ResultsQuery) => {
          let map = previousData;
          if (!map) map = new Map<number, Product[]>();
          map.set(variables.page, data);
          return map;
        }
      );
    },
  });
  const { mutateAsync: addToCategory } = trpc.useMutation(
    ["products.addToCategory"],
    {
      onSuccess(data, variables, context) {
        utils.invalidateQueries(
          ["products.forCategory", { id: variables.category_id }],
          { exact: false }
        );
      },
    }
  );

  const getProducts = (searchName: string, searchPage: number) => {
    const promise = mutateAsync({ name: searchName, page: searchPage });
    toast.promise(promise, {
      pending: "Fetching products",
      success: "Fetched products",
      error: "Could not get product",
    });
  };

  if (!props.dialog) return null;
  return (
    <Dialog title="Add Product" onClose={() => props.setDialog(false)}>
      <Formik
        initialValues={{ name: "" }}
        validationSchema={yup
          .object()
          .shape({ name: yup.string().trim().min(1) })}
        onSubmit={async (data) => {
          setLastName(data.name);
          setPage(0);
          getProducts(data.name, 0);
        }}
      >
        <Form className="grid grid-cols-2 md:grid-cols-3 gap-2">
          <Field
            name="name"
            placeholder="Some product"
            className="col-span-1 md:col-span-2"
          />
          <button type="submit">Search</button>
        </Form>
      </Formik>

      <h6>Results</h6>
      {!products.length ? (
        <p>Results will appear here</p>
      ) : (
        <div>
          <div className="flex flex-col gap-2 mb-4">
            {products.map((x) => (
              <div
                key={x.id}
                onClick={() => {
                  if (props.product_categories.includes(x.id))
                    return toast("Product already in category");
                  const promise = addToCategory({
                    category_id: props.category_id,
                    product_id: x.id,
                  });
                  toast.promise(promise, {
                    pending: "Adding to category",
                    success: "Added!",
                    error: "Something went wrong...",
                  });
                }}
                className="transition cursor-pointer p-2 rounded bg-gray-50 hover:ring-2 hover:ring-gray-400"
              >
                {props.product_categories.includes(x.id) && (
                  <div className="uppercase text-xs tracking-widest">Added</div>
                )}
                <div className="font-bold truncate">{x.name}</div>
                <div className="text-gray-600 truncate">{x.desc}</div>
              </div>
            ))}
          </div>
          <PageControls
            page={page}
            onPrev={() => {
              if (page === 0) return toast("You're at the first page.");
              setPage(page - 1);
              getProducts(lastName, page - 1);
            }}
            onNext={() => {
              if (products.length !== DEFAULT_LIMIT)
                return toast("No more products");
              setPage(page + 1);
              getProducts(lastName, page + 1);
            }}
          />
        </div>
      )}
    </Dialog>
  );
}

const Categories: NextPage = () => {
  const [dialog, setDialog] = useState(false);

  const router = useRouter();
  const { data, isLoading } = trpc.useQuery([
    "categories.one",
    { id: router.query.id as string },
  ]);

  const [page, setPage] = useState(0);
  const { data: products } = trpc.useQuery([
    "products.forCategory",
    { id: router.query.id as string, page },
  ]);

  const utils = trpc.useContext();
  const { mutateAsync: removeFromCategory } = trpc.useMutation(
    ["products.removeFromCategory"],
    {
      onSuccess(data, variables, context) {
        // todo pages would jump when deleting
        setPage(0);
        utils.invalidateQueries([
          "products.forCategory",
          { id: variables.category_id },
        ]);
      },
    }
  );

  return (
    <Layout title="Category Details">
      <h1>Single Category</h1>

      <h6>Basic Information</h6>
      {isLoading ? (
        "Loading..."
      ) : (
        <div>
          <div className="text-sm text-gray-600">{data?.type}</div>
          <div className="font-bold">{data?.name}</div>
          <div>{data?.desc}</div>
        </div>
      )}

      <h6>Category Products</h6>
      <div className="grid grid-cols-2 gap-4 mb-4">
        {products?.map((x) => (
          <div
            key={x.product_id + "_" + x.category_id}
            className="bg-gray-50 hover:ring-2 hover:ring-gray-400 rounded p-2 transition-all cursor-pointer"
          >
            <div className="font-bold">{x.product?.name}</div>
            <div className="text-gray-600">{x.product?.desc}</div>
            <div className="flex justify-end gap-2 mt-2">
              <button
                className="small"
                onClick={() => router.push(`/products/details/${x.product_id}`)}
              >
                View
              </button>
              <button
                className="small bg-red-700"
                onClick={() =>
                  toast.promise(
                    () =>
                      removeFromCategory({
                        product_id: x.product_id,
                        category_id: x.category_id,
                      }),
                    {
                      pending: "Deleting...",
                      success: "Deleted!",
                      error: "Something went wrong...",
                    }
                  )
                }
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* // todo add page */}
      <button onClick={() => setDialog(true)}>Add Product</button>

      <AddProductDialog
        {...{
          dialog,
          setDialog,
          category_id: router.query.id as string,
          onAddProduct: () => setPage(0),
          product_categories: products?.map((x) => x.product_id) || [],
        }}
      />
    </Layout>
  );
};
export default Categories;
