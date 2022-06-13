import { gamesHqUrl, getAxiosInstance } from './utils';

interface ScoreToSave {
  score: number;
  longestStreak: number;
  level?: number;
}

export async function submitScore(scoreToSave: ScoreToSave) {
  const { score, longestStreak, level } = scoreToSave;
  const requestBody = {
    _leaderboardEntryId: 1, // For now this can be hard-coded
    score,
    _leaderboardResultsMeta: [
      {
        attribute: 'longestStreak',
        value: String(longestStreak),
      },
    ],
  };
  if (level) {
    const levelMeta = {
      attribute: 'level',
      value: String(level),
    };
    requestBody._leaderboardResultsMeta.push(levelMeta);
  }
  const axios = await getAxiosInstance({ hasSignature: true, body: requestBody });
  const endpoint = gamesHqUrl + `/webhooks/game-dev/leaderboards/score`;
  const response = await axios.post(endpoint, requestBody);
  return response.data;
}

export async function getHighestScores() {
  const axios = await getAxiosInstance({ hasSignature: true });
  const endpoint = gamesHqUrl + `/webhooks/game-dev/leaderboards/${1}`; // For now this can be hard-coded
  const response = await axios.get(endpoint);
  return response.data;
}
