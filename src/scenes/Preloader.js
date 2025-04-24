import { Scene } from 'phaser';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        this.add.image(1280/2, 720/2, 'olivetitle')
        this.cameras.main.setBackgroundColor(0x333333);

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(1280/2, 500, 640, 32).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(640 - 315, 500, 4, 28, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress) => {

            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + (630 * progress);

        });
    }

    preload ()
    {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath('assets');

        this.load.image('logo', 'logo.png');

        // Glasses
        this.load.image("glass", "Glass2.png");

        // Ingredients
        this.load.image("olive", "OliveSmall.png");
        this.load.image('icecube', 'IcecubeS.png');
        this.load.image('icecubL', 'IcecubeL.png');
        this.load.image('umbrella', 'Umbrella1.png');
        this.load.image('orange', "Orange.png");
        this.load.image('banana', "Banana.png");

        // Various
        this.load.json("spritesPhysics", "physics.json");
        this.load.image('barBack', 'Bar2.png');
        this.load.image('barMid', 'Bar.png');
        this.load.image('olivetitle', 'Olive.png');

        // Guests
        this.load.image('Lawrence', 'Lawrence.png');

    }

    create ()
    {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.start('MainMenu');
    }
}
