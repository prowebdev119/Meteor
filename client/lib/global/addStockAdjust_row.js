addStockAdjustRow = function (rowCount) {
  var $componentTB = $("#tblStockAdjust"),
        $firstTRCopy = $componentTB.children('tr').first().clone(),
      click_count = 0;

  //$('#new_create_btn').on( 'click', function () {
    //$('#component_tb tbody>tr:last').clone(true).insertAfter('#component_tb tbody>tr:last');
  //  var rowCount = $('#component_tb tbody>tr').length;
    click_count++;
    for (var i = 0; i < rowCount; i++) {
    var $clones 	= $('#tblStockAdjust tbody>tr'),
             num 		= $clones.size() + 1,
             next_num 	= parseInt($clones.last().find('input[name^="prod_id"]').val()) + 1,
             //POJob_num 	= ($clones.last().find('input[name^="POJobno"]').val()),
            // PODepartment_num 	= ($clones.last().find('input[name^="PODepartment"]').val()),
            // job_name 	= ($clones.last().find('input[name^="POJobname"]').val()),
            // NonPoJob_name 	= ($clones.last().find('input[name^="jobname"]').val()),
          //   NonPoJob_No 	= ($clones.last().find('select[name^="jobno"]').val()),
          $template 	= $clones.first(),
          newSection 	= $template.clone().attr('id', 'pq_entry_'+num),
          prod_id 	= 'prod_id_'+num,
          ProdName = 'ProdName_'+num,
          productdesc = 'productdesc_'+num,
          productname = 'productname_'+num,
          department = 'department_'+num,
          uom = 'uom_'+num,
          barcode = 'barcode_'+num,
          instock = 'instock_'+num,
          available = 'available_'+num,
          final = 'final_'+num,
          adjust = 'adjust_'+num,
          departmentID = '#department_'+num;

          //TotalAmt = 'TotalAmt_'+num;
          //department = 'department_'+num;
          //PODepartment = 'PODepartment_'+num;
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

      newSection.find('input[name^="barcode_1"]').attr({
      'name': barcode
      }).val('');

      newSection.find('input[name^="instock_1"]').attr({
      'name': instock
      }).val('');

      newSection.find('input[name^="available_1"]').attr({
      'name': available
      }).val('');

      newSection.find('input[name^="final_1"]').attr({
      'name': final
      }).val('');

      newSection.find('input[name^="adjust_1"]').attr({
      'name': adjust
      }).val('');


      newSection.find('select[name^="ProdName"]').attr({
        'name': ProdName
      }).val('');

      newSection.find('select[name^="department_1"]').attr({
      'name': department
      }).val('');

      newSection.find('select[id^="department_1"]').attr({
      'id': department
      }).val('');

      newSection.find('select[name^="uom"]').attr({
        'name': uom
      }).val('');


           $('#tblStockAdjust').append(newSection);
         }

         $('input[name="'+adjust+'"]').keydown(function (event) {


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

                 var $tblrows = $("#tblStockAdjust tbody tr");
                 $tblrows.each(function (index) {
                     var $tblrow = $(this);
                     $tblrow.find('.AdjustQty').on('change', function () {
                  
                    var adjust = $tblrow.find("[id=adjust]").val();

                    var availableQty = $tblrow.find("[id=instock]").val();
                    var sumTotal = parseInt(adjust) + parseInt(availableQty);
                    if (!isNaN(sumTotal)) {

                   $tblrow.find('.finalQty').val(sumTotal);


                   }


                    });

                 });

  //});

  $(document).on('click', 'a.removebutton', function () {
    event.stopPropagation();
  if($('#tblStockAdjust tbody>tr').length > 1){
    //if(confirm("Are you sure you want to delete this row?")) {
        this.click;

            $(this).closest('tr').remove();

    //  } else { }
      event.preventDefault();
      return false;
  }

  });


    $('#tblStockAdjust  tbody').on('change', 'select', function (e) {

      var x = document.getElementById("tblStockAdjust");
      var itemVal =  $(this).val();
      var Segs = itemVal.split(',');
      //var AccTaxCode = Segs[1];
      var ProdDesc = Segs[1];
      var ProdBarcode = Segs[2];
      var ProdName = Segs[0];
      var erpGet = erpDb();

          if (x != null) {

              for (var i = 0; i < x.rows.length; i++) {

                  for (var j = 0; j < x.rows[i].cells.length; j++)

                      x.rows[i].cells[2].onclick = function () {
                        var cnt = i;
                        var prodDescN ="productdesc_"+cnt;
                        var barcodeN ="barcode_"+cnt;
                        var deptN ="department_"+cnt;
                        var instockN ="instock_"+cnt;
                        var availableN ="available_"+cnt;
                        var finalN ="final_"+cnt;
                        var uomN ="uom_"+cnt;
                        var adjustN ="adjust_"+cnt;

                        return function() {
                  $('input[name="'+availableN+'"]').val('0');
                 $('input[name="'+prodDescN+'"]').val(ProdDesc);
                 $('input[name="'+barcodeN+'"]').val(ProdBarcode);
                 var oReq = new XMLHttpRequest();

                 oReq.open("GET",URLRequest + erpGet.ERPIPAddress + ':' + erpGet.ERPPort + '/' + erpGet.ERPApi + '/' + erpGet.ERPProductClassQuantityList + '&select=[ProductName]="'+ProdName+'"and [DepartmentName]="Default"' , true);
                 //oReq.open("GET",URLRequest + erpGet.ERPIPAddress + ':' + erpGet.ERPPort + '/' + erpGet.ERPApi + '/' + erpGet.ERPPOCard + '/' + ProdName, true);
                 oReq.setRequestHeader("database",erpGet.ERPDatabase);
                 oReq.setRequestHeader("username",erpGet.ERPUsername);
                 oReq.setRequestHeader("password",erpGet.ERPPassword);
                 oReq.send();

                 oReq.timeout = 30000;

                 oReq.onreadystatechange = function() {
                 if (oReq.readyState == 4 && oReq.status == 200) {
                   var dataListRet2 = JSON.parse(oReq.responseText);

                   for (var event in dataListRet2) {
                     var dataCopy2 = dataListRet2[event];
                     for (var data2 in dataCopy2) {
                       var mainData2 = dataCopy2[data2];

                      // department = mainData2.DeptName;
                       quantity = mainData2.AvailableQty;
                       inStockQty = mainData2.InStockQty;


                     }
                   }

                   $('input[name="'+instockN+'"]').val(inStockQty);
                  $('input[name="'+availableN+'"]').val(quantity);
                  $('input[name="'+finalN+'"]').val(inStockQty);
                  $('input[name="'+adjustN+'"]').val('1').trigger("change");


                /* var dataListRet = oReq.responseText;
                 //var id = '';
                 var obj = $.parseJSON(dataListRet);
                 $.each(obj, function() {
               AvailQty = this['DeptName'];
               //product = this['Lines'];

               });
*/
               AddUERP(oReq.responseText);
                 }
                 }
                 //$('input[name="'+unitPriceN+'"]').val(ProdPrice);
                // $('input[name="'+TotalAmtN+'"]').val(Amount);
                 //$('#LineTaxTotal_1').append('<option value="ADJ" selected="selected">'+AccTaxCode+'</option>');
                 $('select[name="'+deptN+'"] option[value="Default"]').prop('selected', true);
                //  $('select[name="'+uomN+'"] option: eq(1)').prop('selected', true);
                  $('select[name='+uomN+'] option[value="Units"]').prop('selected', true);
                 //$('select[name="'+TaxRateN+'"]').val("3");

                }
                      }(i);

              }

          }


          $(this).click();
      e.preventDefault();
    });

    $('#tblStockAdjust  tbody').on('change', 'select', function (e) {

      var x = document.getElementById("tblStockAdjust");
      var DeptName =  $(this).val();
      var tblrows2 = $("#tblStockAdjust tbody tr");
      //var Segs2 = itemVal2.split(',');
      //var AccTaxCode = Segs[1];

      var erpGet2 = erpDb();

          if (x != null) {

              for (var i = 0; i < x.rows.length; i++) {

                  for (var j = 0; j < x.rows[i].cells.length; j++)

                      x.rows[i].cells[5].onclick = function () {

                        var cnt = i;

                        var instock2N ="instock_"+cnt;
                        var available2N ="available_"+cnt;
                        var final2N ="final_"+cnt;
                        var prodNameN ="ProdName_"+cnt;
                        var adjustN ="adjust_"+cnt;


                        return function() {

                  $('input[name="'+available2N+'"]').val('0');
                  $('input[name="'+adjustN+'"]').val('');
                  var productName = $('select[name=' + prodNameN + ']').val();
                  //$("#ProdName").val();
                  var Segs3 = productName.split(',');
                  var ProdName2 = Segs3[0];
                 var oReqDept = new XMLHttpRequest();

                 oReqDept.open("GET",URLRequest + erpGet2.ERPIPAddress + ':' + erpGet2.ERPPort + '/' + erpGet2.ERPApi + '/' + erpGet2.ERPProductClassQuantityList + '&select=[ProductName]="'+ProdName2+'"and [DepartmentName]="'+DeptName+'"' , true);
                 //oReq.open("GET",URLRequest + erpGet.ERPIPAddress + ':' + erpGet.ERPPort + '/' + erpGet.ERPApi + '/' + erpGet.ERPPOCard + '/' + ProdName, true);
                 oReqDept.setRequestHeader("database",erpGet2.ERPDatabase);
                 oReqDept.setRequestHeader("username",erpGet2.ERPUsername);
                 oReqDept.setRequestHeader("password",erpGet2.ERPPassword);
                 oReqDept.send();

                 oReqDept.timeout = 30000;

                 oReqDept.onreadystatechange = function() {
                 if (oReqDept.readyState == 4 && oReqDept.status == 200) {
                   var dataListRet3 = JSON.parse(oReqDept.responseText);
                     var quantity2 = '';
                     var inStockQty2 = '';
                   for (var event2 in dataListRet3) {
                     var dataCopy3 = dataListRet3[event2];
                     for (var data3 in dataCopy3) {
                       var mainData3 = dataCopy3[data3];

                      // department = mainData2.DeptName;
                       quantity2 = mainData3.AvailableQty;
                       inStockQty2 = mainData3.InStockQty;
                       //sumQty += parseInt(quantity);

                       //employeeaccno = mainData2.AccountNo;
                       //employeeaccname = mainData2.AccountName;
                       //employeebankcode = mainData2.BankCode;

                       //$(deptN).append('<option value="'+department+'" selected="selected">'+department+'</option>');

                     }
                   }

                  // $('input[name="'+instockN+'"]').val(quantity);
                  if(quantity2 == ''){
                    $('input[name="'+available2N+'"]').val('0');
                 }else{
                    $('input[name="'+available2N+'"]').val(quantity2);
                  }
                   $('input[name="'+instock2N+'"]').val(inStockQty2);
                   $('input[name="'+final2N+'"]').val(inStockQty2);
                  //$('input[name="'+finalN+'"]').val(quantity);


               AddUERP(oReqDept.responseText);
                 }
                 }



                }
                      }(i);

              }

          }



      e.preventDefault();
    });

    $("input[name*='adjust_1']").keydown(function (event) {


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


};
