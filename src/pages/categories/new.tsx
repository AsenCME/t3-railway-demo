import type { NextPage } from "next";
import * as yup from "yup";
import { Field, Form, Formik } from "formik";
import { toast } from "react-toastify";

import { trpc } from "../../utils/trpc";
import { CATEGORY_TYPES } from "../../utils/constants";

import Layout from "../../layouts";
import BackButton from "../../components/back-button";
import CategoryComponent from "../../components/category";

const NewCategory: NextPage = () => {
  const { data: recentlyCreated } = trpc.useQuery(["categories.recent"]);
  const { mutateAsync, isLoading } = trpc.useMutation(["categories.create"]);

  return (
    <Layout title="New Category Page">
      <BackButton name="All Categories" to="/categories" />
      <h1 className="text-2xl font-bold mb-4">Create New Category</h1>
      <Formik
        onSubmit={(data) => {
          const mutation = mutateAsync({
            name: data.name,
            desc: data.desc,
            type: data.type,
          });
          // todo maybe wrapper?
          toast.promise(mutation, {
            success: "Category successfully created!",
            pending: "Creating category...",
            error: "Category could not be created",
          });
        }}
        initialValues={{ name: "", desc: "", type: "brand" }}
        validationSchema={yup.object().shape({
          data: yup.string().min(2),
          desc: yup.string().min(2),
          type: yup.string().oneOf(CATEGORY_TYPES),
        })}
      >
        {(props) => (
          <Form className="p-4 rounded bg-gray-50">
            <div className="grid grid-cols-2 gap-4">
              <Field name="name" placeholder="Name" />
              <Field name="desc" placeholder="Desc" />
              <Field as="select" name="type" placeholder="Category type">
                {CATEGORY_TYPES.map((x, i) => (
                  <option key={i} value={x}>
                    {x}
                  </option>
                ))}
              </Field>
              <button type="submit">
                {isLoading ? "Loading..." : "Create"}
              </button>
            </div>
          </Form>
        )}
      </Formik>

      {!recentlyCreated?.length ? null : (
        <div className="mt-12">
          <h1>Recently Created</h1>
          <div className="flex flex-col gap-2">
            {recentlyCreated.map((x) => (
              <CategoryComponent key={x.id} {...x} />
            ))}
          </div>
        </div>
      )}
    </Layout>
  );
};
export default NewCategory;
