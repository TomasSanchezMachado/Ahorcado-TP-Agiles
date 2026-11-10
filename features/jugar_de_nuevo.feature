# language: es
@HU-10
Característica: Jugar de nuevo
  Como jugador
  quiero tener un botón para jugar de nuevo
  para empezar otra partida sin esfuerzo

  @CA-1
  Escenario: El jugador pierde y ve el botón para jugar de nuevo
    Dado una partida con la palabra "GATO"
    Cuando el jugador ingresa la letra "E"
    Y el jugador ingresa la letra "I"
    Y el jugador ingresa la letra "U"
    Y el jugador ingresa la letra "L"
    Y el jugador ingresa la letra "M"
    Y el jugador ingresa la letra "N"
    Entonces se ve el botón "Jugar de nuevo"

  @CA-1
  Escenario: El jugador gana y ve el botón para jugar de nuevo
    Dado una partida con la palabra "GATO"
    Cuando el jugador ingresa la letra "G"
    Y el jugador ingresa la letra "A"
    Y el jugador ingresa la letra "T"
    Y el jugador ingresa la letra "O"
    Entonces se ve el botón "Jugar de nuevo"

  @CA-3
  Escenario: Al jugar de nuevo se reinician intentos y palabra
    Dado una partida con la palabra "GATO"
    Cuando el jugador ingresa la letra "E"
    Y el jugador ingresa la letra "I"
    Y el jugador ingresa la letra "U"
    Y el jugador ingresa la letra "L"
    Y el jugador ingresa la letra "M"
    Y el jugador ingresa la letra "N"
    Y el jugador aprieta el botón "Jugar de nuevo"
    Entonces se ven 6 intentos restantes
    Y no se ve ninguna letra revelada
    Y no se ve ningún mensaje de resultado

  @CA-3
  Escenario: Al jugar de nuevo se puede volver a usar una letra ya usada
    Dado una partida con la palabra "GATO"
    Cuando el jugador ingresa la letra "E"
    Y el jugador ingresa la letra "I"
    Y el jugador ingresa la letra "U"
    Y el jugador ingresa la letra "L"
    Y el jugador ingresa la letra "M"
    Y el jugador ingresa la letra "N"
    Y el jugador aprieta el botón "Jugar de nuevo"
    Y el jugador ingresa la letra "E"
    Entonces no se ve ningún mensaje de error

  @CA-2
  Escenario: Al jugar de nuevo la palabra es distinta de la anterior
    Dado una partida con la palabra "GATO"
    Cuando el jugador ingresa la letra "E"
    Y el jugador ingresa la letra "I"
    Y el jugador ingresa la letra "U"
    Y el jugador ingresa la letra "L"
    Y el jugador ingresa la letra "M"
    Y el jugador ingresa la letra "N"
    Y el jugador aprieta el botón "Jugar de nuevo"
    Entonces la palabra de la partida no es "GATO"
    Y la palabra de la partida no aparece en la URL
