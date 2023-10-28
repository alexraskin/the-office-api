import app from '../src/index';
import { IErrorResponse, IOfficeEpisodes, IOfficeQuote, IOfficeExtras, IOfficeTriva } from '../src/types';

describe('Basic routes', () => {
  it('should redirect to github URL for index route', async () => {
    const res = await app.request('http://localhost/');
    expect(res.status).toBe(302);
    expect(res.headers.get('location')).toBe(
      'https://github.com/alexraskin/the-office-api'
    );
  });

  it('should return 404 response for not found routes', async () => {
    const res = await app.request('http://localhost/this/does/not/exists');
    expect(res.status).toBe(404);
  });
});

describe('Quote routes', () => {
  it('should return a random quote on /quote/random endpoint', async () => {
    const res = await app.request('http://localhost/quote/random');
    const body = await res.json<IOfficeQuote>();

    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toContain('application/json');
    expect(body.character).not.toBe('');
    expect(body.quote).not.toBe('');
    expect(body.character_avatar_url).not.toBe('');
  });

  it('should return a quote for a valid id', async () => {
    const res = await app.request('http://localhost/quote/1');
    const body = await res.json<IOfficeQuote>();

    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toContain('application/json');
    expect(body.character).not.toBe('');
    expect(body.quote).not.toBe('');
    expect(body.character_avatar_url).not.toBe('');
  });

  it('should return a error for a invalid id', async () => {
    const res = await app.request('http://localhost/quote/PIZZA!!');
    const body = await res.json<IErrorResponse>();

    expect(res.status).toBe(400);
    expect(res.headers.get('Content-Type')).toContain('application/json');
    expect(body.ok).toBe(false);
    expect(body.message).toBe('Invalid ID');
  });

  it('should return a error for a id does not exists', async () => {
    const res = await app.request('http://localhost/quote/100000000000');
    const body = await res.json<IErrorResponse>();

    expect(res.status).toBe(400);
    expect(res.headers.get('Content-Type')).toContain('application/json');
    expect(body.ok).toBe(false);
    expect(body.message).toBe('ID does not exists... yet!');
  });
});

