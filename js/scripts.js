(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {

        const grid = new Muuri('.grid', {
            // Initial item elements
            items: '*',

            // Default show animation
            showDuration: 300,
            showEasing: 'ease',

            // Default hide animation
            hideDuration: 300,
            hideEasing: 'ease',

            // Item's visible/hidden state styles
            visibleStyles: {
                opacity: '1',
                transform: 'scale(1)'
            },
            hiddenStyles: {
                opacity: '0',
                transform: 'scale(0.5)'
            },

            // Layout
            layout: {
                fillGaps: false,
                horizontal: false,
                alignRight: false,
                alignBottom: false,
                rounding: false
            },
            layoutOnResize: 150,
            layoutOnInit: true,
            layoutDuration: 300,
            layoutEasing: 'ease',

            // Sorting
            sortData: null,

            // Drag & Drop
            dragEnabled: true, // modifique
            dragContainer: null,
            dragHandle: null,
            dragStartPredicate: {
                distance: 0,
                delay: 0
            },
            dragAxis: 'xy',
            dragSort: true,
            dragSortHeuristics: {
                sortInterval: 100,
                minDragDistance: 10,
                minBounceBackAngle: 1
            },
            dragSortPredicate: {
                threshold: 50,
                action: 'move',
                migrateAction: 'move'
            },
            dragRelease: {
                duration: 300,
                easing: 'ease',
                useDragContainer: true
            },
            dragCssProps: {
                touchAction: 'none',
                userSelect: 'none',
                userDrag: 'none',
                tapHighlightColor: 'rgba(0, 0, 0, 0)',
                touchCallout: 'none',
                contentZooming: 'none'
            },
            dragPlaceholder: {
                enabled: false,
                createElement: null,
                onCreate: null,
                onRemove: null
            },
            dragAutoScroll: {
                targets: [],
                handle: null,
                threshold: 50,
                safeZone: 0.2,
                speed: Muuri.AutoScroller.smoothSpeed(1000, 2000, 2500),
                sortDuringScroll: true,
                smoothStop: false,
                onStart: null,
                onStop: null
            },

            // Classnames
            containerClass: 'muuri',
            itemClass: 'muuri-item',
            itemVisibleClass: 'muuri-item-shown',
            itemHiddenClass: 'muuri-item-hidden',
            itemPositioningClass: 'muuri-item-positioning',
            itemDraggingClass: 'muuri-item-dragging',
            itemReleasingClass: 'muuri-item-releasing',
            itemPlaceholderClass: 'muuri-item-placeholder'
        });

        // que las imagenes carguen juntas al cargar todas
        window.addEventListener("load", () => {
            grid.refreshItems().layout();

            // añadir clase imagenes-cargadas para darle opacidad a las imagenes
            document.querySelector("#grid").classList.add("imagenes-cargadas");

            // filtrar imagenes por categorías:
            const enlacesCategorias = document.querySelectorAll(".categorias a");
            //console.log(enlacesCategorias);

            enlacesCategorias.forEach((a) => {
                a.addEventListener("click", (e) => {
                    // quita por ejemplo el # , el comportamiento por defecto
                    e.preventDefault();

                    // e.target devuelve el enlace que esta desatando el evento
                    //console.log(e.target); 

                    // quitar activo:
                    const enlaceActivo = document.querySelector(".activo");
                    enlaceActivo.classList.remove("activo");
                    // o en una linea
                    // document.querySelector(".activo").classList.remove("activo");

                    // colocar activo al clickeado
                    e.target.classList.add("activo");

                    // filtrar
                    const categoria = e.target.dataset.categoria;
                    //console.log(categoria);

                    grid.filter(`[data-categoria="${categoria}"]`);

                    if (categoria === "todos") {
                        grid.filter(`*`);
                    }
                    // o en una linea
                    // categoria === "todos" ? grid.filter(`*`) : grid.filter(`[data-categoria="${categoria}"]`);

                })
            });

            // filtrado para búsquedas:
            // acceder a la barra de busqueda
            const buscador = document.querySelector("#buscador");
            const btnBuscar = document.querySelector("#btn-buscar");

            // que busque mientras escribe
            buscador.addEventListener("input", (e) => {
                const valor = e.target.value;
                //console.log(valor);
                //console.log(buscador.value);

                //buscador.value ? grid.filter(`[data-etiqueta="${buscador.value}"]`) : grid.filter("*");

                grid.filter(function(item) {
                    return item.getElement().dataset.etiqueta.includes(`${valor}`);
                });

            })

            // si utiliza el boton de buscar
            btnBuscar.addEventListener("click", (e) => {
                e.preventDefault();
                //console.log(buscador.value);
                /* grid.filter(`[data-etiqueta="${buscador.value}"]`); */

                grid.filter(function(item) {
                    return item.getElement().dataset.etiqueta.includes(`${buscador.value}`);
                });

            })

        })

        /* agrandar imagen al hacer doble click */
        const imagenes = document.querySelectorAll(".item-content img");
        const overlay = document.querySelector(".overlay");

        imagenes.forEach((img) => {
            img.addEventListener("dblclick", (e) => {

                const contenedorImg = document.querySelector(".contenedor-img img");
                const figCaptionImg = document.querySelector(".contenedor-img figcaption");

                overlay.classList.add("overlay-activo");
                //console.log(`hiciste click en: ${img.getAttribute("alt")}`);

                contenedorImg.setAttribute("src", `${img.getAttribute("src")}`);
                contenedorImg.setAttribute("alt", `${img.getAttribute("alt")}`);
                figCaptionImg.innerHTML = img.parentNode.parentNode.parentNode.dataset.descripcion;

                document.querySelector(".mapa-contenido").classList.add("elemento-atras");

            })
        });

        /* btn de cerrar */
        document.querySelector(".btn-cerrar").addEventListener("click", () => {
            overlay.classList.remove("overlay-activo");
            document.querySelector(".mapa-contenido").classList.remove("elemento-atras");
        })

        /* cerrar al hacer doble click en el overlay */
        overlay.addEventListener("dblclick", () => {
            overlay.classList.remove("overlay-activo");
            document.querySelector(".mapa-contenido").classList.remove("elemento-atras");
        })

        /* cerrar al hacer click en la parte oscura */
        overlay.addEventListener("click", (e) => {
            //console.log(e.target.id);
            if (e.target.id === "overlay") {
                overlay.classList.remove("overlay-activo");
                document.querySelector(".mapa-contenido").classList.remove("elemento-atras");
            }
        })

        /* añadir title a todos los items */
        const itemsTotales = document.querySelectorAll(".item");
        itemsTotales.forEach(item => {
            item.setAttribute("title", "Haga doble click para agrandar imagen");
        })

    });


    /* MAPA */
    /* const map = L.map('map').setView([51.505, -0.09], 13); */
    let map = L.map('map').setView([-25.681703291781997, -54.44664261809172], 13);

    const btnUbicacion = document.querySelector(".mapa button");
    const infoMapa = document.querySelector(".info-mapa");

    btnUbicacion.addEventListener("click", () => {
        infoMapa.classList.remove("oculto");

        if (navigator.geolocation) {

            navigator.geolocation.getCurrentPosition(success, error, geo_options);

        } else {
            infoMapa.classList.add("info-mapa-error");
            infoMapa.innerHTML = "No permitió acceder a locación!";
        }

        function success(position) {
            const latitud = position.coords.latitude;
            const longitud = position.coords.longitude;
            const exactitud = position.coords.accuracy;

            infoMapa.classList.add("info-mapa-correcto");
            infoMapa.innerHTML = "Su latitud es: " + latitud + " y su longitud es: " + longitud + " La exactitud: " + exactitud;
            map.setView([latitud, longitud], 13);

            L.marker([latitud, longitud]).addTo(map)
                .bindPopup('Esta es tu ubicación.')
                .openPopup()
                .bindTooltip("my tooltip text").openTooltip();
        }

        function error(e) {
            infoMapa.innerHTML = "Imposible dar su locación: " + e.message;
            infoMapa.classList.add("info-mapa-error");
            infoMapa.innerHTML = "No permitió acceder a locación!";
        }

        var geo_options = {
            // por defecto false, si es true, utiliza GPS
            enableHighAccuracy: true,

            // determina si ha de ir a la cache a buscar última ubicación. tiempo que ha tenido que pasar desde la última localizacion para obtener una nueva o para ir a la cache.
            // es decir que si se encuentra en la cache con una ubicación obtenida antes de 30 segundos,que la obtenga.
            maximumAge: 30000, // en watchPosition determina cada cuanto pide ubicacion.

            // tiempo en milisegundos para llevar a cabo la localización, si no se obtiene devuelve TIMEOUT. 27 seg
            timeout: 27000
        };

    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.marker([-25.681703291781997, -54.44664261809172]).addTo(map)
        .bindPopup('Cataratas del Iguazú.<br> <a href="https://es.wikipedia.org/wiki/Cataratas_del_Iguaz%C3%BA" target="_blank">Más info</a>.')
        .openPopup();


    /* modo oscuro */
    const check = document.querySelector("#check");
    check.addEventListener("input", (e) => {
        /* console.log(check.checked); */
        check.checked ? check.setAttribute("title", "Cambiar a modo normal") : check.setAttribute("title", "Cambiar a modo día");
    })

})();