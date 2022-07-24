addBillRow = function (rowCount) {
  var $componentTB = $("#component_tb"),
        $firstTRCopy = $componentTB.children('tr').first().clone(),
      click_count = 0;

  //$('#new_create_btn').on( 'click', function () {
    //$('#component_tb tbody>tr:last').clone(true).insertAfter('#component_tb tbody>tr:last');
  //  var rowCount = $('#component_tb tbody>tr').length;
    click_count++;
    for (var i = 0; i < rowCount; i++) {
    var $clones 	= $('#component_tb tbody>tr'),
             num 		= $clones.size() + 1,
             next_num 	= parseInt($clones.last().find('input[name^="prod_id"]').val()) + 1,
             POJob_num 	= ($clones.last().find('input[name^="POJobno"]').val()),
             PODepartment_num 	= ($clones.last().find('input[name^="PODepartment"]').val()),
             job_name 	= ($clones.last().find('input[name^="POJobname"]').val()),
             NonPoJob_name 	= ($clones.last().find('input[name^="jobname"]').val()),
             NonPoJob_No 	= ($clones.last().find('select[name^="jobno"]').val()),
          $template 	= $clones.first(),
          newSection 	= $template.clone().attr('id', 'pq_entry_'+num),
          prod_id 	= 'prod_id_'+num,
          ProdName = 'ProdName_'+num,
          AccName = 'AccName_'+num,
          productdesc = 'productdesc_'+num;
          Ordered = 'Ordered_'+num;
          productname = 'productname_'+num;
          UnitPrice = 'UnitPrice_'+num;
          LineTaxTotal = 'LineTaxTotal_'+num;
          Region = 'Region_'+num;
          TotalAmt = 'TotalAmt_'+num;
          department = 'department_'+num;
          PODepartment = 'PODepartment_'+num;
          //person_lname = 'person_lname_'+num;
        //  $componentTB.append($firstTRCopy.clone());

        newSection.removeAttr('data-saved');
        newSection.find('input[type="text"]').val('');
        newSection.find('input[name^="prod_id"]').attr({
        'name': prod_id
      }).val(next_num);

      newSection.find('input[name^="productdesc_1"]').attr({
      'name': productdesc
      }).val('');

      newSection.find('input[name^="Ordered_1"]').attr({
      'name': Ordered
      }).val('');
      newSection.find('input[name^="UnitPrice_1"]').attr({
      'name': UnitPrice
      }).val('');
      newSection.find('select[name^="LineTaxTotal_1"]').attr({
      'name': LineTaxTotal
      }).val('');
      newSection.find('input[name^="Region_1"]').attr({
      'name': Region
      }).val('');
      newSection.find('input[name^="TotalAmt_1"]').attr({
      'name': TotalAmt
      }).val('');

      newSection.find('select[name^="ProdName"]').attr({
        'name': ProdName
      }).val('');

      newSection.find('select[name^="AccName"]').attr({
        'name': AccName
      }).val('');


           $('#component_tb').append(newSection);
         }

         $('input[name="'+UnitPrice+'"]').keydown(function (event) {


                     if (event.shiftKey == true) {
                         event.preventDefault();
                     }

                     if ((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105) || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 37 || event.keyCode == 39 || event.keyCode == 46 || event.keyCode == 190) {

                     } else {
                         event.preventDefault();
                     }

                     if($(this).val().indexOf('.') !== -1 && event.keyCode == 190)
                         event.preventDefault();

                 });


                 $('input[name="'+Ordered+'"]').keydown(function (event) {


                             if (event.shiftKey == true) {
                                 event.preventDefault();
                             }

                             if ((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105) || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 37 || event.keyCode == 39 || event.keyCode == 46 || event.keyCode == 190) {

                             } else {
                                 event.preventDefault();
                             }

                             if($(this).val().indexOf('.') !== -1 && event.keyCode == 190)
                                 event.preventDefault();

                         });

                 var $tblrows = $("#component_tb tbody tr");
                 $tblrows.each(function (index) {
                     var $tblrow = $(this);
                     $tblrow.find('.AccName').on('change', function () {

                       var accountVal = $tblrow.find("[id=AccName]").val();

                       var Segs = accountVal.split(',');
                        $tblrow.find("[id=productdesc]").val(Segs[2]);

                    });

                    $tblrow.find('.qty').on('change', function () {
                      var qty = $tblrow.find("[id=Ordered]").val();

                      var price = $tblrow.find("[id=UnitPrice]").val();
                      var subTotal = parseInt(qty,10) * parseFloat(price);
                      if (!isNaN(subTotal)) {

                     $tblrow.find('.subtot').val(subTotal.toFixed(2));
                     var SubGrandTotal = 0;
                     $(".subtot").each(function () {
                         var stval = parseFloat($(this).val());
                         SubGrandTotal += isNaN(stval) ? 0 : stval;

                     });


                     document.getElementById("subtotal_total").innerHTML = Currency+''+SubGrandTotal.toFixed(2);
                     document.getElementById("subtotal_total2").innerHTML = Currency+''+SubGrandTotal.toFixed(2);
                     $('input[name="subtotal_total_2"]').val(SubGrandTotal.toFixed(2));
                     //$('.subtotal_total').val(grandTotal.toFixed(2));
                     }
                    });

                    $tblrow.find('.unitPrice').on('change', function () {
                      var qty = $tblrow.find("[id=Ordered]").val();

                      var price = $tblrow.find("[id=UnitPrice]").val();
                      var subTotal = parseInt(qty,10) * parseFloat(price);
                      if (!isNaN(subTotal)) {

                     $tblrow.find('.subtot').val(subTotal.toFixed(2));
                     var SubGrandTotal = 0;
                     $(".subtot").each(function () {
                         var stval = parseFloat($(this).val());
                         SubGrandTotal += isNaN(stval) ? 0 : stval;

                     });


                     document.getElementById("subtotal_total").innerHTML = Currency+''+SubGrandTotal.toFixed(2);
                     document.getElementById("subtotal_total2").innerHTML = Currency+''+SubGrandTotal.toFixed(2);
                     $('input[name="subtotal_total_2"]').val(SubGrandTotal.toFixed(2));
                     //$('.subtotal_total').val(grandTotal.toFixed(2));
                     }
                    });


                 });



  $(document).on('click', 'a.removebutton', function () {
    event.stopPropagation();
  if($('#component_tb tbody>tr').length > 1){
    //if(confirm("Are you sure you want to delete this row?")) {
        this.click;

            $(this).closest('tr').remove();

      //} else { }
      event.preventDefault();
      return false;
  }

  });




$(document).on("click", "#component_tb tr", function(e) {
  e.preventDefault();
  var $tblrow = $(this);

  var $cell= $(e.target).closest('td');

 if(($cell.index() == 2)){
  var erpGetAccount = erpReqAccount();
  erpGetAccount.onreadystatechange = function() {
  if (erpGetAccount.readyState == 4 && erpGetAccount.status == 200) {

  var select = $tblrow.find(".AccName");
  //document.getElementById("AccName");
  var dataListRet = JSON.parse(erpGetAccount.responseText)
  for (var event in dataListRet) {
    var dataCopy = dataListRet[event];
    for (var data in dataCopy) {
      var mainData = dataCopy[data];
  var AccName = mainData.AccountName;
  var AccDesc = mainData.Description;
  var AccTaxCode = mainData.TaxCode;
  var Id = mainData.Id;
  var option = document.createElement('option');
  option.text = AccName;
  option.value = AccName +','+ AccTaxCode +','+ AccDesc;

  option.id = Id;
  select.append(option, 0);
  //select.add(option, 0);
  }
  }

    }
  }

}
//$tblrow.find("[id=Ordered]").val()
else if(($cell.index() == 6)){

  var erpGetTaxCode = erpReqTaxCode();
  erpGetTaxCode.onreadystatechange = function() {
  if (erpGetTaxCode.readyState == 4 && erpGetTaxCode.status == 200) {
  var select3 = $tblrow.find(".LineTaxTotal");
  //var select = document.getElementById("SODepartment");
  var dataListRet3 = JSON.parse(erpGetTaxCode.responseText)
  for (var event3 in dataListRet3) {
    var dataCopy3 = dataListRet3[event3];
    for (var data3 in dataCopy3) {
      var mainData3 = dataCopy3[data3];
  var codeName = mainData3.CodeName;

  var Id = mainData3.Id;
  var option3 = document.createElement('option');
  option3.text = codeName;
  option3.value = codeName;
  option3.id = Id;
  select3.append(option3, 0);
  }
  }

  //});

    }
  }
}

});


var $tblrows = $("#component_tb tbody tr");
$tblrows.each(function (index) {
    var $tblrow = $(this);
    $tblrow.find('.AccName').on('change', function () {
  
      var accountVal = $tblrow.find("[id=AccName]").val();

      var Segs = accountVal.split(',');
       $tblrow.find("[id=productdesc]").val(Segs[2]);

   });

   $tblrow.find('.qty').on('change', function () {
     var qty = $tblrow.find("[id=Ordered]").val();

     var price = $tblrow.find("[id=UnitPrice]").val();
     var subTotal = parseInt(qty,10) * parseFloat(price);
     if (!isNaN(subTotal)) {

    $tblrow.find('.subtot').val(subTotal.toFixed(2));
    var SubGrandTotal = 0;
    $(".subtot").each(function () {
        var stval = parseFloat($(this).val());
        SubGrandTotal += isNaN(stval) ? 0 : stval;

    });


    document.getElementById("subtotal_total").innerHTML = Currency+''+SubGrandTotal.toFixed(2);
    document.getElementById("subtotal_total2").innerHTML = Currency+''+SubGrandTotal.toFixed(2);
    $('input[name="subtotal_total_2"]').val(SubGrandTotal.toFixed(2));
    //$('.subtotal_total').val(grandTotal.toFixed(2));
    }
   });

   $tblrow.find('.unitPrice').on('change', function () {
     var qty = $tblrow.find("[id=Ordered]").val();

     var price = $tblrow.find("[id=UnitPrice]").val();
     var subTotal = parseInt(qty,10) * parseFloat(price);
     if (!isNaN(subTotal)) {

    $tblrow.find('.subtot').val(subTotal.toFixed(2));
    var SubGrandTotal = 0;
    $(".subtot").each(function () {
        var stval = parseFloat($(this).val());
        SubGrandTotal += isNaN(stval) ? 0 : stval;

    });


    document.getElementById("subtotal_total").innerHTML = Currency+''+SubGrandTotal.toFixed(2);
    document.getElementById("subtotal_total2").innerHTML = Currency+''+SubGrandTotal.toFixed(2);
    $('input[name="subtotal_total_2"]').val(SubGrandTotal.toFixed(2));
    //$('.subtotal_total').val(grandTotal.toFixed(2));
    }
   });

});


    $("input[name*='UnitPrice_1']").keydown(function (event) {


                if (event.shiftKey == true) {
                    event.preventDefault();
                }

                if ((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105) || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 37 || event.keyCode == 39 || event.keyCode == 46 || event.keyCode == 190) {

                } else {
                    event.preventDefault();
                }

                if($(this).val().indexOf('.') !== -1 && event.keyCode == 190)
                    event.preventDefault();

  });

  $("input[name*='Ordered_1']").keydown(function (event) {


              if (event.shiftKey == true) {
                  event.preventDefault();
              }

              if ((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105) || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 37 || event.keyCode == 39 || event.keyCode == 46 || event.keyCode == 190) {

              } else {
                  event.preventDefault();
              }

              if($(this).val().indexOf('.') !== -1 && event.keyCode == 190)
                  event.preventDefault();

});

tableCalc();

};

