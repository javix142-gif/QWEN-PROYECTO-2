# Albion Marketrelli 1.2.0

Objetivo de esta versión: mejorar el catálogo y las formas de búsqueda sin cambiar la fuente de precios.

## Fuentes del catálogo
- Nombres oficiales/localizados: `ao-data/ao-bin-dumps/formatted/items.json` (`EN-US` y `ES-ES`).
- Categorías y subcategorías: `ao-data/ao-bin-dumps/items.xml`, usando `shopcategory` y `shopsubcategory1..N`.

## Implementación
El archivo `albion-marketrelli-v1.2.0-overlay.zip` contiene únicamente los archivos modificados respecto de la base 1.1.x. GitHub Actions reconstruye la fuente, aplica la corrección nativa 1.1.1, descomprime este overlay, genera el catálogo actual desde las fuentes anteriores y compila la APK.

SHA-256 del overlay: `4866c1261821f677e6799a04a47360d1aca3f206280f1793756b2e9c2dd17d84`.

Incluye búsqueda bilingüe por el mismo `UniqueName`, visualización simultánea ES/EN, tier/encantamiento, explorador jerárquico de categorías, pruebas del generador, búsqueda y responsive.
