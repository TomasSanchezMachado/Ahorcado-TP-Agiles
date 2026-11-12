import os

from flask import Flask, redirect, render_template, request, session

from src.domain.ahorcado import Ahorcado, EntradaInvalida, elegir_palabra

def create_app():
    app = Flask(__name__, template_folder="templates", static_folder="static")
    app.secret_key = os.environ.get("SECRET_KEY", "dev")

    def _iniciar_partida(palabra):
        session["palabra"] = palabra
        session["letras"] = []

    @app.route("/")
    def index():
        if "word" in request.args:
            _iniciar_partida(request.args["word"])
            return redirect("/")
        if "palabra" not in session:
            _iniciar_partida("GATO")
        juego = Ahorcado(session["palabra"])
        for letra in session["letras"]:
            juego.arriesgar(letra)
        error = ""
        if "letra" in request.args:
            try:
                juego.arriesgar(request.args["letra"])
                session["letras"] = session["letras"] + [request.args["letra"]]
            except EntradaInvalida as e:
                error = str(e)
        return render_template("index.html", word=juego.palabra_enmascarada(), error=error, intentos=juego.intentos_restantes, resultado=juego.resultado(), palabra_revelada=juego.palabra_revelada(), letras_usadas=juego.letras_usadas(), letras_acertadas=juego.letras_acertadas(), letras_falladas=juego.letras_falladas(), fallos=juego.fallos())

    @app.route("/nueva")
    def nueva():
        anterior = session.get("palabra")
        session.clear()
        _iniciar_partida(elegir_palabra(anterior))
        return redirect("/")

    @app.route("/version")
    def version():
        return os.environ.get("RENDER_GIT_COMMIT", "")

    return app

# El botón de encendido
if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)