import CircularProgress from 'phaser3-rex-plugins/plugins/circularprogress';

export function onGameOverClock(clockRadius: CircularProgress) {
  console.log('on game over clock');
  if (clockRadius?.data) {
    console.log('here it is');
    const clockTimerTween = clockRadius.data.get('clockTimerTween');
    clockTimerTween.pause();
  }
}