describe('Seasons and Episodes routes', () => {
  it('should return correct data for a valid season id', async () => {
    const res = await app.request('http://localhost/season/1');
    const body = await res.json<IOfficeEpisodes[]>();

    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toContain('application/json');
    expect(body.length).toEqual(6);
    expect(body).toEqual([
      {
        season: 1,
        episode: 1,
        title: 'Pilot',
        description:
          'The premiere episode introduces the boss and staff of the Dunder-Mifflin Paper Company in Scranton, Pennsylvania in a documentary about the workplace.',
        airDate: '2005-03-24',
        imdbRating: 7.4,
        totalVotes: 7006,
        directedBy: 'Ken Kwapis',
        writtenBy: 'Ricky Gervais & Stephen Merchant and Greg Daniels',
        episode_clip_url: "https://cdn.theoffice.foo/s1-ep1.mp4"
      },
      {
        season: 1,
        episode: 2,
        title: 'Diversity Day',
        description:
          "Michael's off color remark puts a sensitivity trainer in the office for a presentation, which prompts Michael to create his own.",
        airDate: '2005-03-29',
        imdbRating: 8.3,
        totalVotes: 6902,
        directedBy: 'Ken Kwapis',
        writtenBy: 'B. J. Novak',
        episode_clip_url: "https://cdn.theoffice.foo/s1-ep2.mp4"
      },
      {
        season: 1,
        episode: 3,
        title: 'Health Care',
        description:
          'Michael leaves Dwight in charge of picking the new healthcare plan for the staff, with disastrous results ahead.',
        airDate: '2005-04-05',
        imdbRating: 7.7,
        totalVotes: 5756,
        directedBy: 'Ken Whittingham',
        writtenBy: 'Paul Lieberstein',
        episode_clip_url: "https://cdn.theoffice.foo/s1-ep3.mp4"
      },
      {
        season: 1,
        episode: 4,
        title: 'The Alliance',
        description:
          'Just for a laugh, Jim agrees to an alliance with Dwight regarding the downsizing rumors.',
        airDate: '2005-04-12',
        imdbRating: 8,
        totalVotes: 5579,
        directedBy: 'Bryan Gordon',
        writtenBy: 'Michael Schur',
        episode_clip_url: "https://cdn.theoffice.foo/s1-ep4.mp4"
      },
      {
        season: 1,
        episode: 5,
        title: 'Basketball',
        description:
          'Michael and his staff challenge the warehouse workers to a basketball game with a bet looming over both parties.',
        airDate: '2005-04-19',
        imdbRating: 8.4,
        totalVotes: 6183,
        directedBy: 'Greg Daniels',
        writtenBy: 'Greg Daniels',
        episode_clip_url: "https://cdn.theoffice.foo/s1-ep5.mp4"
      },
      {
        season: 1,
        episode: 6,
        title: 'Hot Girl',
        description:
          'Michael is just one of the many male staff who start vying for the attention of an attractive saleswoman in the office.',
        airDate: '2005-04-26',
        imdbRating: 7.7,
        totalVotes: 5495,
        directedBy: 'Amy Heckerling',
        writtenBy: 'Mindy Kaling',
        episode_clip_url: "https://cdn.theoffice.foo/s1-ep6.mp4"
      },
    ]);
  });

  it('should return error for a invalid season id', async () => {
    const res = await app.request('http://localhost/season/NOT_ID');
    const body = await res.json<IErrorResponse>();

    expect(res.status).toBe(400);
    expect(res.headers.get('Content-Type')).toContain('application/json');
    expect(body).toEqual({
      ok: false,
      message: 'Invalid ID',
    });
  });

  it('should return error for a non existing season id', async () => {
    const res = await app.request('http://localhost/season/1000');
    const body = await res.json<IErrorResponse>();

    expect(res.status).toBe(400);
    expect(res.headers.get('Content-Type')).toContain('application/json');
    expect(body).toEqual({
      ok: false,
      message: 'No episodes found for this season',
    });
  });

  it('should return correct data for a valid season id and episode id', async () => {
    const res = await app.request('http://localhost/season/1/episode/1');
    const body = await res.json<IOfficeEpisodes>();

    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toContain('application/json');
    expect(body).toEqual({
      season: 1,
      episode: 1,
      title: 'Pilot',
      description:
        'The premiere episode introduces the boss and staff of the Dunder-Mifflin Paper Company in Scranton, Pennsylvania in a documentary about the workplace.',
      airDate: '2005-03-24',
      imdbRating: 7.4,
      totalVotes: 7006,
      directedBy: 'Ken Kwapis',
      writtenBy: 'Ricky Gervais & Stephen Merchant and Greg Daniels',
      episode_clip_url: "https://cdn.theoffice.foo/s1-ep1.mp4"
    });
  });

  it('should return error for a invalid season id or episode id', async () => {
    const res = await app.request('http://localhost/season/1/episode/NOT_ID');
    const body = await res.json<IErrorResponse>();

    expect(res.status).toBe(400);
    expect(res.headers.get('Content-Type')).toContain('application/json');
    expect(body).toEqual({
      ok: false,
      message: 'Invalid ID',
    });
  });

  it('should return error for a non existing season id or episode id', async () => {
    const res = await app.request('http://localhost/season/1/episode/1000');
    const body = await res.json<IErrorResponse>();

    expect(res.status).toBe(400);
    expect(res.headers.get('Content-Type')).toContain('application/json');
    expect(body).toEqual({
      ok: false,
      message: 'No episode found for this season id and episode id',
    });
  });
});

