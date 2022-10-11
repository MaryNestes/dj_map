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
const LayersDictionary = new Map()
function get_json(request_str, id_chbox){
        sendRequest('GET', request_str)
        .then((data) => {
            var current_bounds_screen = map.getBounds()
            var layer = L.geoJSON(data,{
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
              if (LayersDictionary.has(id_chbox)){
                   var json_layers = LayersDictionary.get(id_chbox);
                   json_layers.push(layer);
              }
              else{
                   var json_layers = [];
                   json_layers.push(layer);
                   LayersDictionary.set(id_chbox, json_layers);
              }
        })
}

var list_selected_values = []
function checked_tracking(select_list){
    list_selected_values = select_list
    saveLocalStorage(select_list)
    for (var i=0; i<select_list.length; i++){
        addLayerOnMap(select_list[i], coordinates_dictionary.get(select_list[i].substring(0,16)))
    }
}

function repetition_tracking(append_option){
    for (var i=0; i<list_selected_values.length; i++){
        if(append_option==list_selected_values[i]){
            return true
        }
    }
    return false
}

function getAvailableProducts(date, dt_time){
    sendRequest('GET', "http://192.168.10.37:8000/api/product/type?date="+date+"&time="+dt_time+"&level="+
    $("#"+"result-pressure").text())
    .then((data)=>{
        var parentElement = document.getElementById("product-selector")
        parentElement.innerHTML = ''
        for(var i=0; i<list_selected_values.length; i++){
            $('#product-selector').append("<option selected value="+list_selected_values[i]+">"
                +list_selected_values[i]+"</option>")
        }
        for(var i=0; i<data.length;i++){
            if(!repetition_tracking(date+"_"+($("#"+"result-time_slider").text()).substring(0,5)+"_"+data[i].name+"_"+
                 ($("#"+"result-pressure").text()))){
                $('#product-selector').append("<option value="+date+"_"+($("#"+"result-time_slider").text()).substring(0,5)+"_"+data[i].name+"_"+
                ($("#"+"result-pressure").text())+">"
                +date+"_"+($("#"+"result-time_slider").text()).substring(0,5)+"_"+data[i].name+
                "_"+($("#"+"result-pressure").text())+"</option>")
            }
        }
        $('#product-selector').multiselect('rebuild');
    })
}

const coordinates_dictionary = new Map()
function getAvailableTime(date){
    var list_data_values = []
    sendRequest('GET', "http://192.168.10.37:8000/api/product/time?date="+date)
    .then((data)=>{
        for (var i=0; i<data.length;i++){
                list_data_values.push(String(data[i].dt_time))
                coordinates_dictionary.set(date+"_"+String(data[i].dt_time.substring(0,5)), Array(data[i].coord))
        }
        $("#"+"time_slider").slider("destroy")
        time_slider("time_slider","result-time_slider", list_data_values)
        getAvailableProducts(date, list_data_values[$( "#time_slider" ).slider( "value" )])
    })
}


function getDbAvailableDateTime(date){
//        clearLocalStorage()
        getAvailableTime(date)
}


/**
 * Листенер состояния чек-бокса на отображение городов
 * @ return None
 */
const ch_box_test = document.getElementById("test_json");
ch_box_test.addEventListener('change', function(){
    if(ch_box_test.checked){
        getDbAvailableDateTime("2022-09-26")
    }
    else{
        clear_json(ch_box_test.id)
    }
})
const ch_box_towns = document.getElementById("towns");
ch_box_towns.addEventListener('change', function(){
    if(ch_box_towns.checked){
        draw_json(ch_box_towns.id)
    }
    else{
        clear_json(ch_box_towns.id)
    }
})

/**
 * Функция очистки отображения json-объектов
 * @ return None
 */
function clear_json(id_chbox){
        var getLayers = LayersDictionary.get(id_chbox)
        for (var i = 0; i < getLayers.length; i++){
            map.removeLayer(getLayers[i])
        }
        LayersDictionary.delete(id_chbox)
}

/**
 * Функция вызова json файлов городов
 * @ return None
 */
function draw_json(id_chbox){
    if (map.getZoom() <= 6){
        get_json('http://127.0.0.1:8000/static/JsonData/oblcity_small_zoom.json',id_chbox)
    }
    if ((map.getZoom() >= 7) && (map.getZoom() <= 8)){
        get_json('http://127.0.0.1:8000/static/JsonData/oblcity_small_zoom.json',id_chbox)
        get_json('http://127.0.0.1:8000/static/JsonData/town_middl_zoom.json',id_chbox)
    }
    if (map.getZoom() >= 9){
        get_json('http://127.0.0.1:8000/static/JsonData/oblcity_small_zoom.json',id_chbox)
        get_json('http://127.0.0.1:8000/static/JsonData/town_middl_zoom.json',id_chbox)
        get_json('http://127.0.0.1:8000/static/JsonData/locality_big_zoom.json',id_chbox)
    }
}

/**
 * Листенер движения по карте, вызывает функцию получения json-файла в зависимости от текущего разрешения карты
 * @ return None
 */
var lst = map.on('moveend', function (e){
    if (ch_box_towns.checked){
        clear_json(ch_box_towns.id)
        draw_json(ch_box_towns.id)
    }
})

/**
 * Запрос
 */
  async function sendRequest(method, url) {
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