import Ingredient from '../entities/Ingredient.js';
import Glass from '../entities/Glass.js';

export default class EntityFactory {
    constructor(scene) {
        this.scene = scene;
    }
    
    createIngredient(type, x, y, config) {
        let entity = null;
        switch(type) {
            case "olive": return new Ingredient(this.scene, x, y, 'olive', config);
            default: return new Ingredient(this.scene, x, y, 'olive', config);
        }      
    }
    
    createGlass(x, y, config) {
        return new Glass(this.scene, x, y, 'glass', config);
    }
}