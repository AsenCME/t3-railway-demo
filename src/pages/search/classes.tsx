import type { NextPage } from "next";
import BackButton from "../../components/back-button";
import Layout from "../../layouts";
import { trpc } from "../../utils/trpc";

const SearchClasses: NextPage = () => {
  const { data, isLoading } = trpc.useQuery([
    "categories.ofType",
    { type: "class" },
  ]);

  return (
    <Layout title="All classes">
      <BackButton name="Back" to="/search" />
      <h1>Classes</h1>
      <p>All classes on this site</p>
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
export default SearchClasses;
