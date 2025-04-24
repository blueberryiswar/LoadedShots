import { Scene } from 'phaser';

export class MainMenu extends Scene
{
    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        this.screenSize = {width: 1280, height: 720};
        this.cubeSize = Math.floor(this.screenSize.width / 9)
        this.maxPos = {
            x: Math.ceil(this.screenSize.width / this.cubeSize) * this.cubeSize + this.cubeSize,
            y: Math.ceil(this.screenSize.height / this.cubeSize) * this.cubeSize + this.cubeSize        
        }
        this.checker = [];
        this.createBackground();

        const shadow = this.add.image(630, 350, 'olivetitle');
        const textShadow = this.add.text(630, 510, 'Loaded Shots', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#000000',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);
        textShadow.setAlpha(0.5)
        shadow.setTint(0x000000);
        shadow.setAlpha(0.5)
        this.add.image(640, 360, 'olivetitle');
        

        this.add.text(640, 520, 'Loaded Shots', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        this.timer = 0;
        this.revolution = 0;
        this.movement = [1, 1];

        this.input.once('pointerdown', () => {

            this.scene.start('Game');

        });
    }

    createBackground() {
        const cubeSize = this.cubeSize;
        let currentPos = {x: -cubeSize, y: -cubeSize};
        const maxPos = this.maxPos;
        const colors = [[0x81E7AF, 0x03A791], [0x03A791, 0x81E7AF]];

        this.checker = [];

        while(currentPos.y <= maxPos.y) {
            while(currentPos.x <= maxPos.x) {
                console.log(currentPos, colors[Math.abs(currentPos.y / cubeSize % 2)][Math.abs(currentPos.x / cubeSize % 2)])
                const rect = this.add.rectangle(currentPos.x, currentPos.y, cubeSize, cubeSize, colors[Math.abs(currentPos.y / cubeSize % 2)][Math.abs(currentPos.x / cubeSize % 2)]);
                currentPos.x += cubeSize;
                this.checker.push(rect);
            }
            currentPos.y += cubeSize;
            currentPos.x = 0 - cubeSize;
        }

    }

    update(time, delta) {
        this.timer += delta
        if(this.timer > 5000) {
            this.timer = 0
            this.revolution += 1;
            this.movement[this.revolution % 2] *= -1
        }
        this.checker.forEach((cube) => {
            cube.x += this.movement[0];
            cube.y += this.movement[1];
            if(this.movement[0] > 0) {
                if (cube.x > this.maxPos.x - 1) cube.x = 0 - this.cubeSize;
            } else {
                if (cube.x < 0 - this.cubeSize + 1) cube.x = this.maxPos.x;
            }
            if(this.movement[1] > 0) {
                if (cube.y > this.maxPos.y - 1) cube.y = 0 - this.cubeSize;
            } else {
                if (cube.y < 0 - this.cubeSize + 1) cube.y = this.maxPos.y;
            }
        })
    }
}
