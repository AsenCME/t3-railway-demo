import type { NextPage } from "next";
import { useRouter } from "next/router";
import { trpc } from "../../../utils/trpc";

const Categories: NextPage = () => {
  const router = useRouter();
  const { data, isLoading } = trpc.useQuery([
    "categories.getCategory",
    { id: router.query.id as string },
  ]);
  return (
    <div className="container mx-auto p-4">
      <h1>Single Category</h1>
      {isLoading ? "Loading..." : JSON.stringify(data)}
    </div>
  );
};
export default Categories;
