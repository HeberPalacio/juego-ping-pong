let imagenPelota;
let imagenRaqueta;
let imagenComputadora;
let imagenFondo;
let sonidoRaqueta;
let sonidoGol;
let logoPingPong;  // Variable para la imagen del logo

let nombreJugador = "";
let juegoIniciado = false;
let inputNombre;
let canvas;

let puntosJugador = 0;
let puntosComputadora = 0;

let juegoTerminado = false;
let ganador = "";

class Pelota {
    constructor(x, y, diameter, vx, vy) {
        this.x = x;
        this.y = y;
        this.diameter = diameter;
        this.vx = vx;
        this.vy = vy;
        this.reset();
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.rotation += this.vx + this.vy;

        if (this.x > width - this.diameter / 2 || this.x < this.diameter / 2) {
            sonidoGol.play();
            if (this.x < width / 2) {
                puntosComputadora++;
            } else {
                puntosJugador++;
            }

            if (puntosJugador >= 5 || puntosComputadora >= 5) {
                juegoTerminado = true;
                ganador = (puntosJugador >= 5) ? nombreJugador : "Computadora";
            } else {
                this.reset();
            }
        }

        if (this.y > height - this.diameter / 2 || this.y < this.diameter / 2) {
            this.vy *= -1;
        }

        if (colision(this.x, this.y, this.diameter, raqueta.x, raqueta.y, raqueta.width, raqueta.height) || colision(this.x, this.y, this.diameter, computadora.x, computadora.y, computadora.width, computadora.height)) {
            sonidoRaqueta.play();
            this.vx *= -1;
            this.vx *= 1.2;
            this.vy *= 1.2;
        }
    }

    reset() {
        this.x = 400;
        this.y = 200;
        this.vx = 8 * (Math.random() < 0.5 ? -1 : 1);
        this.vy = 8 * (Math.random() < 0.5 ? -1 : 1);
        this.rotation = 0;
    }

    draw() {
        push();
        translate(this.x, this.y);
        rotate(this.rotation);
        image(imagenPelota, -this.diameter / 2, -this.diameter / 2, this.diameter, this.diameter);
        pop();

        fill(0, 150);
        rect(width / 2 - 250, 10, 500, 40, 10);

        fill(255);
        textSize(32);
        textAlign(CENTER, TOP);
        text(nombreJugador + ": " + puntosJugador + "   |   Computadora: " + puntosComputadora, width / 2, 20);

        if (juegoTerminado) {
            fill(0, 180);
            rect(width / 2 - 200, height / 2 - 100, 400, 200, 20);

            fill(255);
            textAlign(CENTER, CENTER);
            textSize(36);
            text("¡Ganó " + ganador + "!", width / 2, height / 2 - 40);

            textSize(24);
            text("Haz clic para reiniciar", width / 2, height / 2 + 30);

            noLoop();
        }
    }
}

class Raqueta {
    constructor(x, y, width, height, speed) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
    }

    update() {
        if (this.x < width / 2) {
            this.y = mouseY;
        } else {
            // Predicción de la posición futura de la pelota
            let pelotaFuturoY = pelota.y + pelota.vy * 10; // Estimación de donde estará la pelota en el futuro

            // La computadora intenta moverse hacia la pelota, pero con un retraso natural
            if (pelotaFuturoY < this.y) {
                this.y -= this.speed;
            } else if (pelotaFuturoY > this.y + this.height) {
                this.y += this.speed;
            }

            // Limitar el movimiento de la raqueta de la computadora para que no salga de la pantalla
            this.y = constrain(this.y, 0, height - this.height);
        }
    }

    draw() {
        if (this.x < width / 2) {
            image(imagenRaqueta, this.x, this.y, this.width, this.height);
        } else {
            image(imagenComputadora, this.x, this.y, this.width, this.height);
        }
    }
}

let pelota;
let raqueta;
let computadora;

function colision(cx, cy, diameter, rx, ry, rw, rh) {
    if (cx + diameter / 2 < rx) return false;
    if (cy + diameter / 2 < ry) return false;
    if (cx - diameter / 2 > rx + rw) return false;
    if (cy - diameter / 2 > ry + rh) return false;
    return true;
}

function preload() {
    imagenPelota = loadImage('pelota.png');
    imagenRaqueta = loadImage('raqueta1.png');
    imagenComputadora = loadImage('raqueta2.png');
    imagenFondo = loadImage('Fondo2.jpg');
    sonidoRaqueta = loadSound('golpe-fuerte-44125.mp3');
    sonidoGol = loadSound('274178__littlerobotsoundfactory__jingle_win_synth_02.wav');
    logoPingPong = loadImage('logo_ping_pong.png'); // Cargar el logo
}

function setup() {
    canvas = createCanvas(windowWidth, windowHeight);

    inputNombre = createInput('');
    inputNombre.size(200);
    inputNombre.attribute('placeholder', 'Ingresa tu nombre');
    inputNombre.style('font-size', '18px');
    inputNombre.style('padding', '8px');
    inputNombre.style('border-radius', '10px');
    inputNombre.style('border', 'none');
    inputNombre.style('text-align', 'center');

    // Inicialización de objetos del juego
    pelota = new Pelota(400, 200, 50, 5, 5);
    raqueta = new Raqueta(20, height / 2 - 50, 20, 100, 5);
    computadora = new Raqueta(width - 40, height / 2 - 50, 20, 100, 5);
}

function draw() {
    if (!juegoIniciado) {
        background(0, 150);

        // Mostrar el logo encima del input
        let logoAncho = 400;
        let logoAlto = 225;
        let logoX = width / 2 - logoAncho / 2;
        let logoY = height / 2 - 250; // Ajuste para mover el logo más arriba
        image(logoPingPong, logoX, logoY, logoAncho, logoAlto);

        fill(0, 180);

        fill(255);
        textAlign(CENTER, CENTER);
        textSize(28);
        text("Ingresa tu nombre para comenzar", width / 2, height / 2 + 20); // Ajuste para que el texto esté más abajo

        inputNombre.show();

        const inputX = width / 2 - 100;
        const inputY = height / 2 + 60; // Ajuste para mover el input más abajo
        inputNombre.position(inputX, inputY);

        textSize(20);
        fill('#46849d');
        text("Presiona Enter para comenzar el juego", width / 2, inputY + 60); // Ajuste para mover el texto más abajo

        return;
    }

    image(imagenFondo, 0, 0, width, height);

    pelota.update();
    pelota.draw();
    raqueta.update();
    raqueta.draw();
    computadora.update();
    computadora.draw();
}


function keyPressed() {
    if (!juegoIniciado && keyCode === ENTER) {
        iniciarJuego();
    }
}

function mousePressed() {
    if (juegoIniciado && juegoTerminado) {
        puntosJugador = 0;
        puntosComputadora = 0;
        juegoTerminado = false;
        ganador = "";
        pelota.reset();
        loop();
    }
}

function iniciarJuego() {
    nombreJugador = inputNombre.value().trim();
    if (nombreJugador === "") {
        nombreJugador = "Jugador";
    }

    inputNombre.hide();

    pelota = new Pelota(400, 200, 50, 5, 5);
    raqueta = new Raqueta(20, height / 2 - 50, 20, 100, 5);
    computadora = new Raqueta(width - 40, height / 2 - 50, 20, 100, 5);
    juegoIniciado = true;
}
