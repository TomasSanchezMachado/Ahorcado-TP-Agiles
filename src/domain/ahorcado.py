import random

class EntradaInvalida(Exception):
    pass

PALABRAS = ["GATO", "PERRO", "CASA", "ARBOL", "LIBRO", "MESA", "SILLA", "PLAYA", "TREN", "FLOR"]
TABLA_ACENTOS = str.maketrans("ÁÉÍÓÚÜ", "AEIOUU")

def elegir_palabra(anterior):
    return random.choice([palabra for palabra in PALABRAS if palabra != anterior])

class Ahorcado:
    def __init__(self, palabra):
        self.palabra = palabra
        self.letras_arriesgadas = set()
        self.intentos_restantes = 6

    def arriesgar(self, letra):
        if self.resultado() != "":
            raise EntradaInvalida("La partida ya terminó")
        if len(letra) > 1:
            raise EntradaInvalida("Solo se permite una letra por vez")
        if not letra.isalpha():
            raise EntradaInvalida("Solo se permiten letras")
        letra = letra.upper().translate(TABLA_ACENTOS)
        if letra in self.letras_arriesgadas:
            raise EntradaInvalida("Ya ingresaste esa letra")
        self.letras_arriesgadas.add(letra)
        if letra not in self.palabra:
            self.intentos_restantes -= 1

    def palabra_enmascarada(self):
        return " ".join(letra if letra in self.letras_arriesgadas else "_" for letra in self.palabra)

    def resultado(self):
        if all(letra in self.letras_arriesgadas for letra in self.palabra):
            return "Ganaste"
        if self.intentos_restantes == 0:
            return "Perdiste"
        return ""

    def palabra_revelada(self):
        if self.resultado() == "Perdiste":
            return self.palabra
        return ""

    def _letras_formateadas(self, letras):
        return " ".join(sorted(letras))

    def letras_usadas(self):
        return self._letras_formateadas(self.letras_arriesgadas)

    def letras_acertadas(self):
        return self._letras_formateadas(l for l in self.letras_arriesgadas if l in self.palabra)

    def letras_falladas(self):
        return self._letras_formateadas(l for l in self.letras_arriesgadas if l not in self.palabra)

    def fallos(self):
        return 6 - self.intentos_restantes