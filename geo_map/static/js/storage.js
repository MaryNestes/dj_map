function saveLocalStorage(selected_array){
    localStorage.setItem('selected_products', selected_array)
}
function clearLocalStorage(){
    localStorage.clear()
}
function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}
function getLocalStorage(){
    var selected_array = localStorage.getItem('selected_products')
    if (selected_array!= ""){
        var date_list = []
        selected_array = selected_array.split(',')
        for(var i=0; i<selected_array.length; i++){
            list_selected_values.push(selected_array[i])
            $('#product-selector').append("<option selected value="+selected_array[i]+">"
                    +selected_array[i]+"</option>")
            date_list.push(selected_array[i].substring(0,10))
        }
        $('#product-selector').multiselect('rebuild');
        date_list = date_list.filter(onlyUnique)
        for(var i=0; i<date_list.length; i++){
            sendRequest('GET', "http://192.168.10.37:8000/api/product/time?date="+date_list[i])
            .then((data)=>{
                for(var j=0; j<data.length;j++){
                    coordinates_dictionary.set(String(date_list[i-1])+"_"+String(data[j].dt_time.substring(0,5)), Array(data[j].coord))
                }
            })
        }
    }
}
