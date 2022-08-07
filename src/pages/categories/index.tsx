import type { NextPage } from "next";
import Link from "next/link";

import CategoryComponent from "../../components/category";
import Layout from "../../layouts";
import { trpc } from "../../utils/trpc";

const Categories: NextPage = () => {
  const { data, isLoading } = trpc.useQuery(["categories.all"]);

  return (
    <Layout title="Categories">
      <div className="flex justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Categories</h1>
          <p>View all categories</p>
        </div>
        <Link href="/categories/new">
          <button>Create new category</button>
        </Link>
      </div>

      {isLoading ? (
        "Loading..."
      ) : (
        <div className="flex flex-col gap-4 mt-12">
          {data?.map((x) => (
            <CategoryComponent key={x.id} {...x} />
          ))}
        </div>
      )}
    </Layout>
  );
};
export default Categories;
