import { z } from "zod";
import { DEFAULT_LIMIT } from "../../utils/constants";
import { createRouter } from "./context";
import { inferProcedureOutput } from "@trpc/server";

export const productRouter = createRouter()
  // .middleware(async ({ ctx, next }) => {
  //   if (!ctx.session) throw new TRPCError({ code: "UNAUTHORIZED" });
  //   return next();
  // })
  .query("all", {
    async resolve({ ctx }) {
      return ctx.prisma.product.findMany({
        include: {
          inventory: { select: { qty: true } },
          categories: {
            select: {
              category: {
                select: { id: true, name: true, desc: true, type: true },
              },
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
  .query("one", {
    input: z.object({ id: z.string() }),
    async resolve({ ctx, input }) {
      return ctx.prisma.product.findUnique({
        where: { ...input },
        include: {
          inventory: { select: { qty: true } },
          categories: {
            select: {
              category: {
                select: { id: true, name: true, type: true, desc: true },
              },
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
  .query("forCategory", {
    input: z.object({ id: z.string(), page: z.number().nullish().default(0) }),
    async resolve({ ctx, input }) {
      return ctx.prisma.productCategory.findMany({
        where: { category_id: input.id },
        orderBy: { category: { created_at: "desc" } },
        skip: (input.page || 0) * DEFAULT_LIMIT,
        take: DEFAULT_LIMIT,
        include: {
          product: {
            select: {
              id: true,
              name: true,
              desc: true,
              images: true,
              created_at: true,
            },
          },
        },
      });
    },
  })

  .mutation("search", {
    input: z.object({ name: z.string(), page: z.number() }),
    async resolve({ ctx, input }) {
      return ctx.prisma.product.findMany({
        where: { name: { contains: input.name, mode: "insensitive" } },
        orderBy: { created_at: "desc" },
        skip: input.page * DEFAULT_LIMIT,
        take: DEFAULT_LIMIT,
      });
    },
  })
  .mutation("addToCategory", {
    input: z.object({ category_id: z.string(), product_id: z.string() }),
    async resolve({ ctx, input }) {
      return ctx.prisma.productCategory.create({ data: { ...input } });
    },
  })
  .mutation("removeFromCategory", {
    input: z.object({ category_id: z.string(), product_id: z.string() }),
    async resolve({ ctx, input }) {
      return ctx.prisma.productCategory.delete({
        where: { product_id_category_id: { ...input } },
      });
    },
  });

export type AllProductsReturnType = inferProcedureOutput<
  typeof productRouter._def.queries.all
>;
export type AllProductsItemReturnType = inferProcedureOutput<
  typeof productRouter._def.queries.all
>[0];

export type OneProductReturnType = Partial<
  inferProcedureOutput<typeof productRouter._def.queries.one>
>;

export type ForCategoryReturnType = inferProcedureOutput<
  typeof productRouter._def.queries.forCategory
>;
