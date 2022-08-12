import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-toastify";
import PageControls from "../../components/page-controls";
import ProductComponent from "../../components/product";
import Layout from "../../layouts";
import { DEFAULT_LIMIT } from "../../utils/constants";
import { trpc } from "../../utils/trpc";

const Products: NextPage = () => {
  const [page, setPage] = useState(0);
  const { data, isLoading } = trpc.useQuery(["products.all", { page }]);
  const { push } = useRouter();

  return (
    <Layout title="Products">
      <div className="flex justify-between gap-4 mb-4">
        <h1>Products</h1>
        <Link href={`/products/new`}>
          <button>Add Product</button>
        </Link>
      </div>
      {isLoading ? (
        "Loading..."
      ) : (
        <div className="flex flex-col gap-4">
          {data?.map((x) => (
            <ProductComponent
              key={x.id}
              product={x}
              onClick={() => push(`/products/details/${x.id}`)}
            />
          ))}
          <PageControls
            page={page}
            onPrev={() =>
              page === 0
                ? toast("You are at the first page.")
                : setPage(page - 1)
            }
            onNext={() =>
              data?.length !== DEFAULT_LIMIT
                ? toast("You are at the last page.")
                : setPage(page + 1)
            }
          />
        </div>
      )}
    </Layout>
  );
};
export default Products;
