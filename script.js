// ================== Obtención de elementos HTML con querySelector ==================
// Variables para almacenar referencias a elementos HTML del DOM

let nivel= document.querySelector(".nivel");// Variable para gestionar el nivel actual del juego
let puntaje = document.querySelector(".score"); // Variable para llevar la puntuación del jugador
let bandera = document.querySelector(".bandera"); // Referencia a la bandera del nivel
let botonCambiarColor= document.querySelector(".cambiar-color");  // Botón para cambiar el color de fondo
let botonFinalizarJuego= document.querySelector(".finalizar"); // Botón para terminar el juego

// ================== Estado del Juego ==================
// Variables que controlan el movimiento y acciones de Mario

let derechaPresionado = false; // Indica si la tecla derecha está presionada
let izquierdaPresionado = false; // Indica si la tecla izquierda está presionada
let abajoPresionado = false; // Indica si la tecla abajo (agacharse) está presionada
let saltarPresionado = 0; // Contador para gestionar el salto
let tiempoDeSalto = 10; // Duración total del salto en ciclos (frames)
let juegoActivo = true; // Estado general del juego (true = en marcha)

// Puedes agregar aquí variables adicionales para gestionar otros aspectos del estado de Mario
// por ejemplo: si Mario está grande, si tiene monedas, etc.
let marioGrande = false;
let TieneMoneda = false;

// ================== Elementos de personajes y objetos ==================
// Referencias a elementos HTML relacionados con personajes y objetos del juego

let mario =document.querySelector(".mario");// Elemento HTML de Mario
let moneda =document.querySelector(".moneda"); // Elemento HTML de una moneda
let hongo =document.querySelector(".hongo"); // Elemento HTML de un hongo

// ================== Configuración de enemigos ==================
// Parámetros y referencias para los enemigos en el escenario

// Enemigo Goomba
let goomba = document.querySelector(".goomba");
let goombaDireccion = 1; // 1 = mueve hacia la derecha, -1 = hacia la izquierda
const goombaVelocidad = 5; // Velocidad de movimiento en píxeles por ciclo
const limiteIzquierdaGoomba = 300; // Límite izquierdo en píxeles
const limiteDerechaGoomba = 600; // Límite derecho en píxeles

// Enemigo Goomba_alado
let goombaAlado = document.querySelector(".goombaAlado");
let goombaAladoDireccion = 1; // Dirección inicial
const goombaAladoVelocidad = 5; // Velocidad en px
const limiteIzquierdaGoombaAlado = 900;
const limiteDerechaGoombaAlado = 1200;

// ================== Recursos de sonido ==================
// Carga de efectos de sonido ubicados en la carpeta "sonidos"

const TemaFondo = new Audio("./sonidos/Theme.wav"); // Música de fondo
const GameOver = new Audio("./sonidos/Game_Over.wav");
const Pause = new Audio("./sonidos/Pause.wav");
const Jump = new Audio("./sonidos/Jump.wav");
const Power = new Audio("./sonidos/Powerup.wav");
const Coin= new Audio("./sonidos/Coin.wav");
const Nivel= new Audio("./sonidos/Level_Clear.wav");
const Die= new Audio("./sonidos/Die.wav");

// ================== Ciclo principal del juego ==================
// Ejecuta el ciclo del juego cuando la ventana se carga
window.onload = () => {
  gameLoop(); // Inicia el ciclo de actualización continua
};

// Función que inicia el ciclo del juego, llamando a 'actualizar' 20 veces por segundo
function gameLoop() {
  setInterval(actualizar, 1000 / 20); // Ejecuta la función 'actualizar' cada 50 ms
}

