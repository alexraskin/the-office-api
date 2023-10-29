import { Hono, Context } from 'hono';
import { serveStatic } from 'hono/cloudflare-workers'
import { prettyJSON } from 'hono/pretty-json';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger'
import { Bindings } from './types';

import { quoteRouter } from './routes/quotes';
import { triviaRouter } from './routes/trivia';
import { extrasRouter } from './routes/extras';
import { seasonRouter } from './routes/seasons';

const app = new Hono<{ Bindings: Bindings }>();

app.use('*', logger());
app.use('*', prettyJSON());
app.use('*', cors());

app.route("/", quoteRouter)
app.route("/", triviaRouter)
app.route("/", extrasRouter)
app.route("/", seasonRouter)

app.use('/favicon.ico', serveStatic({ path: './favicon.ico' }))

app.use('/', serveStatic({ path: './' }));

app.notFound((c) => c.json({ ok: false, message: 'Not Found' }, 404));

app.onError((err, c) => {
  console.error(err);
  return c.json({ ok: false, message: 'Internal Server Error' }, 500);
});

export default app;
