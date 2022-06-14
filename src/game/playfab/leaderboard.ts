export const submitScore = () => {
  return new Promise(({}, reject) => {
    try {
      // PlayFabClientSDK.UpdatePlayerStatistics(
      //   {
      //     Statistics: [{ StatisticName: 'Highscore', Value: score }],
      //   },
      //   (result: any) => {
      //     return resolve(result.code);
      //   }
      // );
    } catch (e) {
      return reject(new Error(`Submit Score failed ${e}`));
    }
  });
};

export const getLeaderboardScores = () => {
  return new Promise(({}, reject) => {
    try {
      // PlayFabClientSDK.GetLeaderboard(
      //   {
      //     StartPosition: 0,
      //     StatisticName: 'Highscore',
      //     MaxResultsCount: 10,
      //   },
      //   (result: any) => {
      //     return resolve(result.data);
      //   }
      // );
    } catch (e) {
      return reject(new Error('Get Leaderboard failed'));
    }
  });
};
