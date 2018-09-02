GreetingScene = {
  create: function() {
    var content = [
        "Wrecking Bowling",
        "",
        "This is GMTK Game Jam 2018 submission.",
        "Bullet hell without shooting.",
        "(also, without jumping and moving)",
        "",
        "Point and click to launch grappling hook.",
        "Hit skittles and avoid bullets.",
        "",
        "Have fun and thanks for playing!",
        "",
        "https://keepcalmgaming.github.io"
    ];

    var text = this.add.text(0, 0, content, { align: 'center' });
    var bounds = text.getBounds();

    text.x = halfWidth - bounds.width/2;
    text.y = halfHeight - bounds.height/2;

    this.input.on('pointerdown', function() {
      this.scene.switch('game');
    }, this);
  }
}
