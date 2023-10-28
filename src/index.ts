import { Hono, Context } from 'hono';
import { prettyJSON } from 'hono/pretty-json';
import { cors } from 'hono/cors';
import { drizzle } from 'drizzle-orm/d1';
import { eq } from "drizzle-orm";
import * as schema from './db/schema';
import { Bindings } from './types';

const app = new Hono<{ Bindings: Bindings }>();

// Middlewares
app.use('*', prettyJSON());
app.use('*', cors());

// Routes
app.get('/', (c: Context) => {
  // For default route, redirect to github repo
  return c.redirect("https://github.com/alexraskin/the-office-api")
});

// Quotes routes
app.get('/quote/random', async (c: Context) => {
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

app.get('/quote/:id', async (c: Context) => {
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


app.post('/quote', async (c: Context) => {
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

// Seasons & Episodes routes
app.get('/season/:id', async (c: Context) => {
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
  const seasonData = await db.select().from(schema.episodes).where(eq(schema.episodes.season, id));

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

app.post('/season', async (c: Context) => {
  const new_season = await c.req.json();

  const db = drizzle(c.env.DB);
  const db_insert = await db.insert(schema.episodes).values({
    season: new_season.season,
    episode: new_season.episode,
    episode_name: new_season.episode_name,
    episode_description: new_season.episode_description,
    episode_air_date: new_season.episode_air_date,
    episode_rating: new_season.episode_rating,
    episode_image_url: new_season.episode_image_url,
  })

});

app.get('/season/:season_id/episode/:episode_id', async (c: Context) => {
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
});

// Extras routes
app.get('/extras', async (c: Context) => {

  const db = drizzle(c.env.DB);

  const extras = db.select().from(schema.extras);

  return c.json(extras);
});

app.get('/extras/:id', async (c: Context) => {
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

// Trivia routes
app.get('/trivia', (c: Context) => {

  const db = drizzle(c.env.DB);

  const trivia = db.select().from(schema.trivia);

  return c.json(trivia);
});

app.get('/trivia/:id', (c: Context) => {
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

app.notFound((c) => c.json({ ok: false, message: 'Not Found' }, 404));

export default app;
