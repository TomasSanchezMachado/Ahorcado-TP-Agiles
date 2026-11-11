# language: es

@HU-02
Característica: Iniciar partida
  Como jugador
  quiero ver la palabra oculta representada con guiones
  para saber cuántas letras tiene sin conocer cuáles son

  @CA-1
  Escenario: El jugador inicia una partida con una palabra
    Dado una partida con la palabra "GATO"
    Entonces se ve la palabra "_ _ _ _"

  @CA-1
  Escenario: El jugador inicia una partida con una palabra más larga
    Dado una partida con la palabra "PERRO"
    Entonces se ve la palabra "_ _ _ _ _"

  @CA-2
  Escenario: Sin palabra indicada se usa una por defecto
    Cuando el jugador abre el juego sin indicar palabra
    Entonces se ve la palabra "_ _ _ _"