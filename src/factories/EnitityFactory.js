import Ingredient from '../entities/Ingredient.js';
import Glass from '../entities/Glass.js';
import Guest from '../entities/Guest.js';

export default class EntityFactory {
    constructor(scene) {
        this.scene = scene;
        this.ingredientTypes = ["olive", "icecube", "orange", "banana"];
        this.guests = ["Lawrence"];
    }
    
    setSpritePhysics(physics) {
        this.spritePhysics = physics;
    }

    getRandomIngredientType() {
        return Phaser.Math.RND.pick(this.ingredientTypes);
    }

    createRandomIngredient(x, y) {
        const type = this.getRandomIngredientType();
        return this.createIngredient(type, x, y);
    }
    
    createIngredient(type, x, y) {
        switch(type) {
            case "olive": return new Ingredient(this.scene, x, y, type, this.spritePhysics.olive);
            case "icecube": return new Ingredient(this.scene, x, y, type, this.spritePhysics.icecubeS);
            case "orange": return new Ingredient(this.scene, x, y, type, this.spritePhysics.orange);
            case "banana": return new Ingredient(this.scene, x, y, type, this.spritePhysics.banana);
            default: return new Ingredient(this.scene, x, y, 'icecube', this.spritePhysics.icecubeS);
        }      
    }
    
    createGlass(x, y, config) {
        return new Glass(this.scene, x, y, 'glass', this.spritePhysics.glass);
    }

    createGuest(who, x, y) {
        if(!this.guests.includes(who)) return new Guest(this.scene, x, y, "Lawrence");

        return new Guest(this.scene, x, y, "Lawrence")
    }
}