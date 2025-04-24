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
        this.checker = [];
        this.createBackground();

        this.add.image(640, 360, 'olivetitle');

        this.add.text(640, 520, 'Loaded Shots', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        this.input.once('pointerdown', () => {

            this.scene.start('Game');

        });
    }

    createBackground() {
        const cubeSize = 64;
        let currentPos = {x: 0 - cubeSize, y: 0 - cubeSize};
        const maxPos = {x: this.screenSize.width + cubeSize, y: this.screenSize.height + cubeSize};
        const colors = [[0x81E7AF, 0x03A791], [0x03A791, 0x81E7AF]];

        while(currentPos.y <= maxPos.y) {
            console.log("go")
            while(currentPos.x <= maxPos.x) {
                //const rect = new Phaser.GameObjects.Rectangle(this, currentPos.x, currentPos.y, cubeSize, cubeSize, colors[currentPos.x / cubeSize % 2])
                const rect = this.add.rectangle(currentPos.x, currentPos.y, cubeSize, cubeSize, colors[Math.abs(currentPos.y / cubeSize % 2)][Math.abs(currentPos.x / cubeSize % 2)]);
                //this.matter.add.gameObject(rect);
                currentPos.x += cubeSize;
                console.log(currentPos);
                this.checker.push(rect);
            }
            currentPos.y += cubeSize;
            currentPos.x = 0 - cubeSize;
        }

    }

    update() {
        this.checker.forEach((cube) => {
            cube.x += 1;
            cube.y += 1;
            if (cube.x > this.screenSize.width + 63) cube.x = 0 - 64;
            if (cube.y > this.screenSize.height + 63) cube.y = 0 - 64;
        })
    }
}
