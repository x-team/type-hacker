import TFBaseScene from '../../scenes/TFBaseScene';
import { LoggedUserSession } from '../utils/types';
import Word from './Word';
export class HUD extends Phaser.GameObjects.Container {
  private scaleFactor: number = 4;
  constructor(scene: TFBaseScene, x: number, y: number, loggedUserSession: LoggedUserSession) {
    super(scene, x, y);
    // PHOTO SQUARE
    const squarePhoto = scene.add.sprite(0, 0, 'player-hud', 'square.png');
    squarePhoto.setScale(this.scaleFactor);
    squarePhoto.setOrigin(1, 0);
    // NAME BAR
    const nameBar = scene.add.sprite(
      -(squarePhoto.width * this.scaleFactor),
      squarePhoto.height * this.scaleFactor - 21 * this.scaleFactor,
      'player-hud',
      'horizontal_bar.png'
    );
    const offset = 1;
    nameBar.setFlipX(true);
    nameBar.setScale(this.scaleFactor + offset);
    nameBar.setOrigin(0, 0);

    squarePhoto.setDepth(1);
    nameBar.setDepth(0);

    this.add(squarePhoto);
    this.add(nameBar);

    // ADD USER DATA
    if (loggedUserSession.isLoggedIn) {
      const user = loggedUserSession.user;

      // DISPLAYNAME
      const displayInfoText = user.displayName ?? user.email;
      const omitFirstPartOfNameBar = 60;
      const xPos =
        omitFirstPartOfNameBar - (nameBar.x + nameBar.width * (this.scaleFactor + offset));
      const yPos = nameBar.y + (nameBar.height * (this.scaleFactor + offset)) / 2;
      const userInfo = new Word(scene, xPos, yPos, displayInfoText, '#FFFFFF', true, '40px');
      userInfo.setOrigin(0.5, 0.5);
      this.add(userInfo);

      // DISPLAY PHOTO
      const borderOffset = 32;
      const profilePicture = scene.add.image(
        borderOffset / 2 - squarePhoto.width * this.scaleFactor,
        borderOffset / 2,
        'user-profile-picture'
      );
      profilePicture.setOrigin(0, 0);
      profilePicture.displayHeight = squarePhoto.height * this.scaleFactor - borderOffset;
      profilePicture.displayWidth = squarePhoto.width * this.scaleFactor - borderOffset;
      this.add(profilePicture);
    }

    scene.add.existing(this);
  }
}