// ================== Función principal de actualización ==================
// Se ejecuta en cada ciclo del juego para actualizar el estado y movimientos
function actualizar() {
  if (juegoActivo) {
    // Reproduce la música de fondo si aún no se está reproduciendo
    TemaFondo.play();

    // Llamadas a funciones que controlan la lógica del juego
    
    moverGoomba(); // Movimiento del enemigo Goomba
    moverGoombaAlado(); // Movimiento del enemigo Goomba_alado
    detectarColisionGoomba(); // Verificar colisiones con Goomba
    detectarColisionGoombaAlado(); // Verificar colisiones con Goomba_alado
    detectarColisionBandera(); // Verificar si Mario llega a la bandera

    // Tu objetivo es crear las siguientes funciones:

    derecha(); // Control para mover a Mario a la derecha
    izquierda(); // Control para mover a Mario a la izquierda
    saltar(); // Control del salto
    agarrarMoneda(); // Comprobar si Mario recoge una moneda
    agarrarHongo(); // Comprobar si Mario recoge un hongo
  }
}

// ================== Control de teclado ==================
// Detecta cuando se presionan las teclas y actualiza las variables de control

// Evento para cuando se presiona una tecla
window.addEventListener("keydown", (event) => {
  setTimeout(() => {
    if (event.keyCode == 37 && !izquierdaPresionado) {
      // Flecha izquierda
      izquierdaPresionado = true;
    } else if (event.keyCode == 39 && !derechaPresionado) {
      // Flecha derecha
      derechaPresionado = true;
    } else if (event.keyCode == 32) {
      // Barra espaciadora para saltar
      if (saltarPresionado == 0) {
        saltarPresionado = 1; // Inicia el salto
      }
    } else if (event.keyCode == 40 && !abajoPresionado && juegoActivo) {
      // Flecha abajo (agacharse)
      abajoPresionado = true;
      if (abajoPresionado  && marioGrande === false){
        mario.src = "imagenes/mario_Agachado_Peque.png";
        mario.style.width = "35px"
        mario.style.height = "35px"
      }
      if (abajoPresionado  && marioGrande === true){
        mario.src = "imagenes/mario_Agachado_Grande.png";
        mario.style.width = "40px"
        mario.style.height = "40px"
      }
    }
  }, 1);
});

// Evento para cuando se suelta una tecla
window.addEventListener("keyup", (event) => {
  setTimeout(() => {
    if (event.keyCode == 37 && izquierdaPresionado) {
      // Soltar flecha izquierda
      izquierdaPresionado = false;
    } else if (event.keyCode == 39 && derechaPresionado) {
      // Soltar flecha derecha
      derechaPresionado = false;
    } else if (event.keyCode == 40 && abajoPresionado) {
      // Soltar abajo (agacharse)
      abajoPresionado = false;
      if (abajoPresionado==false && marioGrande ===false){
        mario.src = "imagenes/mario_Peque.gif";      
        mario.style.width = "40px"
        mario.style.height = "50px"
      }
      if (abajoPresionado==false && marioGrande ===true){
        mario.src = "imagenes/mario_Grande.gif";      
        mario.style.width = "60px"
        mario.style.height = "60px"
     }
    }
    
  }, 1);
});



// ================== Funciones de movimiento y acciones ==================
// Control del salto
function saltar() {
  if (saltarPresionado != 0 && saltarPresionado < tiempoDeSalto) {
    // Aquí debes agregar la lógica para hacer que Mario salte hacia arriba
    // y gestionar la subida y bajada usando la variable 'saltarPresionado'
   mario.style.bottom ="120px"
    saltarPresionado++; 
    let sonidoSaltar = new Audio("Jump.wav");
  Jump.play();
  } else  {
    saltarPresionado = 0; 
     mario.style.bottom ="35px"
  }
}

// Movimiento a la derecha
function derecha() {
  if (derechaPresionado) {
  
    // Aquí agregas la lógica para mover a Mario hacia la izquierda
    let marioActual= parseInt(mario.style.left) || 75;
    const mover=10;
    const limite=10000;
    let marioNuevo= marioActual + mover;
    
    if (marioNuevo <= limite){
    mario.style.left = marioNuevo + "px"
    mario.classList.remove("flip")
    }
  } 
  
}

// Movimiento a la izquierda
function izquierda() {
  if (izquierdaPresionado) {
  
    // Aquí agregas la lógica para mover a Mario hacia la izquierda
    let marioActual= parseInt(mario.style.left) || 75;
    const mover=10;
    const limite=0;
    let marioNuevo= marioActual - mover;
    
    if (marioNuevo >= limite){
    mario.style.left = marioNuevo + "px"
    mario.classList.add("flip")
    }
  }
}

