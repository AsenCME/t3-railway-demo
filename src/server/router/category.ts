import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createRouter } from "./context";

enum CategoryType {
  brand,
  set,
  category,
  class,
}

export const categoryRouter = createRouter()
  // .middleware(async ({ ctx, next }) => {
  //   if (!ctx.session) throw new TRPCError({ code: "UNAUTHORIZED" });
  //   return next();
  // })
  .query("getCategories", {
    async resolve({ ctx }) {
      return ctx.prisma.category.findMany();
    },
  })
  .query("getCategory", {
    input: z.object({ id: z.string() }),
    async resolve({ ctx, input }) {
      return ctx.prisma.category.findFirst({ where: { id: input.id } });
    },
  })

  .mutation("createCategory", {
    input: z.object({
      name: z.string().trim().min(2),
      desc: z.string().trim().min(2),
    }),
    async resolve({ ctx, input }) {
      return ctx.prisma.category.create({
        data: { ...input, type: "brand" },
      });
    },
  });
