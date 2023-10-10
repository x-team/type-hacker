import { TMonitorConfiguration } from './types';

// GENERAL GAME
export const GAME_BG_COLOR = 0x000000;

export enum CLOCK_COLORS {
  FIRST_COLOR = 0x41defd, // BLUE SCREEN COLOR
  SECOND_COLOR = 0xffc642, // YELLOW
  THIRD_COLOR = 0xfc9842, // ORANGE
  FOURTH_COLOR = 0xff2b24, // RED
}

export const MONITORS_TURNED_OFF_COLOR = 0x0d3740; // OPAQUE DARK DARK BLUE SCREEN COLOR
export const MONITORS_TURNED_OFF_OVERLAY_ALPHA = 0.6; // OPAQUE DARK DARK BLUE SCREEN OPACITY

export const MONITORS_DEFAULT_OVERLAY_COLOR = 0x3d5459; // OPAQUE BLUE SCREEN COLOR
export const MONITORS_DEFAULT_OVERLAY_ALPHA = 0.23; // OPAQUE BLUE SCREEN OPACITY

export const MONITORS_FOCUS_OVERLAY_ALPHA = 0.12; // OPAQUE BLUE SCREEN OPACITY

// SETTINGS
export const monitorConfiguration: TMonitorConfiguration = {
  isDamaged: false,
  timeout: 10,
  userWord: '',
  guessWord: 'guessWord',
  timeoutLostPoints: 10,
  timeoutLostPointsForDamagedMonitor: 20,
  rightKeyStrokeWinPoints: 100, // This is the base score for some reason
  rightKeyStrokeWinPointsForDamagedMonitor: 20,
  comboWinPoints: 10,
  comboWinPointsForDamagedMonitor: 10,
  wrongKeyStrokeLostPoints: 10,
  wrongKeyStrokeLostPointsForDamagedMonitor: 20,
};
