mapboxgl.accessToken = "pk.eyJ1IjoibW5lc3RlcyIsImEiOiJja3lxNDI0bTcwZzl6MzFtdmV3ZXFnOXYxIn0.Ac2EE1i0pj5Oc5cVzc6TOQ";
mapboxgl.accessToken = "pk.eyJ1IjoibW5lc3RlcyIsImEiOiJjbDg4N2g5NzAxZ2trM3VsaGNmOHN5aGlhIn0.zQD9s1KqSbE7kqCHctsE2g";

//const  MAX_ZOOM = 12;
//const  TILE_SIZE = 256;
//const extent = Math.sqrt(2) * 6371007.2;
//const resolutions = Array(MAX_ZOOM + 1)
//  .fill()
//  .map((_, i) => extent / TILE_SIZE / Math.pow(2, i - 1));
//
//const ARCTIC_LAEA = new L.Proj.CRS(
//  "EPSG:3575",
//  '+proj=laea +lat_0=0 +lon_0=0 +x_0=0 +y_0=0 +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
//  {
//    origin: [-extent, extent],
//    bounds: L.bounds(
//      L.point(-extent, extent),
//      L.point(extent, -extent)
//    ),
//    resolutions: resolutions
//  });

const ARCTIC_TILES_URL =
  "http://tiles.arcticconnect.ca/osm_3575/{z}/{x}/{y}.png";

//proj4.defs([['EPSG:3575','+proj=laea +lat_0=90 +lon_0=10 +x_0=0 +y_0=0 +datum=WGS84 +units=degrees +no_defs']])
//proj4.defs['EPSG:3575'] ='+proj=laea +lat_0=90 +lon_0=10 +x_0=0 +y_0=0 +datum=WGS84 +units=degrees +no_defs';



var map = L.map('map',{
//        crs: proj4('EPSG:3575'),
        minZoom: 2,
        maxZoom: 12,
        inertia: false,
        zoomControl:false}).setView([45.912753, 55.032194], 4);

var map2 = L.map('map2',{
//        crs: proj4('EPSG:3575'),
        minZoom: 2,
        maxZoom: 12,
        inertia: false,
        zoomControl:false}).setView([45.912753, 55.032194], 4);

var gl = L.mapboxGL({
        accessToken: "pk.eyJ1IjoibW5lc3RlcyIsImEiOiJja3lxNDI0bTcwZzl6MzFtdmV3ZXFnOXYxIn0.Ac2EE1i0pj5Oc5cVzc6TOQ",
        style: 'mapbox://styles/mnestes/cl6vl036h001015o37uzh86iy'
//        style: 'mapbox://styles/mnestes/cl56b4zk9001l14n7uldwz0x9'
    }).addTo(map);

var gm = L.mapboxGL({
        accessToken: "pk.eyJ1IjoibW5lc3RlcyIsImEiOiJja3lxNDI0bTcwZzl6MzFtdmV3ZXFnOXYxIn0.Ac2EE1i0pj5Oc5cVzc6TOQ",
        style: 'mapbox://styles/mnestes/cl6vl036h001015o37uzh86iy'
//        style: 'mapbox://styles/mnestes/cl56b4zk9001l14n7uldwz0x9'
    }).addTo(map2);
//var map = L.PolarMap.map('map',{
//    baseLayer: L.PolarMap.layer3573
//})

//L.tileLayer(ARCTIC_TILES_URL).addTo(map);
//L.tileLayer(ARCTIC_TILES_URL).addTo(map2);

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

L.control.mousePosition({position: 'bottomright'}).addTo(map2).addTo(map);
L.control.scale({position: 'bottomright'}).addTo(map);
L.control.measure({
  position: 'topright'
}).addTo(map)

map.setMaxBounds(L.latLngBounds(L.latLng(85, -180), L.latLng(-85, 180)));
map2.setMaxBounds(L.latLngBounds(L.latLng(85, -180), L.latLng(-85, 180)));
var popupCoord = L.popup();

var addedLayers = L.layerGroup().addTo(map)
var urlsImages = []
function addLayerOnMap(selected_product, coordinates){

    selected_product = selected_product.split('_')
    urlImg = 'http://127.0.0.1:8000/static/images/'+selected_product[0].replaceAll('-','')+"/"+selected_product[0].replaceAll('-','')+
    selected_product[1].replace(':', '')+"_"+selected_product[2]+"_"+selected_product[3]+".png"
    var img = L.imageOverlay(urlImg,
    L.latLngBounds([[coordinates[0][0],coordinates[0][1]],[coordinates[0][2], coordinates[0][3]]]))
    console.log('img ', img)
    addedLayers.addLayer(img)
}

function a(e){

    sendRequest('GET', "http://192.168.10.37:8000/api/product/value?date="+(document.getElementById("date_pick").value)+"&time="+"02:05:00"+"&level=100"+"&tp=GMP"+"&lat="+
    e.latlng.lat + "&lon=" + e.latlng.lng)
     .then((data)=>{
        console.log(data)
        L.popup().setLatLng([e.latlng.lat, e.latlng.lng]).setContent("Aboba").openOn(map)
     })
}
map.on("dblclick", a)
/**
 * Листенеры, для синхронного движения карт, осторожно, радиоактивно, лучше не смотреть
 * @ return None
 */
//function a(e){
//    //map2.panTo(map.getCenter())
//    map2.off('move', b);
//    map2.flyToBounds(map.getBounds())
//};
//map.on('move', a);
//
//function b(e){
//    //map2.panTo(map.getCenter())
//    map.off('move', a);
//    map.flyToBounds(map2.getBounds())
//};
//map2.on('move', b);
//
//function c(e){
//    map.on('move', a);
//}
//map.on('moveend', c);
//
//function d(e){
//    map2.on('move', b);
//}
//map2.on('moveend', d);