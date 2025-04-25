import Ingredient from '../entities/Ingredient.js';
import Glass from '../entities/Glass.js';
import Guest from '../entities/Guest.js';

export default class EntityFactory {
    constructor(scene) {
        this.scene = scene;
        this.ingredientTypes = ["icecube", "icecubeL", "orange", "olive", "burger", "banana", "celery", "umbrella"];
        this.ingredientWeights = [5,9,6,2,1];
        this.guests = ["Lawrence", "Ingrid", "Murphy"];
    }
    
    setSpritePhysics(physics) {
        this.spritePhysics = physics;
    }

    getRandomIngredientType() {
        return Phaser.Math.RND.weightedPick(this.ingredientTypes);
    }

    createRandomIngredient(x, y) {
        const type = this.getRandomIngredientType();
        return this.createIngredient(type, x, y);
    }
    
    createIngredient(type, x, y) {
        let ingredient = null
        switch(type) {
            case "olive": 
                ingredient = new Ingredient(this.scene, x, y, type, this.spritePhysics.olive);
                ingredient.setWeightDistribution(0, 0.2, false); // top heavy
                break;
            case "icecube": 
                ingredient = new Ingredient(this.scene, x, y, type, this.spritePhysics.icecubeS);
                ingredient.setWeightDistribution(0, 0, 0.01); // center
                break;
            case "icecubeL": 
            ingredient = new Ingredient(this.scene, x, y, type, this.spritePhysics.icecubeL);
            ingredient.setWeightDistribution(0, 0, 0.01); // center
            break;
            case "burger": 
            ingredient = new Ingredient(this.scene, x, y, type, this.spritePhysics.burger);
            ingredient.setWeightDistribution(0, 0.6, false); // very top heavy
            break;
            case "celery": 
            ingredient = new Ingredient(this.scene, x, y, type, this.spritePhysics.celery);
            ingredient.setWeightDistribution(0, -0.2, 0.01); // bottom heavy
            break;
            case "orange": 
            ingredient = new Ingredient(this.scene, x, y, type, this.spritePhysics.orange);
            ingredient.setWeightDistribution(0, -0.2, 0.04); // bottom heavy
            break;
            case "banana": 
            ingredient = new Ingredient(this.scene, x, y, type, this.spritePhysics.banana);
            ingredient.setWeightDistribution(0, 0.1, 0.03); // bit top
            break;
            case "umbrella": 
            ingredient = new Ingredient(this.scene, x, y, type, this.spritePhysics.umbrella);
            ingredient.setWeightDistribution(0, -0.8, 0.03); // bottom monster
            break;
            default: return null
        } 
        return ingredient;     
    }
    
    createGlass(x, y, config) {
        return new Glass(this.scene, x, y, 'glass', this.spritePhysics.glass);
    }

    createRandomGuest() {
        return new Guest(this.scene, 0, 0, Phaser.Math.RND.pick(this.guests));
    }

    createGuest(who, x, y) {
        if(!this.guests.includes(who)) return;
        return new Guest(this.scene, x, y, who);
    }
}