describe('Extras routes', () => {
  it('should return all extras', async () => {
    const res = await app.request('http://localhost/extras');
    const body = await res.json<IOfficeExtras>();

    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toContain('application/json');
    expect(body).toEqual([
      {
        "id": 1,
        "name": "Threat Level Midnight",
        "description": "After secret agent Michael Scarn (played by Scott) is forced into retirement due to the death of his wife Catherine Zeta-Scarn, the President of the United States of America (played by Darryl Philbin) requests that he prevent Goldenface (played by Jim Halpert) from blowing up the NHL All-Star Game and killing several hostages. Scarn goes undercover and learns how to play hockey, killing another hockey player (played by Oscar Martinez) to make it into the game, but after confronting Goldenface, he is shot. He later recuperates but learns that the President was in on it all along. Depressed, he goes to a bar to drown his sorrows. The patrons of the bar sing a song called 'The Scarn' which he danced to with his wife, which cheers Scarn up immensely. With his courage restored, Scarn is able to save the day and blow up Goldenface in the process.",
        "photo_url": "https://cdn.theoffice.foo/Threat-Level-Midnight.jpg",
        "video_url": "https://cdn.theoffice.foo/Threat-Level-Midnight-Movie.mp4"
      },
      {
        "id": 2,
        "name": "The Matrix",
        "description": "An extended cold open where Jim pulls one last prank on Dwight by trying to convince him he is in 'the Matrix', including creating fake 'glitches' such as training a cat to run by his door twice as well as using Glenn's twin brother Ben. Dwight meets up with Hank in the warehouse, who claims to be Morpheus's brother 'Dorpheus' and offers Dwight the red pill, which will allow him to join his army, or the blue pill, which will make him forget. Surprisingly, Dwight chooses the blue pill: He is the manager, he owns the building, he has a nice farm, and he's getting married to Angela, and he does not want to throw that away. Watching over a security camera, Pam finds this cute, while Jim is horrified as he hired thirty people to participate in the prank. Hank calls out that someone should intervene if the blue pill is not actually safe to eat, prompting Jim to run off. Dwight, wise that this is a prank, sarcastically asks if Hank is calling for Deo or Drinity.",
        "photo_url": "https://cdn.theoffice.foo/the-matrix.jpeg",
        "video_url": "https://cdn.theoffice.foo/The-Matrix.mp4"
      }
    ]);
  });
  it('should return a extra for a valid id', async () => {
    const res = await app.request('http://localhost/extras/1');
    const body = await res.json<IOfficeExtras>();

    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toContain('application/json');
    expect(body).toEqual({
      "id": 1,
      "name": "Threat Level Midnight",
      "description": "After secret agent Michael Scarn (played by Scott) is forced into retirement due to the death of his wife Catherine Zeta-Scarn, the President of the United States of America (played by Darryl Philbin) requests that he prevent Goldenface (played by Jim Halpert) from blowing up the NHL All-Star Game and killing several hostages. Scarn goes undercover and learns how to play hockey, killing another hockey player (played by Oscar Martinez) to make it into the game, but after confronting Goldenface, he is shot. He later recuperates but learns that the President was in on it all along. Depressed, he goes to a bar to drown his sorrows. The patrons of the bar sing a song called 'The Scarn' which he danced to with his wife, which cheers Scarn up immensely. With his courage restored, Scarn is able to save the day and blow up Goldenface in the process.",
      "photo_url": "https://cdn.theoffice.foo/Threat-Level-Midnight.jpg",
      "video_url": "https://cdn.theoffice.foo/Threat-Level-Midnight-Movie.mp4"
    });
  });
});

describe('Trivia routes', () => {
  it('should return all trivia', async () => {
    const res = await app.request('http://localhost/trivia');
    const body = await res.json<IOfficeTriva>();

    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toContain('application/json');
    expect(body).not.toBe('');
  });
  it('should return a trivia for a valid id', async () => {
    const res = await app.request('http://localhost/trivia/1');
    const body = await res.json<IOfficeTriva>();

    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toContain('application/json');
    expect(body).not.toBe('');
  });
});