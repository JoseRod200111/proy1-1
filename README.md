# Proyecto #1 - Green Blog (HTML/CSS/JS puro)

Aplicación tipo blog hecha con HTML, CSS y JavaScript puro (sin frameworks). Consume la API pública DummyJSON para listar, buscar, ver detalle y crear publicaciones. Incluye navegación, estados de carga/error/empty, paginación, filtros, favoritos y eliminación simulada.

## Funcionalidades

- Listado de publicaciones con:
  - Título, resumen (preview), autor y botón "Ver más"
  - Paginación
- Detalle de publicación (GET por id)
- Búsqueda por texto (título/contenido)
- Filtros (mínimo 3):
  - Texto (búsqueda)
  - User ID (exacto)
  - Autor (nombre contiene)
- Crear publicación (POST) con validación en JavaScript:
  - Título mínimo 5 caracteres
  - Contenido mínimo 20 caracteres
  - User ID > 0
  - Muestra respuesta JSON del API en éxito y mensajes en error
- Favoritos (sección adicional):
  - Agregar desde detalle
  - Ver favoritos y vaciar
  - Persistencia local (localStorage)
- Eliminar:
  - Elimina del listado y detalle a nivel visual
  - Persistencia local (localStorage)

## API utilizada (DummyJSON)

Base URL: https://dummyjson.com

Endpoints:
- GET /posts?limit=&skip=         (listado paginado)
- GET /posts/search?q=&limit=&skip= (búsqueda por texto)
- GET /posts/{id}                (detalle)
- POST /posts/add                (crear post - respuesta simulada)
- GET /users?limit=200&skip=0    (usuarios para mostrar/filtrar autor por nombre)

Nota sobre la API:
- El POST /posts/add devuelve una respuesta simulada y el post no queda persistido en el listado real del API.

## Cómo ejecutar

Recomendado: usar servidor local (por módulos ES).
Opciones:
1) VS Code: extensión Live Server -> "Open with Live Server"
2) Python:
   - python -m http.server 5500
   - abrir http://localhost:5500

Luego abrir:
- index.html desde el servidor

## Estructura del proyecto

- index.html
- src/
  - css/
    - styles.css
  - js/
    - main.js
    - api/
      - postsApi.js
    - ui/
      - router.js
      - renderPosts.js
      - renderDetail.js
      - renderAdmin.js
      - renderForm.js (si aplica)
    - utils/
      - state.js
      - validators.js
      - storage.js
  - assets/ (capturas/video si se desea)

## Video demo

Pega aquí el enlace al video:
- Video: https://youtu.be/CBAlSKfRCUQ

## Autor

- JoseRod200111