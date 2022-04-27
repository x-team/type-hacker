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

    // First Explosion
    this.load.atlas(
      'explosion-atlas',
      'assets/main/damageMonitor/explosion-atlas.png',
      'assets/main/damageMonitor/explosion-atlas.json'
    );

    // Final Explosion
    this.load.atlas(
      'final-explosion-atlas',
      'assets/main/damageMonitor/final-explosion-atlas.png',
      'assets/main/damageMonitor/final-explosion-atlas.json'
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
    this.load.image('x-team-logo', 'assets/icons/x-team-logo-border.png');

    // LOGOS
    this.load.image('type-hacker-logo', 'assets/main/type-hacker-logo.png');
    this.load.image('game-over-logo', 'assets/main/game-over-logo.png');

    // SFX
    this.load.audio('keyboard1', ['assets/sfx/keyboard1.ogg']);
    this.load.audio('keyboard2', ['assets/sfx/keyboard2.ogg']);
    this.load.audio('keyboard3', ['assets/sfx/keyboard3.ogg']);
    this.load.audio('keyboard4', ['assets/sfx/keyboard4.ogg']);
    this.load.audio('mistype', ['assets/sfx/mistype-sound.wav']);
    this.load.audio('glass-break', ['assets/sfx/glass-break-1.wav']);
    this.load.audio('monitor-break', ['assets/sfx/monitor-break.wav']);
    this.load.audio('monitor-break-fire', ['assets/sfx/monitor-break-fire.wav']);

    // Background Music
    this.load.audio('bgm', ['assets/sfx/electronic-senses-fast-and-intense.mp3']);

    // Sprites
    this.load.spritesheet('matrix-font', 'assets/fonts/matrix-font.png', {
      frameWidth: 32,
      frameHeight: 25,
    });
    this.load.spritesheet('matrix-font-salmon', 'assets/fonts/matrix-font-salmon.png', {
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

    // First Explosion
    const explosionDuration = 2000;
    const explosionRepetitions = 2;
    this.anims.create({
      key: 'explosion-smoke-atlas-anim',
      frames: this.anims.generateFrameNames('explosion-atlas', {
        prefix: '0',
        suffix: '.png',
        start: 0,
        end: 15,
      }),
      repeat: explosionRepetitions,
      duration: explosionDuration,
      hideOnComplete: true,
    });

    // Final Explosion
    const finalExplosionDuration = 1000;
    this.anims.create({
      key: 'final-explosion-atlas-anim',
      frames: this.anims.generateFrameNames('final-explosion-atlas', {
        prefix: '0',
        suffix: '.png',
        start: 0,
        end: 11,
      }),
      duration: finalExplosionDuration,
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
    });

    this.scene.start(SceneKeys.BaseEvents);
    this.scene.start(SceneKeys.GameStartDialog);
    this.scene.start(SceneKeys.UIElements);
  }
}
