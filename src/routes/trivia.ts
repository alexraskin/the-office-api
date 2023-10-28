import { Hono, Context } from 'hono';
import { bearerAuth } from 'hono/bearer-auth'
import { drizzle } from 'drizzle-orm/d1';
import { eq } from "drizzle-orm";
import * as schema from '../db/schema';
import { Bindings } from '../types';

import { token } from '../constants'

export const triviaRouter = new Hono<{ Bindings: Bindings }>();

triviaRouter.get('trivia', (c: Context) => {

  const db = drizzle(c.env.DB);

  const trivia = db.select().from(schema.trivia);

  return c.json(trivia);
});

triviaRouter.get('trivia/:id', (c: Context) => {
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

  const triviaQuestion = db.select().from(schema.trivia).where(eq(schema.trivia.id, id));

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

triviaRouter.post('trivia', bearerAuth({ token }), async (c: Context) => {
  const new_trivia = await c.req.json();

  const db = drizzle(c.env.DB);
  const db_insert = await db.insert(schema.trivia).values({
    question: new_trivia.question,
    answer: new_trivia.answer,
  })
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