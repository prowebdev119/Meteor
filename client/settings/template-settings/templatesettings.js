import { OrganisationService } from "../../js/organisation-service";
import { CountryService } from "../../js/country-service";
import { ReactiveVar } from "meteor/reactive-var";
import { SideBarService } from "../../js/sidebar-service";
import "../../lib/global/indexdbstorage.js";
let sideBarService = new SideBarService();
let organisationService = new OrganisationService();

var template_list = [
  "Bills",
  "Credits",
  "Customer Payments",
  "Customer Statements",
  "Invoices",
  "Invoice Back Orders",
  "Purchase Orders",
  "Quotes",
  "Refunds",
  "Sales Orders",
  "Supplier Payments",
];
var modal_data = [];

Template.templatesettings.onCreated(() => {
  console.log("created template setting", template_list);
  let templateObject = Template.instance();
  templateObject.invoice_data = new ReactiveVar([]);
});

Template.templatesettings.onRendered(function () {
  let templateObject = Template.instance();
  document.querySelectorAll(".templateItem").forEach((el) => {
    el.addEventListener("click", function () {
      title = el.getAttribute("data-id");
      templateObject.generateInvoiceData(title);
    });
  });

  $("#templatePreviewModal").on("shown.bs.modal", function () {
    const data = templateObject.invoice_data.get();
    // Session.set("template",data)
  });

  //save template fields in the localstorage   
  function saveTemplateFields(key, value){
    localStorage.setItem(key, value)
  }


  //update template with invoice type   
  function updateTemplate(object_invoce) {
    $("#templatePreviewModal").modal("toggle");
    if (object_invoce.length > 0) {
      console.log("entered");

      $("#templatePreviewModal .o_url").text(object_invoce[0]["o_url"]);
      $("#templatePreviewModal .o_name").text(object_invoce[0]["o_name"]);
      $("#templatePreviewModal .o_address1").text(
        object_invoce[0]["o_address"]
      );
      $("#templatePreviewModal .o_city").text(object_invoce[0]["o_city"]);
      $("#templatePreviewModal .o_state").text(object_invoce[0]["o_state"]);
      $("#templatePreviewModal .o_reg").text(object_invoce[0]["o_reg"]);
      $("#templatePreviewModal .o_abn").text(object_invoce[0]["o_abn"]);
      $("#templatePreviewModal .o_phone").text(object_invoce[0]["o_phone"]);

      if(object_invoce[0]["applied"] == ""){
        $("#templatePreviewModal .applied").hide()
        $("#templatePreviewModal .applied").text(object_invoce[0]["applied"]);
      }else{
        $("#templatePreviewModal .applied").show()
        $("#templatePreviewModal .applied").text("Applied : " +  object_invoce[0]["applied"]);
      }
      


      if(object_invoce[0]["supplier_type"] == ""){
        $("#templatePreviewModal .customer").hide()
      }else{
        $("#templatePreviewModal .customer").show()
      }
      $("#templatePreviewModal .customer").empty();
      $("#templatePreviewModal .customer").append(object_invoce[0]["supplier_type"]);

      if(object_invoce[0]["supplier_name"] == ""){
        $("#templatePreviewModal .pdfCustomerName").hide()
      }else{
        $("#templatePreviewModal .pdfCustomerName").show()
      }
      $("#templatePreviewModal .pdfCustomerName").empty();
      $("#templatePreviewModal .pdfCustomerName").append(object_invoce[0]["supplier_name"]);

      if(object_invoce[0]["supplier_addr"] == ""){
        $("#templatePreviewModal .pdfCustomerAddress").hide()
      }else{
        $("#templatePreviewModal .pdfCustomerAddress").show()
      }
      $("#templatePreviewModal .pdfCustomerAddress").empty();
      $("#templatePreviewModal .pdfCustomerAddress").append(object_invoce[0]["supplier_addr"]);

      
      $("#templatePreviewModal .print-header").text(object_invoce[0]["title"]);
      $("#templatePreviewModal .modal-title").text(
        object_invoce[0]["title"] + " template"
      );


      $("#templatePreviewModal .bsb").text( "BSB (Branch Number) : " + object_invoce[0]["bsb"]);
      $("#templatePreviewModal .account_number").text( "Account Number : " + object_invoce[0]["account"]);
      $("#templatePreviewModal .swift").text("Swift Code : " + object_invoce[0]["swift"]);


      if(object_invoce[0]["date"] == ""){
        $("#templatePreviewModal .dateNumber").hide();
      }else{
        $("#templatePreviewModal .dateNumber").show();
      }

      $("#templatePreviewModal .date").text(object_invoce[0]["date"]);

      if(object_invoce[0]["pqnumber"] == ""){
        $("#templatePreviewModal .pdfPONumber").hide();
      }else{
        $("#templatePreviewModal .pdfPONumber").show();
      }

      $("#templatePreviewModal .po").text(object_invoce[0]["pqnumber"]);

      if(object_invoce[0]["invoicenumber"] == ""){
        $("#templatePreviewModal .invoiceNumber").hide();
      }else{
        $("#templatePreviewModal .invoiceNumber").show();
      }
      console.log("invoice number==",object_invoce[0]["invoicenumber"])
      $("#templatePreviewModal .io").text(object_invoce[0]["invoicenumber"]);

      if(object_invoce[0]["refnumber"] == ""){
        $("#templatePreviewModal .refNumber").hide();
      }else{
        $("#templatePreviewModal .refNumber").show();
      }
      $("#templatePreviewModal .ro").text(object_invoce[0]["refnumber"]);
      
      if(object_invoce[0]["duedate"] == ""){
        $("#templatePreviewModal .pdfTerms").hide();
      }else{
        $("#templatePreviewModal .pdfTerms").show();
      }
      $("#templatePreviewModal .due").text(object_invoce[0]["duedate"]);
    
      if (object_invoce[0]["paylink"] == "") {
        $("#templatePreviewModal .link").hide();
        $("#templatePreviewModal .linkText").hide();
      } else {
        $("#templatePreviewModal .link").show();
        $("#templatePreviewModal .linkText").show();
      }

    //   table header
      var tbl_header = $("#templatePreviewModal .tbl_header")
      tbl_header.empty()
      for(const [key , value] of Object.entries(object_invoce[0]["fields"])){
            console.log("key and value", key)
            console.log("key and value", value)
            tbl_header.append("<th style='width:" + value + "%'; color: rgb(0 0 0);'>" + key + "</th>")
      }
    }

    // table content
     var tbl_content = $("#templatePreviewModal .tbl_content")
     tbl_content.empty()
     const data = object_invoce[0]["data"]
     
     for(item of data){
        tbl_content.append("<tr style='border-bottom: 1px solid rgba(0, 0, 0, .1);'>")
        var content = ""
         for(item_temp of item){
            content = content + "<td>" + item_temp + "</td>"
         }
         tbl_content.append(content)
         tbl_content.append("</tr>")
     }
    
    // total amount 

    if(object_invoce[0]["subtotal"] != ""){
        $("#templatePreviewModal #subtotal_totalPrint").text(object_invoce[0]["subtotal"]);
    }

    if(object_invoce[0]["gst"] != ""){
        $("#templatePreviewModal #totalTax_totalPrint").text(object_invoce[0]["gst"]);
    }

    if(object_invoce[0]["total"] != ""){
        $("#templatePreviewModal #grandTotalPrint").text(object_invoce[0]["total"]);
    }

    if(object_invoce[0]["bal_due"] != ""){
        $("#templatePreviewModal #totalBalanceDuePrint").text(object_invoce[0]["bal_due"]);
    }

    if(object_invoce[0]["paid_amount"] != ""){
        $("#templatePreviewModal #paid_amount").text(object_invoce[0]["paid_amount"]);
    }
  }

  // show bill data with dummy data
  function showBillData(template_title) {
    object_invoce = [];
    var array_data = [];
    array_data.push([
      "Accumlated Depreciation",
      "Accumlated Depreciation",
      "$0.00",
      "$900.00",
    ]);
    let item = {
      o_url: "vs1cloud.com",
      o_name: "Sample Company",
      o_address: "123 street",
      o_city: "Los Angeles",
      o_state: "Califonia 12345",
      o_reg: "",
      o_abn: "ABN : 5678905",
      o_phone: "Phone : 25151944",
      title: template_title,
      date: "30 / 03 / 2022",
      invoicenumber: "789",
      refnumber: "",
      pqnumber: "",
      duedate: "",
      paylink: "",
      supplier_type: "Supplier",
      supplier_name : "<p>Car Wash Express</p>",
      supplier_addr : "",
      fields: {"Account Name" : "30", "Memo" : "30", "Tax" : "20", "Amount" : "20"},
      subtotal : "$900.00",
      gst : "$0.00",
      total : "$900.00",
      paid_amount : "$900.00",
      bal_due : "$0.00",
      bsb : "",
      account : "",
      swift : "",
      applied : "",
      data: array_data,
    };
    object_invoce.push(item);
    $("#templatePreviewModal .field_payment").hide();
    $("#templatePreviewModal .field_amount").show();
    updateTemplate(object_invoce);

    saveTemplateFields("fields" + template_title , object_invoce[0]["fields"])
  }

  //show credit data with dummy data
  function showCreditData(template_title) {
    object_invoce = [];
    var array_data = [];
    array_data.push([
      "Coghlin Tools Loan",
      "Advance to purchase tools",
      "$0.00",
      "$55.00",
    ]);
    array_data.push([
      "Bank Charges",
      "Bank Charges and Fees",
      "$0.00",
      "$70.00",
    ]);

    let item_credits = {
      o_url: "vs1cloud.com",
      o_name: "Sample Company",
      o_address: "123 street",
      o_city: "Los Angeles",
      o_state: "Califonia 12345",
      o_reg: "",
      o_abn: "ABN : 5678905",
      o_phone: "Phone : 25151944",
      title: template_title,
      date: "",
      invoicenumber: "17/03/2022",
      refnumber: "",
      pqnumber: "",
      duedate: "",
      paylink: "",
      supplier_type: "Supplier",
      supplier_name : "<p>The interesting <br>Company</p>",
      supplier_addr : "<p>123 Street <br> PE Eastern 5115 <br> Australia</p>",
      fields: {"Account Name" : "30", "Memo" : "30", "Tax" : "20", "Amount" : "20"},
      subtotal : "$125.00",
      gst : "$0.00",
      total : "$125.00",
      paid_amount : "$0.00",
      bal_due : "$125.00",
      bsb : "",
      account : "",
      swift : "",
      data: array_data,
      applied : ""
    };

    object_invoce.push(item_credits);

    $("#templatePreviewModal .field_payment").hide();
    $("#templatePreviewModal .field_amount").show();

    updateTemplate(object_invoce);

    saveTemplateFields("fields" + template_title , object_invoce[0]["fields"])
  }

  //show customer payment info with DummyData
  function showCustomerPayment(template_title) {
    object_invoce = [];
    var array_data = [];
    array_data.push([
      "13/12/2021",
      "invoice",
      "710",
      "$50.00",
      "$50.00",
      "$50.00",
      "$0.00",
    ]);

    let item_payments = {
      o_url: "vs1cloud.com",
      o_name: "Sample Company",
      o_address: "123 street",
      o_city: "Los Angeles",
      o_state: "Califonia 12345",
      o_reg: "",
      o_abn: "ABN : 5678905",
      o_phone: "Phone : 25151944",
      title: template_title,
      date: "14/04/2022",
      invoicenumber: "",
      refnumber: "5677",
      pqnumber: "",
      duedate: "",
      paylink: "",
      supplier_type: "Customer",
      supplier_name : "<p>Brand New <br> Company </p>",
      supplier_addr : "<p> JHB <br> GA1515 <br> Australia",
      fields: {"Date" : "20", "Type" : "10", "Trans" : "10", "Original" : "20", "Due" : "10" , "Paid" : "10", "Outstanding" : "20"},
      subtotal : "",
      gst : "",
      total : "",
      paid_amount : "",
      bal_due : "",
      bsb : "",
      account : "",
      swift : "",
      data: array_data,
      applied : "$50.00"
    };

    object_invoce.push(item_payments);

    $("#templatePreviewModal .field_payment").hide();
    $("#templatePreviewModal .field_amount").hide();

    updateTemplate(object_invoce);

    saveTemplateFields("fields" + template_title , object_invoce[0]["fields"])
  }

    //show customer payment info with DummyData
    function showCustomerStatments(template_title) {
        object_invoce = [];
        var array_data = [];
        array_data.push([
          "720",
          "15/03/2022",
          "Payment",
          "30/12/1899",
          "-$15,000.00",
          "$0.00",
          "-$15,000.00",
        ]);

        array_data.push([
            "712",
            "17/03/2022",
            "Payment",
            "30/12/1899",
            "-$7,000.00",
            "$0.00",
            "-$70,000.00",
          ]);

          array_data.push([
            "718",
            "17/03/2022",
            "Payment",
            "30/12/1899",
            "-$15,000.00",
            "$0.00",
            "-$15,000.00",
          ]);
    
        let item_statement = {
          o_url: "vs1cloud.com",
          o_name: "Sample Company",
          o_address: "123 street",
          o_city: "",
          o_state: "",
          o_reg: "",
          o_abn: "ABN : 5678905",
          o_phone: "Phone : 25151944",
          title: template_title,
          date: "11/04/2022",
          invoicenumber: "",
          refnumber: "",
          pqnumber: "",
          duedate: "",
          paylink: "Pay Now",
          supplier_type: "Customer",
          supplier_name : "John Wayne Inc",
          supplier_addr : "",
          fields: {"ID" : "10", "Date" : "10", "Type" : "10", "Due Date" : "20", "Total" : "20" , "Paid" : "10", "Balance" : "20"},
          subtotal : "",
          gst : "",
          total : "",
          paid_amount : "",
          bal_due : "$100,000.00",
          bsb : "",
          account : "",
          swift : "",
          data: array_data,
          applied : "$0.00"
        };
    
        object_invoce.push(item_statement);

        $("#templatePreviewModal .field_payment").hide();
        $("#templatePreviewModal .field_amount").hide();


        updateTemplate(object_invoce);

        saveTemplateFields("fields" + template_title , object_invoce[0]["fields"])
      }

  //show invoice payment info with DummyData
  function showInvoice(template_title) {
    object_invoce = [];
    var array_data = [];
    array_data.push([
      "Fanta Grape Can",
      "Fanta Grape Can SODA",
      "1",
      "$0.00",
      "$0.00",
      "$0.00",
    ]);

    array_data.push([
        "Fanta Grape Can",
        "Fanta Grape Can SODA",
        "1",
        "$0.00",
        "$0.00",
        "$0.00",
      ]);


    let item_invoices = {
      o_url: "vs1cloud.com",
      o_name: "Sample Company",
      o_address: "123 street",
      o_city: "Los Angeles",
      o_state: "Califonia 12345",
      o_reg: "",
      o_abn: "ABN : 5678905",
      o_phone: "Phone : 25151944",
      title: template_title + "733",
      date: "12/04/2022",
      invoicenumber: "12/04/2022",
      refnumber: "",
      pqnumber: "",
      duedate: "14/04/2022",
      paylink: "Pay Now",
      supplier_type: "Customer",
      supplier_name : "<p>Car Wash Express</p>",
      supplier_addr : "",
      fields: {"Product Name" : "20", "Description" : "20", "Qty" : "10", "Unit Price" : "10", "Tax" : "20", "Amount" : "20" },
      subtotal : "$10.00",
      gst : "$0.00",
      total : "$10.00",
      paid_amount : "$0.00",
      bal_due : "$10.00",
      bsb : "4654-454",
      account : "16161616",
      swift : "WPOCA5s",
      data: array_data,
      applied : ""
    };

    object_invoce.push(item_invoices);

    $("#templatePreviewModal .field_payment").show();
    $("#templatePreviewModal .field_amount").show();

    updateTemplate(object_invoce);

    saveTemplateFields("fields" + template_title , object_invoce[0]["fields"])
  }

  //show invoice back  info with DummyData
  function showInvoiceBack(template_title) {
    object_invoce = [];
    var array_data = [];
    array_data.push([
        "Fanta Grape Can",
        "Fanta Grape Can SODA",
        "1",
        "$0.00",
        "$0.00",
        "$0.00",
      ]);
  
      array_data.push([
          "Fanta Grape Can",
          "Fanta Grape Can SODA",
          "1",
          "$0.00",
          "$0.00",
          "$0.00",
        ]);

    let item_invoices_back = {
        o_url: "vs1cloud.com",
        o_name: "Sample Company",
        o_address: "123 street",
        o_city: "Los Angeles",
        o_state: "Califonia 12345",
        o_reg: "",
        o_abn: "ABN : 5678905",
        o_phone: "Phone : 25151944",
        title: template_title + "733",
        date: "12/04/2022",
        invoicenumber: "12/04/2022",
        refnumber: "",
        pqnumber: "",
        duedate: "14/04/2022",
        paylink: "Pay Now",
        supplier_type: "Customer",
        supplier_name : "<p>Car Wash Express</p>",
        supplier_addr : "",
        fields: {"Product Name" : "20", "Description" : "20", "Qty" : "10", "Unit Price" : "10", "Tax" : "20", "Amount" : "20" },
        subtotal : "$10.00",
        gst : "$0.00",
        total : "$10.00",
        paid_amount : "$0.00",
        bal_due : "$10.00",
        bsb : "4654-454",
        account : "16161616",
        swift : "WPOCA5s",
        data: array_data,
        applied : ""
    };

    object_invoce.push(item_invoices_back);
    $("#templatePreviewModal .field_payment").show();
    $("#templatePreviewModal .field_amount").show();

    updateTemplate(object_invoce);

    saveTemplateFields("fields" + template_title , object_invoce[0]["fields"])
  }


    //show purchase orders  info with DummyData
    function showPurchaseOrder(template_title) {
        object_invoce = [];
        var array_data = [];
        array_data.push([
          "ABC Product",
          "ABC Product",
          "5",
          "$5.00",
          "$0.00",
          "$0.00",
        ]);

        let item_purchase = {
          o_url: "vs1cloud.com",
          o_name: "Sample Company",
          o_address: "123 street",
          o_city: "Los Angeles",
          o_state: "Califonia 12345",
          o_reg: "",
          o_abn: "5678905",
          o_phone: "25151944",
          title: template_title + " 287",
          date: "29/03/2022",
          invoicenumber: ".",
          refnumber: "",
          pqnumber: "",
          duedate: "29/03/2022",
          paylink: "",
          supplier_type: "Supplier",
          supplier_name : "<p>ABC Building Company</p>",
          supplier_addr : "<p> Dallas <br> Texas 8877 <br> United States",
          fields: {"Product Name" : "20", "Description" : "20", "Qty" : "10", "Unit Price" : "10", "Tax" : "20", "Amount" : "20" },
          subtotal : "$0.00",
          gst : "$0.00",
          total : "$0.00",
          paid_amount : "",
          bal_due : "",
          bsb : "",
          account : "",
          swift : "",
          data: array_data,
          applied : ""
        };

        object_invoce.push(item_purchase);
        $("#templatePreviewModal .field_payment").hide();
        $("#templatePreviewModal .field_amount").show();
        updateTemplate(object_invoce);

        saveTemplateFields("fields" + template_title , object_invoce[0]["fields"])
      }


    //show Quotes  info with DummyData
    function showQuotes(template_title) {
        object_invoce = [];
        var array_data = [];
        array_data.push([
          "Fanta Grape Can",
          "Fanta Grape Can SODA",
          "1",
          "$0.00",
          "$0.00",
          "$0.00",
        ]);

        let item_quote = {
          o_url: "vs1cloud.com",
          o_name: "Sample Company",
          o_address: "123 street",
          o_city: "Los Angeles",
          o_state: "Califonia 12345",
          o_reg: "",
          o_abn: "5678905",
          o_phone: "25151944",
          title: template_title + " 287",
          date: "14/04/2022",
          invoicenumber: "",
          refnumber: "",
          pqnumber: "_",
          duedate: "14/04/2022",
          paylink: "Pay Now",
          supplier_type: "Customer",
          supplier_name : "<p>Accenture Software Dev</p>",
          supplier_addr : "<p>Building 3 , Waterfall Corporate <br> South Africa</p>",
          fields: {"Product Name" : "20", "Description" : "20", "Qty" : "10", "Unit Price" : "10", "Tax" : "20", "Amount" : "20" },
          subtotal : "$0.00",
          gst : "$0.00",
          total : "$0.00",
          paid_amount : "$0.00",
          bal_due : "$0.00",
          bsb : "4654-454",
          account : "151515",
          swift : "WPOCA5s",
          data: array_data,
          applied : ""
        };

        object_invoce.push(item_quote);
        $("#templatePreviewModal .field_payment").show();
        $("#templatePreviewModal .field_amount").show();
        updateTemplate(object_invoce);

        saveTemplateFields("fields" + template_title , object_invoce[0]["fields"])
      }


    //show refund  info with DummyData
    function showRefund(template_title) {
        object_invoce = [];
        var array_data = [];
        array_data.push([
          "Bank Stickers",
          "Bank Stickers",
          "1",
          "$50.00",
          "$0.00",
          "-$50.00",
        ]);

        let item_refund = {
          o_url: "vs1cloud.com",
          o_name: "Sample Company",
          o_address: "123 street",
          o_city: "Los Angeles",
          o_state: "Califonia 12345",
          o_reg: "",
          o_abn: "5678905",
          o_phone: "25151944",
          title: template_title + " 738",
          date: "14/04/2022",
          invoicenumber: "",
          refnumber: "",
          pqnumber: "90 days",
          duedate: "29/03/2022",
          paylink: "",
          supplier_type: "Customer",
          supplier_name : "<p>Accenture Software Dev</p>",
          supplier_addr : "<p>Building 3, Waterfall Corporate <br> South Africa</p>",
          fields: {"Product Name" : "20", "Description" : "20", "Qty" : "10", "Unit Price" : "10", "Tax" : "20", "Amount" : "20" },
          subtotal : "-$50.00",
          gst : "$0.00",
          total : "-$50.00",
          paid_amount : "$0.00",
          bal_due : "-$50.00",
          bsb : "",
          account : "",
          swift : "",
          data: array_data,
          applied : ""
        };

        object_invoce.push(item_refund);
        $("#templatePreviewModal .field_payment").hide();
        $("#templatePreviewModal .field_amount").show();
        updateTemplate(object_invoce);

        saveTemplateFields("fields" + template_title , object_invoce[0]["fields"])
      }

      //show selas order  info with DummyData
    function showSealsOrder(template_title) {
        object_invoce = [];
        var array_data = [];
        array_data.push([
          "",
          "",
          "",
          "$0",
          "$0.00",
          "$0.00",
        ]);

        let item_sale = {
          o_url: "vs1cloud.com",
          o_name: "Sample Company",
          o_address: "123 street",
          o_city: "Los Angeles",
          o_state: "Califonia 12345",
          o_reg: "",
          o_abn: "5678905",
          o_phone: "25151944",
          title: template_title + " 287",
          date: "14/04/2022",
          invoicenumber: "",
          refnumber: "",
          pqnumber: " _ ",
          duedate: "14/04/2022",
          paylink: "Pay Now",
          supplier_type: "Customer",
          supplier_name : "Car Wash Express",
          supplier_addr : "Australia",
          fields: {"Product Name" : "20", "Description" : "20", "Qty" : "10", "Unit Price" : "10", "Tax" : "20", "Amount" : "20" },
          subtotal : "$0.00",
          gst : "$0",
          total : "$0",
          paid_amount : "$0",
          bal_due : "$0",
          bsb : "4654-454",
          account : "16161616",
          swift : "WPOCA5s",
          data: array_data,
          applied : ""
        };

        object_invoce.push(item_sale);
        $("#templatePreviewModal .field_payment").show();
        $("#templatePreviewModal .field_amount").show();
        updateTemplate(object_invoce);

        saveTemplateFields("fields" + template_title , object_invoce[0]["fields"])
      }


    //show suppliers order  info with DummyData
    function showSuppliers(template_title) {
        object_invoce = [];
        var array_data = [];
        array_data.push([
          "30/03/2022",
          "Bill",
          "298",
          "$900.00",
          "$900.00",
          "$0.00",
        ]);

        let item_supplier = {
          o_url: "vs1cloud.com",
          o_name: "Sample Company",
          o_address: "123 street",
          o_city: "Los Angeles",
          o_state: "Califonia 12345",
          o_reg: "",
          o_abn: "5678905",
          o_phone: "25151944",
          title: template_title + " 287",
          date: "11/04/2022",
          invoicenumber: "",
          refnumber: "67886",
          pqnumber: "",
          duedate: "",
          paylink: "",
          supplier_type: "Supplier",
          supplier_name : "Brand New Company",
          supplier_addr : "",
          fields: {"Date" : "20", "Type" : "10", "No" : "10", "Amount" : "20", "Due" : "10" , "Paid" : "10", "Outstanding" : "20"},
          subtotal : "",
          gst : "",
          total : "",
          paid_amount : "",
          bal_due : "",
          bsb : "",
          account : "",
          swift : "",
          data: array_data,
          applied : ""
        };

        object_invoce.push(item_supplier);

        $("#templatePreviewModal .field_payment").hide();
        $("#templatePreviewModal .field_amount").hide();


        updateTemplate(object_invoce);

        saveTemplateFields("fields" + template_title , object_invoce[0]["fields"])
      }


  templateObject.generateInvoiceData = function (template_title) {
    object_invoce = [];
    switch (template_title) {
      case "Bills":
        showBillData(template_title);
        break;

      case "Credits":
        showCreditData(template_title);
        break;

      case "Customer Payments":
        showCustomerPayment(template_title);
        break;

      
    case "Customer Statements":
        showCustomerStatments(template_title);
        break;  

      case "Invoices":
        showInvoice(template_title);
        break;

      case "Invoice Back Orders":
        showInvoiceBack(template_title);
        break;

      case "Purchase Orders":
        showPurchaseOrder(template_title)
        break;

      case "Quotes":
        showQuotes(template_title)
        break;

      case "Refunds":
        showRefund(template_title)
        break;

      case "Sales Orders":
        showSealsOrder(template_title)
        break;

      case "Supplier Payments":
        showSuppliers(template_title)
        break;
    }

  };
});

Template.templatesettings.helpers({
  getTemplateList: function () {
    return template_list;
  },

  getTemplateNumber: function () {
    let template_numbers = ["1", "2", "3"];
    return template_numbers;
  },
});

Template.templatesettings.events({});
