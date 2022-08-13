import Head from "next/head";
import React from "react";

interface Props {
  title: string;
  desc?: string;
  children: React.ReactNode;
}
export default function Layout({ title, desc, children }: Props) {
  return (
    <div className="container mx-auto px-4 py-12">
      <Head>
        <title>{`${title} | Tonak`}</title>
        <meta name="title" content={title + " | Tonak"} />
        <meta name="description" content={desc} />
      </Head>
      {children}
    </div>
  );
}
