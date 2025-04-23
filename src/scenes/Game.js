import { Scene } from 'phaser';
import EntityFactory from '../factories/EnitityFactory';

export class Game extends Scene
{
    constructor ()
    {
        super('Game');
        this.entities = []; // Track all game objects
        
    }

    create ()
    {
        this.factory = new EntityFactory(this)
        this.cameras.main.setBackgroundColor(0x444444);
        // Create walls (static bodies that don't move)
        this.matter.world.setBounds(0, 0, 1024, 768);

        // Create Matter.js bodies
        const cubic = this.matter.add.rectangle(400, 200, 80, 80);
        const circlous = this.matter.add.circle(400, 50, 30, {
            restitution: 0.9,  // Very bouncy (90% energy retained)
            friction: 0.005,   // Low friction
            frictionAir: 0.01  // Low air resistance
        });

        const olive = this.factory.createIngredient('olive', 400, 100, {
            restitution: 0.9
        });
        
        const glass = this.factory.createGlass(400, 500, {
            width: 300,
            height: 30
        });
        
        this.entities.push(olive, glass);
        
        this.input.once('pointerdown', () => {

            this.scene.start('GameOver');

        });
    }

    update() {
        this.entities.forEach((entity) => entity.update())
    }
}
