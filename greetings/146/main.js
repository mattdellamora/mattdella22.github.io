/**
 * Mattia Dellamora
 * Reference: https://p5js.org/reference/
 *
 *
 * 
 *
 */
let isOnMobile = false
const parentSketch = document.getElementById('sketch');
const parentContent = document.getElementById('content')

/*
var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
if (isIOS) {
  console.log('This is a IOS device');
} else {
  console.log('This is Not a IOS device');
}
*/

let pg,
    font, 
    values 
const f = 5
let cols = 70;
let rows = 50;
let cellW, cellH

const string = "146"
const animTime = 35
let t = animTime
let maxHeight = 32
let blurQty = 6

let mouseIsClicked = true
let preventFirst = false


function preload() {
  font = loadFont('assets/SuisseIntlMono-Bold.otf');
}

function setup() {
  reset()
  pg = createGraphics(floor(width/f), floor(width/f));

  cellW = width/cols
  cellH = height/rows
  
  values = getValues()
}

function draw() {
  background(0);
  console.log(mouseIsClicked)
  if(mouseIsClicked&&!preventFirst){
    if(t<=animTime){
      t+=1
    }
  } else {
    if(t>=0){
      t-=1
    }
  }
  
  stroke(255)
  for(let j = 0; j<height; j+=cellH){
    noFill()
    beginShape()
    for(let i = -cellW; i<width+2*cellW; i+= cellW){
      let mx = floor(map(i, 0, width, 0, pg.width))
      let my = floor(map(j, 0, height, 0, pg.height))
      let index = my + pg.height * mx;
      
      if (index <= 0 || index >= pg.width*pg.height) {
        index = 0;
      }

      let m = map(t, 0, animTime, -0, HALF_PI)
      let n = lerp(0, maxHeight, sin(m))
      let v = map(values[index].b, 0, 255, 0, -maxHeight + n)
      
      curveVertex(i, j+cellH/2 + v)
    }
    endShape()
  }
  
}

  
function mousePressed(){
    if(!isOnMobile){
        preventFirst = false;
        mouseIsClicked = !mouseIsClicked
        if(mouseIsClicked){
            t = 0
        } else {
            t = animTime
        }
    }
}

function touchStarted() {
    if(isOnMobile){
        preventFirst = false;
        mouseIsClicked = !mouseIsClicked
        if(mouseIsClicked){
            t = 0
        } else {
            t = animTime
        }
    }
}



function getValues(){
  pg.textFont(font);
  let tSize = pg.width*0.45
  pg.textSize(tSize);
  pg.textAlign(CENTER, CENTER);

  let bbox = font.textBounds(string, 0,0, tSize)
  //value = sin(map(t, 0, animTime, 0, HALF_PI))*255
  pg.background(0)
  pg.fill(255)
  pg.push()
  pg.translate(pg.width*0.09+bbox.w/2, pg.height/2-bbox.h/4)
  pg.text(string, 0, 0)
  pg.pop()
  pg.filter(BLUR, blurQty);
  _values = []
  for(let i = 0; i<pg.height; i++){
    for(let j = 0; j<pg.height; j++){
      _values.push(
        {
          x: floor(i/pg.width), //adattare alla scala
          y: floor(j/pg.height),
          b: pg.get(i, j)[0]
        }
      )
    }
  }
  return _values
}


function reset() {
    let cnvWidth, cnvHeight
    if(windowWidth > 480){
        cnvWidth = windowWidth/2;
        cnvHeight = (cnvWidth/15)*9
        const parentTop = windowHeight/2.1 - cnvHeight/2
        const parentLeft = windowWidth/2 - cnvWidth/2
        parentContent.style.top = parentTop + "px";
        parentContent.style.left = parentLeft + "px";
        isOnMobile = false

        blurQty = 6
        maxHeight = 32
        cols = 70;
        rows = 50;
    } else {
        cnvWidth = windowWidth-10
        cnvHeight = (cnvWidth/15)*9
        isOnMobile = true
        
        blurQty = 4.2
        maxHeight = 16
        cols = 50;
        rows = 45;
    }

    let cnv = createCanvas(cnvWidth, cnvHeight)
    cnv.parent("sketch")
}
