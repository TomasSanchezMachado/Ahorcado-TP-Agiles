// Efectos de la cabina: animaciones de lo que acaba de pasar y sonidos sintetizados con Web Audio.
// Cada letra recarga la página, así que se compara el estado actual con el de la carga anterior.
(function () {
  "use strict";

  var cabina = document.querySelector(".cabina");
  var boton = document.getElementById("sonido");
  if (!cabina || !boton) return;

  function leer(clave) {
    try { return window.localStorage.getItem(clave); } catch (e) { return null; }
  }
  function guardar(clave, valor) {
    try { window.localStorage.setItem(clave, valor); } catch (e) { /* sin almacenamiento */ }
  }
  function leerSesion() {
    try { return JSON.parse(window.sessionStorage.getItem("ahorcado-estado")); } catch (e) { return null; }
  }
  function guardarSesion(estado) {
    try { window.sessionStorage.setItem("ahorcado-estado", JSON.stringify(estado)); } catch (e) { /* sin almacenamiento */ }
  }

  var activado = leer("ahorcado-sonido") !== "off";
  boton.setAttribute("aria-pressed", String(activado));
  boton.addEventListener("click", function () {
    activado = !activado;
    boton.setAttribute("aria-pressed", String(activado));
    guardar("ahorcado-sonido", activado ? "on" : "off");
    if (activado) sonar();
  });

  // Volumen regulable (0 a 100), recordado entre partidas.
  var deslizador = document.getElementById("volumen");
  var guardado = Number(leer("ahorcado-volumen"));
  var volumen = leer("ahorcado-volumen") === null || isNaN(guardado) ? 70 : guardado;
  function aplicarVolumen() {
    if (deslizador) {
      deslizador.value = volumen;
      deslizador.style.setProperty("--relleno", volumen + "%");
    }
    // Curva cuadrática: el control se siente más natural al oído. Al máximo amplifica x2.5.
    if (salida) salida.gain.setTargetAtTime(Math.pow(volumen / 100, 2) * 2.5, ctx.currentTime, 0.02);
  }
  if (deslizador) {
    deslizador.addEventListener("input", function () {
      volumen = Number(deslizador.value);
      guardar("ahorcado-volumen", String(volumen));
      aplicarVolumen();
    });
    deslizador.addEventListener("change", function () {
      if (!activado && volumen > 0) {
        activado = true;
        boton.setAttribute("aria-pressed", "true");
        guardar("ahorcado-sonido", "on");
      }
      if (activado) sonar();
    });
  }
  aplicarVolumen();

  var Contexto = window.AudioContext || window.webkitAudioContext;
  var ctx = null;
  var salida = null;

  function audio() {
    if (!Contexto) return null;
    if (!ctx) {
      ctx = new Contexto();
      salida = ctx.createGain();
      salida.gain.value = Math.pow(volumen / 100, 2) * 2.5;
      // Compresor al final para poder subir el volumen sin que distorsione.
      var compresor = ctx.createDynamicsCompressor();
      compresor.threshold.value = -14;
      compresor.knee.value = 10;
      compresor.ratio.value = 6;
      compresor.attack.value = 0.003;
      compresor.release.value = 0.2;
      compresor.connect(ctx.destination);
      // Eco de sonar: un delay con realimentación.
      var eco = ctx.createDelay(1);
      eco.delayTime.value = 0.32;
      var realimentacion = ctx.createGain();
      realimentacion.gain.value = 0.35;
      salida.connect(compresor);
      salida.connect(eco);
      eco.connect(realimentacion);
      realimentacion.connect(eco);
      eco.connect(compresor);
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  function envolvente(nodo, t, pico, ataque, caida) {
    nodo.gain.setValueAtTime(0.0001, t);
    nodo.gain.exponentialRampToValueAtTime(pico, t + ataque);
    nodo.gain.exponentialRampToValueAtTime(0.0001, t + ataque + caida);
  }

  function tono(tipo, desde, hasta, inicio, duracion, volumen, ataque) {
    var c = audio();
    if (!c) return;
    var t = c.currentTime + inicio;
    var osc = c.createOscillator();
    var g = c.createGain();
    osc.type = tipo;
    osc.frequency.setValueAtTime(desde, t);
    osc.frequency.exponentialRampToValueAtTime(hasta, t + duracion);
    envolvente(g, t, volumen, ataque || 0.01, duracion);
    osc.connect(g);
    g.connect(salida);
    osc.start(t);
    osc.stop(t + duracion + 0.05);
  }

  function ruido(inicio, duracion, volumen, corteDesde, corteHasta) {
    var c = audio();
    if (!c) return;
    var t = c.currentTime + inicio;
    var buffer = c.createBuffer(1, Math.floor(c.sampleRate * duracion), c.sampleRate);
    var datos = buffer.getChannelData(0);
    for (var i = 0; i < datos.length; i++) datos[i] = Math.random() * 2 - 1;
    var fuente = c.createBufferSource();
    fuente.buffer = buffer;
    var filtro = c.createBiquadFilter();
    filtro.type = "lowpass";
    filtro.frequency.setValueAtTime(corteDesde, t);
    filtro.frequency.exponentialRampToValueAtTime(corteHasta, t + duracion);
    var g = c.createGain();
    envolvente(g, t, volumen, 0.02, duracion);
    fuente.connect(filtro);
    filtro.connect(g);
    g.connect(salida);
    fuente.start(t);
  }

  function sonar() {
    tono("sine", 1250, 1150, 0, 1.4, 0.35, 0.005);
  }

  function burbujas() {
    for (var i = 0; i < 7; i++) {
      var base = 300 + Math.random() * 500;
      tono("sine", base, base * 2.6, i * 0.07 + Math.random() * 0.04, 0.09, 0.18, 0.005);
    }
  }

  function crujido() {
    var c = audio();
    if (!c) return;
    var t = c.currentTime;
    var osc = c.createOscillator();
    var vibrato = c.createOscillator();
    var profundidad = c.createGain();
    var filtro = c.createBiquadFilter();
    var g = c.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(95, t);
    osc.frequency.exponentialRampToValueAtTime(55, t + 0.9);
    vibrato.frequency.value = 11;
    profundidad.gain.value = 14;
    vibrato.connect(profundidad);
    profundidad.connect(osc.frequency);
    filtro.type = "bandpass";
    filtro.frequency.value = 700;
    filtro.Q.value = 9;
    envolvente(g, t, 0.5, 0.08, 0.85);
    osc.connect(filtro);
    filtro.connect(g);
    g.connect(salida);
    osc.start(t);
    vibrato.start(t);
    osc.stop(t + 1);
    vibrato.stop(t + 1);
    ruido(0, 0.25, 0.12, 3000, 400);
  }

  function implosion() {
    crujido();
    ruido(0.35, 1.6, 0.7, 2500, 60);
    tono("sine", 70, 28, 0.35, 1.5, 0.7, 0.02);
  }

  function victoria() {
    tono("sine", 660, 650, 0, 0.6, 0.25, 0.005);
    tono("sine", 880, 870, 0.18, 0.6, 0.25, 0.005);
    tono("sine", 1320, 1300, 0.36, 1.2, 0.25, 0.005);
    setTimeout(burbujas, 450);
  }

  function aviso() {
    tono("square", 190, 170, 0, 0.12, 0.08, 0.005);
    tono("square", 190, 170, 0.16, 0.12, 0.08, 0.005);
  }

  var teclas = Array.prototype.slice.call(document.querySelectorAll(".tecla.acierto, .tecla.fallo"));
  var casilleros = Array.prototype.slice.call(document.querySelectorAll(".casillero"));
  var actual = {
    fallos: Number(cabina.dataset.fallos),
    aciertos: Number(cabina.dataset.aciertos),
    usadas: Number(cabina.dataset.usadas),
    resultado: cabina.dataset.resultado,
    teclas: teclas.map(function (t) { return t.dataset.letra; }),
    llenas: casilleros.map(function (c) { return c.classList.contains("llena"); })
  };
  var previo = leerSesion();
  if (previo && (actual.usadas === 0 || previo.llenas.length !== actual.llenas.length)) previo = null;
  guardarSesion(actual);

  var huboFallo = previo && actual.fallos > previo.fallos;
  var huboAcierto = previo && actual.aciertos > previo.aciertos;

  // ----- Animaciones de lo que acaba de pasar -----
  if (huboFallo) {
    cabina.classList.add("recien-fallo");
    var corazon = document.querySelector('.corazon[data-indice="' + (6 - actual.fallos) + '"]');
    if (corazon) corazon.classList.add("rompiendo");
  }
  if (huboAcierto) {
    cabina.classList.add("recien-acierto");
    var orden = 0;
    casilleros.forEach(function (c, i) {
      if (actual.llenas[i] && !previo.llenas[i]) {
        c.classList.add("nueva");
        c.style.setProperty("--orden", orden++);
      }
    });
  }
  // La persona reacciona un momento y después vuelve a la cara que corresponde a los fallos.
  if (!actual.resultado && (huboFallo || huboAcierto)) {
    cabina.setAttribute("data-reaccion", huboFallo ? "fallo" : "acierto");
    setTimeout(function () { cabina.removeAttribute("data-reaccion"); }, 1300);
  }
  if (previo) {
    teclas.forEach(function (t) {
      if (previo.teclas.indexOf(t.dataset.letra) === -1) t.classList.add("recien");
    });
  }
  if (actual.resultado === "Ganaste" && (!previo || previo.resultado !== "Ganaste")) festejar();

  function festejar() {
    var capa = document.createElement("div");
    capa.className = "festejo";
    capa.setAttribute("aria-hidden", "true");
    for (var i = 0; i < 40; i++) {
      var b = document.createElement("i");
      var t = 6 + Math.random() * 22;
      b.style.left = Math.random() * 100 + "%";
      b.style.setProperty("--t", t + "px");
      b.style.setProperty("--d", 2.5 + Math.random() * 3 + "s");
      b.style.setProperty("--r", Math.random() * 1.2 + "s");
      capa.appendChild(b);
    }
    document.body.appendChild(capa);
    setTimeout(function () { capa.remove(); }, 7000);
  }

  // ----- Sonidos -----
  var efecto = null;
  if (actual.resultado === "Perdiste" && (!previo || previo.resultado !== "Perdiste")) efecto = implosion;
  else if (actual.resultado === "Ganaste" && (!previo || previo.resultado !== "Ganaste")) efecto = victoria;
  else if (cabina.dataset.error) efecto = aviso;
  else if (actual.usadas === 0) efecto = sonar;
  else if (huboFallo) efecto = crujido;
  else if (huboAcierto) efecto = burbujas;

  function reproducir() {
    if (activado && efecto) efecto();
  }

  // Si el navegador bloquea el audio hasta que haya interacción, se habilita en la primera.
  var c = audio();
  if (!c) return;
  if (c.state === "running") {
    reproducir();
    return;
  }
  var habilitar = function () {
    c.resume();
    window.removeEventListener("pointerdown", habilitar);
    window.removeEventListener("keydown", habilitar);
  };
  window.addEventListener("pointerdown", habilitar);
  window.addEventListener("keydown", habilitar);
  c.resume().then(function () {
    if (c.state === "running") reproducir();
  });
})();
