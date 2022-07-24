
import {ReactiveVar} from "meteor/reactive-var";
import {AccountService} from '../../accounts/account-service'
import{InvoiceService} from '../../invoice/invoice-service'
import {SalesBoardService} from "../../js/sales-service";
const _ = require('lodash');
let invoiceService = new InvoiceService();
let salesService = new SalesBoardService();
Template.newBatchDeposit.onCreated(function(){
    let templateObj = Template.instance();
    templateObj.record = new ReactiveVar({});
    templateObj.record.set(Session.get('recordId'));
    templateObj.customerName = new ReactiveVar({});
    templateObj.TotalAmount = new ReactiveVar({});
    templateObj.CurrencyCode = new ReactiveVar({});
    templateObj.addNote = new ReactiveVar({});
    templateObj.date = new ReactiveVar({});
    templateObj.CurrencyCode.set(' ');
    templateObj.customerName.set(' ');
    templateObj.TotalAmount.set(' ');

});
Template.newBatchDeposit.onRendered(function() {
    let templateObj = Template.instance();
    let accountService = new AccountService()
    let invoiceService = new InvoiceService()
    let accountsList=[];
    let totalAmount=0;
    let recordId= templateObj.record.get();
    let date=recordId[0].dueDate;
    date=moment(date).format('DD-MMM-YYYY');
    templateObj.date.set(date);
    templateObj.customerName.set(recordId[0].CustomerName);
    templateObj.CurrencyCode.set(recordId[0].foreignExchangeCode);
    templateObj.addNote.set('');
    $("#date-input").datepicker({
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
    $(".date input#date-input").val(moment().format("DD-MMM-YYYY"));

    //total amount calculate
    if(recordId!=null){
        for(let i=0;i<recordId.length;i++){
            totalAmount=totalAmount+recordId[i].TotalAmount;
        }
        totalAmount= Currency +totalAmount.toFixed(2);
        templateObj.TotalAmount.set(totalAmount);
    }
    //Bank Account Dropdown
    templateObj.getAllAccountTypes = function () {
        accountService.getAccountTypes().then(function (data) {
            let temp = [];
            for (let i = 0; i < data.taccount.length; i++) {
                let dataObj = {};
                let label = data.taccount[i].AccountNumber ? data.taccount[i].AccountNumber + " - " + data.taccount[i].AccountName : data.taccount[i].AccountName;
                let category = data.taccount[i].AccountTypeName;
                let taxCode = data.taccount[i].TaxCode;
                dataObj.label = label;
                dataObj.category = category;
                dataObj.taxCode = taxCode;
                accountsList.push(dataObj);
                temp.push(dataObj);
            }
            temp = _.orderBy(temp, 'label');
            accountsList = _.orderBy(temp, 'category');

            setTimeout(function () {
                templateObj.getAccountDropDown();
            },1000);
        });
    };
    templateObj.getAccountDropDown = function () {
        $.widget("custom.accdropdown", $.ui.autocomplete, {
            _create: function () {
                this._super();
                this.widget().menu("option", "items", "> :not(.ui-autocomplete-category)");
            },
            _renderMenu: function (ul, items) {
                let that = this,
                    currentCategory = "";
                $.each(items, function (index, item) {
                    let li;
                    if (item.category !== currentCategory) {
                        ul.append("<li class='ui-autocomplete-category'><div class='sub-heading-category'>" + item.category + "</div></li>");
                        currentCategory = item.category;
                    }
                    li = that._renderItemData(ul, item);
                    if (item.category) {
                        li.attr("aria-label", item.category + " : " + item.label);
                    }
                });
            }
        });
        this.$(".select-account").accdropdown({
            delay: 0,
            source: accountsList,
            minLength: 0,
            select: function (event, ui) {
                templateObj.$("#account-input").val(ui.item.value);
            }
        }).focus(function () {
            $(this).accdropdown('search', "");
        });
    };
    templateObj.getAllAccountTypes();
});
Template.newBatchDeposit.helpers({
    record: () => {
        return Template.instance().record.get();
    },
    customerName: () => {
        return Template.instance().customerName.get();
    },
    date: () => {
        return Template.instance().date.get();
    },
    addNote: () => {
        return Template.instance().addNote.get();
    },
    TotalAmount: () => {
        return Template.instance().TotalAmount.get();
    },
    CurrencyCode: () => {
        return Template.instance().CurrencyCode.get();
    },
    recordId: () => {
        return Session.get('recordId');
    },
    depositMsg: () => {
        return Session.get('depositMsg');
    },
    depositData: () => {
        return Session.get('depositData');
    }
});
Template.newBatchDeposit.events({
    'click .account-img': function (event) {
        let templateObject = Template.instance();
        templateObject.$("#account-input").trigger("select");
    },
    'click .ui-menu li': function (event) {
        $(this).addClass("active").siblings().removeClass("active");
        $(".ui-menu").hide();
    },
    'blur #reference, blur #account-input':function () {
        let templateObject = Template.instance();
        let reference=$("#reference").val();
        let account=$("#account-input").val();

        if(reference!='' && account!=''){
            templateObject.$('#invoiveDeposit').addClass('saveBtn');
            templateObject.$('#invoiveDeposit').removeClass('disableBtn')
        }

    },
    'blur #payment':function () {
        let templateObject = Template.instance();
        let payment=$("#payment").val();
        let totalAmount=parseFloat(templateObject.TotalAmount.get().substring(Currency.length).replace(",", ""))
        if(payment>totalAmount){
            Bert.alert('<strong>' + 'You cannot overpay in deposit' + '</strong>!', 'danger');
        }
    },
    'click a.removebutton': function (event) {
        if ($('.batch-statement-table tbody>tr').length > 1) {
            let templateObject = Template.instance();
            let totalAmount=0;
            let depositData=[];
            let lineToBeRemoved = event.currentTarget.id.split('removebutton-')[1];
            let newRecord = templateObject.record.get();
            if ((newRecord.length > 1)) {
                $('#pq_entry_' + lineToBeRemoved).remove();
                templateObject.record.set(newRecord);
            }
            for(let i=0;i<newRecord.length;i++){
                if(i!=lineToBeRemoved){
                    let data={
                        id : newRecord[i].id,
                        CustomerName :  newRecord[i].CustomerName,
                        employeName  :  newRecord[i].employeName,
                        docNumber    :  newRecord[i].docNumber,
                        dueDate      :  newRecord[i].dueDate,
                        TotalAmount  :  newRecord[i].TotalAmount,
                        paidAmount   :  newRecord[i].paidAmount,
                    };
                    depositData.push(data);
                    templateObject.record.set(depositData);
                    totalAmount=totalAmount+newRecord[i].TotalAmount;
                }
            }
            totalAmount= Currency +totalAmount.toFixed(2);
            templateObject.TotalAmount.set(totalAmount);
        }
    },
    'click #invoiveDeposit':function () {
        let templateObject = Template.instance();
        let invoiceService = new InvoiceService();
        let depositData= templateObject.record.get();

        let flag=false;
        let PayMethod;
        if(depositData[0].PayMethod !== ''){
            PayMethod = depositData[0].PayMethod;
        }
        else {
            PayMethod = 'Cash';
        }
        let empName = localStorage.getItem('mySession');
        let date= $("#date-input").val();
        let invoiceData=[]
         let bankAccount= $("#account-input").val();
        let saveStatus=[];
         if(bankAccount.includes("-")){
             bankAccount=bankAccount.split("- ");
             bankAccount=bankAccount[1];
         }
        for(let i=0;i<depositData.length;i++){
            let Line = {
                type: 'TCustomerPaymentLine',
                fields: {
                    AmountDue:depositData[i].TotalAmount,
                    EnteredBy:empName || ' ',
                    InvoiceId:depositData[i].id,
                    RefNo:($("#invoiceRef").val()),
                    Payment:parseFloat($("#payment").val()),
                    TransNo:''+depositData[i].id,
                }
            };
            invoiceData.push(Line);
            let invoiceObjDetails = {
                type: "TInvoiceEx",
                fields: {
                    ID: parseInt(depositData[i].id),
                    TotalPaid :parseFloat($("#payment").val())
                }
        };
        if(depositData[i].TotalAmount ===parseFloat($("#payment").val())){
            invoiceObjDetails.fields.SalesStatus='Paid';
            invoiceObjDetails.fields.IsPaid=true;
        }
            saveStatus.push(invoiceObjDetails)
        }
        let objDetails = {
             type: "TCustomerPayment",
             fields: {
                 AccountName:bankAccount,
                 ClientPrintName:($("#customerName").val()),
                 CompanyName:($("#customerName").val()),
                 EmployeeName: empName || ' ',
                 Lines: invoiceData,
                 Notes:($("#productcomment").val()),
                 Payment:true,
                 PaymentDate: moment($("#date-input").val()).format(),
                 PaymentMethodName: PayMethod,
                 ReferenceNo: ($("#reference").val()),
             }
         };
        invoiceService.saveDepositData(objDetails).then(function (data) {
            for(let i=0;i<saveStatus.length;i++) {
                invoiceService.saveInvoice(saveStatus[i]).then(function (dataInvoice) {
                });
            }
            Session.set('depositMsg', true);
            FlowRouter.go('/invoicelist/AwaitingPayment');

           }).catch(function (err) {
             swal({
             title: 'Oooops...',
             text: err,
             type: 'error',
             showCancelButton: false,
             confirmButtonText: 'Try Again'
             }).then((result) => {
             if (result.value) {
              Meteor._reload.reload();
             } else if (result.dismiss === 'cancel') {

             }
             });
        });

    },
    'click #cancel_new':function () {
        window.open('/invoicelist/AwaitingPayment' ,'_self');
    },
    'click .list_search': function () {
        let templateObject = Template.instance();
        templateObject.$('#search_box').show();
    },
    'keyup #productcomment':function(){
        let templateObj = Template.instance();
        templateObj.$('#productcommentupd').addClass('save_new');
        templateObj.$('#productcommentupd').removeClass('disableBtn')
    },
    'click #productcommentupd':function() {
    let tempObj = Template.instance();
    let newComments = $('textarea#productcomment').val();
    tempObj.addNote.set(newComments);
    tempObj.$('#search_box').hide();
},
    'click #cancel-po-note':function(){
    let templateObj = Template.instance();
    $("#productcomment").val(" ");
    $('#productnoteschars').text(300);
    templateObj.$('#productcommentupd').addClass('disableBtn');
    templateObj.$('#productcommentupd').removeClass('save_new');
    $("#search_box").hide();
},
});
