import SceneKeys from '../game/utils/SceneKeys';
import TFBaseScene from './TFBaseScene';

export default class PreloaderScene extends TFBaseScene {
  constructor() {
    super(SceneKeys.Preloader);
  }

  preload() {
    const assetsHakcer = [];
    for (let i = 0; i < 7; i++) {
      assetsHakcer.push(`assets/hero/hacker-background-${i}.png`);
    }

    // ATLAS
    this.load.atlas('hacker-background', assetsHakcer, 'assets/hero/hacker-background.json');

    this.load.atlas(
      'explotion-atlas',
      'assets/main/damageMonitor/explotion-atlas.png',
      'assets/main/damageMonitor/explotion-atlas.json'
    );

    this.load.atlas(
      'smoke-atlas',
      'assets/main/damageMonitor/smoke-atlas.png',
      'assets/main/damageMonitor/smoke-atlas.json'
    );

    // PROPS AND EFFECTS
    this.load.image('panel', 'assets/main/damageMonitor/monitor.png');

    this.load.image('timer', 'assets/main/timer.png');

    // Broken Monitor assets
    this.load.image('broken-screen-1', 'assets/main/damageMonitor/broken-screen-1.png');
    this.load.image('broken-screen-2', 'assets/main/damageMonitor/broken-screen-2.png');
    this.load.image('broken-screen-3', 'assets/main/damageMonitor/broken-screen-3.png');

    // ICONS
    this.load.image('sound', 'assets/icons/sound.png');
    this.load.image('no-sound', 'assets/icons/no-sound.png');

    // SFX
    this.load.audio('keyboard1', ['assets/sfx/keyboard1.ogg']);
    this.load.audio('keyboard2', ['assets/sfx/keyboard2.ogg']);
    this.load.audio('keyboard3', ['assets/sfx/keyboard3.ogg']);
    this.load.audio('keyboard4', ['assets/sfx/keyboard4.ogg']);
    this.load.audio('mistype', ['assets/sfx/mistype-sound.wav']);
    this.load.audio('glass-break', ['assets/sfx/glass-break-1.wav']);

    // Background Music
    this.load.audio('bgm', ['assets/sfx/electronic-senses-fast-and-intense.mp3']);
  }

  create() {
    this.anims.create({
      key: 'hacker-background-gif',
      frames: this.anims.generateFrameNames('hacker-background'),
      repeat: -1,
    });

    const explotionDuration = 2000;
    const explotionRepetitions = 2;
    this.anims.create({
      key: 'explotion-smoke-atlas-anim',
      frames: this.anims.generateFrameNames('explotion-atlas', {
        prefix: '0',
        suffix: '.png',
        start: 0,
        end: 15,
      }),
      repeat: explotionRepetitions,
      duration: explotionDuration,
      hideOnComplete: true,
    });

    this.anims.create({
      key: 'smoke-atlas-anim',
      frames: this.anims.generateFrameNames('smoke-atlas', {
        prefix: '0',
        suffix: '.png',
        start: 0,
        end: 7,
      }),
      repeat: -1,
      duration: 1500,
      // delay: explotionDuration * explotionRepetitions,
    });

    this.scene.start(SceneKeys.BaseEvents);
    this.scene.start(SceneKeys.GameStartDialog);
    this.scene.start(SceneKeys.UIElements);
  }
}
