var targetGroup;
var gun;
var count= 0;
var play;
var database;
var edges;

var timerValue = 0;

var clickImg;

var PLAY= 1;
var END= 0;
var WELCOME= 0.5;
var gameState= PLAY;
function preload(){
  targetImg= loadImage("target.png");
  gunImg= loadImage("gun.png  ")
  clickImg=createImg("Click.gif");
}

function setup() {
  canvas = createCanvas(800,400);
targetGroup= new Group();
gun = createSprite(200,200,10, 10);
gun.addImage(gunImg);
gun.scale= 0.1;
database=firebase.database();


var readCount=database.ref('count');
readCount.on("value", getCount);



edges=createEdgeSprites();

play= createSprite(400,200);
}
function draw() {
  background("yellow");
  fill("blue");
  text("Score: "+ count, 10, 20);

  if (timerValue >= 10 && timerValue <= 60) {
    text("0:" + timerValue, 100,200);
  }
  if (timerValue < 10) {
    text('0:0' + timerValue, 100,200);
  }
  
  if(timerValue > 60 && timerValue < 70){
       text('1:0'+ (timerValue-60), 100,200);     

  }

  if(timerValue >=70 && timerValue < 120){
    text('1:'+ (timerValue-60), 100,200);     

}


if (gameState === PLAY){
  spawnTargets();

  for(var i=0; i<targetGroup.length; i++){
    if(mousePressedOver(targetGroup.get(i))){
  
      targetGroup.get(i).destroy();
      updateCount(1);
      
  }
  }

 if(frameCount % 25 === 0){
  timeIt();

 }


  for(var i=0; i<targetGroup.length; i++){
    if(edges.isTouching(targetGroup.get(i))){
  
      updateCount(-1);
      targetGroup.get(i).destroy();
  }
  }

  if(mousePressedOver(play)){
    clickImg.hide();
    play.destroy();
  }

  gun.x = mouseX;
  gun.y = mouseY;

  clickImg.position(350, 100);

  if(count<0){
    gameState= END;
  }
}

else if(gameState=== END){
targetGroup.setVelocityXEach(0);
updateHighscore(timerValue);
}
  drawSprites();

}

function updateHighscore(data){
    database.ref('/').update({
      'highScore': data
    })


}

function spawnTargets(){
if(frameCount % 30 === 0){
  var target = createSprite(400,320, 40,40);
  target.y = random(400,30);
  target.velocityX= random(-1, +3);
  target.velocityY= random(-1, +3);
  target.addImage(targetImg);
  targetGroup.add(target);
 target.lifetime = 140;
  target.scale= 0.1;
  console.log(target);

  target.depth= gun.depth ;
  gun.depth= gun.depth +1;
}


}

function getCount(data){
count=data.val();
}

function updateCount(num){
database.ref('/').update({
  'count':count+num

})


}

function timeIt() {
    timerValue++;
}
