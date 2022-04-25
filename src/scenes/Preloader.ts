import SceneKeys from '../game/utils/SceneKeys';
import TFBaseScene from './TFBaseScene';

export default class PreloaderScene extends TFBaseScene {
  constructor() {
    super(SceneKeys.Preloader);
  }

  preload() {
    const assetsHacker = [];
    for (let i = 0; i < 7; i++) {
      assetsHacker.push(`assets/hero/hacker-background-${i}.png`);
    }

    // ATLAS
    this.load.atlas('hacker-background', assetsHacker, 'assets/hero/hacker-background.json');
    this.load.atlas('numbers', 'assets/main/numbers.png', 'assets/main/numbers.json');

    // PLUGINS
    // this.load.plugin(
    //   "rexcircularprogressplugin",
    //   "https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexcircularprogressplugin.min.js",
    //   true
    // );

    // PROPS AND EFFECTS
    this.load.image('panel', 'assets/main/monitor.png');
    this.load.image('timer', 'assets/main/timer.png');
    this.load.image('smoke', 'assets/main/smoke.png');

    // ICONS
    this.load.image('sound', 'assets/icons/sound.png');
    this.load.image('no-sound', 'assets/icons/no-sound.png');
    this.load.image('x-team-logo', 'assets/icons/x-team-logo-border.png');

    // LOGOS
    this.load.image('type-hacker-logo', 'assets/main/type-hacker-logo.png');

    // SFX
    this.load.audio('keyboard1', ['assets/sfx/keyboard1.ogg']);
    this.load.audio('keyboard2', ['assets/sfx/keyboard2.ogg']);
    this.load.audio('keyboard3', ['assets/sfx/keyboard3.ogg']);
    this.load.audio('keyboard4', ['assets/sfx/keyboard4.ogg']);
    this.load.audio('mistype', ['assets/sfx/mistype-sound.wav']);

    // Background Music
    this.load.audio('bgm', ['assets/sfx/electronic-senses-fast-and-intense.mp3']);

    // Sprites
    this.load.spritesheet('font', 'assets/fonts/matrix-font.png', {
      frameWidth: 32,
      frameHeight: 25,
    });
  }

  create() {
    this.anims.create({
      key: 'hacker-background-gif',
      frames: this.anims.generateFrameNames('hacker-background'),
      repeat: -1,
    });

    this.scene.start(SceneKeys.BaseEvents);
    this.scene.start(SceneKeys.GameStartDialog);
    this.scene.start(SceneKeys.UIElements);
  }
}
