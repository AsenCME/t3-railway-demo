import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createRouter } from "./context";

export const productRouter = createRouter()
  // .middleware(async ({ ctx, next }) => {
  //   if (!ctx.session) throw new TRPCError({ code: "UNAUTHORIZED" });
  //   return next();
  // })
  .query("getAll", {
    async resolve({ ctx }) {
      return ctx.prisma.product.findMany({
        include: {
          inventory: { select: { qty: true } },
          categories: {
            select: {
              category: { select: { id: true, name: true, desc: true } },
            },
          },
          discount: {
            select: {
              id: true,
              name: true,
              desc: true,
              discount_percent: true,
            },
          },
        },
      });
    },
  })
  .query("getById", {
    input: z.object({ id: z.string() }),
    async resolve({ ctx, input }) {
      return ctx.prisma.product.findUnique({
        where: { ...input },
        include: {
          inventory: { select: { qty: true } },
          categories: {
            select: {
              category: { select: { id: true, name: true, desc: true } },
            },
          },
          discount: {
            select: {
              id: true,
              name: true,
              desc: true,
              discount_percent: true,
            },
          },
        },
      });
    },
  });
