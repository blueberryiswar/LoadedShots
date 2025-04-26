import { Scene } from 'phaser';
import CheckerBackground from '../entities/CheckerBackground';

export class GameOver extends Scene
{
    constructor ()
    {
        super('GameOver');
    }

    create ()
    {
        this.cameras.main.setBackgroundColor(0xff0000);
        this.background = new CheckerBackground(this, [
            [0x5E1675, 0xEE4266],
            [0x640D5F, 0xD91656],
            [0xF7CFD8, 0xF4F8D3],
            [0xA6D6D6, 0x8E7DBE]
        ])
        
        this.add.image(870,250,'gameoverText');
        this.add.image(360,400,'angryBoss');

        /*

        this.add.text(640, 360, 'Game Over', {
            fontFamily: 'Arial Black', fontSize: 64, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        */

        this.input.once('pointerdown', () => {

            this.scene.start('MainMenu');

        });
    }

    update(time, delta) {
        this.background.update(time, delta);
    }
}
