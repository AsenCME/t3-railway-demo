import type { NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { useState } from "react";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const hello = trpc.useQuery(["example.hello", { text: "Railway!" }]);

  // example stuff
  const examples = trpc.useQuery(["example.getAll"]);
  const createExample = trpc.useMutation(["example.createExample"], {
    onSuccess: () => examples.refetch(),
  });
  const [exampleMessage, setExampleMessage] = useState("");

  const { data } = useSession();

  return (
    <>
      <Head>
        <title>Demo Application</title>
        <meta
          name="description"
          content="Demo application to run on railway.app"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container mx-auto">
        <div className="mt-12 mb-4 text-2xl text-indigo-700 font-bold">
          {hello.data ? <p>{hello.data.greeting}</p> : <p>Loading..</p>}
        </div>

        <div className="flex items-center justify-between">
          <h4 className="text-gray-600 font-bold">Add Example</h4>
          <div className="flex">
            <input
              value={exampleMessage}
              onChange={(e) => setExampleMessage(e.target.value)}
              className="w-[200px] focus:ring-black focus:outline-none transition bg-gray-300/50 hover:ring-2 ring-offset-2 ring-gray-200 rounded px-4 py-2"
            />
            <button
              className="ml-4 px-4 py-2 bg-black text-white rounded"
              onClick={async () => {
                await createExample.mutateAsync({ message: exampleMessage });
                setExampleMessage("");
              }}
            >
              {createExample.isLoading ? "Loading..." : "Create"}
            </button>
          </div>
        </div>
        <h4 className="text-lg font-bold">Examples</h4>
        {!examples.data?.length
          ? "No examples yet..."
          : examples.data?.map((e) => (
              <div key={e.id}>
                {e.id}, {e.message}
              </div>
            ))}

        <h4 className="text-lg font-bold mt-12">Session</h4>
        {data ? (
          <div className="flex flex-col gap-4 items-start">
            <div className="flex items-center p-4 rounded bg-gray-100">
              <img
                src={data.user?.image || ""}
                className="w-12 h-12 rounded-full object-contain mr-4"
              />
              <div>
                <div className="text-xl font-bold">{data.user?.name}</div>
                <div className="text-gray-600">{data.user?.email}</div>
              </div>
            </div>
            <button
              className="px-4 py-2 bg-red-700 text-white rounded"
              onClick={() => signOut()}
            >
              Sign out
            </button>
          </div>
        ) : (
          <div>
            <button
              className="px-4 py-2 bg-black text-white rounded"
              onClick={() => signIn("facebook")}
            >
              Sign in
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
