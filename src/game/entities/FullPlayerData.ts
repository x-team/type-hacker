// Singleton class to have the same player info;

import { generatePlayerDataSeed } from '../utils/generators';
import {
  PlayerDataData,
  PlayerDataConfiguration,
  PlayerDataHelpers,
  PlayerDataSettings,
} from '../utils/types';

export class FullPlayerData {
  private static instance: FullPlayerData;

  public settings: PlayerDataSettings;
  public configuration: PlayerDataConfiguration;
  public helpers: PlayerDataHelpers;
  public data: PlayerDataData;

  constructor() {
    const fullPlayerData = generatePlayerDataSeed();
    this.configuration = fullPlayerData.configuration;
    this.data = fullPlayerData.data;
    this.helpers = fullPlayerData.helpers;
    this.settings = fullPlayerData.settings;
  }

  private seedAllParams() {
    const fullPlayerData = generatePlayerDataSeed();
    this.configuration = fullPlayerData.configuration;
    this.data = fullPlayerData.data;
    this.helpers = fullPlayerData.helpers;
    this.settings = fullPlayerData.settings;
  }

  public static getPlayerData(reset?: boolean): FullPlayerData {
    if (!FullPlayerData.instance || reset) {
      FullPlayerData.instance = new FullPlayerData();
      FullPlayerData.instance.seedAllParams();
    }

    return FullPlayerData.instance;
  }
}
