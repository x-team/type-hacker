import { HUD } from '../../game/entities/HUD';
import SceneKeys from '../../game/utils/SceneKeys';
import TFBaseScene from '../TFBaseScene';

export default class HUDScene extends TFBaseScene {
  private hudInstance!: HUD;
  constructor() {
    super(SceneKeys.HUD);
  }

  preload() {
    if (this.getPlayerData().data.session.isLoggedIn) {
      this.load.image('user-profile-picture', 'assets/icons/hud-no-user.svg');
      // const userSession = this.getPlayerData().data.session.user;
      // TODO: We need to revisit gthis in the future due to CORS error
      // if (userSession.profilePictureUrl) {
      //   this.load.setCORS('anonymous');
      //   this.load.image(
      //     'user-profile-picture',
      //     userSession.profilePictureUrl
      //     );
      //   } else {
      //   this.load.image('user-profile-picture', 'assets/icons/hud-no-user.svg');
      // }
    }
  }

  create() {
    this.createHUDInstance();
  }

  createHUDInstance() {
    const xPos = this.game.canvas.width;
    if (this.getPlayerData().data.session.isLoggedIn) {
      this.hudInstance = new HUD(this, xPos, 0, this.getPlayerData().data.session);
      this.tweens.add({
        targets: this.hudInstance,
        alpha: {
          from: 0,
          to: 1,
        },
        duration: 1500,
      });
    }
  }
}
