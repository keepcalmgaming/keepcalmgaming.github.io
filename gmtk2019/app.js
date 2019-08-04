define("scenes/greeting", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const gameHeight = window.innerHeight;
    const gameWidth = window.innerWidth;
    const halfHeight = gameHeight / 2;
    const halfWidth = gameWidth / 2;
    class GreetingScene extends Phaser.Scene {
        create() {
            var content = [
                "A Hero, A Sword and A Pit",
                "",
                "This is GMTK Game Jam 2019 submission.",
                "Only one.",
                "",
                "Have fun and thanks for playing!",
                "",
                "https://keepcalmgaming.github.io"
            ];
            var text = this.add.text(0, 0, content, { align: 'center' });
            var bounds = text.getBounds();
            text.x = halfWidth - bounds.width / 2;
            text.y = halfHeight - bounds.height / 2;
            this.input.on('pointerdown', () => {
                this.scene.switch('main');
            });
        }
    }
    exports.GreetingScene = GreetingScene;
});
define("game/game", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const labs = [
        [
            [2, 0, 0, 0, 0],
            [1, 1, 1, 3, 0],
            [0, 0, 0, 1, 0],
            [0, 3, 0, 1, 0],
            [0, 1, 0, 3, 0],
            [0, 1, 0, 0, 0],
            [0, 3, 1, 1, 1],
            [0, 0, 0, 0, 4]
        ],
        [
            [2, 1, 0, 0, 0],
            [0, 1, 1, 1, 1],
            [0, 0, 0, 0, 0],
            [1, 3, 1, 1, 0],
            [1, 1, 0, 0, 0],
            [0, 0, 0, 3, 1],
            [0, 3, 1, 1, 0],
            [0, 0, 0, 0, 4]
        ],
        [
            [2, 0, 0, 1, 1],
            [1, 1, 0, 0, 0],
            [0, 0, 1, 3, 0],
            [1, 3, 1, 0, 0],
            [1, 0, 0, 0, 1],
            [0, 0, 3, 1, 1],
            [0, 1, 0, 0, 0],
            [0, 0, 0, 1, 4]
        ]
    ];
    class Game {
        constructor(x, y, isVertical) {
            this.LIVES = 4;
            this.score = 0;
            this.spawns = [];
            this.towerSpawns = [];
            this.walls = [];
            this.isVertical = isVertical;
            this.lives = this.LIVES;
            this.X = x;
            this.Y = y;
            this.map = this.generateMap();
            this.createEntities();
            this.createMonsterPass({ x: 0, y: 0 });
            this.mainframe = {
                x: Math.floor(this.X / 2) - 1,
                y: Math.floor(this.Y / 2) - 1
            };
        }
        randomLabs() {
            return labs[0];
        }
        generateMap() {
            let clone = Object.create(labs);
            let upLeft = this.generateQuorter(clone[this.getRandNum(labs.length - 1)], false, false);
            let upRight = this.generateQuorter(clone[this.getRandNum(labs.length - 1)], true, false);
            let downLeft = this.generateQuorter(clone[this.getRandNum(labs.length - 1)], false, true);
            let downRight = this.generateQuorter(clone[this.getRandNum(labs.length - 1)], true, true);
            let result = [];
            for (var i = 0; i < 8; i++) {
                result[i] = upLeft[i].concat(upRight[i].flat());
            }
            for (var i = 8; i < 16; i++) {
                result[i] = downLeft[i - 8].concat(downRight[i - 8].flat());
            }
            if (!this.isVertical) {
                result = this.rotateMap(result);
            }
            return result;
        }
        generateQuorter(upLeft, flipX, flipY) {
            let quorter = [];
            if (!flipX && !flipY) {
                quorter = Object.create(upLeft);
            }
            if (flipX && !flipY) {
                for (var i = 0; i < 8; i++) {
                    let t = Object.create(upLeft[i]);
                    quorter[i] = t.reverse().flat();
                }
            }
            if (!flipX && flipY) {
                quorter = Object.create(upLeft).reverse();
            }
            if (flipX && flipY) {
                let downLeft = Object.create(upLeft).reverse();
                for (var i = 0; i < 8; i++) {
                    let t = Object.create(downLeft[i]);
                    quorter[i] = t.reverse();
                }
            }
            return quorter;
        }
        rotateMap(map) {
            let rotatedMap = [];
            for (let y = 0; y < this.Y; y++) {
                let row = [];
                for (let x = 0; x < this.X; x++) {
                    row.push(map[x][y]);
                }
                rotatedMap.push(row);
            }
            return rotatedMap;
        }
        active() {
            return this.lives > 0;
        }
        createEntities() {
            for (let i = 0; i < this.map.length; i++) {
                let row = this.map[i];
                for (let j = 0; j < row.length; j++) {
                    switch (row[j]) {
                        case 1: // wall
                            this.walls.push({ x: j, y: i });
                            break;
                        case 2: // monster spawn
                            this.spawns.push({ x: j, y: i });
                            break;
                        case 3: // tower spawn
                            this.towerSpawns.push({ x: j, y: i });
                            break;
                    }
                }
            }
        }
        randomCoords() {
            let spawnX = this.getRandNum(this.X);
            let spawnY = this.getRandNum(this.Y);
            return { x: spawnX, y: spawnY };
        }
        getRandNum(n) {
            return Math.floor(Math.random() * Math.floor(n));
        }
        createMonsterPass(spawn) {
            console.log("start");
            let startX, startY, endX, endY;
            if (spawn.x < this.map[0].length / 2) {
                if (spawn.y < this.map.length / 2) {
                    startX = 0;
                    startY = 0;
                    endX = this.map[0].length / 2;
                    endY = this.map.length / 2;
                }
                else {
                    startX = 0;
                    startY = this.map.length / 2;
                    endX = this.map[0].length / 2;
                    endY = this.map.length;
                }
            }
            else {
                if (spawn.y < this.map.length / 2) {
                    startX = this.map[0].length / 2;
                    startY = 0;
                    endX = this.map[0].length;
                    endY = this.map.length / 2;
                }
                else {
                    startX = this.map[0].length / 2;
                    startY = this.map.length / 2;
                    endX = this.map[0].length;
                    endY = this.map.length;
                }
            }
            console.log(startX, endX, startY, endY);
            let currX, currY;
            let prevX, prevY;
            let path = [];
            currX = spawn.x;
            currY = spawn.y;
            prevX = currX;
            prevY = currY;
            path.push({ x: currX, y: currY });
            while (true) {
                if (this.map[currY][currX] == 4)
                    break;
                if (currX - 1 >= startX && currX - 1 != prevX && (this.map[currY][currX - 1] == 0 || this.map[currY][currX - 1] == 4)) {
                    prevX = currX;
                    prevY = currY;
                    currX = currX - 1;
                    path.push({ x: currX, y: currY });
                }
                else if (currX + 1 < endX && currX + 1 != prevX && (this.map[currY][currX + 1] == 0 || this.map[currY][currX + 1] == 4)) {
                    prevX = currX;
                    prevY = currY;
                    currX = currX + 1;
                    path.push({ x: currX, y: currY });
                }
                else if (currY - 1 >= startY && currY - 1 != prevY && (this.map[currY - 1][currX] == 0 || this.map[currY - 1][currX] == 4)) {
                    prevX = currX;
                    prevY = currY;
                    currY = currY - 1;
                    path.push({ x: currX, y: currY });
                }
                else if (currY + 1 < endY && currY + 1 != prevY && (this.map[currY + 1][currX] == 0 || this.map[currY + 1][currX] == 4)) {
                    prevX = currX;
                    prevY = currY;
                    currY = currY + 1;
                    path.push({ x: currX, y: currY });
                }
                else {
                    if (this.map[currY][currX] != 4) {
                        throw 420;
                    }
                    else {
                        break;
                    }
                }
            }
            return path;
        }
    }
    exports.Game = Game;
});
define("scenes/main", ["require", "exports", "game/game"], function (require, exports, game_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const gameHeight = window.innerHeight;
    const gameWidth = window.innerWidth;
    const halfWidth = gameWidth / 2;
    const halfHeight = gameHeight / 2;
    const debug = true;
    const minSide = 10;
    const maxSide = 16;
    class MainScene extends Phaser.Scene {
        constructor(sceneConfig) {
            // super({key: 'main'})
            super(sceneConfig);
            this.offsetX = 0;
            this.offsetY = 0;
            this.towerSpawns = [];
            this.monsterSpawns = [];
            this.isVertical = gameHeight > gameWidth;
            if (this.isVertical) {
                this.x = minSide;
                this.y = maxSide;
            }
            else {
                this.x = maxSide;
                this.y = minSide;
            }
            let rw = gameWidth / this.x, rh = gameHeight / this.y;
            this.rectSize = rh < rw ? rh : rw;
            this.offsetX = (gameWidth - this.rectSize * this.x) / 2;
            this.offsetY = (gameHeight - this.rectSize * this.y) / 2;
            this.towergame = new game_1.Game(this.x, this.y, this.isVertical);
            console.log('Game Created', this.x, this.y, this.towergame);
        }
        create() {
            this.cameras.main.setBackgroundColor('#E8745A');
            let field = this.add.graphics({ lineStyle: { width: 2, color: 0xffffff }, fillStyle: { color: 0x000000 } });
            this.setupMainframe();
            this.setupWalls();
            this.setupTowerSpawns();
            this.setupTower();
            this.setupMonsterSpawns();
            this.setupText();
            this.setupEvents();
            // let music = this.sound.add('music')
            // music.play()
            if (debug) {
                this.debugDrawGrid();
            }
        }
        update() {
            this.input.on('pointerup', () => {
                if (!this.towergame.active()) {
                    this.towergame = new game_1.Game(this.x, this.y, this.isVertical);
                    this.scene.restart();
                }
            });
        }
        setupMainframe() {
            this.mfGroup = this.physics.add.staticGroup();
            this.mainframe = this.mfGroup.create(0, 0, 'mainframe');
            this.scaleSprite(this.mainframe, this.rectSize * 2);
            this.mainframe.setOrigin(0);
            let position = this.getC(this.towergame.mainframe);
            this.mainframe.x = position.x;
            this.mainframe.y = position.y;
            this.mainframe['refreshBody'].call(this.mainframe);
        }
        setupWalls() {
            for (let i = 0; i < this.towergame.walls.length; i++) {
                let wall = this.towergame.walls[i];
                let sprite = this.physics.add.sprite(0, 0, 'wallbrick');
                this.scaleSprite(sprite, this.rectSize);
                sprite.setOrigin(0);
                let position = this.getC(wall);
                sprite.x = position.x;
                sprite.y = position.y;
            }
        }
        setupTower() {
            this.tower = this.physics.add.sprite(0, 0, 'tower');
            this.scaleSprite(this.tower, this.rectSize);
            this.tower.setOrigin(0);
            let coord = this.towergame.towerSpawns ? this.towergame.towerSpawns[0] : { x: 0, y: 0 };
            let position = this.getC(coord);
            this.tower.x = position.x;
            this.tower.y = position.y;
        }
        setupTowerSpawns() {
            this.towerSpawns = [];
            for (let i = 0; i < this.towergame.towerSpawns.length; i++) {
                let towerSpawn = this.towergame.towerSpawns[i];
                let sprite = this.physics.add.sprite(0, 0, 'towerplace').setInteractive();
                this.scaleSprite(sprite, this.rectSize);
                sprite.setOrigin(0);
                let position = this.getC(towerSpawn);
                sprite.x = position.x;
                sprite.y = position.y;
                sprite.on('pointerdown', (pointer) => {
                    if (!this.tower)
                        return;
                    this.tower.x = sprite.x;
                    this.tower.y = sprite.y;
                });
                this.towerSpawns.push(sprite);
            }
        }
        setupMonsterSpawns() {
            this.monsterSpawns = [];
            for (let i = 0; i < this.towergame.spawns.length; i++) {
                let spawn = this.towergame.spawns[i];
                let sprite = this.physics.add.sprite(0, 0, 'monsterplace');
                this.scaleSprite(sprite, this.rectSize);
                sprite.setOrigin(0);
                let position = this.getC(spawn);
                sprite.x = position.x;
                sprite.y = position.y;
                sprite['spawn'] = spawn;
                this.monsterSpawns.push(sprite);
            }
        }
        setupEvents() {
            if (!this.mainframe || !this.mfGroup)
                return;
            this.monsters = this.physics.add.group();
            this.physics.add.collider(this.monsters, this.mfGroup, this.mainframeHit);
            this.bullets = this.physics.add.group();
            this.physics.add.collider(this.monsters, this.bullets, this.bulletHit);
            // MONSTER SPAWNS
            for (let monsterSpawn of this.monsterSpawns) {
                this.time.addEvent({
                    delay: 3000,
                    loop: true,
                    callback: this.createMonster,
                    callbackScope: this,
                    args: [monsterSpawn]
                });
            }
            this.time.addEvent({
                delay: 1000,
                loop: true,
                callback: this.towerShoot,
                callbackScope: this
            });
        }
        towerShoot() {
            if (!this.tower || !this.monsters || !this.bullets)
                return;
            let minDistance = 999999;
            let closestMonster = null;
            for (let monster of this.monsters.getChildren()) {
                let distance = Phaser.Math.Distance.Between(this.tower.x, this.tower.y, monster.x, monster.y);
                if (distance < minDistance) {
                    minDistance = distance;
                    closestMonster = monster;
                }
            }
            if (closestMonster && minDistance < this.rectSize * 3) {
                let bullet = this.bullets.create(this.tower.x + this.rectSize / 2, this.tower.y + this.rectSize / 2, 'bullet');
                let scale = this.getScale(bullet, this.rectSize);
                bullet.setScale(scale);
                bullet.setOrigin(0.5);
                bullet.setCircle(20 * scale, bullet.width / 2, bullet.height / 2);
                this.physics.moveTo(bullet, closestMonster.x + this.rectSize / 2, closestMonster.y + this.rectSize / 2, this.rectSize * 4);
            }
        }
        bulletHit(o1, o2) {
            let scene = o1['scene'];
            o1.destroy();
            o2.destroy();
            if (scene.towergame.active()) {
                scene.towergame.score++;
                if (!scene.textScore)
                    return;
                scene.textScore.setText(`SCORE: ${scene.towergame.score}`);
            }
        }
        mainframeHit(monster, mainframe) {
            monster.destroy();
            let scene = mainframe['scene'];
            scene.towergame.lives--;
            if (!scene.textLives)
                return;
            if (scene.towergame.lives > 0) {
                scene.textLives.setText(`LIVES: ${scene.towergame.lives}`);
            }
            else {
                scene.textLives.setText('YOU DIED');
            }
        }
        createMonster(spawn) {
            if (!this.monsters)
                return;
            if (!this.towergame)
                return;
            if (!this.towergame.active())
                return;
            let mfc = this.getMFC();
            let spawnpoint = spawn['spawn'];
            let path = this.buildPath(this.towergame.createMonsterPass(spawnpoint));
            let monster = this.add.follower(path, spawn.x, spawn.y, 'monster');
            this.monsters.add(monster);
            this.scaleSprite(monster, this.rectSize);
            monster.setOrigin(0);
            monster.x = spawn.x;
            monster.y = spawn.y;
            monster.startFollow({
                duration: 15000,
                from: 0,
                to: 1
            });
        }
        buildPath(cells) {
            console.log('building path for', cells);
            let start = this.getC(cells[0]);
            let path = this.add.path(start.x, start.y);
            for (let i = 1; i < cells.length; i++) {
                let pos1 = this.getC(cells[i - 1]);
                let pos2 = this.getC(cells[i]);
                let p1 = new Phaser.Math.Vector2(pos1.x, pos1.y);
                let p2 = new Phaser.Math.Vector2(pos2.x, pos2.y);
                path.add(new Phaser.Curves.Line(p1, p2));
            }
            return path;
        }
        setupText() {
            this.textLives = this.add.text(20, 20, `LIVES: ${this.towergame.lives}`, { fontFamily: 'Verdana', fontSize: 20, color: '#4C191B', align: 'center' });
            this.textScore = this.add.text(gameWidth - 120, 20, `SCORE: ${this.towergame.score}`, { fontFamily: 'Verdana', fontSize: 20, color: '#4C191B', align: 'center' });
        }
        getScale(sprite, dim) {
            return dim / sprite.width;
        }
        scaleSprite(sprite, dim) {
            sprite.setScale(this.getScale(sprite, dim));
        }
        getMFC() {
            let mf = this.towergame.mainframe;
            return this.getC({ x: mf.x + 1, y: mf.y + 1 });
        }
        getC(c) {
            return {
                x: this.getCX(c.x),
                y: this.getCY(c.y)
            };
        }
        getCX(x) { return this.offsetX + x * this.rectSize; }
        getCY(y) { return this.offsetY + y * this.rectSize; }
        preload() {
            this.load.image('bullet', 'images/bullet2.png');
            this.load.image('mainframe', 'images/mainframe.png');
            this.load.image('monster', 'images/monster.png');
            this.load.image('monsterplace', 'images/monsterplace.png');
            this.load.image('tower', 'images/tower.png');
            this.load.image('towerplace', 'images/towerplace.png');
            this.load.image('wallbrick', 'images/wallbrick.png');
            // this.load.audio('music', 'sounds/GameOST.mp3')
        }
        debugDrawGrid() {
            let field = this.add.graphics({ lineStyle: { width: 2, color: 0x000000 }, fillStyle: { color: 0x000000 } });
            for (let i = 0; i < this.x; i++) {
                for (let j = 0; j < this.y; j++) {
                    field.strokeRect(this.getCX(i), this.getCY(j), this.rectSize, this.rectSize);
                }
            }
        }
    }
    exports.MainScene = MainScene;
});
define("app", ["require", "exports", "scenes/main"], function (require, exports, main_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const gameHeight = window.innerHeight;
    const gameWidth = window.innerWidth;
    let config = {
        type: Phaser.AUTO,
        width: gameWidth,
        height: gameHeight,
        physics: {
            default: 'arcade',
            arcade: {
                debug: false
            }
        },
        scene: [main_1.MainScene]
    };
    class App {
        constructor() {
            this.isDebug = true;
        }
        start() {
            this.log('Generating game...');
            let g = new Phaser.Game(config);
            this.log('Ready to play');
        }
        log(...args) {
            if (this.isDebug) {
                console.log(...args);
            }
        }
    }
    exports.App = App;
});
//# sourceMappingURL=app.js.map