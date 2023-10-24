import { Hono, Context } from 'hono';
import { prettyJSON } from 'hono/pretty-json';
import { cors } from 'hono/cors';
import quotes from '../data/quotes.json';
import episodes from '../data/episodes.json';

const app: Hono = new Hono();

// Middlewares
app.use('*', prettyJSON());
app.use('*', cors());

// Routes
app.get('/', (c: Context) => {
  // For default route, redirect to github repo
  return c.redirect("https://github.com/alexraskin/the-office-api")
});

// Quotes routes
app.get('/quote/random', (c: Context) => {
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  return c.json(randomQuote);
});

app.get('/quote/:id', (c: Context) => {
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

  const quote = quotes.find((quote) => quote.id === id);

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

// Seasons & Episodes routes
app.get('/season/:id', (c: Context) => {
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

  const seasonData = episodes.filter((d) => d.season === id);

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

app.get('/season/:season_id/episode/:episode_id', (c: Context) => {
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

  const episodeData = episodes.find(
    (d) => d.season === seasonId && d.episode === episodeId
  );

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

app.notFound((c) => c.json({ ok: false, message: 'Not Found' }, 404));

export default app;
