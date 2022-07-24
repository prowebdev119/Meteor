clickFirstRow = function (event) {
var index,
table = document.getElementById("tblShippingDocket");
//for(var i = 1; i < table.rows.length; i++){
  table.rows[1].click();


};

clickFittingFirstRow = function (event) {
var index,
table = document.getElementById("fittingscanlist");
//for(var i = 1; i < table.rows.length; i++){
  table.rows[1].click();

};
$('div.dataTables_filter input').addClass('form-control form-control-sm');
