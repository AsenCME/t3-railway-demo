import { NextPage } from "next";
import { Field, Form, Formik } from "formik";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import * as yup from "yup";

import { trpc } from "../../utils/trpc";
import { PASSWORD_REGEX } from "../../utils/constants";

import Layout from "../../layouts";
import FormikErrors from "../../components/formik-errors";

const NewAccount: NextPage = () => {
  const { mutateAsync, isLoading } = trpc.useMutation(["auth.createUser"]);
  const { replace } = useRouter();

  return (
    <Layout title="Create an account">
      <h1>Create a new account</h1>
      <p>
        An account allows you to view past orders quickly and unlocks discounts.
      </p>
      <Formik
        validateOnBlur={true}
        initialValues={{
          email: "",
          username: "",
          password: "",
          repeat_password: "",
        }}
        validationSchema={yup.object().shape({
          email: yup.string().email().trim(),
          username: yup.string(),
          password: yup
            .string()
            .matches(
              PASSWORD_REGEX,
              "Password must be between 6 and 16 digits and contain at least 1 uppercase character, 1 lowercase character, 1 digit and one special characte"
            ),
          repeat_password: yup
            .string()
            .oneOf([yup.ref("password")], "Passwords do not match"),
        })}
        onSubmit={async (data) => {
          const promise = mutateAsync({ ...data });
          toast.promise(promise, {
            pending: "Creating account...",
            success: "Account created successfully",
            error: "There was an error.",
          });
          await promise;
          replace("/");
        }}
      >
        <Form className="flex flex-col gap-4">
          <FormikErrors />
          <Field name="email" placeholder="Email" />
          <Field name="username" placeholder="Username" />
          <Field name="password" placeholder="Password" />
          <Field name="repeat_password" placeholder="Repeat password" />
          <button type="submit">
            {isLoading ? "Loading..." : "Create an account"}
          </button>
        </Form>
      </Formik>
    </Layout>
  );
};
export default NewAccount;
