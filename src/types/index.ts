import { D1Database } from '@cloudflare/workers-types';

export type Bindings = {
  DATABASE: D1Database;
  DATABASE_NAME: string;
  DATABASE_ID: string;
};

export interface IOfficeQuote {
  id: number;
  quote: string;
  character: string;
  character_avatar_url: string;
}

export interface IOfficeEpisodes {
  season: number;
  episode: number;
  title: string;
  description: string;
  airDate: string;
  imdbRating: number;
  totalVotes: number;
  directedBy: string;
  writtenBy: string;
  episode_clip_url: string;
}

export interface IOfficeExtras {
  id: number;
  name: string;
  description: string;
  photo_url: string;
  video_url: string;
}

export interface IOfficeTriva {
  id: number;
  question: string;
  answer: string;
}

export interface IErrorResponse {
  ok: boolean;
  message: string;
}
