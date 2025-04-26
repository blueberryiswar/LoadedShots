import { Scene } from 'phaser';
import CheckerBackground from '../entities/CheckerBackground';

export class MainMenu extends Scene {
    constructor() {
        super('MainMenu');
    }

    create() {
        this.screenSize = { width: 1280, height: 720 };
        this.background = new CheckerBackground(this, [
            [0x81E7AF, 0x03A791],
            [0xF1BA88, 0xE9F5BE],
            [0x8C82FC, 0xFF9DE2],
            [0x7EFFDB, 0xB693FE],
            [0xEBEAFF, 0x9694FF]
        ]);

        const shadow = this.add.image((this.screenSize.width*0.5)-175, (this.screenSize.height*0.5), 'olivetitle');
        const titleShadow = this.add.image((this.screenSize.width*0.5)+110, (this.screenSize.height*0.5)+20, 'titleText');

        this.add.image((this.screenSize.width*0.5)-180, (this.screenSize.height*0.5)-15, 'olivetitle');

        this.add.image((this.screenSize.width*0.5)+100, (this.screenSize.height*0.5)+10, 'titleText');
        /*
        const textShadow = this.add.text(650, 530, 'Loaded Shots', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#000000',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);
        textShadow.setAlpha(0.5)
        */
        shadow.setTint(0x000000);
        shadow.setAlpha(0.5);
        titleShadow.setTint(0x000000);
        titleShadow.setAlpha(0.5);
        //titleShadow.setScale(1.2,1.2)
        /*
      
                this.add.text(640, 520, 'Loaded Shots', {
                    fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
                    stroke: '#000000', strokeThickness: 8,
                    align: 'center'
                }).setOrigin(0.5);
        */

        
        this.input.once('pointerdown', () => {

            this.scene.start('Game');

        });
    }

    
    update(time, delta) {
        /* movement based on one over *
        this.timer += delta
        if (this.timer > 5000) {
            this.timer = 0
            this.revolution += 1;
            this.movement[this.revolution % 2] *= -1
        }
        this.checker.forEach((cube) => {
            cube.x += this.movement[0];
            cube.y += this.movement[1];
            if (this.movement[0] > 0) {
                if (cube.x > this.maxPos.x - 1) cube.x = 0 - this.cubeSize;
            } else {
                if (cube.x < 0 - this.cubeSize + 1) cube.x = this.maxPos.x;
            }
            if (this.movement[1] > 0) {
                if (cube.y > this.maxPos.y - 1) cube.y = 0 - this.cubeSize;
            } else {
                if (cube.y < 0 - this.cubeSize + 1) cube.y = this.maxPos.y;
            }
        })
        */

        this.background.update(time, delta);
    }

    destroy() {
        this.background.destroy();
        super.destroy();
    }
}
