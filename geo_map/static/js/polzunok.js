var list_pressure = ["100","200","300","400","500","700","850","925","1000"];
var time_values = [];
function polzunok(id_polzunok, id_out){
$("#"+id_out).text("100");
$( "#"+id_polzunok ).slider({
  animate: "slow",
  range: "min",
  value: 0,
  step:1,
  min:0,
  max:list_pressure.length-1,
  slide: function(event,ui){
    $("#"+id_out).text(list_pressure[ui.value]);
    getAvailableProducts(document.getElementById("date_pick").value, $("#"+"result-time_slider").text())
  }
});
}

function time_slider(id_slider, id_text_out, time_list = null){
    if (time_list == null){
        time_list = []
    }
    $("#"+id_slider ).slider({
        animate: "slow",
        range: "min",
        value: 0,
        step:1,
        min:0,
        max:time_list.length-1,
        slide:function(event,ui){
            $("#"+id_text_out).text(time_list[ui.value]);
            getAvailableProducts(document.getElementById("date_pick").value, $("#"+"result-time_slider").text())
        },
        create:function(event,ui){
            $("#"+id_text_out).text(time_list[$( "#time_slider" ).slider( "value" )]);
        }
    })
    return time_list
}