// ================== Funciones de recolección de objetos ==================
// Detecta si Mario recoge una moneda
function agarrarMoneda() {
  if (moneda.style.display != "none") {
    // Lógica para que Mario recoja la moneda, por ejemplo:
    // moneda.style.display = "none";
    // incrementar puntaje, etc.
  let marioRect = mario.getBoundingClientRect();
  let monedaRect = moneda.getBoundingClientRect();

  if (
    
    marioRect.left < monedaRect.right &&
    marioRect.right > monedaRect.left &&
    marioRect.top < monedaRect.bottom &&
    marioRect.bottom > monedaRect.top
  ) {
    let sonidoCrecimiento = new Audio("sonidos/Coin.wav");
  Coin.play();

    moneda.style.display = "none";
    incrementarPuntaje(); 

    TieneMoneda = true;
    
}
function incrementarPuntaje() {
puntaje.innerHTML = parseInt(puntaje.innerHTML) +1
}



  }
}

// Detecta si Mario recoge un hongo
function agarrarHongo() {
  if (hongo.style.display != "none") {
    // Lógica para que Mario recoja el hongo
    // por ejemplo, hacer crecer a Mario
 let marioRect = mario.getBoundingClientRect();
  let hongoRect = hongo.getBoundingClientRect();

  if (
    marioRect.bottom >= hongoRect.top && 
    marioRect.left < hongoRect.right &&
    marioRect.right > hongoRect.left &&
    marioRect.top < hongoRect.bottom
  ) {


    hongo.style.display ="none";
    crecer()
  
    marioGrande = true;

  }
  
}
}




// Función que hace crecer a Mario
function crecer() {
  // Aquí puedes implementar la lógica para aumentar el tamaño de Mario
  // cuando recoge un hongo
  hongo.style.display = "none"; 
  mario.src = "imagenes/mario_Grande.gif";
  mario.style.width = "60px"
  mario.style.height = "60px"
  
  let sonidoCrecimiento = new Audio("sonidos/Powerup.wav");
  Power.play();

}



// ================== Movimiento de enemigos ==================
// Función que anima el movimiento constante del Goomba
function moverGoomba() {
  if (juegoActivo) {
    let posicionActual = parseInt(goomba.style.left) || 600;
    let nuevaPosicion = posicionActual + goombaVelocidad * goombaDireccion;

    // Cambio de dirección si llega a los límites
    if (nuevaPosicion >= limiteDerechaGoomba) {
      nuevaPosicion = limiteDerechaGoomba;
      goombaDireccion = -1; // Cambia a moverse hacia la izquierda
      goomba.classList.remove("flip");
    } else if (nuevaPosicion <= limiteIzquierdaGoomba) {
      nuevaPosicion = limiteIzquierdaGoomba;
      goombaDireccion = 1; // Cambia a moverse hacia la derecha
      goomba.classList.add("flip");
    }
    goomba.style.left = nuevaPosicion + "px"; // Actualiza la posición en pantalla
  }
}

// Función que anima el movimiento del Goomba_alado
function moverGoombaAlado() {
  if (juegoActivo) {
    let posicionActual = parseInt(goombaAlado.style.left) || 800;
    let nuevaPosicion =
      posicionActual + goombaAladoVelocidad * goombaAladoDireccion;

    if (nuevaPosicion >= limiteDerechaGoombaAlado) {
      nuevaPosicion = limiteDerechaGoombaAlado;
      goombaAladoDireccion = -1; // Cambia a izquierda
      goombaAlado.classList.remove("flip");
    } else if (nuevaPosicion <= limiteIzquierdaGoombaAlado) {
      nuevaPosicion = limiteIzquierdaGoombaAlado;
      goombaAladoDireccion = 1; // Cambia a derecha
      goombaAlado.classList.add("flip");
    }
    goombaAlado.style.left = nuevaPosicion + "px"; // Actualiza la posición
  }
}

