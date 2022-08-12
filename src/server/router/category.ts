import { CategoryType } from "@prisma/client";
import { createRouter } from "./context";
import { DEFAULT_LIMIT } from "../../utils/constants";
import { z } from "zod";

export const categoryRouter = createRouter()
  // .middleware(async ({ ctx, next }) => {
  //   if (!ctx.session) throw new TRPCError({ code: "UNAUTHORIZED" });
  //   return next();
  // })
  .query("all", {
    input: z.object({ page: z.number().nullish().default(0) }),
    async resolve({ ctx, input }) {
      return ctx.prisma.category.findMany({
        skip: (input.page || 0) * DEFAULT_LIMIT,
        take: DEFAULT_LIMIT,
        orderBy: { created_at: "desc" },
      });
    },
  })
  .query("recent", {
    async resolve({ ctx }) {
      const startOfDay = new Date();
      startOfDay.setUTCHours(0, 0, 0, 0);
      return ctx.prisma.category.findMany({
        orderBy: { created_at: "desc" },
        where: { created_at: { gte: startOfDay } },
      });
    },
  })
  .query("one", {
    input: z.object({ id: z.string() }),
    async resolve({ ctx, input }) {
      return ctx.prisma.category.findFirst({ where: { id: input.id } });
    },
  })

  .mutation("search", {
    input: z.object({
      name: z.string(),
      type: z.string(),
      page: z.number().optional().default(0),
    }),
    async resolve({ ctx, input }) {
      return ctx.prisma.category.findMany({
        where: {
          name: { contains: input.name, mode: "insensitive" },
          type:
            input.type === "all"
              ? undefined
              : { equals: input.type as CategoryType },
        },
        take: DEFAULT_LIMIT,
        skip: (input.page || 0) * DEFAULT_LIMIT,
        orderBy: { created_at: "desc" },
      });
    },
  })
  .mutation("addToProduct", {
    input: z.object({ category_id: z.string(), product_id: z.string() }),
    async resolve({ ctx, input }) {
      return ctx.prisma.productCategory.create({ data: { ...input } });
    },
  })
  .mutation("removeFromProduct", {
    input: z.object({ category_id: z.string(), product_id: z.string() }),
    async resolve({ ctx, input }) {
      return ctx.prisma.productCategory.delete({
        where: { product_id_category_id: { ...input } },
      });
    },
  })
  .mutation("create", {
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
