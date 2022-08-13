import type { NextPage } from "next";
import { Field, Form, Formik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

import Layout from "../../../layouts";
import { trpc } from "../../../utils/trpc";
import BackButton from "../../../components/back-button";
import FormikErrors from "../../../components/formik-errors";

const EditProduct: NextPage = () => {
  const router = useRouter();
  const { data: product, isLoading } = trpc.useQuery([
    "products.one",
    { id: router.query.id as string },
  ]);
  const { mutateAsync } = trpc.useMutation(["products.edit"]);

  if (isLoading) return null;
  if (!product) return null;
  return (
    <Layout title="New Product">
      <BackButton
        to={`/products/details/${product.id}`}
        name="Back to details"
      />
      <h1>Edit Product</h1>
      <p>Edit this product</p>

      <Formik
        initialValues={{
          name: product.name || "",
          desc: product.desc || "",
          price: product.price || 1,
          SKU: product.SKU || "",
        }}
        validationSchema={yup.object().shape({
          name: yup.string().trim().min(1).required(),
          desc: yup.string().trim().min(1).required(),
          price: yup.number().positive().required(),
          SKU: yup.string().required(),
        })}
        onSubmit={async (values) => {
          const promise = mutateAsync({ id: product.id, ...values });
          toast.promise(promise, {
            pending: "Editing...",
            success: "Edited Successfully!",
            error: "Something went wrong.",
          });
        }}
      >
        <Form className="flex flex-col gap-4">
          <FormikErrors />
          <Field name="name" placeholder="Product name" />
          <Field name="desc" placeholder="Product description" />
          <Field name="SKU" placeholder="SKU" />
          <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <b className="flex-none">Product price</b>
            <Field name="price" placeholder="Product price" type="number" />
          </div>
          <button type="submit">Edit</button>
        </Form>
      </Formik>
    </Layout>
  );
};
export default EditProduct;
