import Button from 'phaser3-rex-plugins/plugins/button';
import ContainerLite from 'phaser3-rex-plugins/plugins/containerlite';
import Label from 'phaser3-rex-plugins/templates/ui/label/Label';
import TFBaseScene from '../../scenes/TFBaseScene';
import { LoggedUserSession } from '../utils/types';
import Word from './Word';

enum HUDButtons {
  LOGOUT = 'logout_button',
  ACHIEVEMENTS = 'achievements_button',
}

export class HUD extends ContainerLite {
  private scaleFactor: number = 4.5;
  private parentScene: TFBaseScene;

  constructor(scene: TFBaseScene, x: number, y: number, loggedUserSession: LoggedUserSession) {
    super(scene, x, y);

    this.parentScene = scene;

    // PHOTO SQUARE
    const squarePhoto = scene.add.sprite(0, 0, 'player-hud', 'square.png');
    squarePhoto.setOrigin(1, 0);
    squarePhoto.setScale(this.scaleFactor);

    this.add(squarePhoto);
    this.setChildPosition(squarePhoto, x, 0);

    // NAME BAR
    const nameBar = scene.add.sprite(
      squarePhoto.x - squarePhoto.width * squarePhoto.scale,
      0,
      'player-hud',
      'horizontal_bar.png'
    );
    const offset = 1;
    nameBar.setFlipX(true);
    nameBar.setScale(this.scaleFactor + offset);
    nameBar.setOrigin(0, 0);

    this.add(nameBar);

    // LOGOUT BUTTON
    const logoutButton = scene.add.sprite(0, 0, 'main-buttons', 'enabled.png');

    // ACHIEVEMENTS BUTTON
    const achievementsButton = scene.add.sprite(0, 0, 'main-buttons', 'enabled.png');

    const logoutText = new Word(scene, 0, 0, 'Logout', 'white', true, '25px');

    const logoutButtonLabel = scene.rexUI.add.label({
      name: HUDButtons.LOGOUT,
      x: squarePhoto.x - squarePhoto.width * squarePhoto.scale,
      y: nameBar.y + nameBar.height * nameBar.scale,
      align: 'center',
      background: logoutButton,
      text: logoutText,
      space: {
        left: 10,
        right: 10,
        top: 5,
        bottom: 20,
      },
    });

    logoutButtonLabel.setOrigin(1, 0).layout();

    this.add(logoutButtonLabel);

    const achievementsText = new Word(scene, 0, 0, 'Achievements', 'white', true, '25px');

    const achievementsButtonLabel = scene.rexUI.add.label({
      name: HUDButtons.ACHIEVEMENTS,
      x: logoutButtonLabel.x - logoutButtonLabel.width,
      y: nameBar.y + nameBar.height * nameBar.scale,
      align: 'center',
      background: achievementsButton,
      text: achievementsText,
      space: {
        left: 10,
        right: 10,
        top: 5,
        bottom: 20,
      },
    });

    achievementsButtonLabel.setOrigin(1, 0).layout();

    this.add(achievementsButtonLabel);

    // ADD USER DATA
    if (loggedUserSession.isLoggedIn) {
      const user = loggedUserSession.user;
      // DISPLAYNAME
      const displayInfoText = user.displayName ?? user.email;
      const omitFirstPartOfNameBar = 40;
      const xPos =
        omitFirstPartOfNameBar + nameBar.x - (nameBar.width * (this.scaleFactor + offset)) / 2;
      const yPos = nameBar.y + (nameBar.height * (this.scaleFactor + offset)) / 2;
      const userInfo = new Word(scene, xPos, yPos, displayInfoText, '#FFFFFF', true, '40px');
      userInfo.setOrigin(0.5, 0.5);

      this.add(userInfo);
      // DISPLAY PHOTO
      const borderOffset = 18;
      const profilePicture = scene.add.image(
        squarePhoto.x - squarePhoto.width * this.scaleFactor + borderOffset,
        borderOffset,
        'user-profile-picture'
      );
      profilePicture.setOrigin(0, 0);
      profilePicture.setScale(0.16);
      this.add(profilePicture);
    }
    scene.add.existing(this);

    // EVENTS
    // logoutButtonLabel.on('click', this.buttonClick, this);
    // achievementsButtonLabel.on('click', this.buttonClick, this);
    logoutButtonLabel.onClick(this.buttonClick, this);
    achievementsButtonLabel.onClick(this.buttonClick, this);
  }

  buttonClick(_click: Button, go: Phaser.GameObjects.GameObject) {
    const buttonLabel = go as Label;
    this.parentScene.tweens.add({
      targets: buttonLabel.getChildren(),
      alpha: 0.6,
      duration: 100,
      yoyo: true,
      onComplete: (tween) => {
        tween.resetTweenData(true);
      },
    });
    switch (buttonLabel.name) {
      case HUDButtons.LOGOUT:
        this.logout();
        break;
    }
  }

  logout() {
    this.parentScene.getPlayerData().data.session.isLoggedIn = false;
    this.parentScene.getPlayerData().data.session.user = {
      displayName: '',
      email: '',
      slackId: undefined,
      firebaseUserUid: undefined,
      profilePictureUrl: undefined,
      role: 0,
    };
    this.parentScene.getPlayerData().data.session.data = {
      token: '',
      expireTime: 0,
    };
    localStorage.removeItem('session');
    this.destroy();
  }
}
