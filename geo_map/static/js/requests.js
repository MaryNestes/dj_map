//Requests
const requestURL='http://localhost:8000/CO?'+new URLSearchParams({ data: 1 }).toString();


/**
 * Опции для json-маркеров
 */
var geojsonMarkerOptions = {
    radius: 3,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8,
};
/**
 * Опции для надписей Point-объектов json
 */
var popupOptions = {
    maxWidth: 100,
    permanent: 1,
};
/**
 * Отправляет запрос на получение json файла, с последующим добавлением
 * на карту маркера с подписью (если json-объект имеет геометрию точки), с добавением на карту только тех значений,
 * что попадают в рамку экрана.
 * @ {String} request_str Адрес запроса json-файла
 * @ return None
 */
var json_objects = L.layerGroup();
function get_json(request_str){
        sendRequest('GET', request_str)
        .then((data) => {
            var current_bounds_screen = map.getBounds()
            var json_layer = L.geoJSON(data,{
                pointToLayer: function (feature, latlng) {
                    if ((feature.geometry.coordinates[0]<current_bounds_screen._northEast.lng) &&
                        (feature.geometry.coordinates[0]>current_bounds_screen._southWest.lng) &&
                        (feature.geometry.coordinates[1]<current_bounds_screen._northEast.lat) &&
                        (feature.geometry.coordinates[1]>current_bounds_screen._southWest.lat)){
                        var marker = L.circleMarker(latlng, geojsonMarkerOptions);
                        marker.bindTooltip(feature.properties.name, popupOptions).openTooltip(latlng);
                        return marker;
                    }
                }
            }).addTo(map);
            json_objects.addLayer(json_layer)
        })
}

/**
 * Листенер состояния чек-бокса на отображение городов
 * @ return None
 */
const ch_box = document.getElementById("towns");
ch_box.addEventListener('change', function(){
    if(ch_box.checked){
        draw_json()
    }
    else{
        clear_json()
    }
})

/**
 * Функция очистки отображения json-объектов
 * @ return None
 */
function clear_json(){
        json_objects.eachLayer(function (layer){
        map.removeLayer(layer)
        json_objects.removeLayer(layer)
        })
}

/**
 * Функция вызова json файлов городов
 * @ return None
 */
function draw_json(){
    if (map.getZoom() <= 6){
        get_json('http://127.0.0.1:8000/static/JsonData/oblcity_small_zoom.json')
    }
    if ((map.getZoom() >= 7) && (map.getZoom() <= 8)){
        get_json('http://127.0.0.1:8000/static/JsonData/oblcity_small_zoom.json')
        get_json('http://127.0.0.1:8000/static/JsonData/town_middl_zoom.json')
    }
    if (map.getZoom() >= 9){
        get_json('http://127.0.0.1:8000/static/JsonData/oblcity_small_zoom.json')
        get_json('http://127.0.0.1:8000/static/JsonData/town_middl_zoom.json')
        get_json('http://127.0.0.1:8000/static/JsonData/locality_big_zoom.json')
    }
}

/**
 * Листенер движения по карте, вызывает функцию получения json-файла в зависимости от текущего разрешения карты
 * @ return None
 */
var lst = map.on('moveend', function (e){
    clear_json()
    if (ch_box.checked){
        draw_json()
    }
})

function sendRequest(method, url) {
  const headers = {
    'Content-Type': 'application/json'
  }

  return fetch(url, {
    method: method,
    headers: headers
  }).then(response => {
    if (response.ok) {
      return response.json()
    }

    return response.json().then(error => {
      const e = new Error('Что-то пошло не так')
      e.data = error
      throw e
    })
  })
}