import type { NextPage } from "next";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";

const Categories: NextPage = () => {
  const { data, isLoading } = trpc.useQuery(["categories.getCategories"]);
  const { mutate, isLoading: isCreating } = trpc.useMutation([
    "categories.createCategory",
  ]);
  const router = useRouter();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Categories</h1>
      {isCreating ? (
        "Creating category..."
      ) : (
        <form
          className="p-4 rounded bg-gray-200 flex flex-col gap-4"
          onSubmit={async (e) => {
            e.preventDefault();
            const form = e.target as any;
            mutate({ name: form.name.value, desc: form.desc.value });
          }}
        >
          <h2 className="font-bold">Create new category</h2>
          <div className="flex flex-1 w-full gap-4">
            <input
              type="text"
              name="name"
              className="w-full"
              placeholder="Name"
            />
            <input
              type="text"
              name="desc"
              className="w-full"
              placeholder="Desc"
            />
            <input
              type="text"
              name="type"
              className="w-full"
              placeholder="Category type"
            />
          </div>
          <input type="submit" />
        </form>
      )}

      {isLoading ? (
        "Loading..."
      ) : (
        <div className="flex flex-col gap-4 mt-12">
          {data?.map((x) => (
            <div
              key={x.id}
              className="transition p-2 rounded bg-gray-200 hover:bg-gray-400"
              onClick={() => router.push(`/categories/${x.id}`)}
            >
              {JSON.stringify(x)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default Categories;
