/** Valor mínimo medido de partículas  */
var min_value = 2;
/** Valor maximo medido de partículas  */
var max_value = 109;

// Generación de los colores
var base_triad = [32, 142, 0];
var end_triad = [106, 0, 30];
colors = red_gradient(base_triad, end_triad, max_value);
console.log(colors.length)



// Generando el año
var yearSelector = document.getElementById('year-selector');
// Generando fechas disponibles para la selección
var dateSelector = document.getElementById('day-selector');
// Selector del boton para generar animacion.
var button = document.getElementById("btn");
// Boton para finalizar animación
var button_stop_animation = document.getElementById("btn-stop");

/** Generando el mapa. */
var map;
/** Capas donde se colocarán los circulos. */
var circleLayer;


// Arreglo de toda la información coleccionada.
var data;
// Arreglo de intensidad de colores.
var colors;

for (let year = 2003; year < 2024; year++) {
    yearSelector.add(new Option(`${year}`));
}

/** Año seleccionado por el usuario. */
var selectedYear = "2003";
/** Fecha seleccionada por el usuario  */
var selectedDate = "17/08/2003";

// Escuchando los cambios en el selector de año
dateSelector.addEventListener('change', () => {

    selectedDate = dateSelector.value;

    /** Función para actualizar la información de los marcadores de intensidad */
    updateCircles(data, selectedDate ,colors, map)
})

// Escuchando el cambio de la selección del año.
yearSelector.addEventListener("change", () => {
    selectedYear = yearSelector.value;

    updateDates(data, selectedYear);
})

// Escuchando los cambios del selector de generar la animación.
button.addEventListener("click", generateAnimation)
// Escuchando los cambios del selector de generar la animación.
button.addEventListener("click", generateAnimation)
// Escuchando los cambios del selector de generar la animación.
button_stop_animation.addEventListener("click", stopAnimation)

/** JSON que contiene la información del CSV de las particulas PM2.5 */
let merged_json;

/** Función para obtener el objeto del JSON. */
async function getJSON() {
    try {
        var response = await fetch('./merged.json');
        merged_json = await response.json();
    } catch (error) {
        console.log("Error al recuperar el JSON", error);
    }
}

/**  Esta función genera un gradiente sobre la recta que une dos puntos en un espacio RGB */
function red_gradient(from, to, n) {
    let values = new Array();
    let divisor = n > 1 ? n - 1 : 1;
    for(let i = 0; i < n; i++) {
        let proportion = i / divisor;
        let R = Math.floor(from[0] + (to[0] - from[0]) * proportion).toString(16).padStart(2, '0');
        let G = Math.floor(from[1] + (to[1] - from[1]) * proportion).toString(16).padStart(2, '0');
        let B = Math.floor(from[2] + (to[2] - from[2]) * proportion).toString(16).padStart(2, '0');
        values.push("#" + R + G + B)
    }
    return values;
}

/** Función principal. */
async function main() {

    // Cargando la información de json.
    await getJSON();

    // Creando el mapa al cual añadiremos los puntos de las coordenadas de las mediciones.
    map = L.map('map', {
        center: [19.4394237,-99.143898],
        zoom: 11
    }).addLayer(
        new L.TileLayer("https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png")
    );

    circleLayer = L.layerGroup();

    // Consiguiendo los valores.
    data = merged_json.data;

    // Actualizando las fechas seleccionables.
    updateDates(data, selectedYear);
    
    // Actualizando las áreas circulares mostradas.
    updateCircles(data, selectedDate ,colors, map);
}


/** Ejecución de la función principal.  */
main();

function stopAnimation() {
    window.location.reload();
}

/** Función para generar la animación del las mediciones */
async function generateAnimation() {

    // Valores iniciales.
    selectedDate = data[0][0];

    // Se busca generar un iterador por todas las actualizaciones.

    // Limpiamos todo lo que se habia generado en el mapa.
    cleanMap();

    for await (let item of data) {

        selectedDate = item[0];

        data.forEach((data_item) => {
            if (data_item[0] == selectedDate) {
                circleLayer.addLayer(
                    L.circle([data_item[7], data_item[6]], {
                        color: colors[data_item[3]],
                        fillOpacity: 0.5,
                        radius: 2_500
                    })
                ).addTo(map);
            }
        })
        
        
        // Hacemos que el siguiente paso no sea inmediato.
        await async_sleep(5_0)
        
        // Reiniciamos el mapa.
        cleanMap()
    }
}

/** Función para limpiar el mapa */
function cleanMap() {
    circleLayer.removeFrom(map);
    circleLayer = undefined;
    circleLayer = L.layerGroup();    
}

/** Función para actualizar las fechas que se muestran en el selector. */
function updateDates(data_list, selected_year) {
    
    dateSelector.innerHTML = '';
    cleanMap()

    data_list.forEach(item => {
        var dateItem = item[0];
        if (dateItem.includes(selected_year)) {
            var option = document.createElement('option');
            option.value = dateItem;
            option.label = dateItem;
            dateSelector.appendChild(option)
        }
    });
}

/** Función para actualizar la información de los marcadores de intensidad */
function updateCircles(data_list, selected_date, colors, map) {
    
    cleanMap()

    data_list.forEach((data_item) => {
        if (data_item[0] == selected_date) {
                circleLayer.addLayer(
                    L.circle([data_item[7], data_item[6]], {
                        color: colors[data_item[3]],
                        fillOpacity: 0.5,
                        radius: 2_500
                    })
                ).addTo(map);

                // L.circle([data_item[7], data_item[6]], {
                //     color: colors[data_item[3]],
                //     fillOpacity: 0.5,
                //     radius: 1500
                // }).addTo(map);
            }
        })
    // )
}


async function async_sleep(ms) {
    return new Promise((resolve, _) => {
        setTimeout(resolve, ms);
    })
}