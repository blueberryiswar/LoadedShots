import { Scene } from 'phaser';
import CheckerBackground from '../entities/CheckerBackground';

export class GameOver extends Scene
{
    constructor ()
    {
        super('GameOver');
    }

    init(data) {
        this.score = data.score
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

        this.add.image(880,260,'gameoverText').setTint(0x000000).setAlpha(0.5);
        this.add.image(370,410,'angryBoss').setTint(0x000000).setAlpha(0.5);

        this.add.image(870,250,'gameoverText');
        this.add.image(360,400,'angryBoss');

        this.add.text(40, 40, `You let the Customer wait too long!`, {
            fontFamily: 'Arial Black', fontSize: 32, color: '#000000',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0).setAlpha(0.5);

        this.add.text(50, 50, `You let the Customer wait too long!`, {
            fontFamily: 'Arial Black', fontSize: 32, color: '#BB3E00',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0);
        
        this.add.text(960, 560, `Your Earnings: ${this.score}$`, {
            fontFamily: 'Arial Black', fontSize: 36, color: '#000000',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setAlpha(0.5);
        this.add.text(950, 550, `Your Earnings: ${this.score}$`, {
            fontFamily: 'Arial Black', fontSize: 36, color: '#F7AD45',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        this.add.text(960, 660, `Click to try again`, {
            fontFamily: 'Arial Black', fontSize: 32, color: '#000000',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setAlpha(0.5);

        this.add.text(950, 650, `Click to try again`, {
            fontFamily: 'Arial Black', fontSize: 32, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        this.input.once('pointerdown', () => {

            this.scene.start('Game');

        });
    }

    update(time, delta) {
        this.background.update(time, delta);
    }
}
