export default class CheckerBackground{
    constructor(scene, colorSets) {
        this.scene = scene;
        this.screenSize = { width: 1280, height: 720 };
        this.cubeSize = Math.floor(this.screenSize.width / 9)
        this.maxPos = {
            x: Math.ceil(this.screenSize.width / this.cubeSize) * this.cubeSize * 2,
            y: Math.ceil(this.screenSize.height / this.cubeSize) * this.cubeSize * 2        
        }
        this.checker = [];
        this.colorSets = colorSets;
        this.switchColor = false;
        this.movement = [0.2, 0.2];

        this.createBackground();
    }

    createBackground() {
        const cubeSize = this.cubeSize;
        let currentPos = {
            x: -this.cubeSize * Math.ceil(this.screenSize.width / this.cubeSize)
            , y: -this.cubeSize * Math.ceil(this.screenSize.height / this.cubeSize)
        };
        const maxPos = this.maxPos;
        const colors = this.colorSets[0];

        this.checker = [];

        while (currentPos.y <= maxPos.y) {
            while (currentPos.x <= maxPos.x) {
                const colorType = (Math.abs(currentPos.y / cubeSize % 2) + Math.abs(currentPos.x / cubeSize % 2)) % 2
                const rect = this.scene.add.rectangle(currentPos.x, currentPos.y, cubeSize, cubeSize, colors[colorType]);
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
        this.switchColor = false;
        
        if(bounce.x) {
            this.movement[0] = this.getRandomMovespeed(this.movement[0]>0);
            this.pickRandomColor();
        }
        if(bounce.y) {
            this.movement[1] = this.getRandomMovespeed(this.movement[1]>0);
            this.pickRandomColor();
        }
    }

    destroy() {
        this.checker.forEach((cube) => cube.destroy());
    }
}