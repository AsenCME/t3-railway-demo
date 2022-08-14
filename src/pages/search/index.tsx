import { Field, Form, Formik } from "formik";
import type { NextPage } from "next";
import Link from "next/link";
import { useState } from "react";
import { IoFilter } from "react-icons/io5";
import Layout from "../../layouts";
import { CATEGORY_TYPES } from "../../utils/constants";

const Search: NextPage = () => {
  const [filters, setFilters] = useState(false);

  return (
    <Layout title="Search">
      <h1>Search</h1>
      <p>Search for products and filter</p>

      <div className="flex gap-4 mb-4">
        <Link href="/search/sets">
          <button className="small">Search by set</button>
        </Link>
        <Link href="/search/classes">
          <button className="small">Search by class</button>
        </Link>
        <Link href="/search/categories">
          <button className="small">Search by category</button>
        </Link>
        <Link href="/search/brands" className="small">
          <button className="small">Search by brand</button>
        </Link>
      </div>

      <Formik
        initialValues={{ query: "" }}
        onSubmit={async (data) => {
          console.log("do search", data);
        }}
      >
        <Form>
          <div className="flex gap-4">
            <Field name="query" placeholder="Search..." />
            <div
              onClick={() => setFilters(!filters)}
              className="w-[40px] h-[40px] rounded bg-gray-50 border-2 cursor-pointer border-solid border-gray-100 hover:border-gray-300 grid place-content-center"
            >
              <IoFilter />
            </div>
          </div>

          <div
            className={`${
              filters ? "max-h-[40px]" : "max-h-0"
            } transition-all overflow-hidden grid grid-cols-1 md:grid-cols-4 mt-4`}
          >
            <Field name="type" component="select">
              <option value="all">All</option>
              {CATEGORY_TYPES.map((x) => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </Field>
          </div>
        </Form>
      </Formik>
    </Layout>
  );
};
export default Search;
