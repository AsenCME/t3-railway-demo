import type { NextPage } from "next";
import BackButton from "../../components/back-button";
import Layout from "../../layouts";
import { trpc } from "../../utils/trpc";

const SearchCategories: NextPage = () => {
  const { data, isLoading } = trpc.useQuery([
    "categories.ofType",
    { type: "category" },
  ]);

  return (
    <Layout title="All categories">
      <BackButton name="Back" to="/search" />
      <h1>Categories</h1>
      <p>All categories on this site</p>
      {isLoading ? (
        "Loading..."
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data?.map((x, i) => (
            <div key={i} className="item">
              <h1>{x.name}</h1>
              <p>{x.desc}</p>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
};
export default SearchCategories;
