import { Hono, Context } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import { eq } from "drizzle-orm";
import * as schema from '../db/schema';
import { Bindings } from '../types';
import { bearerAuth } from 'hono/bearer-auth'

import { token } from '../constants'

export const quoteRouter = new Hono<{ Bindings: Bindings }>(); 

// Quotes routes
quoteRouter.get('quote/random', async (c: Context) => {
  const db = drizzle(c.env.DB);
  const allQuotes = await db.select().from(schema.quotes);
  const randomQuote = allQuotes[Math.floor(Math.random() * allQuotes.length)];

  if (!randomQuote) {
    return c.json(
      {
        ok: true,
        message: 'No quotes found',
      },
      400
    );
  }

  return c.json(randomQuote);
});

quoteRouter.get('quote/:id', async (c: Context) => {
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
  const quote = await db.select().from(schema.quotes).where(eq(schema.quotes.id, id));

  if (!quote) {
    return c.json(
      {
        ok: false,
        message: 'ID does not exists... yet!',
      },
      400
    );
  }
  return c.json(quote);
});


quoteRouter.post('quote', bearerAuth({ token }),  async (c: Context) => {
  const new_quote = await c.req.json();

  const db = drizzle(c.env.DB);
  const db_insert = await db.insert(schema.quotes).values({
    quote: new_quote.quote,
    character: new_quote.character,
    character_avatar_url: new_quote.character_avatar_url,
  })
  if (db_insert) {
    return c.json(
      {
        ok: true,
        message: 'Quote added successfully',
      },
      200
    );
  }
});
