import { NextPage } from "next";
import { Field, Form, Formik } from "formik";
import * as yup from "yup";
import { signIn } from "next-auth/react";

import Layout from "../../layouts";
import FormikErrors from "../../components/formik-errors";
import { PASSWORD_SCHEMA } from "../../utils/validation";
import { toast } from "react-toastify";

const NewAccount: NextPage = () => {
  return (
    <Layout title="Create an account">
      <h1>Sign into your account</h1>
      <p>Example text</p>
      <Formik
        validateOnBlur={true}
        initialValues={{ email: "", password: "" }}
        validationSchema={yup.object().shape({
          email: yup.string().email().trim(),
          password: PASSWORD_SCHEMA,
        })}
        onSubmit={async (data) => {
          const promise = signIn("credentials", {
            ...data,
            callbackUrl: `${window.location.host}/`,
          });
          toast.promise(promise, {
            pending: "Signing you in...",
            success: "Logged in!",
            error: "Something went wrong",
          });
        }}
      >
        <Form className="flex flex-col gap-4">
          <FormikErrors />
          <Field name="email" placeholder="Email" />
          <Field name="password" placeholder="Password" />
          <button type="submit">Sign in</button>
        </Form>
      </Formik>
    </Layout>
  );
};
export default NewAccount;
