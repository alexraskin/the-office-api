import { Hono, Context } from 'hono';
import { bearerAuth } from 'hono/bearer-auth'
import { drizzle } from 'drizzle-orm/d1';
import { eq } from "drizzle-orm";
import * as schema from '../db/schema';
import { Bindings } from '../types';

import { token } from '../constants'

export const extrasRouter = new Hono<{ Bindings: Bindings }>();

extrasRouter.get('/extras', async (c: Context) => {

  const db = drizzle(c.env.DB);

  const extras = await db.select().from(schema.extras);
  console.log(extras);

  return c.json(extras);
});

extrasRouter.get('/extras/:id', async (c: Context) => {
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

  const extra = await db.select().from(schema.extras).where(eq(schema.extras.id, id));

  if (!extra) {
    return c.json(
      {
        ok: false,
        message: 'ID does not exists... yet!',
      },
      400
    );
  }

  return c.json(extra);
});

extrasRouter.post('/extras', bearerAuth({ token }), async (c: Context) => {
  const new_extra = await c.req.json();

  const db = drizzle(c.env.DB);
  const db_insert = await db.insert(schema.extras).values({
    name: new_extra.name,
    description: new_extra.description,
    photo_url: new_extra.photo_url,
    video_url: new_extra.video_url,
  })
  if (db_insert) {
    return c.json(
      {
        ok: true,
        message: 'Extra added successfully',
      },
      200
    );
  }

});