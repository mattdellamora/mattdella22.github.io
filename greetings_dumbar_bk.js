/**
 * Mattia Dellamora
 * Reference: https://p5js.org/reference/
 *
 * Ispirato a:
 * - Rewind, Pauline Saglio (https://vimeo.com/channels/832315/74715354)
 *
 */

let img;
let spritesheet;
let particles = []
let isOnMobile = false
let particleDensity = 1.6
let particleMaxSize = 200;
let particlePosOffset={d:-5, u:5} //down e up
let radius = 82;
const parentSketch = document.getElementById('sketch');
const parentContent = document.getElementById('postcardContent')



let anim = [];

function preload() {
    img = loadImage("./greetings/afrika/assets/afrika5.png");
    spritesheet = loadImage('./greetings/dumbar/assets/texture.png');
}

function setup() {
    reset()
}

function draw() {
    background(0, 0, 0)
    fill(255)
    noStroke()

    for (let p of particles) {
        p.animate()
        p.hover(mouseX, mouseY)
        p.click(mouseIsPressed)
        p.show()
    }

    noFill()
    stroke(255, 0, 0)
    //ellipse(mouseX, mouseY, radius, radius)
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight)
    reset()
}

function mousePressed() {}


class Particle {
    constructor(animation, x, y, size, rot) {
        this.animation = animation; //array di immagini
        let r = random(particlePosOffset.d, particlePosOffset.u); //displacement iniziale
        this.pos = createVector(x + r, y + r);
        this.length = this.animation.length;
        this.rot = rot;
        let frameStart = floor(random(4, 12));
        this.frameStart = frameStart; //memorizzo la posizione iniziale
        this.idx = frameStart; //index dell'array di frames, sfasamento dell'animazione
        this.speed = 0;
        this.size = map(size, 0, 1, 7, particleMaxSize)
    }

    animate() {
        this.idx += this.speed;
    }

    show() {
        push()
        translate(this.pos.x, this.pos.y);
        rotate(this.rot);
        let index = floor(this.idx) % this.length;
        image(this.animation[index], -this.size / 2, -this.size / 2, this.size, this.size);
        pop()
    }

    hover(mouseX, mouseY) {
            let index = floor(this.idx) % this.length
            //console.log(index)
            let d = dist(this.pos.x, this.pos.y, mouseX, mouseY)
            if (d < radius) {
                if (index != 19) { 									//incrementa speed se l'index non è 50
                    if (this.speed < 1.0) { this.speed += 0.4 } 	//incrementa la velocità
                } else {
                    this.speed = 0; 								//fermati se raggiungi frame #50, se lo sorpassa, fa un'altro giro...
                }
            } else {
                if (index != this.frameStart) {						//Se sorpassa frameStart, allora fa un'altro giro....
                    this.speed = 0.4;
                } else { this.speed = 0.0 }
            }
    }
    click(mouseIsPressed) {
        if(!isOnMobile){
        let index = floor(this.idx) % this.length;
        this.index=0;
        if (mouseIsPressed) {
            if (index != 50) {
                if (this.speed < 1.0) { this.speed += 0.6 }
            } else {
                this.speed = 0;
            }
        }
        }
    }

    // Gli arrotondamenti per interi a volte non fanno arrivare
    // l'index a frame di destinazione (es f50). Controllo quindi un 
    // range di frames. 
    // condizione da usare: if (!this.notInRange(index))
    notInRange(currentIndex) {
        let safeRange = []					//range di tutti i frame "salvi"
        for (let i = 47; i < 67; i++) {
            safeRange.push(i)
        }
        for (let n of safeRange) {
            if (n === currentIndex) {
                return true
            }
        }
        return false
    }

}

function reset() {
    let cnvWidth, cnvHeight
    if(windowWidth > 480){
        cnvWidth = windowWidth/2;
        cnvHeight = (cnvWidth/15)*9

        const parentTop = windowHeight/2.1 - cnvHeight/2
        const parentLeft = windowWidth/2 - cnvWidth/2
        // parentContent.style.top = parentTop + "px";
        // parentContent.style.left = parentLeft + "px";
        particleDensity = 1.6
        particleMaxSize= 120
        particlePosOffset={d:-5, u:5} //down e up
        radius = 82;
        isOnMobile = false
    } else {
        cnvWidth = windowWidth-10
        cnvHeight = (cnvWidth/15)*9
        particleDensity=2.1
        particleMaxSize=22
        particlePosOffset={d:-1.8, u:1.8} //down e up
        radius = 45;
        isOnMobile = true
    }

    let cnv = createCanvas(cnvWidth, cnvHeight)
    cnv.parent("sketch")


    


    particles = []
    const num_x = 10
    const num_y = 4
    const sprite_w = 198
    const sprite_h = 198

    for (let j = 0; j < num_y; j++) {
        for (let i = 0; i < num_x; i++) {
            const x = i * sprite_w
            const y = j * sprite_w
            let img = spritesheet.get(x, y, sprite_w, sprite_h);
            img.resize(64, 64)
            anim.push(img);
        }
    }

    //calcolo il nro di particelle con la prima img
    let off = 0.0;
    const grid = min(cnvWidth, cnvHeight) / 80
    const ox = (cnvWidth - (img.width - 1) * grid) / 2
    const oy = (cnvHeight - (img.height - 1) * grid) / 2
    for (let j = 0; j < img.height; j+=particleDensity) {
        for (let i = 0; i < img.width; i+=particleDensity) {
            let c = img.get(i, j)
            let x = ox + i * grid
            let y = oy + j * grid
            if (c[0] > 200) {
                //let d = map(c[0], 0, 255, 1, grid)
                particles.push(new Particle(anim, x, y, noise(off), random(TAU)));
                off += 1.3;
            }
        }
    }
}