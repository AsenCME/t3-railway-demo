import type { GetServerSidePropsContext, NextPage } from "next";
import { useRouter } from "next/router";

import Layout from "../../layouts";
import { trpc } from "../../utils/trpc";

const Products: NextPage = () => {
  const { query } = useRouter();
  const id = query.id as string;
  const { data, isLoading } = trpc.useQuery(["products.getById", { id }], {});
  return (
    <Layout title={`Product ${data?.name}`}>
      <h1>Product #{id}</h1>
      {/* {isLoading
        ? "Loading..."
        : data?.map((x) => <div key={x.id}>{JSON.stringify(x)}</div>)} */}
    </Layout>
  );
};
export default Products;
