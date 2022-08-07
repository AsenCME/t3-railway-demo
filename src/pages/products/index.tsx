import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import ProductComponent from "../../components/product";
import Layout from "../../layouts";
import { trpc } from "../../utils/trpc";

const Products: NextPage = () => {
  const { data, isLoading } = trpc.useQuery(["products.all"]);
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
        </div>
      )}
    </Layout>
  );
};
export default Products;
