// next type
import type { AppType } from "next/dist/shared/lib/utils";

// trpc stuff
import { withTRPC } from "@trpc/next";
import type { AppRouter } from "../server/router";

// next auth stuff
import { SessionProvider } from "next-auth/react";
import superjson from "superjson";

// Toast lib
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// tailwind global styles
import "../styles/globals.css";

// main app
const MyApp: AppType = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
      <ToastContainer
        autoClose={5000}
        position={"bottom-left"}
        hideProgressBar={false}
        pauseOnHover={true}
        draggable={true}
        theme="dark"
      />
    </SessionProvider>
  );
};

// helper fn
const getBaseUrl = () => {
  if (typeof window !== "undefined") return "";
  if (process.browser) return ""; // Browser should use current path
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url

  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

// add trpc to the entire site (can enable SSR)
export default withTRPC<AppRouter>({
  config({ ctx }) {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
    const url = `${getBaseUrl()}/api/trpc`;

    return {
      url,
      transformer: superjson,
      /**
       * @link https://react-query.tanstack.com/reference/QueryClient
       */
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: false,
})(MyApp);
