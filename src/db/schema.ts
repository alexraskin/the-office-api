import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core';

export const episodes = sqliteTable('episodes', {
  id: integer('id').primaryKey(),
  season: integer('season'),
  episode: integer('episode'),
  title: text('title'),
  description: text('description'),
  airDate: text('airDate'),
  imdbRating: text('imdbRating'),
  totalVotes: integer('totalVotes'),
  directedBy: text('directedBy'),
  writtenBy: text('writtenBy'),
  episode_clip_url: text('episode_clip_url'),
});

export const quotes = sqliteTable('quotes', {
  id: integer('id').primaryKey(),
  quote: text('quote'),
  character: text('character'),
  character_avatar_url: text('character_avatar_url'),
});

export const extras = sqliteTable('extras', {
  id: integer('id').primaryKey(),
  name: text('name'),
  description: text('description'),
  photo_url: text('photo_url'),
  video_url: text('video_url'),
});

export const trivia = sqliteTable('trivia', {
  id: integer('id').primaryKey(),
  question: text('question'),
  answer: text('answer'),
});
