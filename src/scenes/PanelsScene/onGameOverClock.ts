import CircularProgress from 'phaser3-rex-plugins/plugins/circularprogress';

export function onGameOverClock(clockRadius: CircularProgress) {
  if (clockRadius?.data) {
    const clockTimerTween = clockRadius.data.get('clockTimerTween');
    clockTimerTween.pause();
  }
}