tableCalc = function () {

  var $tblrows = $("#component_tb tbody tr");
  $tblrows.each(function (index) {
      var $tblrow = $(this);

      $tblrow.find('.qty').on('change', function () {
      
     //var qty = $tblrow.find("[id=Ordered]").val();

     var price = $tblrow.find("[id=UnitPrice]").val();
     var subTotal =  parseFloat(price);
     if (!isNaN(subTotal)) {

    $tblrow.find('.qty').val(subTotal.toFixed(2));
    var SubGrandTotal = 0;
    $(".qty").each(function () {
        var stval = parseFloat($(this).val());
        SubGrandTotal += isNaN(stval) ? 0 : stval;

    });

    document.getElementById("subtotal_total").innerHTML = Currency+''+SubGrandTotal.toFixed(2);
    document.getElementById("subtotal_total2").innerHTML = Currency+''+SubGrandTotal.toFixed(2);
    $('input[name="subtotal_total_2"]').val(SubGrandTotal.toFixed(2));
    //$('.subtotal_total').val(grandTotal.toFixed(2));
    }
      

     });

  });


};



/*
var trArray = [];
$('#component_tb tbody >tr').each(function () {
  var tr =$(this).text();
  var tdArray = [];
//  var splashArray = new Array();
  $(this).find('td').each(function () {
      var td = $(this).text();
      // I want to create the array of objects here …
      var items = {};
      items[tr] = td;
      tdArray.push(items);


  });
});

*/
