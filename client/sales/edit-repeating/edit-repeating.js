import { ReactiveVar } from 'meteor/reactive-var';
import {SalesBoardService} from '../../js/sales-service';
import {AccountService} from "../../accounts/account-service";
import {InvoiceService} from "../../invoice/invoice-service";
import {UtilityService} from "../../utility-service";
const _ = require('lodash');

Template.editRepeating.onCreated(function(){
    let templateObj = Template.instance();
    templateObj.invrecord = new ReactiveVar();
    templateObj.records = new ReactiveVar();
    templateObj.currencySymbol = new ReactiveVar();
    templateObj.taxrateobj = new ReactiveVar();
    templateObj.selectedCurrency = new ReactiveVar();
    templateObj.taxCode = new ReactiveVar();
    templateObj.inputSelectedCurrency = new ReactiveVar();
    templateObj.attachmentCount = new ReactiveVar();
    templateObj.uploadedFiles = new ReactiveVar([]);
});
Template.editRepeating.onRendered(function(){

    let getDatePicker = function(id){
        $("#"+id).datepicker({
            showOn: 'button',
            buttonText: 'Show Date',
            buttonImageOnly: true,
            buttonImage: '/img/dropdown_icon.png',
            dateFormat: 'd M yy',
            showOtherMonths: true,
            selectOtherMonths: true,
            changeMonth: true,
            changeYear: true,
yearRange: "-90:+10",
        });
    };
    getDatePicker('invoiceDate');
    getDatePicker('endDate');
    $("#invoiceDate").val(moment().format('DD MMM YYYY'));
    let salesService = new SalesBoardService();
    let accountService = new AccountService()
    let invoice_id = FlowRouter.current().queryParams.id;
    let templateObject = Template.instance();
    let initCurrency = Currency;
    let currencySymbol;
    const records =[];
    let accountsList = [];
    let productList = [];
    const taxCodesList = [];
    let DataList = [];
    templateObject.getCurrencies = function(){
        salesService.getCurrency().then(function(data){
            for(let i in data.tcurrency){

                let recordObj = {
                    Code: data.tcurrency[i].Code || ' ',
                    Country : data.tcurrency[i].Country || ' ',
                    Currency: data.tcurrency[i].Currency || ' ',
                    CurrencySymbol: data.tcurrency[i].CurrencySymbol || initCurrency,
                };
                records.push(recordObj);
            }
            templateObject.records.set(records);
        });
    };
    templateObject.getCurrencies();
    templateObject.getAllAccountTypes = function(){
        salesService.getProducts().then(function(data){
            for(let i=0; i<data.tproduct.length; i++){
                let dataObj = {};
                let label =  data.tproduct[i].ProductName;
                let desciption = data.tproduct[i].SalesDescription;
                let prodPrice = data.tproduct[i].SellQty1Price;
                let taxCode = data.tproduct[i].TaxCodeSales;
                dataObj.label = label;
                dataObj.desciption = desciption;
                dataObj.prodPrice = prodPrice;
                dataObj.taxCode = taxCode;
                accountsList.push(dataObj);
            }
        });
    };

    templateObject.getAccountDropDown = function(){
        $.widget( "custom.accdropdown", $.ui.autocomplete, {
            _create: function() {
                this._super();
                this.widget().menu( "option", "items", "> :not(.ui-autocomplete-category)" );
            },
            _renderMenu: function( ul, items ) {
                let that = this,
                    currentCategory = "";
                ul.append( "<li  class='add_new_popup newItem' data-toggle='modal' data-target='#newProduct'>" + "+ New Item" + "</li>" );
                $.each( items, function( index, item ) {
                    let li;
                    li = that._renderItemData( ul, item );
                    if ( item.category ) {
                        li.attr( "aria-label", item.category  );
                    }
                });
            }
        });
        this.$(".select-product").accdropdown({
            delay: 0,
            source: function (request, response) {
                var top_suggestions = $.map(accountsList, function (json) {

                    if ( json.label.toUpperCase().indexOf(request.term.toUpperCase()) === 0 ) {
                        return json;
                    }
                });
                var final_results = _.uniq(top_suggestions,"label");

                response(top_suggestions);
            },
            minLength: 0,
            select:function(event,ui) {
                let id = this.id.split('product-input-')[1];
                if (ui.item === undefined) {
                    $(".item-dropdown").css("display", "none");
                    templateObject.currentRowID.set(id);
                }
                else {
                    let unitPrice = parseFloat(ui.item.prodPrice) || 0;
                    let Amount = 1 * parseFloat(ui.item.prodPrice);
                    let $tblrows = $("#component_tbUpdate tbody tr");
                    //const tempTaxObj = Template.instance();
                    let taxRateData = (templateObject.taxrateobj.get());
                    let currencySymbol = templateObject.currencySymbol.get();
                    let flag = 0;
                    let indexValue;
                    let taxCode = templateObject.taxCode.get();
                    if (taxCode.length == 0) {
                        let obj = {
                            id: id,
                            tax: ui.item.taxCode
                        };
                        DataList.push(obj);
                        templateObject.taxCode.set(DataList);
                    }
                    else {
                        for (let i = 0; i < taxCode.length; i++) {
                            if (taxCode[i].id == id) {
                                flag = true;
                                indexValue = i;
                            }
                        }
                        if (flag == true) {
                            taxCode[indexValue].tax = ui.item.taxCode;
                            templateObject.taxCode.set(taxCode);
                        }
                        else {
                            let obj = {
                                id: id,
                                tax: ui.item.taxCode
                            };
                            DataList.push(obj);
                            templateObject.taxCode.set(DataList);
                        }
                    }
                    $.each(taxRateData, function () {
                        if (this.label === ui.item.taxCode) {
                            $("#TaxRate-" + id).val(this.rate);
                        } else {
                            $("#TaxRate-" + id).val(0);
                        }

                    });
                    $("#tax-rate-input-" + id).html(ui.item.taxCode);
                    $("#productdesc-" + id).html(ui.item.desciption);
                    $("#UnitPrice-" + id).html(unitPrice.toFixed(2));
                    $("#Ordered-" + id).html(1);
                    $("#TotalAmt-" + id).html(Amount.toFixed(2));
                    $("#displayTotalAmt-" + id).html(currencySymbol + Amount.toFixed(2));
                    if (templateObject.$("#myTaxDropdown").val() == "No Tax") {
                        $('#taxRateHeader').css('background', '#ccc');
                        $("#tax-rate-input-" + id).attr('readonly', true);
                        $("#tax-rate-input-" + id).prop('disabled', true);
                        $('.taxcodetotal').hide();
                        $tblrows.each(function (index) {
                            var $tblrow = $(this);
                            //$tblrow.find('.qty').on('change', function () {
                            var qty = $tblrow.find(".qty").html();
                            var taxrate = $tblrow.find(".taxrate").val();
                            
                            var price = $tblrow.find(".unitPrice").html();
                            var subTotal = parseInt(qty, 10) * parseFloat(price);
                            var taxTotal = 0;
                            if (!isNaN(subTotal)) {

                                $tblrow.find('.subtot').val(subTotal.toFixed(2));
                                $tblrow.find('.displaySubtot').html(currencySymbol + subTotal.toFixed(2));
                                var SubGrandTotal = 0;
                                $(".subtot").each(function () {
                                    var stval = parseFloat($(this).val());
                                    SubGrandTotal += isNaN(stval) ? 0 : stval;

                                });
                                //taxtot
                                document.getElementById("subtotal_total").innerHTML = currencySymbol + '' + SubGrandTotal.toFixed(2);


                            }

                            if (!isNaN(taxTotal)) {

                                $tblrow.find('.taxtot').val(taxTotal.toFixed(2));
                                var GrandTaxTotal = 0;
                                $(".taxtot").each(function () {
                                    var stval = parseFloat($(this).val());
                                    GrandTaxTotal += isNaN(stval) ? 0 : stval;

                                });
                                //taxtot
                                document.getElementById("subtotal_total3").innerHTML = currencySymbol + '' + GrandTaxTotal.toFixed(2);
                                //document.getElementById("subtotal_total2").innerHTML = Currency+''+SubGrandTotal.toFixed(2);

                            }

                            if (!isNaN(GrandTaxTotal) && (!isNaN(SubGrandTotal))) {
                                let GrandTotal = (parseFloat(GrandTaxTotal)) + (parseFloat(SubGrandTotal));
                                document.getElementById("subtotal_total2").innerHTML = currencySymbol + '' + GrandTotal.toFixed(2);
                            }


                        });
                    } else {
                        $('#taxRateHeader').css('background', '');
                        $("#tax-rate-input-" + id).attr('readonly', false);
                        $("#tax-rate-input-" + id).prop('disabled', false);
                        $('.taxcodetotal').show();
                        $tblrows.each(function (index) {
                            var $tblrow = $(this);
                            //$tblrow.find('.qty').on('change', function () {

                            var qty = $tblrow.find(".qty").html();

                            var taxrate = $tblrow.find(".taxrate").val();
                            
                            var price = $tblrow.find(".unitPrice").html();
                            var subTotal = parseInt(qty, 10) * parseFloat(price);
                            var taxTotal = parseInt(qty, 10) * parseFloat(price) * parseFloat(taxrate);
                            if (!isNaN(subTotal)) {

                                $tblrow.find('.subtot').val(subTotal.toFixed(2));
                                $tblrow.find('.displaySubtot').html(currencySymbol + subTotal.toFixed(2));
                                var SubGrandTotal = 0;
                                $(".subtot").each(function () {
                                    var stval = parseFloat($(this).val());
                                    SubGrandTotal += isNaN(stval) ? 0 : stval;

                                });
                                //taxtot
                                document.getElementById("subtotal_total").innerHTML = currencySymbol + '' + SubGrandTotal.toFixed(2);


                            }

                            if (!isNaN(taxTotal)) {

                                $tblrow.find('.taxtot').val(taxTotal.toFixed(2));
                                var GrandTaxTotal = 0;
                                $(".taxtot").each(function () {
                                    var stval = parseFloat($(this).val());
                                    GrandTaxTotal += isNaN(stval) ? 0 : stval;

                                });
                                //taxtot
                                document.getElementById("subtotal_total3").innerHTML = currencySymbol + '' + GrandTaxTotal.toFixed(2);
                                //document.getElementById("subtotal_total2").innerHTML = Currency+''+SubGrandTotal.toFixed(2);

                            }

                            if (!isNaN(GrandTaxTotal) && (!isNaN(SubGrandTotal))) {
                                let GrandTotal = (parseFloat(GrandTaxTotal)) + (parseFloat(SubGrandTotal));
                                document.getElementById("subtotal_total2").innerHTML = currencySymbol + '' + GrandTotal.toFixed(2);
                            }


                        });
                    }
                }
            }
        }).focus(function() {
            $(this).accdropdown('search', "");
            //  $(".product-img").show();
        });
        $(".select-product").accdropdown( "widget" ).addClass( "item-dropdown" );
    };

    templateObject.getAllTaxCodes = function(){
        salesService.getTaxCodesVS1().then(function(data){


            for(let i=0; i<data.ttaxcodevs1.length; i++){
                let dataObj2 = {};
                let label =  data.ttaxcodevs1[i].CodeName;
                let rate = data.ttaxcodevs1[i].Rate;
                dataObj2.label = label;
                dataObj2.rate = rate;
                taxCodesList.push(dataObj2);
                templateObject.taxrateobj.set(taxCodesList);
            }
        });

    };

    templateObject.getTaxRateDropDown = function(){
        $.widget( "custom.taxdropdown", $.ui.autocomplete, {
            _create: function() {
                this._super();
                this.widget().menu( "option", "items", "> :not(.ui-autocomplete-category)" );
            },
            _renderMenu: function( ul, items ) {
                let that = this,
                    currentCategory = "";
                ul.append( "<li class='add_new_popup' data-toggle='modal' data-target='#myModal'>" + "+ Add new tax rate..." + "</li>" );
                $.each( items, function( index, item ) {
                    let li;

                    li = that._renderItemData( ul, item );
                    if ( item.category ) {
                        li.attr( "aria-label", item.label  );
                    }
                });
            }
        });

        this.$(".select-tax-rate").taxdropdown({
            source: taxCodesList,
            minLength: 0,
            select:function(event,ui){
                let id = this.id.split('tax-rate-input-')[1];
                let $tblrows = $("#component_tbUpdate tbody tr");
                let currencySymbol = templateObject.currencySymbol.get();
                let flag=0;
                let indexValue;
                let taxCode=templateObject.taxCode.get();
                if(taxCode.length==0){
                    let obj={
                        id:id,
                        tax:ui.item.label
                    };
                    DataList.push(obj);
                    templateObject.taxCode.set(DataList);
                }else {
                    for (let i = 0; i < taxCode.length; i++) {
                        if (taxCode[i].id == id) {
                            flag = true;
                            indexValue = i;
                        }
                    }
                    if (flag == true) {
                        taxCode[indexValue].tax = ui.item.label;
                        templateObject.taxCode.set(taxCode);
                    }
                    else {
                        let obj = {
                            id: id,
                            tax: ui.item.label
                        };
                        DataList.push(obj);
                        templateObject.taxCode.set(DataList);
                    }
                }
                if(ui.item.rate != ''){
                    $("#TaxRate-" + id).val(ui.item.rate);
                }else{
                    $("#TaxRate-" + id).val(0);
                }
                $tblrows.each(function (index) {
                    var $tblrow = $(this);
                    var qty = $tblrow.find(".qty").html();

                    var taxrate = $tblrow.find(".taxrate").val();
                    
                    var price = $tblrow.find(".unitPrice").html();
                    var subTotal = parseInt(qty,10) * parseFloat(price);
                    var taxTotal = parseInt(qty,10) * parseFloat(price) * parseFloat(taxrate);
                    if (!isNaN(subTotal)) {

                        $tblrow.find('.subtot').val(subTotal.toFixed(2));
                        $tblrow.find('.displaySubtot').html(currencySymbol+subTotal.toFixed(2));
                        var SubGrandTotal = 0;
                        $(".subtot").each(function () {
                            var stval = parseFloat($(this).val());
                            SubGrandTotal += isNaN(stval) ? 0 : stval;

                        });
                        //taxtot
                        document.getElementById("subtotal_total").innerHTML = currencySymbol+''+SubGrandTotal.toFixed(2);


                    }

                    if (!isNaN(taxTotal)) {

                        $tblrow.find('.taxtot').val(taxTotal.toFixed(2));
                        var GrandTaxTotal = 0;
                        $(".taxtot").each(function () {
                            var stval = parseFloat($(this).val());
                            GrandTaxTotal += isNaN(stval) ? 0 : stval;

                        });
                        //taxtot
                        document.getElementById("subtotal_total3").innerHTML = currencySymbol+''+GrandTaxTotal.toFixed(2);
                        //document.getElementById("subtotal_total2").innerHTML = Currency+''+SubGrandTotal.toFixed(2);

                    }

                    if (!isNaN(GrandTaxTotal) && (!isNaN(SubGrandTotal))) {
                        let GrandTotal = (parseFloat(GrandTaxTotal)) + (parseFloat(SubGrandTotal));
                        document.getElementById("subtotal_total2").innerHTML = currencySymbol+''+GrandTotal.toFixed(2);
                    }
                    //let GrandTotal = (parseFloat(GrandTaxTotal)) + (parseFloat(SubGrandTotal));
                    
                    //document.getElementById("subtotal_total2").innerHTML = Currency+''+GrandTotal.toFixed(2);
                    // });

                });

            }
        }).focus(function() {
            $(this).taxdropdown('search', "")
        });
        $(".select-tax-type1").autocomplete({
            source: taxCodesList,
            minLength: 0,
            select:function(event,ui){
                templateObject.newItemTaxRate.set(ui.item.rate);
            }
        }).focus(function () {
            $(this).autocomplete('search', "")
        });

        $(".select-tax-type2").autocomplete({
            source: taxCodesList,
            minLength: 0
        }).focus(function () {
            $(this).autocomplete('search', "")
        });
    };
    templateObject.getAllAccountTypes();
    templateObject.getAllTaxCodes();
     setTimeout(function(){
        templateObject.getTaxRateDropDown();
    },2000);


    setTimeout(function(){
        templateObject.getAccountDropDown();
    },2000);

        salesService.getOneInvoicedata(invoice_id).then(function (data) {
            let lineItems = [];
            let lineItemObj = {};
            let exchangeCode = data.fields.ForeignExchangeCode;
            let currencySymbol = '';
            let currencyRecord = templateObject.records.get();
            $.each(currencyRecord, function () {
                if(this.Code == exchangeCode){
                    if(this.CurrencySymbol != ''){
                        currencySymbol = this.CurrencySymbol;
                        templateObject.currencySymbol.set(this.CurrencySymbol);
                    }else{
                        currencySymbol = Currency;
                        templateObject.currencySymbol.set(currencySymbol);
                    }
                }
            });
            let total = currencySymbol +''+data.fields.TotalAmount.toLocaleString(undefined, {minimumFractionDigits: 2});
            let totalInc = currencySymbol +''+data.fields.TotalAmountInc.toLocaleString(undefined, {minimumFractionDigits: 2});
            let subTotal = currencySymbol +''+data.fields.TotalAmount.toLocaleString(undefined, {minimumFractionDigits: 2});
            let totalTax = currencySymbol +''+data.fields.TotalTax.toLocaleString(undefined, {minimumFractionDigits: 2});
            if(data.fields.Lines.length){
                for(let i=0; i<data.fields.Lines.length; i++){
                    let AmountGbp = data.fields.Lines[i].fields.TotalLineAmount.toFixed(2);
                    let currencyAmountGbp = currencySymbol+''+data.fields.Lines[i].fields.TotalLineAmount.toFixed(2);
                    let TaxTotalGbp = data.fields.Lines[i].fields.LineTaxTotal;
                    let TaxRateGbp = data.fields.Lines[i].fields.LineTaxRate;
                    lineItemObj = {
                        lineID: data.fields.Lines[i].fields.ID || '',
                        item: data.fields.Lines[i].fields.ProductName || '',
                        description: data.fields.Lines[i].fields.ProductDescription || '',
                        quantity: data.fields.Lines[i].fields.UOMOrderQty || 0,
                        unitPrice: data.fields.Lines[i].fields.LinePrice.toFixed(2) || 0,
                        taxRate: data.fields.Lines[i].fields.LineTaxCode || '',
                        TotalAmt:  AmountGbp || 0,
                        curTotalAmt: currencyAmountGbp || currencySymbol +'0',
                        TaxTotal: TaxTotalGbp || 0,
                        TaxRate: TaxRateGbp || 0,

                    };
                    lineItems.push(lineItemObj);
                    let obj={
                        id:i,
                        tax:data.fields.Lines[i].fields.LineTaxCode
                    };
                    DataList.push(obj);
                    templateObject.taxCode.set(DataList);
                }
            }else {
                let AmountGbp = data.fields.Lines.fields.TotalLineAmountInc.toFixed(2);
                let currencyAmountGbp = currencySymbol+''+data.fields.Lines.fields.TotalLineAmount.toFixed(2);
                let TaxTotalGbp = data.fields.Lines.fields.LineTaxTotal;
                let TaxRateGbp = data.fields.Lines.fields.LineTaxRate;
                lineItemObj = {
                    lineID: data.fields.Lines.fields.ID || '',
                    description: data.fields.Lines.fields.ProductDescription || '',
                    item: data.fields.Lines[i].fields.ProductName || '',
                    quantity: data.fields.Lines.fields.UOMOrderQty || 0,
                    unitPrice: data.fields.Lines[i].fields.LinePrice || 0,
                    taxRate: data.fields.Lines.fields.LineTaxCode || '',
                    TotalAmt:  AmountGbp || 0,
                    curTotalAmt: currencyAmountGbp || currencySymbol +'0',
                    TaxTotal: TaxTotalGbp || 0,
                    TaxRate: TaxRateGbp || 0
                };
                lineItems.push(lineItemObj);
                let obj={
                    id:1,
                    tax:data.fields.Lines.fields.LineTaxCode
                };
                DataList.push(obj);
                templateObject.taxCode.set(DataList);
            }

            let invrecord = {
                id : data.fields.ID,
                lid : 'Edit Invoice' + ' '+ data.fields.DocNumber,
                customername : data.fields.CustomerName,
                invoiceto : data.fields.InvoiceToDesc,
                shipto : data.fields.ShipToDesc,
                department : data.fields.SaleClassName,
                docnumber : data.fields.DocNumber,
                saledate : data.fields.SaleDate ? moment(data.fields.SaleDate).format('DD MMM YYYY') : "",
                duedate : data.fields.DueDate ? moment(data.fields.DueDate).format('DD MMM YYYY') : "",
                employeename : data.fields.EmployeeName,
                status : data.fields.SalesStatus,
                category : data.fields.SalesCategory,
                comments : data.fields.Comments,
                pickmemo : data.fields.PickMemo,
                ponumber : data.fields.CustPONumber,
                via : data.fields.Shipping,
                connote : data.fields.ConNote,
                reference : data.fields.CustPONumber,
                currency : data.fields.ForeignExchangeCode,
                branding : data.fields.MedType,
                Total: totalInc,
                LineItems: lineItems,
                TotalTax: totalTax,
                SubTotal: subTotal
            };
            if(data.fields.Attachments){
                if(data.fields.Attachments.length){
                    templateObject.attachmentCount.set(data.fields.Attachments.length);
                    templateObject.uploadedFiles.set(data.fields.Attachments)
                }
            }
            templateObject.invrecord.set(invrecord);
            templateObject.selectedCurrency.set(invrecord.currency);
            templateObject.inputSelectedCurrency.set(invrecord.currency);
            templateObject.$('#allnotes').val(data.fields.Comments);
        });
});
Template.editRepeating.helpers({
    invrecord: () => {
        return Template.instance().invrecord.get();
    },
    records: () => {
        return Template.instance().records.get();
    },
    currencySymbol: () => {
        return Template.instance().currencySymbol.get();
    },
    taxrateobj: () => {
        return Template.instance().taxrateobj.get();
    },
    selectedCurrency: () => {
        return Template.instance().selectedCurrency.get();
    },
    taxCode: () => {
        return Template.instance().taxCode.get();
    },
    inputSelectedCurrency: () => {
        return Template.instance().inputSelectedCurrency.get();
    },
    attachmentCount: () => {
        return Template.instance().attachmentCount.get();
    },
    uploadedFiles: () => {
        return Template.instance().uploadedFiles.get();
    },
});
Template.editRepeating.events({
    'click':function(event){
        if(event.target.id !== 'btn_Attachment'){
            $("#new-attachment2-tooltip").hide();
        }
    },
    'click #new_create_btn':function(event){
        let templateObject = Template.instance();
        let newRecord = templateObject.invrecord.get();
        newRecord.LineItems.push({
            item: '',
            description: '',
            quantity: '1.00',
            unitPrice: '0.00',
            taxRate: '',
            amountGbp: '0.00'
        });
        templateObject.invrecord.set(newRecord);

        setTimeout(function () {
            templateObject.getAccountDropDown();
        },2000);

        setTimeout(function(){
            templateObject.getTaxRateDropDown();
            if (templateObject.$("#myTaxDropdown").val() == "No Tax") {
                templateObject.$('#taxRateHeader').css('background','#ccc');
                templateObject.$(".select-tax-rate").attr('readonly', true);
                templateObject.$(".select-tax-rate").prop('disabled', true);
                templateObject.$('.taxcodetotal').hide();
            }else{
                templateObject.$('#taxRateHeader').css('background','');
                templateObject.$(".select-tax-rate").attr('readonly', false);
                templateObject.$(".select-tax-rate").prop('disabled', false);
                templateObject.$('.taxcodetotal').show();
            }

        },0);
    },
    'click #new_5Line_btn':function(event){
        let templateObject = Template.instance();
        let newRecord = templateObject.invrecord.get();
        newRecord.LineItems.push({
            item: '',
            description: '',
            quantity: '1.00',
            unitPrice: '0.00',
            taxRate: '',
            amountGbp: '0.00'
        });
        newRecord.LineItems.push({
            item: '',
            description: '',
            quantity: '1.00',
            unitPrice: '0.00',
            taxRate: '',
            amountGbp: '0.00'
        });
        newRecord.LineItems.push({
            item: '',
            description: '',
            quantity: '1.00',
            unitPrice: '0.00',
            taxRate: '',
            amountGbp: '0.00'
        });
        newRecord.LineItems.push({
            item: '',
            description: '',
            quantity: '1.00',
            unitPrice: '0.00',
            taxRate: '',
            amountGbp: '0.00'
        });
        newRecord.LineItems.push({
            item: '',
            description: '',
            quantity: '1.00',
            unitPrice: '0.00',
            taxRate: '',
            amountGbp: '0.00'
        });
        templateObject.invrecord.set(newRecord);
        templateObject.$('span.remove-line-item').removeAttr('data-toggle data-target');
        setTimeout(function () {
            templateObject.getAccountDropDown();
        },2000);

        setTimeout(function(){
            templateObject.getTaxRateDropDown();
            if (templateObject.$("#myTaxDropdown").val() == "No Tax") {
                templateObject.$(".select-tax-rate").attr('readonly', true);
                templateObject.$(".select-tax-rate").prop('disabled', true);
                templateObject.$('#taxRateHeader').css('background','#ccc');
                templateObject.$('.taxcodetotal').hide();
            }else{
                templateObject.$(".select-tax-rate").attr('readonly', false);
                templateObject.$(".select-tax-rate").prop('disabled', false);
                templateObject.$('#taxRateHeader').css('background','');
                templateObject.$('.taxcodetotal').show();
            }
        },0);

    },
    'click #new_10Line_btn':function(event){
        let templateObject = Template.instance();
        let newRecord = templateObject.invrecord.get();
        newRecord.LineItems.push({
            item: '',
            description: '',
            quantity: '1.00',
            unitPrice: '0.00',
            taxRate: '',
            amountGbp: '0.00'
        });
        newRecord.LineItems.push({
            item: '',
            description: '',
            quantity: '1.00',
            unitPrice: '0.00',
            taxRate: '',
            amountGbp: '0.00'
        });
        newRecord.LineItems.push({
            item: '',
            description: '',
            quantity: '1.00',
            unitPrice: '0.00',
            taxRate: '',
            amountGbp: '0.00'
        });
        newRecord.LineItems.push({
            item: '',
            description: '',
            quantity: '1.00',
            unitPrice: '0.00',
            taxRate: '',
            amountGbp: '0.00'
        });
        newRecord.LineItems.push({
            item: '',
            description: '',
            quantity: '1.00',
            unitPrice: '0.00',
            taxRate: '',
            amountGbp: '0.00'
        });
        newRecord.LineItems.push({
            item: '',
            description: '',
            quantity: '1.00',
            unitPrice: '0.00',
            taxRate: '',
            amountGbp: '0.00'
        });
        newRecord.LineItems.push({
            item: '',
            description: '',
            quantity: '1.00',
            unitPrice: '0.00',
            taxRate: '',
            amountGbp: '0.00'
        });
        newRecord.LineItems.push({
            item: '',
            description: '',
            quantity: '1.00',
            unitPrice: '0.00',
            taxRate: '',
            amountGbp: '0.00'
        });
        newRecord.LineItems.push({
            item: '',
            description: '',
            quantity: '1.00',
            unitPrice: '0.00',
            taxRate: '',
            amountGbp: '0.00'
        });
        newRecord.LineItems.push({
            item: '',
            description: '',
            quantity: '1.00',
            unitPrice: '0.00',
            taxRate: '',
            amountGbp: '0.00'
        });
        templateObject.invrecord.set(newRecord);
        templateObject.$('span.remove-line-item').removeAttr('data-toggle data-target');
        setTimeout(function () {
            templateObject.getAccountDropDown();
        },2000);

        setTimeout(function(){
            templateObject.getTaxRateDropDown();
            if (templateObject.$("#myTaxDropdown").val() == "No Tax") {
                templateObject.$(".select-tax-rate").attr('readonly', true);
                templateObject.$(".select-tax-rate").prop('disabled', true);
                templateObject.$('#taxRateHeader').css('background','#ccc');
                templateObject.$('.taxcodetotal').hide();
            }else{
                templateObject.$(".select-tax-rate").attr('readonly', false);
                templateObject.$(".select-tax-rate").prop('disabled', false);
                templateObject.$('#taxRateHeader').css('background','');
                templateObject.$('.taxcodetotal').show();
            }
        },0);

    },
    'click #new_20Line_btn':function(event){
        let templateObject = Template.instance();
        let newRecord = templateObject.invrecord.get();
        newRecord.LineItems.push({
            item: '',
            description: '',
            quantity: '1.00',
            unitPrice: '0.00',
            taxRate: '',
            amountGbp: '0.00'
        });
        newRecord.LineItems.push({
            item: '',
            description: '',
            quantity: '1.00',
            unitPrice: '0.00',
            taxRate: '',
            amountGbp: '0.00'
        });
        newRecord.LineItems.push({
            item: '',
            description: '',
            quantity: '1.00',
            unitPrice: '0.00',
            taxRate: '',
            amountGbp: '0.00'
        });
        newRecord.LineItems.push({
            item: '',
            description: '',
            quantity: '1.00',
            unitPrice: '0.00',
            taxRate: '',
            amountGbp: '0.00'
        });
        newRecord.LineItems.push({
            item: '',
            description: '',
            quantity: '1.00',
            unitPrice: '0.00',
            taxRate: '',
            amountGbp: '0.00'
        });
        newRecord.LineItems.push({
            item: '',
            description: '',
            quantity: '1.00',
            unitPrice: '0.00',
            taxRate: '',
            amountGbp: '0.00'
        });
        newRecord.LineItems.push({
            item: '',
            description: '',
            quantity: '1.00',
            unitPrice: '0.00',
            taxRate: '',
            amountGbp: '0.00'
        });
        newRecord.LineItems.push({
            item: '',
            description: '',
            quantity: '1.00',
            unitPrice: '0.00',
            taxRate: '',
            amountGbp: '0.00'
        });
        newRecord.LineItems.push({
            item: '',
            description: '',
            quantity: '1.00',
            unitPrice: '0.00',
            taxRate: '',
            amountGbp: '0.00'
        });
        newRecord.LineItems.push({
            item: '',
            description: '',
            quantity: '1.00',
            unitPrice: '0.00',
            taxRate: '',
            amountGbp: '0.00'
        });
        newRecord.LineItems.push({
            item: '',
            description: '',
            quantity: '1.00',
            unitPrice: '0.00',
            taxRate: '',
            amountGbp: '0.00'
        });
        newRecord.LineItems.push({
            item: '',
            description: '',
            quantity: '1.00',
            unitPrice: '0.00',
            taxRate: '',
            amountGbp: '0.00'
        });
        newRecord.LineItems.push({
            item: '',
            description: '',
            quantity: '1.00',
            unitPrice: '0.00',
            taxRate: '',
            amountGbp: '0.00'
        });
        newRecord.LineItems.push({
            item: '',
            description: '',
            quantity: '1.00',
            unitPrice: '0.00',
            taxRate: '',
            amountGbp: '0.00'
        });
        newRecord.LineItems.push({
            item: '',
            description: '',
            quantity: '1.00',
            unitPrice: '0.00',
            taxRate: '',
            amountGbp: '0.00'
        });
        newRecord.LineItems.push({
            item: '',
            description: '',
            quantity: '1.00',
            unitPrice: '0.00',
            taxRate: '',
            amountGbp: '0.00'
        });
        newRecord.LineItems.push({
            item: '',
            description: '',
            quantity: '1.00',
            unitPrice: '0.00',
            taxRate: '',
            amountGbp: '0.00'
        });
        newRecord.LineItems.push({
            item: '',
            description: '',
            quantity: '1.00',
            unitPrice: '0.00',
            taxRate: '',
            amountGbp: '0.00'
        });
        newRecord.LineItems.push({
            item: '',
            description: '',
            quantity: '1.00',
            unitPrice: '0.00',
            taxRate: '',
            amountGbp: '0.00'
        });
        newRecord.LineItems.push({
            item: '',
            description: '',
            quantity: '1.00',
            unitPrice: '0.00',
            taxRate: '',
            amountGbp: '0.00'
        });
        templateObject.invrecord.set(newRecord);
        templateObject.$('span.remove-line-item').removeAttr('data-toggle data-target');
        setTimeout(function () {
            templateObject.getAccountDropDown();
        },2000);

        setTimeout(function(){
            templateObject.getTaxRateDropDown();
            if (templateObject.$("#myTaxDropdown").val() == "No Tax") {
                templateObject.$(".select-tax-rate").attr('readonly', true);
                templateObject.$(".select-tax-rate").prop('disabled', true);
                templateObject.$('#taxRateHeader').css('background','#ccc');
                templateObject.$('.taxcodetotal').hide();
            }else{
                templateObject.$(".select-tax-rate").attr('readonly', false);
                templateObject.$(".select-tax-rate").prop('disabled', false);
                templateObject.$('#taxRateHeader').css('background','');
                templateObject.$('.taxcodetotal').show();
            }
        },0);

    },
    'click .curreny-option':function(event){
        $(".select-currency-option").val(event.currentTarget.innerText);
        let currnecyval = event.currentTarget.innerText;
        let templateObject = Template.instance();
        templateObject.selectedCurrency.set(currnecyval.substr(0, 3));
        templateObject.inputSelectedCurrency.set(currnecyval);
        let currencyRecord = templateObject.records.get();
        $.each(currencyRecord, function () {
            if(this.Code == currnecyval.substr(0, 3)){
                if(this.CurrencySymbol != ''){
                    templateObject.currencySymbol.set(this.CurrencySymbol);
                }

                let currencySymbol = templateObject.currencySymbol.get();
                var itemVal = templateObject.$("#myTaxDropdown").val();
                if( itemVal === "No Tax"){
                    
                    templateObject.$('#taxRateHeader').css('background','#ccc');
                    $('.select-tax-rate').attr('readonly', true);
                    $(".select-tax-rate").prop('disabled', true);
                    $('.taxcodetotal').hide();
                    //$('.taxrate').attr('readonly', true);
                    let $tblrows = $("#component_tbUpdate tbody tr");

                    $tblrows.each(function (index) {
                        var $tblrow = $(this);
                        var qty = $tblrow.find(".qty").val();
                        var taxrate = $tblrow.find(".taxrate").val();
                        var price = $tblrow.find(".unitPrice").val();
                        var subTotal = parseInt(qty,10) * parseFloat(price);
                        var taxTotal = 0;
                        if (!isNaN(subTotal)) {

                            $tblrow.find('.subtot').val(subTotal.toFixed(2));
                            $tblrow.find('.displaySubtot').val(currencySymbol+subTotal.toFixed(2));
                            var SubGrandTotal = 0;
                            $(".subtot").each(function () {
                                var stval = parseFloat($(this).val());
                                SubGrandTotal += isNaN(stval) ? 0 : stval;

                            });
                            document.getElementById("subtotal_total").innerHTML = currencySymbol+''+SubGrandTotal.toFixed(2);


                        }

                        if (!isNaN(taxTotal)) {

                            $tblrow.find('.taxtot').val(taxTotal.toFixed(2));
                            var GrandTaxTotal = 0;
                            $(".taxtot").each(function () {
                                var stval = parseFloat($(this).val());
                                GrandTaxTotal += isNaN(stval) ? 0 : stval;

                            });
                            document.getElementById("subtotal_total3").innerHTML = currencySymbol+''+GrandTaxTotal.toFixed(2);

                        }

                        if (!isNaN(GrandTaxTotal) && (!isNaN(SubGrandTotal))) {
                            let GrandTotal = (parseFloat(GrandTaxTotal)) + (parseFloat(SubGrandTotal));
                            document.getElementById("subtotal_total2").innerHTML = currencySymbol+''+GrandTotal.toFixed(2);
                        }

                    });


                }else{
                    $('.select-tax-rate').attr('readonly', false);
                    templateObject.$('#taxRateHeader').css('background','');
                    $(".select-tax-rate").prop('disabled', false);
                    $('.taxcodetotal').show();
                    let $tblrows = $("#component_tbUpdate tbody tr");

                    $tblrows.each(function (index) {
                        var $tblrow = $(this);
                        var qty = $tblrow.find(".qty").val();
                        var taxrate = $tblrow.find(".taxrate").val();
                        var price = $tblrow.find(".unitPrice").val();
                        var subTotal = parseInt(qty,10) * parseFloat(price);
                        var taxTotal = parseInt(qty,10) * parseFloat(price) * parseFloat(taxrate);
                        if (!isNaN(subTotal)) {

                            $tblrow.find('.subtot').val(subTotal.toFixed(2));
                            $tblrow.find('.displaySubtot').val(currencySymbol+subTotal.toFixed(2));
                            var SubGrandTotal = 0;
                            $(".subtot").each(function () {
                                var stval = parseFloat($(this).val());
                                SubGrandTotal += isNaN(stval) ? 0 : stval;

                            });
                            document.getElementById("subtotal_total").innerHTML = currencySymbol+''+SubGrandTotal.toFixed(2);


                        }

                        if (!isNaN(taxTotal)) {

                            $tblrow.find('.taxtot').val(taxTotal.toFixed(2));
                            var GrandTaxTotal = 0;
                            $(".taxtot").each(function () {
                                var stval = parseFloat($(this).val());
                                GrandTaxTotal += isNaN(stval) ? 0 : stval;

                            });
                            document.getElementById("subtotal_total3").innerHTML = currencySymbol+''+GrandTaxTotal.toFixed(2);

                        }

                        if (!isNaN(GrandTaxTotal) && (!isNaN(SubGrandTotal))) {
                            let GrandTotal = (parseFloat(GrandTaxTotal)) + (parseFloat(SubGrandTotal));
                            document.getElementById("subtotal_total2").innerHTML = currencySymbol+''+GrandTotal.toFixed(2);
                        }

                    });
                }

            }

        });
    },
    'keydown .unitPrice':function(event){
        if ($.inArray(event.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 ||
            // Allow: Ctrl+A, Command+A
            (event.keyCode === 65 && (event.ctrlKey === true || event.metaKey === true)) ||
            // Allow: home, end, left, right, down, up
            (event.keyCode >= 35 && event.keyCode <= 40)) {
            // let it happen, don't do anything
            return;
        }

        if (event.shiftKey == true) {
            event.preventDefault();
        }

        if ((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105) || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 37 || event.keyCode == 39 || event.keyCode == 46 || event.keyCode == 190) {

        } else {
            event.preventDefault();
        }

        if($(this).val().indexOf('.') !== -1 && event.keyCode == 190)
            event.preventDefault();
    },
    'click a.removebutton': function (event) {
        if ($('#component_tbUpdate tbody>tr').length > 1) {
            let templateObject = Template.instance();
            let lineToBeRemoved = event.currentTarget.id.split('removebutton-')[1];
            let newRecord = templateObject.invrecord.get();
            let currencySymbol = templateObject.currencySymbol.get();
            if ((newRecord.LineItems.length > 1)) {
                $('#pq_entry_' + lineToBeRemoved).remove();
                templateObject.invrecord.set(newRecord);

                let $tblrows = $("#component_tbUpdate tbody tr");
                if ($("#myTaxDropdown").html() == "No Tax") {
                    templateObject.$('#taxRateHeader').css('background','#ccc');
                    $("#tax-rate-input-"+lineToBeRemoved).attr('readonly', true);
                    $("#tax-rate-input-"+lineToBeRemoved).prop('disabled', true);
                    $('.taxcodetotal').hide();
                    $tblrows.each(function (index) {
                        var $tblrow = $(this);
                        var qty = $tblrow.find(".qty").html();
                        var taxrate = $tblrow.find(".taxrate").val();
                        var price = $tblrow.find(".unitPrice").html();
                        var subTotal = parseInt(qty, 10) * parseFloat(price);
                        var taxTotal = 0;
                        let AmountInc = 0;
                        if (!isNaN(subTotal)) {

                            $tblrow.find('.subtot').val(subTotal.toFixed(2));
                            $tblrow.find('.displaySubtot').html(currencySymbol + subTotal.toFixed(2));
                            var SubGrandTotal = 0;
                            $(".subtot").each(function () {
                                var stval = parseFloat($(this).val());
                                SubGrandTotal += isNaN(stval) ? 0 : stval;

                            });
                            document.getElementById("subtotal_total").innerHTML = currencySymbol + '' + SubGrandTotal.toFixed(2);


                        }

                        if (!isNaN(taxTotal)) {

                            $tblrow.find('.taxtot').val(taxTotal.toFixed(2));
                            var GrandTaxTotal = 0;
                            $(".taxtot").each(function () {
                                var stval = parseFloat($(this).val());
                                GrandTaxTotal += isNaN(stval) ? 0 : stval;

                            });
                            document.getElementById("subtotal_total3").innerHTML = currencySymbol + '' + GrandTaxTotal.toFixed(2);

                        }

                        if (!isNaN(subTotal) && (!isNaN(taxTotal))) {
                            AmountInc = subTotal + taxTotal;
                            $tblrow.find('.linetotAmtInc').val(AmountInc.toFixed(2));
                        }

                        if (!isNaN(GrandTaxTotal) && (!isNaN(SubGrandTotal))) {
                            let GrandTotal = (parseFloat(GrandTaxTotal)) + (parseFloat(SubGrandTotal));
                            document.getElementById("subtotal_total2").innerHTML = currencySymbol + '' + GrandTotal.toFixed(2);
                            $('input[name="subtotal_total_2"]').val(GrandTotal.toFixed(2));
                            //$('input[name="BillTotal"]').val(currencySymbol + '' + GrandTotal.toLocaleString(undefined, {minimumFractionDigits: 2}));
                        }
                        //let GrandTotal = (parseFloat(GrandTaxTotal)) + (parseFloat(SubGrandTotal));
                        // document.getElementById("subtotal_total2").innerHTML = Currency+''+GrandTotal.toFixed(2);


                    });
                } else {
                    templateObject.$('#taxRateHeader').css('background','');
                    $("#tax-rate-input-"+lineToBeRemoved).attr('readonly', false);
                    $("#tax-rate-input-"+lineToBeRemoved).prop('disabled', false);
                    $('.taxcodetotal').show();
                    $tblrows.each(function (index) {
                        var $tblrow = $(this);
                        var qty = $tblrow.find(".qty").html();
                        var taxrate = $tblrow.find(".taxrate").val();
                        var price = $tblrow.find(".unitPrice").html();
                        var subTotal = parseInt(qty, 10) * parseFloat(price);
                        var taxTotal = parseInt(qty, 10) * parseFloat(price) * parseFloat(taxrate);
                        let AmountInc = 0;
                        if (!isNaN(subTotal)) {

                            $tblrow.find('.subtot').val(subTotal.toFixed(2));
                            $tblrow.find('.displaySubtot').html(currencySymbol + subTotal.toFixed(2));
                            var SubGrandTotal = 0;
                            $(".subtot").each(function () {
                                var stval = parseFloat($(this).val());
                                SubGrandTotal += isNaN(stval) ? 0 : stval;

                            });
                            document.getElementById("subtotal_total").innerHTML = currencySymbol + '' + SubGrandTotal.toFixed(2);


                        }

                        if (!isNaN(taxTotal)) {

                            $tblrow.find('.taxtot').val(taxTotal.toFixed(2));
                            var GrandTaxTotal = 0;
                            $(".taxtot").each(function () {
                                var stval = parseFloat($(this).val());
                                GrandTaxTotal += isNaN(stval) ? 0 : stval;

                            });
                            document.getElementById("subtotal_total3").innerHTML = currencySymbol + '' + GrandTaxTotal.toFixed(2);

                        }

                        if (!isNaN(subTotal) && (!isNaN(taxTotal))) {
                            AmountInc = subTotal + taxTotal;
                            $tblrow.find('.linetotAmtInc').val(AmountInc.toFixed(2));
                        }

                        if (!isNaN(GrandTaxTotal) && (!isNaN(SubGrandTotal))) {
                            let GrandTotal = (parseFloat(GrandTaxTotal)) + (parseFloat(SubGrandTotal));
                            document.getElementById("subtotal_total2").innerHTML = currencySymbol + '' + GrandTotal.toFixed(2);
                            $('input[name="subtotal_total_2"]').val(GrandTotal.toFixed(2));
                           // $('input[name="BillTotal"]').val(currencySymbol + '' + GrandTotal.toLocaleString(undefined, {minimumFractionDigits: 2}));
                        }
                        //let GrandTotal = (parseFloat(GrandTaxTotal)) + (parseFloat(SubGrandTotal));
                        // document.getElementById("subtotal_total2").innerHTML = Currency+''+GrandTotal.toFixed(2);


                    });
                }
            } else {
                //$('a.removebutton').attr({'data-toggle':'modal','data-target':'#removeModal'});
            }

        }
    },
    'blur .qty': function (event) {
        let $tblrows = $("#component_tbUpdate tbody tr");
        let templateObject = Template.instance();
        let currencySymbol = templateObject.currencySymbol.get();
        if (templateObject.$("#myTaxDropdown").val() == "No Tax") {
            templateObject.$('#taxRateHeader').css('background','#ccc');
            let id = Number(event.currentTarget.id.split('-')[1]);
            templateObject.$("#tax-rate-input-"+id).attr('readonly', true);
            templateObject.$("#tax-rate-input-"+id).attr('disabled', true);
            $('.taxcodetotal').hide();
            $tblrows.each(function (index) {
                var $tblrow = $(this);
                var qty = $tblrow.find(".qty").html();
                var taxrate = $tblrow.find(".taxrate").val();
                var price = $tblrow.find(".unitPrice").html();
                var subTotal = parseInt(qty, 10) * parseFloat(price);
                var taxTotal = 0;
                let AmountInc = 0;

                if (!isNaN(subTotal)) {

                    $tblrow.find('.subtot').val(subTotal.toFixed(2));
                    $tblrow.find('.displaySubtot').html(currencySymbol + subTotal.toFixed(2));
                    var SubGrandTotal = 0;
                    $(".subtot").each(function () {
                        var stval = parseFloat($(this).val());
                        SubGrandTotal += isNaN(stval) ? 0 : stval;

                    });
                    document.getElementById("subtotal_total").innerHTML = currencySymbol + '' + SubGrandTotal.toFixed(2);


                }

                if (!isNaN(taxTotal)) {

                    $tblrow.find('.taxtot').val(taxTotal.toFixed(2));
                    var GrandTaxTotal = 0;
                    $(".taxtot").each(function () {
                        var stval = parseFloat($(this).val());
                        GrandTaxTotal += isNaN(stval) ? 0 : stval;

                    });
                    document.getElementById("subtotal_total3").innerHTML = currencySymbol + '' + GrandTaxTotal.toFixed(2);

                }

                if (!isNaN(subTotal) && (!isNaN(taxTotal))) {
                    AmountInc = subTotal + taxTotal;
                    $tblrow.find('.linetotAmtInc').val(AmountInc.toFixed(2));
                }

                if (!isNaN(GrandTaxTotal) && (!isNaN(SubGrandTotal))) {
                    let GrandTotal = (parseFloat(GrandTaxTotal)) + (parseFloat(SubGrandTotal));
                    document.getElementById("subtotal_total2").innerHTML = currencySymbol + '' + GrandTotal.toFixed(2);
                    $('input[name="subtotal_total_2"]').val(GrandTotal.toFixed(2));
                }
                //let GrandTotal = (parseFloat(GrandTaxTotal)) + (parseFloat(SubGrandTotal));
                //document.getElementById("subtotal_total2").innerHTML = Currency+''+GrandTotal.toFixed(2);


            });
        } else {
            templateObject.$('#taxRateHeader').css('background','');
            let id = Number(event.currentTarget.id.split('-')[1]);
            templateObject.$("#tax-rate-input-"+id).attr('readonly', false);
            templateObject.$("#tax-rate-input-"+id).attr('disabled', false);
            $('.taxcodetotal').show();
            $tblrows.each(function (index) {
                var $tblrow = $(this);
                var qty = $tblrow.find(".qty").html();
                var taxrate = $tblrow.find(".taxrate").val();
                var price = $tblrow.find(".unitPrice").html();
                var subTotal = parseInt(qty, 10) * parseFloat(price);
                var taxTotal = parseInt(qty, 10) * parseFloat(price) * parseFloat(taxrate);
                let AmountInc = 0;
                if (!isNaN(subTotal)) {

                    $tblrow.find('.subtot').val(subTotal.toFixed(2));
                    $tblrow.find('.displaySubtot').html(currencySymbol + subTotal.toFixed(2));
                    var SubGrandTotal = 0;
                    $(".subtot").each(function () {
                        var stval = parseFloat($(this).val());
                        SubGrandTotal += isNaN(stval) ? 0 : stval;

                    });
                    document.getElementById("subtotal_total").innerHTML = currencySymbol + '' + SubGrandTotal.toFixed(2);


                }

                if (!isNaN(taxTotal)) {

                    $tblrow.find('.taxtot').val(taxTotal.toFixed(2));
                    var GrandTaxTotal = 0;
                    $(".taxtot").each(function () {
                        var stval = parseFloat($(this).val());
                        GrandTaxTotal += isNaN(stval) ? 0 : stval;

                    });
                    document.getElementById("subtotal_total3").innerHTML = currencySymbol + '' + GrandTaxTotal.toFixed(2);

                }

                if (!isNaN(subTotal) && (!isNaN(taxTotal))) {
                    AmountInc = subTotal + taxTotal;
                    $tblrow.find('.linetotAmtInc').val(AmountInc.toFixed(2));
                }

                if (!isNaN(GrandTaxTotal) && (!isNaN(SubGrandTotal))) {
                    let GrandTotal = (parseFloat(GrandTaxTotal)) + (parseFloat(SubGrandTotal));
                    document.getElementById("subtotal_total2").innerHTML = currencySymbol + '' + GrandTotal.toFixed(2);
                    $('input[name="subtotal_total_2"]').val(GrandTotal.toFixed(2));
                }
                //let GrandTotal = (parseFloat(GrandTaxTotal)) + (parseFloat(SubGrandTotal));
                //document.getElementById("subtotal_total2").innerHTML = Currency+''+GrandTotal.toFixed(2);


            });
        }
    },
    'blur .unitPrice':function(event){
        let tempObj = Template.instance();
        let unitPriceVal = tempObj.$("#" + event.currentTarget.id).val();
        let currencySymbol = tempObj.currencySymbol.get();
        tempObj.$("#" + event.currentTarget.id).val(parseFloat(unitPriceVal).toFixed(2));
        let $tblrows = $("#component_tbUpdate tbody tr");
        if (tempObj.$("#myTaxDropdown").val() == "No Tax") {
            $('#taxRateHeader').css('background','#ccc');
            let id = Number(event.currentTarget.id.split('-')[1]);
            tempObj.$("#tax-rate-input-"+id).attr('readonly', true);
            tempObj.$("#tax-rate-input-"+id).attr('disabled', true);
            $('.taxcodetotal').hide();
            $tblrows.each(function (index) {
                var $tblrow = $(this);
                var qty = $tblrow.find(".qty").html();
                var taxrate = $tblrow.find(".taxrate").val();
                var price = $tblrow.find(".unitPrice").html();
                var subTotal = parseInt(qty,10) * parseFloat(price);
                var taxTotal = 0;
                if (!isNaN(subTotal)) {

                    $tblrow.find('.subtot').val(subTotal.toFixed(2));
                    $tblrow.find('.displaySubtot').html(currencySymbol+subTotal.toFixed(2));
                    var SubGrandTotal = 0;
                    $(".subtot").each(function () {
                        var stval = parseFloat($(this).val());
                        SubGrandTotal += isNaN(stval) ? 0 : stval;

                    });
                    document.getElementById("subtotal_total").innerHTML = currencySymbol+''+SubGrandTotal.toFixed(2);
                }
                if (!isNaN(taxTotal)) {
                    $tblrow.find('.taxtot').val(taxTotal.toFixed(2));
                    var GrandTaxTotal = 0;
                    $(".taxtot").each(function () {
                        var stval = parseFloat($(this).val());
                        GrandTaxTotal += isNaN(stval) ? 0 : stval;
                    });
                    document.getElementById("subtotal_total3").innerHTML = currencySymbol+''+GrandTaxTotal.toFixed(2);
                }
                if (!isNaN(GrandTaxTotal) && (!isNaN(SubGrandTotal))) {
                    let GrandTotal = (parseFloat(GrandTaxTotal)) + (parseFloat(SubGrandTotal));
                    document.getElementById("subtotal_total2").innerHTML = currencySymbol+''+GrandTotal.toFixed(2);
                }

            });
        }
        else{
            $('#taxRateHeader').css('background','');
            let id = Number(event.currentTarget.id.split('-')[1]);
            tempObj.$("#tax-rate-input-"+id).attr('readonly', false);
            tempObj.$("#tax-rate-input-"+id).attr('disabled', false);
            $('.taxcodetotal').show();
            $tblrows.each(function (index) {
                var $tblrow = $(this);
                var qty = $tblrow.find(".qty").html();
                var taxrate = $tblrow.find(".taxrate").val();
                var price = $tblrow.find(".unitPrice").html();
                var subTotal = parseInt(qty,10) * parseFloat(price);
                var taxTotal = parseInt(qty,10) * parseFloat(price) * parseFloat(taxrate);
                if (!isNaN(subTotal)) {

                    $tblrow.find('.subtot').val(subTotal.toFixed(2));
                    $tblrow.find('.displaySubtot').html(currencySymbol+subTotal.toFixed(2));
                    var SubGrandTotal = 0;
                    $(".subtot").each(function () {
                        var stval = parseFloat($(this).val());
                        SubGrandTotal += isNaN(stval) ? 0 : stval;

                    });
                    document.getElementById("subtotal_total").innerHTML = currencySymbol+''+SubGrandTotal.toFixed(2);


                }

                if (!isNaN(taxTotal)) {

                    $tblrow.find('.taxtot').val(taxTotal.toFixed(2));
                    var GrandTaxTotal = 0;
                    $(".taxtot").each(function () {
                        var stval = parseFloat($(this).val());
                        GrandTaxTotal += isNaN(stval) ? 0 : stval;

                    });
                    document.getElementById("subtotal_total3").innerHTML = currencySymbol+''+GrandTaxTotal.toFixed(2);

                }

                if (!isNaN(GrandTaxTotal) && (!isNaN(SubGrandTotal))) {
                    let GrandTotal = (parseFloat(GrandTaxTotal)) + (parseFloat(SubGrandTotal));
                    document.getElementById("subtotal_total2").innerHTML = currencySymbol+''+GrandTotal.toFixed(2);
                }
                //let GrandTotal = (parseFloat(GrandTaxTotal)) + (parseFloat(SubGrandTotal));
                // document.getElementById("subtotal_total2").innerHTML = Currency+''+GrandTotal.toFixed(2);


            });
        }


    },
    'click .select-tax-type':function(event){
        let templateObject = Template.instance();
        $(".select-tax-type-input").val(event.currentTarget.innerText);
        let currencySymbol = templateObject.currencySymbol.get();
        var itemVal =  templateObject.$("#myTaxDropdown").val();
        if( itemVal === "No Tax"){
            $('#taxRateHeader').css('background','#ccc');
            $('.select-tax-rate').attr('readonly', true);
            $(".select-tax-rate").prop('disabled', true);
            $('.taxcodetotal').hide();
            let $tblrows = $("#component_tbUpdate tbody tr");
            $tblrows.each(function (index) {
                var $tblrow = $(this);
                var qty = $tblrow.find(".qty").val();
                var taxrate = $tblrow.find(".taxrate").val();
                var price = $tblrow.find(".unitPrice").val();
                var subTotal = parseInt(qty,10) * parseFloat(price);
                var taxTotal = 0;
                if (!isNaN(subTotal)) {

                    $tblrow.find('.subtot').val(subTotal.toFixed(2));
                    $tblrow.find('.displaySubtot').val(currencySymbol+subTotal.toFixed(2));
                    var SubGrandTotal = 0;
                    $(".subtot").each(function () {
                        var stval = parseFloat($(this).val());
                        SubGrandTotal += isNaN(stval) ? 0 : stval;

                    });
                    document.getElementById("subtotal_total").innerHTML = currencySymbol+''+SubGrandTotal.toFixed(2);


                }

                if (!isNaN(taxTotal)) {

                    $tblrow.find('.taxtot').val(taxTotal.toFixed(2));
                    var GrandTaxTotal = 0;
                    /*$(".taxtot").each(function () {
                     var stval = parseFloat($(this).val());
                     GrandTaxTotal += isNaN(stval) ? 0 : stval;

                     });*/
                    document.getElementById("subtotal_total3").innerHTML = currencySymbol+''+GrandTaxTotal.toFixed(2);

                }

                if (!isNaN(GrandTaxTotal) && (!isNaN(SubGrandTotal))) {
                    let GrandTotal = (parseFloat(GrandTaxTotal)) + (parseFloat(SubGrandTotal));
                    document.getElementById("subtotal_total2").innerHTML = currencySymbol+''+GrandTotal.toFixed(2);
                }

            });

        }else{
            $('#taxRateHeader').css('background','');
            $('.select-tax-rate').attr('readonly', false);
            $(".select-tax-rate").prop('disabled', false);
            $('.taxcodetotal').show();
            let $tblrows = $("#component_tbUpdate tbody tr");
            $tblrows.each(function (index) {
                var $tblrow = $(this);
                var qty = $tblrow.find(".qty").val();
                var taxrate = $tblrow.find(".taxrate").val();
                var price = $tblrow.find(".unitPrice").val();
                var subTotal = parseInt(qty,10) * parseFloat(price);
                var taxTotal = parseInt(qty,10) * parseFloat(price) * parseFloat(taxrate);
                if (!isNaN(subTotal)) {

                    $tblrow.find('.subtot').val(subTotal.toFixed(2));
                    $tblrow.find('.displaySubtot').val(currencySymbol+subTotal.toFixed(2));
                    var SubGrandTotal = 0;
                    $(".subtot").each(function () {
                        var stval = parseFloat($(this).val());
                        SubGrandTotal += isNaN(stval) ? 0 : stval;

                    });
                    document.getElementById("subtotal_total").innerHTML = currencySymbol+''+SubGrandTotal.toFixed(2);


                }

                if (!isNaN(taxTotal)) {

                    $tblrow.find('.taxtot').val(taxTotal.toFixed(2));
                    var GrandTaxTotal = 0;
                    $(".taxtot").each(function () {
                        var stval = parseFloat($(this).val());
                        GrandTaxTotal += isNaN(stval) ? 0 : stval;

                    });
                    document.getElementById("subtotal_total3").innerHTML = currencySymbol+''+GrandTaxTotal.toFixed(2);

                }

                if (!isNaN(GrandTaxTotal) && (!isNaN(SubGrandTotal))) {
                    let GrandTotal = (parseFloat(GrandTaxTotal)) + (parseFloat(SubGrandTotal));
                    document.getElementById("subtotal_total2").innerHTML = currencySymbol+''+GrandTotal.toFixed(2);
                }



            });

        }

    },
    'click .branding-option': function (event) {
        let templateObject = Template.instance();
        templateObject.$("#brandingtype").val(event.currentTarget.innerText);
    },
    'click .monthDropDown': function (event) {
        let templateObject = Template.instance();
        templateObject.$("#repeat").val(event.currentTarget.innerText);
    },
    'click .selectItem': function (event) {
        let templateObject = Template.instance();
        templateObject.$("#select").val(event.currentTarget.innerText);
    },
    'blur .select-tax-rate': function (event) {
        let tempObj = Template.instance();
        let currencySymbol = tempObj.currencySymbol.get();
        let currencyLength = currencySymbol.length;
        let id = Number(event.currentTarget.id.split('-')[3]);
        let taxRateInput = $('#tax-rate-input-'+id).html();
        let $tblrows = $("#component_tbUpdate tbody tr");
        $tblrows.each(function (index) {
            var $tblrow = $(this);
            let recordId= $tblrow.context.id.split('_')[2];
            if(recordId==id){
                var taxrate = $tblrow.find(".taxrate").html();
                var qty = $tblrow.find(".qty").val();
                var price = $tblrow.find(".unitPrice").html();
                let taxTotal= parseInt(qty,10) * parseFloat(price) * parseFloat(taxrate);
                taxTotal=taxTotal.toFixed(2);
                let subTotal = $('#subtotal_total3').text().substring(currencyLength);
                let total = $('#subtotal_total2').text().substring(currencyLength);
                if (taxRateInput == '') {
                    $("#TaxRate-" + id).val(0);
                    if (subTotal != '$0.00') {
                        const changesubtotal = (subTotal - parseFloat(taxTotal)).toFixed(2);
                        const changetotal = (total - parseFloat(taxTotal)).toFixed(2);
                        $('#subtotal_total3').text(currencySymbol + '' + changesubtotal.toLocaleString(undefined, {minimumFractionDigits: 2}));
                        $('#subtotal_total2').text(currencySymbol + '' + changetotal.toLocaleString(undefined, {minimumFractionDigits: 2}));
                    }
                }
                else{
                    let taxCode=tempObj.taxCode.get();
                    let code;
                    for(let i=0;i<taxCode.length;i++){
                        if(taxCode[i].id ==id){
                            code=taxCode[i].tax;
                        }
                    }

                    if(taxRateInput!=code){
                        let taxRateInput = $('#tax-rate-input-'+id).html(code);
                    }

                }
            }
        });
    },
    'click .add-new-note':function(){
        let tempObj = Template.instance();
        let invoiceId = parseInt(FlowRouter.current().queryParams.id);
        let invoiceService = new InvoiceService();
        let objDetails = {
            type: "TInvoiceEx",
            fields: {
                ID: invoiceId,
                Comments: tempObj.$('#allnotes').val()
            }
        };
        invoiceService.saveInvoice(objDetails).then(function (data) {
            tempObj.$("#AddNote").hide();
        });
    },
    'click #btn_Attachment':function(){
        let templateInstance = Template.instance();
        let uploadedFileArray = templateInstance.uploadedFiles.get();
        if(uploadedFileArray.length > 0){
            let utilityService = new UtilityService();
            utilityService.showUploadedAttachment(uploadedFileArray);
        }else{
            $(".attchment-tooltip").show();
        }
    },
    'click .new_attachment_btn':function(event){
        $('#attachment-upload').trigger('click');

    },
    'click .file-name': function(event){
        let attachmentID = parseInt(event.currentTarget.parentNode.id.split('attachment-name-')[1]);
        let templateObj = Template.instance();
        templateObj.$("#new-attachment2-tooltip").show();
        let uploadedFiles = templateObj.uploadedFiles.get();
        let previewFile = {};
        let input =  uploadedFiles[attachmentID].fields.Description;
        previewFile.link = 'data:'+input+';base64,'+uploadedFiles[attachmentID].fields.Attachment;
        previewFile.name = uploadedFiles[attachmentID].fields.AttachmentName;
        let type =  uploadedFiles[attachmentID].fields.Description;
        if(type ==='application/pdf'){
            previewFile.class = 'pdf-class';
        }else if(type === 'application/msword' || type ==='application/vnd.openxmlformats-officedocument.wordprocessingml.document'){
            previewFile.class = 'docx-class';
        }
        else if(type === 'application/vnd.ms-excel' || type ==='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            previewFile.class = 'excel-class';
        }
        else if(type === 'application/vnd.ms-powerpoint' || type ==='application/vnd.openxmlformats-officedocument.presentationml.presentation'){
            previewFile.class = 'ppt-class';
        }
        else if(type === 'application/vnd.oasis.opendocument.formula' || type ==='text/csv' || type ==='text/plain' || type ==='text/rtf'){
            previewFile.class = 'txt-class';
        }
        else if(type === 'application/zip' || type ==='application/rar' || type ==='application/x-zip-compressed' || type ==='application/x-zip,application/x-7z-compressed'){
            previewFile.class = 'zip-class';
        }
        else {
            previewFile.class = 'default-class';
        }
        if(type.split('/')[0]==='image'){
            previewFile.image = true
        }else {
            previewFile.image = false
        }
        templateObj.uploadedFile.set(previewFile);
        $('#files_view').modal('show');
        return;
    },
    'click .remove-attachment': function (event,ui) {
        let tempObj = Template.instance();
        let attachmentID = event.target.id.split('remove-attachment-')[1];
        if(tempObj.$("#confirm-action-"+attachmentID).length){
            tempObj.$("#confirm-action-"+attachmentID).remove();
        }else{
            let actionElement = '<div class="confirm-action" id="confirm-action-' + attachmentID +'"><a class="confirm-delete-attachment btn btn-default" id="delete-attachment-'+ attachmentID +'">'
                + 'Delete</a><button class="save-to-library btn btn-default">Remove & save to File Library</button></div>';
            tempObj.$('#attachment-name-'+attachmentID).append(actionElement);
        }
        tempObj.$("#new-attachment2-tooltip").show();

    },
    'click .confirm-delete-attachment': function (event,ui) {
        let tempObj = Template.instance();
        tempObj.$("#new-attachment2-tooltip").show();
        let attachmentID = parseInt(event.target.id.split('delete-attachment-')[1]);
        let  uploadedArray = tempObj.uploadedFiles.get();
        let attachmentCount = tempObj.attachmentCount.get();
        $('#attachment-upload').val('');
        uploadedArray.splice(attachmentID,1);
        tempObj.uploadedFiles.set(uploadedArray);
        attachmentCount --;
        if(attachmentCount === 0) {
            let elementToAdd = ' <div class="file-display_img"><div class="col inboxcol1"><img src="/icons/nofiles_icon.jpg" class=""></div> <div class="col inboxcol2"> <div>Upload  files or add files from the file library</div> <p style="color: #ababab;">Only users with access to your company can view these files</p></div></div>';
            $('#file-display').html(elementToAdd);
        }
        tempObj.attachmentCount.set(attachmentCount);
        if(uploadedArray.length > 0){
            let utilityService = new UtilityService();
            utilityService.showUploadedAttachment(uploadedArray);
        }else{
            $(".attchment-tooltip").show();

        }

    },
    'change #attachment-upload': function (e) {
        let utilityService = new UtilityService();
        let templateObj = Template.instance();
        let saveToTAttachment = false;
        let lineIDForAttachment = false;
        let uploadedFilesArray = templateObj.uploadedFiles.get();
        let myFiles = $('#attachment-upload')[0].files;
        let uploadData = utilityService.attachmentUpload(uploadedFilesArray, myFiles, saveToTAttachment, lineIDForAttachment);
        templateObj.uploadedFiles.set(uploadData.uploadedFilesArray);
        templateObj.attachmentCount.set(uploadData.totalAttachments);
    },

});
