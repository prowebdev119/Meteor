updateRow = function (rowCount) {
  var $componentTB = $("#component_tbUpdate"),
       $firstTRCopy = $componentTB.children('tr').first().clone(),
     click_count = 0;

 //$('#new_create_btn').on( 'click', function () {
   //$('#component_tbUpdate tbody>tr:last').clone(true).insertAfter('#component_tbUpdate tbody>tr:last');
 //  var rowCount = $('#component_tbUpdate tbody>tr').length;
   click_count++;
   for (var i = 0; i < rowCount; i++) {
   var $clones 	= $('#component_tbUpdate tbody>tr'),
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
         productdesc = 'productdesc_'+num,
         Ordered = 'Ordered_'+num,
         productname = 'productname_'+num,
         UnitPrice = 'UnitPrice_'+num,
         LineTaxTotal = 'LineTaxTotal_'+num,
         Region = 'Region_'+num,
         TotalAmt = 'TotalAmt_'+num,
         department = 'department_'+num,
         allocation = 'allocation_'+num,
         PODepartment = 'PODepartment_'+num;
         //person_lname = 'person_lname_'+num;
       //  $componentTB.append($firstTRCopy.clone());

       newSection.removeAttr('data-saved');
       newSection.find('input[type="text"]').val('');
       newSection.find('input[name^="prod_id"]').attr({
       'name': prod_id
     }).val(next_num);

     newSection.find('a[name^="allocation_1"]').attr({
     'name': allocation
   }).val('+');

   newSection.find('input[name^="allocation_1"]').attr({
   'name': allocation
 }).val('+');

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


          $('#component_tbUpdate').append(newSection);
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

                var $tblrows = $("#component_tbUpdate tbody tr");
                $tblrows.each(function (index) {
                    var $tblrow = $(this);
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
                 //$('.subtotal_total').val(grandTotal.toFixed(2));
                 }
                   

                  });

                });

 //});
/*
 $('.Show').click(function() {
     $('#allocate_box').show(500);
     $('.Show').hide(0);
     $('.Hide').show(0);
 });
 $('.Hide').click(function() {
     $('#allocate_box').hide(500);
     $('.Show').show(0);
     $('.Hide').hide(0);
 });


 $(document).on('click', '.allocate_edit', function () {

   event.stopPropagation();
 //if($('#component_tbUpdate tbody>tr').length > 1){
     $('#allocate_box').toggle('slow');
 //  }

 });
*/
 $(document).on('click', 'a.removebutton', function () {
   event.stopPropagation();
 if($('#component_tbUpdate tbody>tr').length > 1){
   //if(confirm("Are you sure you want to delete this row?")) {
       this.click;

           $(this).closest('tr').remove();

   //  } else { }
     event.preventDefault();
     return false;
 }

 });


   $('#component_tbUpdate  tbody').on('change', 'select', function (e) {
     var x = document.getElementById("component_tbUpdate");
     var itemVal =  $(this).val();
     var Segs = itemVal.split(',');
     var ProdDesc = Segs[1];
     var ProdPrice = Segs[2];
     var Amount = 1 * parseFloat(ProdPrice);
     var $dropdown = $("#dropdown");
   var $tblrows = $("#component_tbUpdate tbody tr");


     /*

     <option value="Special Projects">20%(VAT on Income)</option>
     <option value="Standard" selected>5%(VAT on Income)</option>
     <option value="Very orange invoice!">Exempt Income</option>
     <option value="Very orange invoice!">No VAT</option>
     <option value="Very orange invoice!">Zero Rated EC Goods Income</option>
     <option value="Very orange invoice!">Zero Rated EC Services</option>
     <option value="Very orange invoice!">Zero Rated Income</option>
     */

         if (x != null) {

             for (var i = 0; i < x.rows.length; i++) {

                 for (var j = 0; j < x.rows[i].cells.length; j++)

                     x.rows[i].cells[2].onclick = function () {
                       var cnt = i;
                       var prodDescN ="productdesc_"+cnt;
                       var unitPriceN ="UnitPrice_"+cnt;
                       var OrderN ="Ordered_"+cnt;
                       var TaxRateN ="LineTaxTotal_"+cnt;
                       var RegionN ="Region_"+cnt;
                       var TotalAmtN ="TotalAmt_"+cnt;

                       return function() {

                $('input[name="'+prodDescN+'"]').val(ProdDesc);
                $('input[name="'+OrderN+'"]').val(1);
                $('input[name="'+unitPriceN+'"]').val(ProdPrice);
                $('input[name="'+TotalAmtN+'"]').val(Amount);
                //$('#LineTaxTotal').append('<option value="20" selected="selected">'+assignMenu+'</option>');
                $('select[name="'+TaxRateN+'"] option:eq(6)').prop('selected', true);

                $tblrows.each(function (index) {
                    var $tblrow = $(this);
                    //$tblrow.find('.qty').on('change', function () {
                    
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

                  }

                  // });

                });
               }
                     }(i);

             }

         }


         $(this).click();
     e.preventDefault();
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

tableCalc();

};

tableCalc = function () {

 var $tblrows = $("#component_tbUpdate tbody tr");
 $tblrows.each(function (index) {
     var $tblrow = $(this);
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
   //$('.subtotal_total').val(grandTotal.toFixed(2));
   }
     

    });

 });


};
