var config = {
    type: Phaser.AUTO,
    width: gameWidth,
    height: gameHeight,
    scene: [ GreetingScene, GameScene ],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: debug
        }
    }
};

var game = new Phaser.Game(config);
