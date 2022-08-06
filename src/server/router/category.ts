import { CategoryType } from "@prisma/client";
import { createRouter } from "./context";
import { CATEGORY_TYPES, DEFAULT_LIMIT } from "../../utils/constants";
import { z } from "zod";

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

  // .mutation("search", {
  //   input: z.object({
  //     name: z.string(),
  //     type: z.string().refine([...CATEGORY_TYPES, "all"].includes),
  //     page: z.number().optional().default(0),
  //   }),
  //   async resolve({ ctx, input }) {
  //     console.log("search:", input);
  //     // const items = await ctx.prisma.category.findMany({
  //     //   // where: {
  //     //   //   name: { contains: input.name },
  //     //   // type:
  //     //   //   input.type === "all" ? {} : { equals: input.type as CategoryType },
  //     //   // },
  //     //   take: DEFAULT_LIMIT,
  //     //   skip: (input.page || 0) * DEFAULT_LIMIT,
  //     //   orderBy: { created_at: "desc" },
  //     // });
  //     // console.log("items:", items);
  //     // return items;
  //     return {};
  //   },
  // })
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
