import { CategoryType } from "@prisma/client";
import { z } from "zod";
import { createRouter } from "./context";

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
  .query("getRecentlyCreated", {
    async resolve({ ctx }) {
      const startOfDay = new Date();
      startOfDay.setUTCHours(0, 0, 0, 0);
      return ctx.prisma.category.findMany({
        orderBy: { created_at: "desc" },
        where: { created_at: { gte: startOfDay } },
      });
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
      type: z.string(),
    }),
    async resolve({ ctx, input }) {
      return ctx.prisma.category.create({
        data: { ...input, type: input.type as CategoryType },
      });
    },
  });
