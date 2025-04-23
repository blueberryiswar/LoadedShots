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
        const spritePhysics = this.cache.json.get("spritesPhysics");

        // Create Matter.js bodies
        

        const olive = this.factory.createIngredient('olive', 400, 100, spritePhysics.olive);
        const orangu = this.factory.createIngredient('orange', 400, 20, spritePhysics.orange);
        const icecube = this.factory.createIngredient('icecube', 400, 140, spritePhysics.icecubeS);
        const icecube2 = this.factory.createIngredient('icecube', 430, 150, spritePhysics.icecubeS);
        const icecube3 = this.factory.createIngredient('icecube', 380, 40, spritePhysics.icecubeS);
        
        const glass = this.factory.createGlass(400, 500, spritePhysics.glass);

        //const olive2 = this.matter.add.sprite(300, 360, "olive", null, { shape: spritePhysics.olive });
  
        
        //this.entities.push(olive, glass);
        
        this.input.once('pointerdown', () => {

            this.scene.start('GameOver');

        });
    }

    update() {
        this.entities.forEach((entity) => entity.update())
    }
}
