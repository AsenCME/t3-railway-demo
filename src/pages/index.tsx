import type { NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

import Layout from "../layouts";

function Account() {
  const { data } = useSession();
  if (!data)
    return (
      <div className="flex gap-4 mt-12">
        <Link href="/account/login">
          <button>Sign in</button>
        </Link>
        <Link href="/account/new">
          <button>Create Account</button>
        </Link>
      </div>
    );
  else
    return (
      <div className="mt-12">
        <h1>My account</h1>
        <p>Account Information</p>
        <div>{data.user?.name}</div>
        <div>{data.user?.email}</div>

        <button className="mt-4 bg-red-700" onClick={() => signOut()}>
          Sign out
        </button>
      </div>
    );
}

// todo add login
const Home: NextPage = () => {
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

      <Account />
    </Layout>
  );
};

export default Home;
