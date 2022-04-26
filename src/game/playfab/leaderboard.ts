export const submitScore = (score: number) => {
  PlayFabClientSDK.UpdatePlayerStatistics({
    Statistics: [{ StatisticName: 'Highscore', Value: score }],
  });
};

export const getLeaderboardScores = () => {
  return new Promise((resolve, reject) => {
    PlayFabClientSDK.GetLeaderboard(
      {
        StartPosition: 0,
        StatisticName: 'Highscore',
        MaxResultsCount: 100,
      },
      (result: any) => {
        return resolve(result.data);
      }
    );
  });
};
