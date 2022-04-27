export const submitScore = (score: number) => {
  return new Promise((resolve, reject) => {
    PlayFabClientSDK.UpdatePlayerStatistics(
      {
        Statistics: [{ StatisticName: 'Highscore', Value: score }],
      },
      (result: any) => {
        return resolve(result.code);
      }
    );
  });
};

export const getLeaderboardScores = () => {
  return new Promise((resolve, reject) => {
    PlayFabClientSDK.GetLeaderboard(
      {
        StartPosition: 0,
        StatisticName: 'Highscore',
        MaxResultsCount: 10,
      },
      (result: any) => {
        return resolve(result.data);
      }
    );
  });
};
