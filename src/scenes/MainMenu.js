import { Scene } from 'phaser';

export class MainMenu extends Scene {
    constructor() {
        super('MainMenu');
    }

    create() {
        this.screenSize = { width: 1280, height: 720 };
        this.cubeSize = Math.floor(this.screenSize.width / 9)
        this.maxPos = {
            x: Math.ceil(this.screenSize.width / this.cubeSize) * this.cubeSize * 2,
            y: Math.ceil(this.screenSize.height / this.cubeSize) * this.cubeSize * 2        
        }
        this.checker = [];
        this.createBackground();

        const shadow = this.add.image((this.screenSize.width*0.5)-170, (this.screenSize.height*0.5)-5, 'olivetitle');

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
        shadow.setAlpha(0.5)
        /*
      
                this.add.text(640, 520, 'Loaded Shots', {
                    fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
                    stroke: '#000000', strokeThickness: 8,
                    align: 'center'
                }).setOrigin(0.5);
        */

        this.timer = 0;
        this.revolution = 0;
        this.colorSets = [
            [0x81E7AF, 0x03A791],
            [0xF1BA88, 0xE9F5BE],
            [0x8C82FC, 0xFF9DE2],
            [0x7EFFDB, 0xB693FE],
            [0xEBEAFF, 0x9694FF]
        ]
        this.switchColor = false;
        this.movement = [0.2, 0.2];

        this.input.once('pointerdown', () => {

            this.scene.start('Game');

        });
    }

    createBackground() {
        const cubeSize = this.cubeSize;
        let currentPos = {
            x: -this.cubeSize * Math.ceil(this.screenSize.width / this.cubeSize)
            , y: -this.cubeSize * Math.ceil(this.screenSize.height / this.cubeSize)
        };
        const maxPos = this.maxPos;
        const colors = [0x81E7AF, 0x03A791];

        this.checker = [];

        while (currentPos.y <= maxPos.y) {
            while (currentPos.x <= maxPos.x) {
                console.log(currentPos, colors[Math.abs(currentPos.y / cubeSize % 2)][Math.abs(currentPos.x / cubeSize % 2)])
                const colorType = (Math.abs(currentPos.y / cubeSize % 2) + Math.abs(currentPos.x / cubeSize % 2)) % 2
                const rect = this.add.rectangle(currentPos.x, currentPos.y, cubeSize, cubeSize, colors[colorType]);
                currentPos.x += cubeSize;
                rect.colorType = colorType;
                this.checker.push(rect);
            }
            currentPos.y += cubeSize;
            currentPos.x = -this.cubeSize * Math.ceil(this.screenSize.width / this.cubeSize);
        }

    }

    pickRandomColor() {
        this.currentColor = Phaser.Math.RND.pick(this.colorSets);
        this.switchColor = true;
    }

    getRandomMovespeed(positive) {
        const speed = [0.12, 0.2, 0.15, 0.14, 0.18, 0.08, 0.23];

        if(!positive) return Phaser.Math.RND.pick(speed);
        return 0 - Phaser.Math.RND.pick(speed);
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

        /* bouncing bounds */
        let bounce = {
            x: true,
            y: true
        };

        this.checker.forEach((cube) => {
            cube.x += this.movement[0] * delta;
            if(this.movement[0] > 0 && cube.x < 0) bounce.x = false;
            if(this.movement[0] < 0 && cube.x > this.screenSize.width) bounce.x = false;

            cube.y += this.movement[1] * delta;
            if(this.movement[1] > 0 && cube.y < 0) bounce.y = false;
            if(this.movement[1] < 0 && cube.y > this.screenSize.height) bounce.y = false;
            if(this.switchColor) {
                cube.setFillStyle(this.currentColor[cube.colorType]);
            }
        })
        this.switchColor = false

        console.log(bounce.y);
        
        if(bounce.x) {
            this.movement[0] = this.getRandomMovespeed(this.movement[0]>0);
            this.pickRandomColor();
        }
        if(bounce.y) {
            this.movement[1] = this.getRandomMovespeed(this.movement[1]>0);
            this.pickRandomColor();
        }
        

    }
}
