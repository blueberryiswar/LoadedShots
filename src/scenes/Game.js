import { Scene } from 'phaser';

export class Game extends Scene
{
    constructor ()
    {
        super('Game');
    }

    create ()
    {
        this.cameras.main.setBackgroundColor(0x00ff00);
        // Create walls (static bodies that don't move)
        this.matter.world.setBounds(0, 0, 1024, 768);

        // Create Matter.js bodies
        const cubic = this.matter.add.rectangle(400, 200, 80, 80);
        const circlous = this.matter.add.circle(400, 50, 30);
        
        this.input.once('pointerdown', () => {

            this.scene.start('GameOver');

        });
    }
}