// ================== Colisiones con la bandera ==================
// Detecta si Mario llega a la bandera para ganar el nivel
function detectarColisionBandera() {
  let marioPos = mario.getBoundingClientRect(); // Posición de Mario en pantalla
  let banderaPos = bandera.getBoundingClientRect(); // Posición de la bandera

  if (
    marioPos.left < banderaPos.right &&
    marioPos.right > banderaPos.left &&
    marioPos.bottom > banderaPos.top &&
    marioPos.top < banderaPos.bottom
  ) {
    // Condición de colisión detectada
    if (marioGrande && TieneMoneda) {
      // Solo gana si Mario está en tamaño grande y tiene la moneda
      Nivel.play(); // Reproduce sonido de victoria
      TemaFondo.pause(); // Detiene la música
      TemaFondo.currentTime = 0; // Reinicia la música
      juegoActivo = false; // Detiene el ciclo principal
      mario.src = "./imagenes/Mario_Gana.png"; // Cambia imagen a Mario ganador
      mario.style.width = "70px";
      mario.style.height = "70px";

      // Reinicio del nivel después de 6 segundos
      setTimeout(() => {
        location.reload(); // Recarga la página para reiniciar
      }, 6000);
    }
  }
}

// ================== Acciones de botones ==================
// Cambiar color de fondo cuando se hace clic en el botón correspondiente
botonCambiarColor.onclick = function () {
  document.body.style.backgroundColor="purple";
  // Agrega aquí la lógica para cambiar el color de fondo
};

// Finalizar el juego cuando se hace clic en el botón correspondiente
botonFinalizarJuego.onclick = function () {
  setTimeout(() => {
    // Agrega aquí la lógica para terminar el juego, como mostrar mensaje o reiniciar
    nivel.innerHTML="Juego Finalizado: Gilibeth";
    GameOver.play();
    TemaFondo.pause();
    juegoActivo= false;
    
  }, 0);
};

// ================== Colisiones con enemigos ==================
// Detecta colisión entre Mario y Goomba
function detectarColisionGoomba() {
  let marioPos = mario.getBoundingClientRect();
  let goombaPos = goomba.getBoundingClientRect();

  if (
    marioPos.left < goombaPos.right &&
    marioPos.right > goombaPos.left &&
    marioPos.bottom > goombaPos.top &&
    marioPos.top < goombaPos.bottom
  ) {
    // Colisión detectada: Mario pierde
    juegoActivo = false; // Detiene el juego
    Die.play(); // Reproduce sonido de muerte
    TemaFondo.pause(); // Pausa música
    TemaFondo.currentTime = 0; // Reinicia música
    mario.src = "./imagenes/Mario_Muerto.png"; // Imagen de Mario muerto
    mario.style.width = "40px";
    mario.style.height = "40px";

    // Animación de muerte: hace que Mario suba y baje
    mario.style.transition = "bottom 0.5s ease";
    mario.style.bottom = "120px"; // Sube para efecto
    setTimeout(() => {
      mario.style.bottom = "-120px"; // Baja para efecto
      setTimeout(() => {
        location.reload(); // Reinicia el juego
      }, 2000);
    }, 1000);
  }
}

// Detecta colisión con Goomba_alado
function detectarColisionGoombaAlado() {
  let marioPos = mario.getBoundingClientRect();
  let goombaAladoPos = goombaAlado.getBoundingClientRect();

  if (
    marioPos.left < goombaAladoPos.right &&
    marioPos.right > goombaAladoPos.left &&
    marioPos.bottom > goombaAladoPos.top &&
    marioPos.top < goombaAladoPos.bottom
  ) {
    // Colisión detectada: Mario pierde
    juegoActivo = false;
    Die.play();
    TemaFondo.pause();
    TemaFondo.currentTime = 0;
    mario.src = "./imagenes/Mario_Muerto.png"; // Imagen de Mario muerto
    mario.style.width = "40px";
    mario.style.height = "40px";

    // Animación de muerte
    mario.style.transition = "bottom 0.5s ease";
    mario.style.bottom = "120px"; // Subir
    setTimeout(() => {
      mario.style.bottom = "-120px"; // Bajar
      setTimeout(() => {
        location.reload(); // Reiniciar
      }, 2000);
    }, 1000);
  }
}
