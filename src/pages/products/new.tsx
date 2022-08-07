import type { NextPage } from "next";
import { Field, Form, Formik } from "formik";
import * as yup from "yup";

import Layout from "../../layouts";
import { trpc } from "../../utils/trpc";
import { toast } from "react-toastify";

const NewProduct: NextPage = () => {
  const { mutateAsync } = trpc.useMutation(["products.create"]);
  return (
    <Layout title="New Product">
      <h1>New Product</h1>
      <p>Create a product</p>

      <Formik
        initialValues={{ name: "", desc: "", price: 1, qty: 0, SKU: "" }}
        validationSchema={yup.object().shape({
          name: yup.string().trim().min(1).required(),
          desc: yup.string().trim().min(1).required(),
          price: yup.number().positive().required(),
          qty: yup.number().positive().required(),
          SKU: yup.string().required(),
        })}
        onSubmit={async (data) => {
          const promise = mutateAsync({ ...data });
          toast.promise(promise, {
            pending: "Creating...",
            success: "Created!",
            error: "Something went wrong.",
          });
        }}
      >
        {(props) => (
          <Form className="flex flex-col gap-4">
            {Object.keys(props.errors).length > 0 && (
              <div className="p-2 mb-4 rounded bg-red-700 text-white flex flex-col gap-2">
                {Object.entries(props.errors).map(([k, v]) => (
                  <div key={k} className="hover:text-gray-300">
                    <b>{k}</b>: {v}
                  </div>
                ))}
              </div>
            )}
            <Field name="name" placeholder="Product name" />
            <Field name="desc" placeholder="Product description" />
            <Field name="SKU" placeholder="SKU" />
            <div className="col-span-2 grid grid-cols-2 gap-4">
              <b className="flex-none">Product price</b>
              <Field name="price" placeholder="Product price" type="number" />
            </div>
            <div className="col-span-2 grid grid-cols-2 gap-4">
              <b className="flex-none">Inventory quantity</b>
              <Field
                name="qty"
                placeholder="Inventory quantity"
                type="number"
              />
            </div>
            <button type="submit">Create</button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};
export default NewProduct;
