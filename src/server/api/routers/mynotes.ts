import { string, z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const notesRouter = createTRPCRouter({
  newNote: publicProcedure
    .input(
      z.object({
        title: z
          .string()
          .min(5, { message: "Must be 5 or more characters of length" })
          .max(200, {
            message: "must not be greater than 200 characters",
          })
          .trim(),
        description: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.notes.create({
          data: {
            title: input.title,
            description: input.description,
          },
        });
      } catch (error) {
        console.log(`Notes can not be created`);
        console.log(error);
      }
    }),

  allNotes: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.notes.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        isDone: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }),
  singleNote: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      return await ctx.prisma.notes.findUnique({
        where: {
          id: input.id,
        },
      });
    }),
  updateNote: publicProcedure
    .input(
      z.object({
        title: z
          .string()
          .min(5, { message: "Must be 5 or more characters of length" })
          .max(200, {
            message: "must not be greater than 200 characters",
          })
          .trim(),
        description: z.string(),
        id: z.string(),
        isDone: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.notes.update({
          where: {
            id: input.id,
          },
          data: {
            title: input.title,
            description: input.description,
            isDone: input.isDone,
          },
        });
      } catch (error) {
        console.log(`Notes can not be created`);
        console.log(error);
      }
    }),
  deleteNote: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        return await ctx.prisma.notes.delete({
          where: {
            id: input.id,
          },
        });
      } catch (err) {
        console.log(err);
      }
    }),
});
