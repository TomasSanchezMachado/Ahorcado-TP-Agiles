from pytest_bdd import scenarios, when, then, parsers

scenarios("../jugar_de_nuevo.feature")

@then(parsers.parse('se ve el botón "{texto}"'))
def entonces_ve_boton(page, texto):
    assert page.get_by_test_id("jugar-de-nuevo").text_content(timeout=2000) == texto

@when(parsers.parse('el jugador aprieta el botón "{texto}"'))
def cuando_aprieta_boton(page, texto):
    page.get_by_test_id("jugar-de-nuevo").click()

@then("no se ve ninguna letra revelada")
def entonces_no_hay_letras_reveladas(page):
    assert set(page.get_by_test_id("word").text_content(timeout=2000)) <= {"_", " "}

@then("no se ve ningún mensaje de resultado")
def entonces_no_hay_resultado(page):
    assert page.get_by_test_id("resultado").text_content(timeout=2000) == ""

def _palabra_en_sesion(page, app):
    cookie = next(c for c in page.context.cookies() if c["name"] == "session")
    _, datos = app.session_interface.get_signing_serializer(app).loads_unsafe(cookie["value"])
    return datos["palabra"]

@then(parsers.parse('la palabra de la partida no es "{palabra}"'))
def entonces_palabra_distinta(page, app, palabra):
    assert _palabra_en_sesion(page, app) != palabra

@then("la palabra de la partida no aparece en la URL")
def entonces_palabra_no_en_url(page, app):
    assert _palabra_en_sesion(page, app) not in page.url.upper()
