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

let pg,
    font, 
    values 

let rectSize;
const f = 5
let cols, rows;
let off = 0.0;
const speed = 0.9;
let cellW, cellH

const string = "CLAUDIA\nBASEL"
const animTime = 25
let t = animTime
let maxRot;
let blurQty = 0

let mouseIsClicked = true
let preventFirst = false


function preload() {
  font = loadFont('assets/SuisseIntlCond-Bold.otf');
}

function setup() {
  reset()
  pg = createGraphics(floor(width/f), floor(height/f));
  
  values = getValues()
}

function draw() {
  background(0);
  //image(pg, 0,0);

  //console.log(mouseIsClicked)
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

  for(let j=0; j<rows+5; j++){
    for(let i=0; i<cols+7; i++){
      let x = i * rectSize.w;
      let y = j * rectSize.h;
      let my = floor(map(i, 0, rows, 0, pg.height))
      let mx = floor(map(j, 0, cols, 0, pg.width))
      let index = mx + pg.height * my;
      if (index <= 0 || index >= pg.width*pg.height) {
        index = 0;
      }

      let m = map(t, 0, animTime, -0, HALF_PI)
      //let m = map(mouseX, 0, width, HALF_PI, 0)
      let n = lerp(0, maxRot, sin(m))
      let r = map(values[index].b, 0, 255, 0, -maxRot + n)
      let c = map(r, 0, TWO_PI, 0, 255)

      stroke(255);
      push()
      translate(x, y);
      translate(rectSize.w/2, rectSize.h/2);
      rotate(r);
      line(-rectSize.w/2, -rectSize.h/2 + rectSize.h/2, -rectSize.w/2 + rectSize.w, -rectSize.h/2 + rectSize.h/2)
      pop()
    }
  } 

  off += speed
  
}

function getValues(){
  pg.textFont(font);
  let tSize = pg.width*0.25
  pg.textSize(tSize);
  pg.textLeading(tSize*0.9)
  pg.textAlign(LEFT, CENTER);

  let bbox = font.textBounds(string, 0,0, tSize)
  //value = sin(map(t, 0, animTime, 0, HALF_PI))*255
  pg.background(0)
  pg.fill(255)
  pg.push()
  pg.translate(pg.width/2-bbox.w/3.4, pg.height/2-bbox.h/7)
  pg.text(string, 0, 0)
  pg.pop()
  pg.filter(BLUR, blurQty);
  _values = []
  for(let i = 0; i<pg.width; i++){
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

        blurQty = 2
        cols = 85;
        rows = 55;
        rectSize = {
          w: floor(cnvWidth/cols),
          h: floor(cnvHeight/rows)
        }
        maxRot = HALF_PI;
        //console.log(rectSize)
      } else {
        cnvWidth = windowWidth-10
        cnvHeight = (cnvWidth/15)*9
        isOnMobile = true
        
        blurQty = 2
        cols = 55;
        rows = 33;
        rectSize = {
          w: floor(cnvWidth/cols),
          h: floor(cnvHeight/rows)
        }
        maxRot = HALF_PI;
    }

    let cnv = createCanvas(cnvWidth, cnvHeight)
    cnv.parent("sketch")
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
