// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { authRouter } from "./auth";
import { categoryRouter } from "./category";
import { productRouter } from "./product";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("auth.", authRouter)
  .merge("categories.", categoryRouter)
  .merge("products.", productRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
