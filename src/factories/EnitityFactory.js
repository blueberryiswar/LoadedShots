import Ingredient from '../entities/Ingredient.js';
import Glass from '../entities/Glass.js';

export default class EntityFactory {
    constructor(scene) {
        this.scene = scene;
        
    }
    
    setSpritePhysics(physics) {
        this.spritePhysics = physics
    }

    createIngredient(type, x, y) {
        switch(type) {
            case "olive": return new Ingredient(this.scene, x, y, 'olive', this.spritePhysics.olive);
            case "icecube": return new Ingredient(this.scene, x, y, 'icecube', this.spritePhysics.icecubeS);
            case "orange": return new Ingredient(this.scene, x, y, 'orange', this.spritePhysics.orange);
            case "banana": return new Ingredient(this.scene, x, y, 'banana', this.spritePhysics.banana);
            default: return new Ingredient(this.scene, x, y, 'icecube', this.spritePhysics.icecubeS);
        }      
    }
    
    createGlass(x, y, config) {
        return new Glass(this.scene, x, y, 'glass', this.spritePhysics.glass);
    }
}