import { Scene } from 'phaser';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        
        this.cameras.main.setBackgroundColor(0x333333);
        //this.add.image(1280/2, 720/2, 'loading')

        this.loadingDrink = this.add.sprite(640, 360, 'drinkSheet', 0);

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(1280/2, 500, 640, 32).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(640 - 315, 500, 4, 28, 0xffffff);
        let animFrame = 0
        

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress) => {

            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + (630 * progress);
            animFrame = (animFrame < 7) ? animFrame + 1 : 0;
            this.loadingDrink.setFrame(animFrame)

        });
    }

    preload ()
    {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath('assets');

        this.load.image('logo', 'logo.png');

        // Glasses
        this.load.image("glass", "Glass2.png");

        this.load.image("liquid","Liquid2.png");
        this.load.image("liquidbg","Liquid3.png");

        // Ingredients
        this.load.image("olive", "OliveSmall.png");
        this.load.image('oliveSingle','OliveSingle.png');
        this.load.image('icecube', 'IcecubeS.png');
        this.load.image('icecubeL', 'IcecubeL.png');
        this.load.image('umbrella', 'Umbrella1.png');
        this.load.image('orange', "Orange.png");
        this.load.image('banana', "Banana.png");
        this.load.image('burger', "Burger.png");
        this.load.image('celery', "Celery.png");
        this.load.image('ziggi','Ziggi.png');
        this.load.image('pickle','Pickle.png');

        // Various
        this.load.json("spritesPhysics", "physics.json");
        this.load.image('barBack', 'Bar2.png');
        this.load.image('barMid', 'Bar.png');
        this.load.image('olivetitle', 'Olive.png');
        this.load.image('titleText', 'Title.png');
        this.load.image('dripmat','DripMat.png');
        this.load.image('angryBoss','Boss.png');
        this.load.image('gameoverText','GameOver.png');

        // Guests
        this.load.image('Lawrence', 'Lawrence.png');
        this.load.image('Ingrid', 'Ingrid.png');
        this.load.image('Murphy', 'Murphy.png');

    }

    create ()
    {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.start('MainMenu');
    }
}
