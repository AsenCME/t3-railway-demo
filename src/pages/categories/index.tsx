import type { NextPage } from "next";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-toastify";

import CategoryComponent from "../../components/category";
import PageControls from "../../components/page-controls";
import Layout from "../../layouts";
import { DEFAULT_LIMIT } from "../../utils/constants";
import { trpc } from "../../utils/trpc";

const Categories: NextPage = () => {
  const [page, setPage] = useState(0);
  const { data, isLoading } = trpc.useQuery(["categories.all", { page }]);

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
          <PageControls
            page={page}
            onPrev={() =>
              page === 0
                ? toast("You are at the first page")
                : setPage(page - 1)
            }
            onNext={() =>
              data?.length !== DEFAULT_LIMIT
                ? toast("You are at the last page")
                : setPage(page + 1)
            }
          />
        </div>
      )}
    </Layout>
  );
};
export default Categories;
