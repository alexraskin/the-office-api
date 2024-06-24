import { Hono, Context } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import { eq } from 'drizzle-orm';
import * as schema from '../db/schema';
import { Bindings } from '../types';

export const triviaRouter = new Hono<{ Bindings: Bindings }>();

triviaRouter.get('trivia', async (c: Context) => {
  const db = drizzle(c.env.DB);

  const trivia = await db.select().from(schema.trivia);

  return c.json(trivia);
});

triviaRouter.get('trivia/:id', async (c: Context) => {
  const id = Number(c.req.param('id'));

  if (Number.isNaN(id)) {
    return c.json(
      {
        ok: false,
        message: 'Invalid ID',
      },
      400
    );
  }

  const db = drizzle(c.env.DB);

  const triviaQuestion = await db
    .select()
    .from(schema.trivia)
    .where(eq(schema.trivia.id, id));

  if (!triviaQuestion) {
    return c.json(
      {
        ok: false,
        message: 'ID does not exists... yet!',
      },
      400
    );
  }

  return c.json(triviaQuestion);
});

triviaRouter.post('trivia', async (c: Context) => {
  const new_trivia = await c.req.json();

  const token: string = c.req.headers.get('X-API-KEY') || '';

  if (!token !== c.env.TOKEN) {
    return c.json(
      {
        ok: false,
        message: 'Invalid token',
      },
      401
    );
  }

  const db = drizzle(c.env.DB);
  const db_insert = await db.insert(schema.trivia).values({
    question: new_trivia.question,
    answer: new_trivia.answer,
  });
  if (db_insert) {
    return c.json(
      {
        ok: true,
        message: 'Trivia question added successfully',
      },
      200
    );
  }
});
