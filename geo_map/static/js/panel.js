/**
 * Заполнение date-picker текущей датой при загрузке страницы
 * @ return None
 */
function current_date(){
    const date = document.getElementById("date_pick");
    var today = new Date();
    date.value = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' +
    String(today.getDate()).padStart(2, '0');
    getDbAvailableDateTime(date.value);
    date.addEventListener('change', function(){
        getDbAvailableDateTime(date.value);
    })
}
