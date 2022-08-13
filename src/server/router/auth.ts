import { TRPCError } from "@trpc/server";
import { genSalt, hash } from "bcrypt";
import { z } from "zod";
import { createRouter } from "./context";

export const authRouter = createRouter()
  .query("getSession", {
    resolve({ ctx }) {
      return ctx.session;
    },
  })
  // .middleware(async ({ ctx, next }) => {
  //   if (!ctx.session) throw new TRPCError({ code: "UNAUTHORIZED" });
  //   return next();
  // })
  .query("getSecretMessage", {
    async resolve({ ctx }) {
      return "You are logged in and can see this secret message!";
    },
  })
  .mutation("createUser", {
    input: z.object({
      email: z.string().trim().email(),
      username: z.string().trim().min(2),
      password: z
        .string()
        .trim()
        .regex(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W){8,16}/, {
          message:
            "Password must be between 6 and 18 characters and include at least 1 digit, 1 uppercase and 1 lowercase character",
        }),
    }),
    async resolve({ ctx, input }) {
      if (await ctx.prisma.user.findUnique({ where: { email: input.email } }))
        return new TRPCError({
          code: "FORBIDDEN",
          message: "User already exists",
        });
      const password = await hash(input.password, await genSalt(10));
      await ctx.prisma.user.create({
        data: { email: input.email, name: input.username, password },
      });
    },
  });
