/**
 * Mattia Dellamora
 * Reference: https://p5js.org/reference/
 *
 * Ispirato a:
 * - Rewind, Pauline Saglio (https://vimeo.com/channels/832315/74715354)
 *
 */
const parentSketch = document.getElementById('sketch');
const parentContent = document.getElementById('content')
const string = "DINAMO"
let lScale = 7
let cols = 6
let rows = 8


let canvas = initCanvas()
console.log(canvas)
// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies;
    Events = Matter.Events,
    Composite = Matter.Composite,
    Composites = Matter.Composites,
    Common = Matter.Common,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    Svg = Matter.Svg,
    World = Matter.World
    Vertices = Matter.Vertices

// create an engine
var engine = Engine.create();

// create a renderer
var render = Render.create({
    element: parentSketch,
    engine: engine,
    options: {
        width: canvas.w,
        height: canvas.h,
        wireframes: false,
        pixelRatio: 1,
        background: 'black'
    }
});

/*
-- BODIES ---------------
*/
const button = Bodies.rectangle(0, 0, canvas.w*2, canvas.h*2, { isStatic: true });
//World.add(engine.world, button);

//walls
let walls = [
                //top
                Bodies.rectangle(-3,-3, canvas.w*2+3, 3, {
                    isStatic: true,
                    render: { fillStyle: "rgba(200,0,0,1)" }
                }),
                //bottom
                Bodies.rectangle(0,canvas.h+3, canvas.w*2+3, 3, {
                    isStatic: true,
                    render: { fillStyle: "rgba(200,0,0,1)" }
                }),
                //left
                Bodies.rectangle(-3,-3, 3, canvas.h*2+3, {
                    isStatic: true,
                    render: { fillStyle: "rgba(200,0,0,1)" }
                }),
                //right
                Bodies.rectangle(canvas.w+3,-3, 3, canvas.h*2 + 3, {
                    isStatic: true,
                    render: { fillStyle: "rgba(200,0,0,1)" }
                })
            ]
World.add(engine.world, walls);

// elements
const bodyOptions = {
    frictionAir: 0,
    friction: 0.0001,
    restitution: 0.5,
    render: { 
        fillStyle: "white",
        /*
        sprite: {
            texture: 'assets/a.png',
                        xScale: .36,
                        yScale: .36
        }
        */
    }
};

let mouseIsClicked = false
const mouse = Matter.Mouse.create(render.canvas)
const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse,
      constraint: {
        render: {
          visible: false
        }
      }
    });
World.add(engine.world, mouseConstraint);



for(let c of string){
    Vertices.scale(data[c], lScale, lScale)
}

let letter = Matter.Body.create({
    position: { x: canvas.w/2, y: canvas.h/2 },
    vertices: data.M,
    render: { 
        fillStyle: "white",
    }
})
//World.add(engine.world, letter)

let count  = 0
Matter.World.add(
    engine.world,
    Matter.Composites.stack(canvas.w / 2 - (14*cols + 5*cols) , 0, cols, rows, 5, 5, (x, y) => {
        count+= 1  
        return Matter.Body.create({
            position: {x: x, y: y},
            vertices: data[string[(count-1)%6]],
            frictionAir: 0,
            friction: 0.0001,
            restitution: 0.5,
            render: { 
                fillStyle: "white",
            }
        })  
        
    })
  );

let timeScaleTarget = 1,
    counter = 0;

Matter.Events.on(engine, 'afterUpdate', event => {
    engine.timing.timeScale +=
        (timeScaleTarget - engine.timing.timeScale) * 0.05;
    counter += 1;

    //console.log(engine.world)
    
    if (mouseIsClicked) {
        if (timeScaleTarget < 1) {
        timeScaleTarget = 1;
        } else {
        timeScaleTarget = 0.05;
        }

        explosion(engine);

        counter = 0;
        mouseIsClicked = false;
    }
    
    
});

Matter.Events.on(mouseConstraint, "mousedown", event => {
    mouseIsClicked = true;

})
// run the engine
Engine.run(engine);

// run the renderer
Render.run(render);


function explosion(engine) {
const bodies = Matter.Composite.allBodies(engine.world);

for (let i = 0; i < bodies.length; ++i) {
    const body = bodies[i];

    if (!body.isStatic && body.position.y <= 425) {
    const forceMagnitude = 0.02 * body.mass;

    Matter.Body.applyForce(body, body.position, {
        x:
        (forceMagnitude + Matter.Common.random() * forceMagnitude) *
        Matter.Common.choose([1, -1]),
        y: -forceMagnitude + Matter.Common.random() * -forceMagnitude
    });
    //Matter.Body.setAngle(body, 0)
    }
}
}




function initCanvas() {
    let cnvWidth, cnvHeight, isOnMobile
    if(window.innerWidth > 480){
        cnvWidth = window.innerWidth/2;
        cnvHeight = (cnvWidth/15)*9
        const parentTop = window.innerHeight/2.1 - cnvHeight/2
        const parentLeft = window.innerWidth/2 - cnvWidth/2
        parentSketch.width = cnvWidth;
        parentSketch.height = cnvHeight;
        parentContent.style.top = parentTop + "px";
        parentContent.style.left = parentLeft + "px";
        lScale=7
        isOnMobile = false
        cols = 6
        rows = 8
    } else {
        cnvWidth = window.innerWidth-10
        cnvHeight = (cnvWidth/15)*9
        parentSketch.width = cnvWidth;
        parentSketch.height = cnvHeight;
        lScale = 6
        isOnMobile = true
        cols = 6
        rows = 4
    }

    return {w: Math.floor(cnvWidth), h:Math.floor(cnvHeight), isMobile: isOnMobile}
    /*
    let cnv = createCanvas(cnvWidth, cnvHeight)
    cnv.parent("sketch")
    */
}

