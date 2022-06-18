import { getConfig } from '../config';
import { gamesHqUrl, getAxiosInstance } from './utils';

interface LeaderboardResult {
  displayName?: string;
  email: string;
  score: number;
}

interface ScoreToSave {
  score: number;
  longestStreak: number;
  level?: number;
}

const highestScoreLeaderBoarsId = getConfig('VITE_GAMES_API_HIGHEST_LEADERBOARD_ID');
export async function submitScore(scoreToSave: ScoreToSave) {
  const { score, longestStreak, level } = scoreToSave;
  const requestBody = {
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
  const endpoint =
    gamesHqUrl + `/webhooks/game-dev/leaderboards/${highestScoreLeaderBoarsId}/score`;
  const response = await axios.post(endpoint, requestBody);
  return response.data;
}

export async function getHighestScores() {
  const axios = await getAxiosInstance({ hasSignature: true });
  const endpoint = gamesHqUrl + `/webhooks/game-dev/leaderboards/${highestScoreLeaderBoarsId}/rank`;
  const response = await axios.get(endpoint);
  return response.data as Array<LeaderboardResult>;
}
