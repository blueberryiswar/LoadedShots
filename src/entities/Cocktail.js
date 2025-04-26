export default class Cocktail {
    constructor(scene, x, y) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.price = 1 // base price
        this.ingredientList = [];

        this.createContainer();
    }

    createContainer() {
        this.container = this.scene.add.container(
            this.x, 
            this.y
        );
        this.scene.layers.game.add(this.container);
    }

    addIngredient(name, price) {
        let ingredient = this.ingredientList.filter((ingredient) => ingredient.name === name);
        if(ingredient) {
            ingredient.count += 1;
        } else {
            this.ingredientList.push({name: name, count: 1, price: price});
        }
    }

    mix(glass, ingredients) {
        // Add glass sprite (maintain its current display properties)
        this.container.add(
            this.scene.add.sprite(0, 0, glass.sprite.texture.key)
                .setFrame(glass.sprite.frame.name)
                .setScale(glass.sprite.scaleX, glass.sprite.scaleY)
                .setAngle(glass.sprite.angle)
                .setAlpha(glass.sprite.alpha)
        );

        // Add liquid graphics if they exist (as new sprites)
        if (glass.liquidbg) {
            this.container.add(
                this.scene.add.sprite(0, 0, glass.liquidbg.texture.key)
                    .setFrame(glass.liquidbg.frame.name)
                    .setScale(glass.liquidbg.scaleX, glass.liquidbg.scaleY)
                    .setAlpha(glass.liquidbg.alpha)
            );
        }

        // Add all contained ingredients as new sprites
        ingredients.forEach(ingredient => {
            this.container.add(
                this.scene.add.sprite(
                    ingredient.sprite.x - this.x,
                    ingredient.sprite.y - this.y,
                    ingredient.sprite.texture.key
                )
                .setFrame(ingredient.sprite.frame.name)
                .setScale(ingredient.sprite.scaleX, ingredient.sprite.scaleY)
                .setAngle(ingredient.sprite.angle)
                .setAlpha(ingredient.sprite.alpha)
            );
            this.price += ingredient.getPrice();
            this.addIngredient(ingredient.name, ingredient.getPrice());
        });

        if (glass.liquid) {
            this.container.add(
                this.scene.add.sprite(0, 0, glass.liquid.texture.key)
                    .setFrame(glass.liquid.frame.name)
                    .setScale(glass.liquid.scaleX, glass.liquid.scaleY)
                    .setAlpha(glass.liquid.alpha)
            );
        }
        this.price = Phaser.Math.FloorTo(this.price, -2)
    }
}