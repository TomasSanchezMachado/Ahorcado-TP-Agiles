# TP Integrador - Juego del Ahorcado

**Cátedra:** Metodologías Ágiles en el Desarrollo de Software — UTN FRRO

**Grupo:** 12

**Integrantes:** Esteban Karlen Aguirre; Gabriel Perlin; Tomás Sanchez Machado; Mateo Spertino

## Aplicación en producción

https://ahorcado-wgp8.onrender.com

Se despliega en Render automáticamente con cada push a `main` que pasa build, unit tests y acceptance tests; después el CI vuelve a correr los acceptance tests contra producción. El commit desplegado se ve en [`/version`](https://ahorcado-wgp8.onrender.com/version) y el historial de deploys en el environment `production` del repo.

> Plan free de Render: si nadie la usa por 15 minutos se duerme y el primer acceso tarda unos 50 segundos.

## Dashboard de calidad (SonarQube Cloud)

https://sonarcloud.io/project/overview?id=Ahorcado-TP-Agiles-Grupo12

Análisis estático de código automático con Quality Gate que corta el pipeline ante presencia de bugs, vulnerabilidades o caída de cobertura. Los reportes de cobertura generados por `pytest` se integran automáticamente en cada build.

## Descripción del producto

Desarrollo de una versión web del **Juego del Ahorcado**, construida aplicando prácticas ágiles de ingeniería que permitan evolucionar, probar e integrar el producto de manera continua.

El objetivo no es solo hacer que el juego funcione, sino experimentar cómo las prácticas de producto e ingeniería trabajan juntas: aprendizaje, feedback rápido, automatización, calidad y entrega continua.

### Visión del producto

- **Simple:** experiencia sencilla, fácil de comprender y utilizar.
- **Claro:** cada acción produce feedback visible y comprensible para el usuario.
- **Evolutivo:** la solución comienza con un alcance reducido y permite incorporar nuevos comportamientos apoyándose en buenas prácticas de diseño e ingeniería.

### Usuario objetivo

**Jugador casual:** persona que busca entretenimiento rápido y una interacción sencilla, sin necesidad de comprometerse con partidas largas. Puede tener distinta experiencia digital, por lo que el juego debe poder ser comprendido por personas con distinto nivel de manejo de tecnología.

### Objetivo

Crear una experiencia de juego simple, dinámica y confiable, con partidas cortas, reglas comprensibles y feedback inmediato. El producto debe permitir aprender del uso y evolucionar sin perder calidad.

## Story Mapping y MVP

El Story Map completo (User Journey, Features/Stories y cortes de Release) se encuentra documentado en:

https://miro.com/app/board/uXjVHwePskk=/?share_link_id=83546637908

### Alcance del MVP (Release 1)

El MVP se centra exclusivamente en poder **jugar una partida completa de punta a punta**, sin login, sin configuración y sin ranking:

- Entrar directo al juego sin necesidad de registrarme.
- Ver la palabra oculta representada con guiones.
- Ingresar una letra por vez.
- Validar que solo se ingresen letras.
- Descontar un intento ante letra incorrecta.
- Ver cantidad de intentos restantes.
- Validar letra repetida.
- Ver mensaje de resultado (Ganó/Perdió).
- Revelar la palabra completa si se pierde.
- Botón para jugar de nuevo.

Quedan fuera del MVP (Release 2 y 3): configuración de dificultad/idioma/categoría, pistas, dibujo progresivo del ahorcado, modo multijugador, sistema de puntaje, ranking, historial y login/registro real.

## Consignas técnicas del TP

- [x] **Story Mapping del producto** — primera versión + corte de MVP.
- [x] **Unit Tests con TDD** — lógica central desarrollada test-first.
- [x] **Single Repository** — todo el código en este repositorio.
- [x] **CI: compilación automática**
- [x] **CI: ejecución de Unit Tests**
- [x] **CI: Code Coverage**
- [x] **UI Web + Acceptance Tests** — al menos 4 escenarios automatizados (Cucumber/Gherkin + Selenium/Playwright o equivalente).
- [x] **CI/CD: deploy a producción** — repetible y trazable.
- [x] **CI: ejecución de Acceptance Tests** contra el ambiente desplegado.
- [x] **Análisis Estático de Código** (SonarQube/SonarCloud o equivalente).

## Stack tecnológico

- **Lenguaje:** Python
- **Testing (Unit Tests):** pytest
- **Web:** Flask + Gunicorn
- **Acceptance Tests:** pytest-bdd (Gherkin) + Playwright
- **CI/CD:** GitHub Actions + Render
- **SonarQube Cloud:** Análisis estático de código y Quality Gate.

## Cómo ejecutar el proyecto

**1. Instalar dependencias:**
`pip install -r requirements.txt`
`playwright install chromium`

**2. Levantar la aplicación web:**
`python -m flask --app src/web/app run`
La aplicación estará disponible en http://127.0.0.1:5000/

**3. Correr las pruebas:**
Para los Unit Tests (lógica de dominio): `python -m pytest tests/`
Para los Acceptance Tests (comportamiento UI): `python -m pytest features/`

## Funcionalidades Extra (Aprobación Directa)

- [x] Jugar de nuevo (HU-10, CA-1 y CA-3).
- [x] Palabra al azar de una lista, distinta de la anterior (HU-10, CA-2).
- [x] Soporte de acentos y la letra ñ (HU-11).
- [x] Letras usadas, acertadas y falladas (HU-15).

## Licencia

Trabajo práctico académico — UTN FRRO.
