mapboxgl.accessToken = "pk.eyJ1IjoibW5lc3RlcyIsImEiOiJja3lxNDI0bTcwZzl6MzFtdmV3ZXFnOXYxIn0.Ac2EE1i0pj5Oc5cVzc6TOQ";

var map = L.map('map',{
        minZoom: 2,
        maxZoom: 12,
        zoomControl:false}).setView([53.912753, 86.032194], 4);
var gl = L.mapboxGL({
        accessToken: "pk.eyJ1IjoibW5lc3RlcyIsImEiOiJja3lxNDI0bTcwZzl6MzFtdmV3ZXFnOXYxIn0.Ac2EE1i0pj5Oc5cVzc6TOQ",
        style: 'mapbox://styles/mnestes/cl6vl036h001015o37uzh86iy'
//        style: 'mapbox://styles/mnestes/cl56b4zk9001l14n7uldwz0x9'
    }).addTo(map);

/**
 * Функция смены подложки
 * @ return None
 */
function change_map(style_map){
    map.removeLayer(gl)
    gl = L.mapboxGL({
        accessToken: "pk.eyJ1IjoibW5lc3RlcyIsImEiOiJja3lxNDI0bTcwZzl6MzFtdmV3ZXFnOXYxIn0.Ac2EE1i0pj5Oc5cVzc6TOQ",
        style: style_map
         }).addTo(map);
}

/**
 * Подгрузка satellite подложки
 * @ return None
 */
function get_satellite_map(){
    change_map('mapbox://styles/mnestes/cl6vl036h001015o37uzh86iy')
}

/**
 * Подгрузка схематичной подложки
 * @ return None
 */
function get_scheme_map(){
    change_map('mapbox://styles/mnestes/cl56b4zk9001l14n7uldwz0x9')
}

/**
 * Очистить  map-контейнер
 * @ return None
 */
function clear_map(){
    map.removeLayer(gl)
}

L.control.mousePosition({position: 'bottomright'}).addTo(map);
L.control.scale({position: 'bottomright'}).addTo(map)
L.control.measure({
  position: 'topright'
}).addTo(map)
map.setMaxBounds(L.latLngBounds(L.latLng(85, -180), L.latLng(-85, 180)));



var popupCoord = L.popup();
