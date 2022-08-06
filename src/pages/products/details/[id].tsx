import type { NextPage } from "next";
import { useRouter } from "next/router";
import { Field, Form, Formik } from "formik";
import { toast } from "react-toastify";
import { useState } from "react";

import Layout from "../../../layouts";
import { Price } from "../../../components/price";
import Dialog from "../../../components/dialog";

import { trpc } from "../../../utils/trpc";
import { ProductFull } from "../../../utils/types";
import { CATEGORY_TYPES } from "../../../utils/constants";
import { useQuery, useQueryClient } from "react-query";
import { Category } from "@prisma/client";

function AddCategoryDialog() {
  // const [page, setPage] = useState(0);
  // const [lastVars, setLastVars] = useState({ name: "", type: "" });
  // const client = useQueryClient();
  // const { data: results } = useQuery<Map<number, Category[]>>(
  //   "add_category_to_product",
  //   { enabled: false }
  // );
  // const { mutateAsync } = trpc.useMutation(["categories.search"], {
  // onSuccess(data, variables, context) {
  //   client.setQueryData(
  //     "add_category_to_product",
  //     (oldData: Map<number, Category[]> | undefined) => {
  //       let map = oldData;
  //       if (!map) map = new Map<number, Category[]>();
  //       map.set(variables.page || 0, data);
  //       return map;
  //     }
  //   );
  // },
  // });

  return (
    <Dialog>
      <h1>Search categories</h1>
      <Formik
        initialValues={{ name: "", type: "all" }}
        onSubmit={async (data) => {
          if (!data.name)
            return toast(
              "Must enter at least one character for the category name",
              { type: "error" }
            );

          // setLastVars(data);
          // const promise = mutateAsync({ name: "", type: "", page: 0 });
          // toast.promise(promise, {
          //   pending: "Fetching categories...",
          //   success: "Fetched categories",
          //   error: "Could not fetch categories",
          // });
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
      {/* {!results || !results.has(page) ? (
        <p>Results will appear here</p>
      ) : (
        <>
          <div>{JSON.stringify(results.get(page), null, 2)}</div>
          <div className="flex gap-2">
            <div
              onClick={() => {
                setPage(page - 1);
                mutateAsync({ ...lastVars, page: page - 1 });
              }}
            >
              Prev
            </div>
            <div>{page}</div>
            <div
              onClick={() => {
                setPage(page + 1);
                mutateAsync({ ...lastVars, page: page + 1 });
              }}
            >
              Next
            </div>
          </div>
        </>
      )} */}
    </Dialog>
  );
}

function RenderPage(props: ProductFull) {
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
        props.categories?.map((x) => (
          <div key={x.category?.id} className="text-gray-600 hover:underline">
            {x.category?.name}
          </div>
        ))
      )}
      <button className="text-sm">Add category</button>

      <AddCategoryDialog />
    </div>
  );
}

const Products: NextPage = () => {
  const { query } = useRouter();
  const id = query.id as string;
  const { data, isLoading } = trpc.useQuery(["products.getById", { id }]);
  return (
    <Layout title={`Product ${data?.name}`}>
      <h1>Product #{id}</h1>
      {isLoading ? "Loading..." : <RenderPage {...data} />}
    </Layout>
  );
};
export default Products;
