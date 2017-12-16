var ball = $("#ball");
var land = $("#land");
var accelerationOfGravity = 700;
var fiction = 200;
var doubleJump = 0;
var speed = 150000;
var score = 0;
var enemies = {};
var enemiesLength = 0;
var start = 0;
var stop = 0;
var last;
var requestID;

ball = new createPhysicalObj(ball);
land = new createPhysicalObj(land);
enemies['0'] = new createEnemy();

function createPhysicalObj(jqueryEl) {
    this.x = jqueryEl.position().left;
    this.y = jqueryEl.position().top;
    this.vX = 0;
    this.vY = 0;
    this.width = parseInt(jqueryEl.css("width"));
    this.height = parseInt(jqueryEl.css("height"));
    this.id = jqueryEl.attr('id');
    this.jqueryAccess = jqueryEl;
}

function checkCollistionLand(obj1, obj2) {
    if(Math.floor(obj1.y+obj1.height) > Math.floor(obj2.y)) {
        if(Math.abs(obj1.vY) < fiction) {
            if(obj1.vY !== 0){
                obj1.vY = 0;
            }
            obj1.y = obj2.y-obj1.height;
            doubleJump = 0;
            obj1.jqueryAccess.css("top", obj1.y);
            return false;
        }
        if(obj1.vY < 0) return true;
        if(obj1.vY > fiction) obj1.vY = -obj1.vY + fiction;
        doubleJump = 1;
    }
    return true;
}

function checkCollistionEnemy(obj1, obj2) {
    if(obj1.x + obj1.width > obj2.x && obj1.x < obj2.x + obj2.width && obj1.y + obj1.height > obj2.y) {
        stop = 1;
        $('.gameover').text('Game Over');
        cancelAnimationFrame(requestID);
    } else if(obj2.x < -obj2.width) {
        score += 1;
        $('.score').text('Score: ' + score);
        speed += 10000;
        delete enemies[score-1];
        enemiesLength += 1;
        enemies[enemiesLength] = new createEnemy();
        console.log(enemies);
    } else if(enemies[score].x < 500 && Object.keys(enemies).length === 1) {
        console.log(enemies);
        enemiesLength += 1;
        enemies[enemiesLength] = new createEnemy();
        console.log(enemies);
    }
}

function gravity(obj, dt) {
    if(checkCollistionLand(obj, land) && obj.vY !== 0){
        var y = obj.y;
        var vY = obj.vY;
        vY += accelerationOfGravity*dt;
        y += vY*dt;
        obj.vY = vY;
        obj.y = y;
        obj.jqueryAccess.css("top", obj.y);
    }
    for(enemy in enemies) {
        enemies[enemy].render(dt/1000);
        checkCollistionEnemy(obj, enemies[enemy]);
    }
}

function createEnemy() {
    this.jqueryAccess = $('<div>', {class: 'enemy', id: score});
    this.width = 50 + Math.random()*50;
    this.height = 50 + Math.random()*100;
    this.y = parseInt(land.jqueryAccess.css('top')) - this.height;
    this.x = parseInt(land.jqueryAccess.css('width')) - this.width;
    this.render = function(dt) {
        this.x -= speed*dt;
        this.jqueryAccess.css({'left': this.x});
    };

    this.jqueryAccess.css({
        'width': this.width + 'px',
        'height': this.height + 'px',
        'top': this.y + 'px',
        'left': this.x + 'px'
    });

    this.jqueryAccess.appendTo('body');
}

function render() {
    var now = performance.now();
    dt = now - last;
    last = now;
    gravity(ball, dt/1000);
    if(stop === 1) return;
    requestID = requestAnimationFrame(render);
}

$(document).keydown(function(e){
    if(e.which === 32){
        e.preventDefault();
        if(doubleJump === 0)ball.vY += -500;
        if(doubleJump === 1)ball.vY += -200;
        doubleJump += 1;
        return;
    }
    if(e.which === 13 && start === 0){
        e.preventDefault();
        start = 1;
        ball.vY += 1;
        last = performance.now();
        requestID = requestAnimationFrame(render);
    }
});


$(document).bind('touchstart', function (e) {
   if(start === 0){
       e.preventDefault();
       start = 1;
       ball.vY += 1;
       last = performance.now();
       requestID = requestAnimationFrame(render);
   } else {
       e.preventDefault();
       if(doubleJump === 0)ball.vY += -500;
       if(doubleJump === 1)ball.vY += -200;
       doubleJump += 1;
       return;
   }
});