import { Hono, Context } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import { eq } from 'drizzle-orm';
import * as schema from '../db/schema';
import { Bindings } from '../types';

export const seasonRouter = new Hono<{ Bindings: Bindings }>();

// Seasons & Episodes routes
seasonRouter.get('season/:id', async (c: Context) => {
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
  const seasonData = await db
    .select()
    .from(schema.episodes)
    .where(eq(schema.episodes.season, id));

  if (seasonData.length === 0) {
    return c.json(
      {
        ok: false,
        message: 'No episodes found for this season',
      },
      400
    );
  }

  return c.json(seasonData);
});

seasonRouter.post('season', async (c: Context) => {
  const new_season = await c.req.json();

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
  const db_insert = await db.insert(schema.episodes).values({
    episode: new_season.episode,
    season: new_season.season,
    title: new_season.title,
    description: new_season.description,
    airDate: new_season.airDate,
    imdbRating: new_season.imdbRating,
    totalVotes: new_season.totalVotes,
    directedBy: new_season.directedBy,
    writtenBy: new_season.writtenBy,
    episode_clip_url: new_season.episode_clip_url,
  });
  if (db_insert) {
    return c.json(
      {
        ok: true,
        message: 'Episode added successfully!',
      },
      201
    );
  } else {
    return c.json(
      {
        ok: false,
        message: 'Something went wrong',
      },
      400
    );
  }
});

seasonRouter.get(
  'season/:season_id/episode/:episode_id',
  async (c: Context) => {
    const seasonId = Number(c.req.param('season_id'));
    const episodeId = Number(c.req.param('episode_id'));

    if (Number.isNaN(seasonId) || Number.isNaN(episodeId)) {
      return c.json(
        {
          ok: false,
          message: 'Invalid ID',
        },
        400
      );
    }

    const db = drizzle(c.env.DB);

    const episodeData = await db
      .select()
      .from(schema.episodes)
      .where(eq(schema.episodes.season, seasonId))
      .where(eq(schema.episodes.episode, episodeId));

    if (!episodeData) {
      return c.json(
        {
          ok: false,
          message: 'No episode found for this season id and episode id',
        },
        400
      );
    }

    return c.json(episodeData);
  }
);
