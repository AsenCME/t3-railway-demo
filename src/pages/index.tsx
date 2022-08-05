import type { NextPage } from "next";
// import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Layout from "../layouts";

// todo add login
const Home: NextPage = () => {
  // const { data } = useSession();

  return (
    <Layout title="Home">
      <h1>Tonak Website</h1>
      <div className="flex gap-4">
        <Link href="/products">
          <button>Products</button>
        </Link>
        <Link href="/categories">
          <button>Categories</button>
        </Link>
      </div>
    </Layout>
  );
};

export default Home;
