import Ingredient from '../entities/Ingredient.js';
import Glass from '../entities/Glass.js';
import Guest from '../entities/Guest.js';

export default class EntityFactory {
    constructor(scene) {
        this.scene = scene;
        this.ingredientTypes = ["oliveSingle", "icecubeL", "orange", "olive","pickle", "burger", "banana", "celery", "umbrella","ziggi","fly"];
        this.guests = ["Lawrence", "Ingrid", "Murphy","Raven"];
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
                ingredient.setWeightDistribution(0, 0.002, false); // top heavy
                ingredient.setPrice(1.5);
                break;
            case "icecube": 
                ingredient = new Ingredient(this.scene, x, y, type, this.spritePhysics.icecubeS);
                ingredient.setWeightDistribution(0, 0, 0.0001); // center
                ingredient.setPrice(0.2);
                break;
            case "icecubeL": 
                ingredient = new Ingredient(this.scene, x, y, type, this.spritePhysics.icecubeL);
                ingredient.setWeightDistribution(0, 0, 0.0001); // center
                ingredient.setPrice(0.3);
                break;
            case "burger": 
                ingredient = new Ingredient(this.scene, x, y, type, this.spritePhysics.burger);
                ingredient.setWeightDistribution(0, -0.6, 0.0002); // very top heavy
                ingredient.setPrice(3.5);
                break;
            case "celery": 
                ingredient = new Ingredient(this.scene, x, y, type, this.spritePhysics.celery);
                ingredient.setWeightDistribution(0, -0.2, 0.0001); // bottom heavy
                ingredient.setPrice(2);
                break;
            case "orange": 
                ingredient = new Ingredient(this.scene, x, y, type, this.spritePhysics.orange);
                ingredient.setWeightDistribution(0, -0.2, 0.0004); // bottom heavy
                ingredient.setPrice(1);
                break;
            case "banana": 
                ingredient = new Ingredient(this.scene, x, y, type, this.spritePhysics.banana);
                ingredient.setWeightDistribution(0, 0.1, 0.0003); // bit top
                ingredient.setPrice(5);
                break;
            case "umbrella": 
                ingredient = new Ingredient(this.scene, x, y, type, this.spritePhysics.umbrella);
                ingredient.setWeightDistribution(0, 0.8, 0.0003); // bottom monster
                ingredient.setPrice(0.5);
                break;
            case "ziggi": 
                ingredient = new Ingredient(this.scene, x, y, type, this.spritePhysics.ziggi);
                ingredient.setWeightDistribution(0, 0, 0.0003); // bottom monster
                ingredient.setPrice(-2);
                break;
                case "oliveSingle": 
                ingredient = new Ingredient(this.scene, x, y, type, this.spritePhysics.oliveSingle);
                ingredient.setWeightDistribution(0, 0, 0.0003); // bottom monster
                ingredient.setPrice(0.5);
                break;
                case "pickle": 
                ingredient = new Ingredient(this.scene, x, y, type, this.spritePhysics.pickle);
                ingredient.setWeightDistribution(0, -0.2, 0.0004); // bottom heavy
                ingredient.setPrice(1);
                break;
                case "fly": 
                ingredient = new Ingredient(this.scene, x, y, type, this.spritePhysics.fly);
                ingredient.setWeightDistribution(0, 0, 0.0003); // bottom monster
                ingredient.setPrice(-3);
                break;
            default: return null
        } 
        return ingredient;     
    }
    
    createGlass(x, y, config) {
        return new Glass(this.scene, x, y, 'glass', this.spritePhysics.glass);
    }

    createRandomGuest() {
        return new Guest(this.scene, 1300, 400, Phaser.Math.RND.pick(this.guests));
    }

    createGuest(who, x, y) {
        if(!this.guests.includes(who)) return;
        return new Guest(this.scene, x, y, who);
    }
}