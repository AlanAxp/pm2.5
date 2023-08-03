# Mapa de partículas contaminantes.

Para inicar el servidor local se recomienda usar el liveserver de visual studio code.

# Generación del archivo JSON

El JSON usado en el `index.js` se obtiene de ejecutar

```bash
    python3 __init__.py,
```

el cual genera un arcchivo csv y otro JSON para poder visualizar la información de las particulas cargadas.

Para el cual se requiere de la librería de pandas.

```bash
    pip3 install pandas
```

Como recomendación extra, se sugiere realizar este proceso en un ambiente virtual de python3.


```bash
    python3 -m venv termodinamica
```

El cual se inicializa con el comando

```bash
    source termodinamica/bin/activate
```

# Levantando el servidor

Para desplegar el mapa, se necesita instalar el plugin de `Live server` en Visual Studio Code y una vez sobre el archivo `csv_read.html` ejecutar el comando `Live Server: Open with Live Server`.

Posteriormente en el navegador ir hacia la ruta `http://localhost:5500/csv_read.html`
