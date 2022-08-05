import type { NextPage } from "next";
import { useRouter } from "next/router";
import ProductComponent from "../../components/product";
import Layout from "../../layouts";
import { trpc } from "../../utils/trpc";

const Products: NextPage = () => {
  const { data, isLoading } = trpc.useQuery(["products.getAll"]);
  const { push } = useRouter();
  return (
    <Layout title="Products">
      <h1>Products</h1>
      {isLoading ? (
        "Loading..."
      ) : (
        <div className="flex flex-col gap-4">
          {data?.map((x) => (
            <ProductComponent
              key={x.id}
              product={x}
              onClick={() => push(`/products/${x.id}`)}
            />
          ))}
        </div>
      )}
    </Layout>
  );
};
export default Products;
