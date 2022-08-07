import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import Layout from "../../../layouts";
import { trpc } from "../../../utils/trpc";

const Categories: NextPage = () => {
  const router = useRouter();
  const { data, isLoading } = trpc.useQuery([
    "categories.one",
    { id: router.query.id as string },
  ]);

  const [page, setPage] = useState(0);
  const { data: products, isLoading: gettingProducts } = trpc.useQuery([
    "products.forCategory",
    { id: router.query.id as string, page },
  ]);

  return (
    <Layout title="Category Details">
      <h1>Single Category</h1>

      <h6>Basic Information</h6>
      {isLoading ? (
        "Loading..."
      ) : (
        <div>
          <div className="text-sm text-gray-600">{data?.type}</div>
          <div className="font-bold">{data?.name}</div>
          <div>{data?.desc}</div>
        </div>
      )}

      <h6>Category Products</h6>
      <div className="grid grid-cols-2 gap-4">
        {products?.map((x) => (
          <Link key={x.product_id} href={`/products/details/${x.product_id}`}>
            <div className="bg-gray-50 hover:ring-2 hover:ring-gray-400 rounded p-2 transition-all cursor-pointer">
              <div className="font-bold">{x.product?.name}</div>
              <div className="text-gray-600">{x.product?.desc}</div>
            </div>
          </Link>
        ))}
      </div>
    </Layout>
  );
};
export default Categories;
