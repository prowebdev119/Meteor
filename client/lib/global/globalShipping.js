ShippingRow = function () {


  var click_count = 0;
  var batch_count = 0;
  var bin_count = 0;
  var serial_count = 0;
  var htmlAppend = '';

function updateRowOrder(){
 $('td.form_id').each(function(i){
        $(this).text(i+1);
			});
};

  $(document).on('click', '.removesecondtablebutton', function () {
    event.stopPropagation();

    // if(confirm("Are you sure you want to delete this row?")) {
    //     this.click;
    //
    //         $(this).closest('tr').remove();
    //         $("#btnsaveallocline").trigger("click");
    //         updateRowOrder();
    //   } else { }

      swal({
          title: 'Delete Serial Number',
          text: "Are you sure you want to Delete Serial Number?",
          type: 'question',
          showCancelButton: true,
          confirmButtonText: 'Yes'
      }).then((result) => {
          if (result.value) {
            this.click;

                $(this).closest('tr').remove();
                $("#btnsaveallocline").trigger("click");
                updateRowOrder();
          } else {
              $('.modal-backdrop').css('display', 'none');
          }
          // } else {}
      });

      event.preventDefault();
      return false;



  });

  $('#newsnbtn').click(function(){
    var scannedCode =  $('input[name="allocBarcode"]').val().toUpperCase();
    var departmentID =  $('input[name="deptID"]').val();
    var productID =  $('input[name="prodID"]').val();
    var scannedSerial = "";
    var erpGet = erpDb();
    var lineQuantity = $('input[name="orderQty"]').val();

      if(scannedCode != ''){
          var segs = scannedCode.split('-');
          if(segs[0] == Barcode_Prefix_PQASN){
            var flag = false;
            var maximumScan = false;
            var oReqSID = new XMLHttpRequest();
            oReqSID.open("GET",URLRequest + erpGet.ERPIPAddress + ':' + erpGet.ERPPort + '/' + erpGet.ERPApi + '/ValidateSN?DepartmentID='+departmentID+'&SerialNumber='+scannedCode+'', true);
            oReqSID.setRequestHeader("database",erpGet.ERPDatabase);
            oReqSID.setRequestHeader("username",erpGet.ERPUsername);
            oReqSID.setRequestHeader("password",erpGet.ERPPassword);
            oReqSID.send();

            oReqSID.timeout = 30000;
            oReqSID.onreadystatechange = function() {
            if (oReqSID.readyState == 4 && oReqSID.status == 200) {

              var valListRet = jQuery.parseJSON(oReqSID.responseText);

              if(valListRet.ValidateSN.Result == false){
                 scannedSerial = "";
                Bert.alert('<strong>WARNING:</strong> '+valListRet.ValidateSN.Message+' or product is not on this order!', 'now-danger');
                DangerSound();

              }else{
                 //scannedSerial = scannedCode;
                 var segsSerial = scannedCode.split('-');
                 var scannedSerial = "";
                  var i;
                  for (i = 2; i < segsSerial.length; i++) {
                  	if(scannedSerial != ""){
                     scannedSerial = scannedSerial + '-';
                     }
                     scannedSerial +=  segsSerial[i] ;
                  }
                  // Loop End's here.

        var $tblrow2 = $("#tblShippingDocket > tbody  > tr");
        $tblrow2.each(function (index) {
        var $tblrow = $(this);
        var ProductID = $tblrow.find("[id=ProductID]").text();
        //var  lineOrderQty = $tblrow.find("[id=Ordered]").val();
        if (ProductID == segs[1]){
          $tblrow.click();

          if($tblrow.click()){
            var $tblrowAlloc = $("#serailscanlist > tbody  > tr");
            var newQuantity = $('input[name="orderQty"]').val();

            //var rowCount = $tblrowAlloc.length;
             var rowCount = $('#serailscanlist  > tbody  > tr').length;
              if(rowCount == newQuantity){
                Bert.alert('<strong>WARNING:</strong> You cannot ship more serial numbers than Ordered quantity!', 'now-danger');
                DangerSound();
              }else{
            $tblrowAlloc.each(function (index2) {
                var $tblAlloc = $(this);
                  var serialNumber = $tblAlloc.find("[id=serialNo]").val();
                  if (serialNumber == scannedSerial){
                    flag = true;
                  return false;
                  }
            });
  if(flag){
   Bert.alert('<strong>WARNING:</strong> Serial number is already in use!', 'now-danger');
  DangerSound();
   return;
    }else{

     htmlAppend = '<tr class="dnd-moved"><td class="form_id"></td><td>' + ''
      + '</td><td>' + '</td>'
      + '<td>' + '<input type="text" style="text-align: left !important;" name="serialNo" id="serialNo" class="highlightInput " value="'+scannedSerial+'" readonly>' + '</td><td style="width: 1%;"><span class=" removesecondtablebutton"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0 "><i class="fa fa-remove"></i></button></span></td>'
      + '</tr>';
       $("#serailscanlist").append(htmlAppend);
       updateRowOrder();
       $("#btnsaveallocline").trigger("click");
       Bert.alert('<strong>OK</strong>', 'now-success');
       OkaySound();
    }

}
          }

      }

    });
                // $('input[name="serialNo"]').val(scannedSerial);

              }

            }


            }

          }else{
          var flag = false;
        var oReqSID = new XMLHttpRequest();
          oReqSID.open("GET",URLRequest + erpGet.ERPIPAddress + ':' + erpGet.ERPPort + '/' + erpGet.ERPApi + '/ValidateSN?ProductID='+productID+'&DepartmentID='+departmentID+'&SerialNumber='+scannedCode+'', true);
        oReqSID.setRequestHeader("database",erpGet.ERPDatabase);
        oReqSID.setRequestHeader("username",erpGet.ERPUsername);
        oReqSID.setRequestHeader("password",erpGet.ERPPassword);
        oReqSID.send();

        oReqSID.timeout = 30000;
        oReqSID.onreadystatechange = function() {
        if (oReqSID.readyState == 4 && oReqSID.status == 200) {

          var valListRet = jQuery.parseJSON(oReqSID.responseText);

          if(valListRet.ValidateSN.Result == false){
             scannedSerial = "";
            Bert.alert('<strong>WARNING:</strong> '+valListRet.ValidateSN.Message+' or product is not on this order!', 'now-danger');
            DangerSound();
          }else{
             scannedSerial = scannedCode;
             //$('input[name="serialNo"]').val(scannedSerial);
             var rowCount = $('#serailscanlist  > tbody  > tr').length;
                      if(rowCount == 0){

                        htmlAppend = '<tr class="dnd-moved"><td class="form_id"></td><td>' + ''
                         + '</td><td>' + '</td>'
                         + '<td>' + '<input type="text" style="text-align: left !important;" name="serialNo" id="serialNo" class="highlightInput " value="'+scannedSerial+'" readonly>' + '</td><td style="width: 1%;"><span class=" removesecondtablebutton"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0 "><i class="fa fa-remove"></i></button></span></td>'
                         + '</tr>';
                          $("#serailscanlist").append(htmlAppend);
                          updateRowOrder();
                          $("#btnsaveallocline").trigger("click");
                          Bert.alert('<strong>OK</strong>', 'now-success');
                          OkaySound();
                      }else if(rowCount == lineQuantity){
                        //lineQuantity
                        Bert.alert('<strong>WARNING:</strong> You cannot ship more serial numbers than Ordered quantity!', 'now-danger');
                        DangerSound();
                      }else {
                        var $tblrowAlloc = $("#serailscanlist > tbody  > tr");
                           $tblrowAlloc.each(function () {
                               var $tblAlloc = $(this);
                                 var serialNumber = $tblAlloc.find("[id=serialNo]").val();
                                 if (serialNumber == scannedSerial){
                                   flag = true;
                                   return false;
                                 }

                           });

                           if(flag){
                           Bert.alert('<strong>WARNING:</strong> Serial number is already in use!', 'now-danger');
                          DangerSound();
                           return;
                       }else{

                         htmlAppend = '<tr class="dnd-moved"><td class="form_id"></td><td>' + ''
                          + '</td><td>' + '</td>'
                          + '<td>' + '<input type="text" style="text-align: left !important;" name="serialNo" id="serialNo" class="highlightInput " value="'+scannedSerial+'" readonly>' + '</td><td style="width: 1%;"><span class=" removesecondtablebutton"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0 "><i class="fa fa-remove"></i></button></span></td>'
                          + '</tr>';
                           $("#serailscanlist").append(htmlAppend);
                           updateRowOrder();
                           $("#btnsaveallocline").trigger("click");
                           Bert.alert('<strong>OK</strong>', 'now-success');
                           OkaySound();
                       }

                      }

          }

        }


        }
        }

      }else{
        $("#allocBarcode").focus();
      }



    $('input[name="allocBarcode"]').val('');
    $("#allocBarcode").focus();
  });

  $("#allocBarcode").keyup(function (e) {
      if (e.keyCode == 13) {
        var scannedCode =  $(this).val().toUpperCase();
        var departmentID =  $('input[name="deptID"]').val();
        var productID =  $('input[name="prodID"]').val();
        var lineQuantity = $('input[name="orderQty"]').val();
        var scannedSerial = "";
         var confirmAssignee = false;
          var erpGet = erpDb();

          if(scannedCode != ''){
              var segs = scannedCode.split('-');
              if(segs[0] == Barcode_Prefix_PQASN){
                var flag = false;
                var oReqSID = new XMLHttpRequest();
                oReqSID.open("GET",URLRequest + erpGet.ERPIPAddress + ':' + erpGet.ERPPort + '/' + erpGet.ERPApi + '/ValidateSN?DepartmentID='+departmentID+'&SerialNumber='+scannedCode+'', true);
                oReqSID.setRequestHeader("database",erpGet.ERPDatabase);
                oReqSID.setRequestHeader("username",erpGet.ERPUsername);
                oReqSID.setRequestHeader("password",erpGet.ERPPassword);
                oReqSID.send();

                oReqSID.timeout = 30000;
                oReqSID.onreadystatechange = function() {
                if (oReqSID.readyState == 4 && oReqSID.status == 200) {

                  var valListRet = jQuery.parseJSON(oReqSID.responseText);

                  if(valListRet.ValidateSN.Result == false){
                     scannedSerial = "";

                    Bert.alert('<strong>WARNING:</strong> '+valListRet.ValidateSN.Message+' or product is not on this order!', 'now-danger');
                    DangerSound();
                    //var audio = new Audio('/sounds/system-fault.mp3');
                    //audio.play();
                  }else{
                     //scannedSerial = scannedCode;
                     var segsSerial = scannedCode.split('-');
                     var scannedSerial = "";
                      var i;
                      for (i = 2; i < segsSerial.length; i++) {
                        if(scannedSerial != ""){
                         scannedSerial = scannedSerial + '-';
                         }
                         scannedSerial +=  segsSerial[i] ;
                      }
                    // $('input[name="serialNo"]').val(scannedSerial);
                    var $tblrow2 = $("#tblShippingDocket > tbody  > tr");
                    var rowCount = $('#serailscanlist  > tbody  > tr').length;
                     if(rowCount == lineQuantity){
                       Bert.alert('<strong>WARNING:</strong> You cannot ship more serial numbers than Ordered quantity!', 'now-danger');
                       DangerSound();
                     }else{
                  $tblrow2.each(function (index) {
                    var $tblrow = $(this);
                      var ProductID = $tblrow.find("[id=ProductID]").text();
                      if (ProductID == segs[1]){
                        $tblrow.click();
                        if($tblrow.click()){
                          var $tblrowAlloc = $("#serailscanlist > tbody  > tr");
                          var newQuantity = $('input[name="orderQty"]').val();
                          var rowCount = $('#serailscanlist  > tbody  > tr').length;
                          if(rowCount == newQuantity){
                       Bert.alert('<strong>WARNING:</strong> You cannot ship more serial numbers than Ordered quantity!', 'now-danger');
                       DangerSound();
                         }else{
                          $tblrowAlloc.each(function (index2) {
                              var $tblAlloc = $(this);
                                var serialNumber = $tblAlloc.find("[id=serialNo]").val();
                                if (serialNumber == scannedSerial){
                                  flag = true;
                                return false;

                                }


                          });
                          if(flag){
                 Bert.alert('<strong>WARNING:</strong> Serial number is already in use!', 'now-danger');
                DangerSound();
                 return;
             }else{

               htmlAppend = '<tr class="dnd-moved"><td class="form_id"></td><td>' + ''
                + '</td><td>' + '</td>'
                + '<td>' + '<input type="text" style="text-align: left !important;" name="serialNo" id="serialNo" class="highlightInput " value="'+scannedSerial+'" readonly>' + '</td><td style="width: 1%;"><span class=" removesecondtablebutton"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0 "><i class="fa fa-remove"></i></button></span></td>'
                + '</tr>';
                 $("#serailscanlist").append(htmlAppend);
                 updateRowOrder();
                 $("#btnsaveallocline").trigger("click");
                 Bert.alert('<strong>OK</strong>', 'now-success');
                 OkaySound();
             }
           }
           }
                      }

                  });

                }
                  }

                }


                }

              }else{
            var flag = false;
            var oReqSID = new XMLHttpRequest();
              oReqSID.open("GET",URLRequest + erpGet.ERPIPAddress + ':' + erpGet.ERPPort + '/' + erpGet.ERPApi + '/ValidateSN?ProductID='+productID+'&DepartmentID='+departmentID+'&SerialNumber='+scannedCode+'', true);
            oReqSID.setRequestHeader("database",erpGet.ERPDatabase);
            oReqSID.setRequestHeader("username",erpGet.ERPUsername);
            oReqSID.setRequestHeader("password",erpGet.ERPPassword);
            oReqSID.send();

            oReqSID.timeout = 30000;
            oReqSID.onreadystatechange = function() {
            if (oReqSID.readyState == 4 && oReqSID.status == 200) {

              var valListRet = jQuery.parseJSON(oReqSID.responseText);

              if(valListRet.ValidateSN.Result == false){
                 scannedSerial = "";
              Bert.alert('<strong>WARNING:</strong> '+valListRet.ValidateSN.Message+' or product is not on this order!', 'now-danger');
              DangerSound();
              }else{
                 scannedSerial = scannedCode;
                 var rowCount = $('#serailscanlist  > tbody  > tr').length;
                 if(rowCount == 0){

                   htmlAppend = '<tr class="dnd-moved"><td class="form_id"></td><td>' + ''
                    + '</td><td>' + '</td>'
                    + '<td>' + '<input type="text" style="text-align: left !important;" name="serialNo" id="serialNo" class="highlightInput " value="'+scannedSerial+'" readonly>' + '</td><td style="width: 1%;"><span class=" removesecondtablebutton"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0 "><i class="fa fa-remove"></i></button></span></td>'
                    + '</tr>';
                     $("#serailscanlist").append(htmlAppend);
                     updateRowOrder();
                     $("#btnsaveallocline").trigger("click");
                     Bert.alert('<strong>OK</strong>', 'now-success');
                     OkaySound();
                 }else if(rowCount == lineQuantity){
                   //lineQuantity
                   Bert.alert('<strong>WARNING:</strong> You cannot ship more serial numbers than Ordered quantity!', 'now-danger');
                   DangerSound();
                 }else {
                   var $tblrowAlloc = $("#serailscanlist > tbody  > tr");
                      $tblrowAlloc.each(function () {
                          var $tblAlloc = $(this);
                            var serialNumber = $tblAlloc.find("[id=serialNo]").val();
                            if (serialNumber == scannedSerial){
                              flag = true;
                              return false;
                            }

                      });

                      if(flag){
                      Bert.alert('<strong>WARNING:</strong> Serial number is already in use!', 'now-danger');
                      DangerSound();
                      return;
                  }else{

                    htmlAppend = '<tr class="dnd-moved"><td class="form_id"></td><td>' + ''
                     + '</td><td>' + '</td>'
                     + '<td>' + '<input type="text" style="text-align: left !important;" name="serialNo" id="serialNo" class="highlightInput " value="'+scannedSerial+'" readonly>' + '</td><td style="width: 1%;"><span class=" removesecondtablebutton"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0 "><i class="fa fa-remove"></i></button></span></td>'
                     + '</tr>';
                      $("#serailscanlist").append(htmlAppend);
                      updateRowOrder();
                      $("#btnsaveallocline").trigger("click");
                      Bert.alert('<strong>OK</strong>', 'now-success');
                      OkaySound();
                  }

                 }

              }

            }


            }
            }

          }else{
            $("#allocBarcode").focus();
          }



        $('input[name="allocBarcode"]').val('');
        $("#allocBarcode").focus();
      }
  });

  $("#scanResult" ).click(function() {
    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) )
    {
      if(navigator.userAgent.toLowerCase().indexOf("android") !== -1) {
      getScan();
      if(window.location.hash.substr(1,2) == "zx"){
          var bc = window.location.hash.substr(3);
          localStorage["barcode"] = decodeURI(window.location.hash.substr(3))
          window.close();
          self.close();
          window.location.href = "about:blank";//In case self.close isn't allowed
      }

      var changingHash = false;
      function onbarcode(event){
          switch(event.type){
              case "hashchange":{
                  if(changingHash == true){
                      return;
                  }
                  var hash = window.location.hash;
                  if(hash.substr(0,3) == "#zx"){
                      hash = window.location.hash.substr(3);
                      changingHash = true;
                      window.location.hash = event.oldURL.split("\#")[1] || ""
                      changingHash = false;
                      processBarcode(hash);
                  }

                  break;
              }
              case "storage":{
                  window.focus();
                  if(event.key == "barcode"){
                      window.removeEventListener("storage", onbarcode, false);
                      processBarcode(event.newValue);
                  }
                  break;
              }
              default:{

                  break;
              }
          }
      }
      window.addEventListener("hashchange", onbarcode, false);

      function getScan(){
          var href = window.location.href;
          var ptr = href.lastIndexOf("#");
          if(ptr>0){
              href = href.substr(0,ptr);
          }
          window.addEventListener("storage", onbarcode, false);
          setTimeout('window.removeEventListener("storage", onbarcode, false)', 15000);
          localStorage.removeItem("barcode");

          if(navigator.userAgent.match(/Firefox/i)){
              window.location.href =  ("zxing://scan/?ret=" + encodeURIComponent(href + "#zx{CODE}"));
          }else{
              //window.open   ("zxing://scan/?ret=" + encodeURIComponent(href + "#zx{CODE}"));
              window.open("http://zxing.appspot.com/scan?ret=" + encodeURIComponent(href + "#zx{CODE}"));
          }
      }

      function processBarcode(bc){

        $("#allocBarcode").val(bc);
        var scannedCode =  bc.toUpperCase();
        var departmentID =  $('input[name="deptID"]').val();
        var productID =  $('input[name="prodID"]').val();
        var lineQuantity = $('input[name="orderQty"]').val();
        var scannedSerial = "";
         var confirmAssignee = false;
          var erpGet = erpDb();

          if(scannedCode != ''){
              var segs = scannedCode.split('-');
              if(segs[0] == Barcode_Prefix_PQASN){
                var flag = false;
                var oReqSID = new XMLHttpRequest();
                oReqSID.open("GET",URLRequest + erpGet.ERPIPAddress + ':' + erpGet.ERPPort + '/' + erpGet.ERPApi + '/ValidateSN?DepartmentID='+departmentID+'&SerialNumber='+scannedCode+'', true);
                oReqSID.setRequestHeader("database",erpGet.ERPDatabase);
                oReqSID.setRequestHeader("username",erpGet.ERPUsername);
                oReqSID.setRequestHeader("password",erpGet.ERPPassword);
                oReqSID.send();

                oReqSID.timeout = 30000;
                oReqSID.onreadystatechange = function() {
                if (oReqSID.readyState == 4 && oReqSID.status == 200) {

                  var valListRet = jQuery.parseJSON(oReqSID.responseText);

                  if(valListRet.ValidateSN.Result == false){
                     scannedSerial = "";

                    Bert.alert('<strong>WARNING:</strong> '+valListRet.ValidateSN.Message+' or product is not on this order!', 'now-danger');
                    DangerSound();
                    //var audio = new Audio('/sounds/system-fault.mp3');
                    //audio.play();
                  }else{
                     //scannedSerial = scannedCode;
                     var segsSerial = scannedCode.split('-');
                     var scannedSerial = "";
                      var i;
                      for (i = 2; i < segsSerial.length; i++) {
                        if(scannedSerial != ""){
                         scannedSerial = scannedSerial + '-';
                         }
                         scannedSerial +=  segsSerial[i] ;
                      }
                    // $('input[name="serialNo"]').val(scannedSerial);
                    var $tblrow2 = $("#tblShippingDocket > tbody  > tr");
                    var rowCount = $('#serailscanlist  > tbody  > tr').length;
                     if(rowCount == lineQuantity){
                       Bert.alert('<strong>WARNING:</strong> You cannot ship more serial numbers than Ordered quantity!', 'now-danger');
                       DangerSound();
                     }else{
                  $tblrow2.each(function (index) {
                    var $tblrow = $(this);
                      var ProductID = $tblrow.find("[id=ProductID]").text();
                      if (ProductID == segs[1]){
                        $tblrow.click();
                        if($tblrow.click()){
                          var $tblrowAlloc = $("#serailscanlist > tbody  > tr");
                          var newQuantity = $('input[name="orderQty"]').val();
                          var rowCount = $('#serailscanlist  > tbody  > tr').length;
                          if(rowCount == newQuantity){
                       Bert.alert('<strong>WARNING:</strong> You cannot ship more serial numbers than Ordered quantity!', 'now-danger');
                       DangerSound();
                         }else{
                          $tblrowAlloc.each(function (index2) {
                              var $tblAlloc = $(this);
                                var serialNumber = $tblAlloc.find("[id=serialNo]").val();
                                if (serialNumber == scannedSerial){
                                  flag = true;
                                return false;

                                }


                          });
                          if(flag){
                 Bert.alert('<strong>WARNING:</strong> Serial number is already in use!', 'now-danger');
                DangerSound();
                 return;
             }else{

               htmlAppend = '<tr class="dnd-moved"><td class="form_id"></td><td>' + ''
                + '</td><td>' + '</td>'
                + '<td>' + '<input type="text" style="text-align: left !important;" name="serialNo" id="serialNo" class="highlightInput " value="'+scannedSerial+'" readonly>' + '</td><td style="width: 1%;"><span class=" removesecondtablebutton"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0 "><i class="fa fa-remove"></i></button></span></td>'
                + '</tr>';
                 $("#serailscanlist").append(htmlAppend);
                 updateRowOrder();
                 $("#btnsaveallocline").trigger("click");
                 Bert.alert('<strong>OK</strong>', 'now-success');
                 OkaySound();
             }
           }
           }
                      }

                  });

                }
                  }

                }


                }

              }else{
            var flag = false;
            var oReqSID = new XMLHttpRequest();
              oReqSID.open("GET",URLRequest + erpGet.ERPIPAddress + ':' + erpGet.ERPPort + '/' + erpGet.ERPApi + '/ValidateSN?ProductID='+productID+'&DepartmentID='+departmentID+'&SerialNumber='+scannedCode+'', true);
            oReqSID.setRequestHeader("database",erpGet.ERPDatabase);
            oReqSID.setRequestHeader("username",erpGet.ERPUsername);
            oReqSID.setRequestHeader("password",erpGet.ERPPassword);
            oReqSID.send();

            oReqSID.timeout = 30000;
            oReqSID.onreadystatechange = function() {
            if (oReqSID.readyState == 4 && oReqSID.status == 200) {

              var valListRet = jQuery.parseJSON(oReqSID.responseText);

              if(valListRet.ValidateSN.Result == false){
                 scannedSerial = "";
              Bert.alert('<strong>WARNING:</strong> '+valListRet.ValidateSN.Message+' or product is not on this order!', 'now-danger');
              DangerSound();
              }else{
                 scannedSerial = scannedCode;
                 var rowCount = $('#serailscanlist  > tbody  > tr').length;
                 if(rowCount == 0){

                   htmlAppend = '<tr class="dnd-moved"><td class="form_id"></td><td>' + ''
                    + '</td><td>' + '</td>'
                    + '<td>' + '<input type="text" style="text-align: left !important;" name="serialNo" id="serialNo" class="highlightInput " value="'+scannedSerial+'" readonly>' + '</td><td style="width: 1%;"><span class=" removesecondtablebutton"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0 "><i class="fa fa-remove"></i></button></span></td>'
                    + '</tr>';
                     $("#serailscanlist").append(htmlAppend);
                     updateRowOrder();
                     $("#btnsaveallocline").trigger("click");
                     Bert.alert('<strong>OK</strong>', 'now-success');
                     OkaySound();
                 }else if(rowCount == lineQuantity){
                   //lineQuantity
                   Bert.alert('<strong>WARNING:</strong> You cannot ship more serial numbers than Ordered quantity!', 'now-danger');
                   DangerSound();
                 }else {
                   var $tblrowAlloc = $("#serailscanlist > tbody  > tr");
                      $tblrowAlloc.each(function () {
                          var $tblAlloc = $(this);
                            var serialNumber = $tblAlloc.find("[id=serialNo]").val();
                            if (serialNumber == scannedSerial){
                              flag = true;
                              return false;
                            }

                      });

                      if(flag){
                      Bert.alert('<strong>WARNING:</strong> Serial number is already in use!', 'now-danger');
                      DangerSound();
                      return;
                  }else{

                    htmlAppend = '<tr class="dnd-moved"><td class="form_id"></td><td>' + ''
                     + '</td><td>' + '</td>'
                     + '<td>' + '<input type="text" style="text-align: left !important;" name="serialNo" id="serialNo" class="highlightInput " value="'+scannedSerial+'" readonly>' + '</td><td style="width: 1%;"><span class=" removesecondtablebutton"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0 "><i class="fa fa-remove"></i></button></span></td>'
                     + '</tr>';
                      $("#serailscanlist").append(htmlAppend);
                      updateRowOrder();
                      $("#btnsaveallocline").trigger("click");
                      Bert.alert('<strong>OK</strong>', 'now-success');
                      OkaySound();
                  }

                 }

              }

            }


            }
            }

          }else{
            $("#allocBarcode").focus();
          }



        $('input[name="allocBarcode"]').val('');
        $("#allocBarcode").focus();

      }

    }
   }
    else
    {
     Bert.alert('<strong>Please Note:</strong> This function is only available on mobile devices!', 'now-dangerorange');
    }

  });
};
