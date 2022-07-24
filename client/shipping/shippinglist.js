


import {ShippingService} from "../shipping/shipping-service";
import {ReactiveVar} from "meteor/reactive-var";





Template.shippinglist.onCreated(function () {
  const templateObject = Template.instance();
      templateObject.records = new ReactiveVar([]);
      templateObject.allCount = new ReactiveVar();
      templateObject.salesorderRecords = new ReactiveVar({});
      templateObject.allSalesOrdersData = new ReactiveVar([]);
});

Template.shippinglist.onRendered(function () {
  let templateObject = Template.instance();
  let shippingService = new ShippingService();
  let table;
  var splashArray = new Array();
  $('.fullScreenSpin').css('display','inline-block');
  templateObject.getShippings = function () {
  shippingService.getAllInvoice().then(function(data){
  let records = [];
  let lineItemObj = {};


  for(let i=0; i<data.tinvoicebackorder.length; i++){
     let recordObj = {};
     let deleteOption = data.tinvoicebackorder[i].deleted;

     // if(data.tsalesorder[i].deleted == false){
     //   deleteOption = "F";
     // }else if(data.tsalesorder[i].deleted == true){
     //   deleteOption = "T";
     // }
     recordObj.id = data.tinvoicebackorder[i].Id;
     recordObj.active = data.tinvoicebackorder[i].Deleted;

    recordObj.dataArr = [
        // data.tinvoice[i].Id || '',
        data.tinvoicebackorder[i].Id || '',
        data.tinvoicebackorder[i].Id || '',
        data.tinvoicebackorder[i].EmployeeName || '',
        data.tinvoicebackorder[i].SaleClassName || '',
        data.tinvoicebackorder[i].SaleDate !=''? moment(data.tinvoicebackorder[i].SaleDate).format("DD-MM-YYYY"): data.tinvoicebackorder[i].SaleDate,
        data.tinvoicebackorder[i].ClientName || '',

    ];
    records.push(recordObj);
    //if(deleteOption === false){
    var dataList = [data.tinvoicebackorder[i].Id || '',
    data.tinvoicebackorder[i].Id || '',
    data.tinvoicebackorder[i].EmployeeName || '',
    // data.tinvoice[i].SaleClassName || '',
    data.tinvoicebackorder[i].SaleClassName || '',
    data.tinvoicebackorder[i].ClientName || '',
    data.tinvoicebackorder[i].SaleDate !=''? moment(data.tinvoicebackorder[i].SaleDate).format("DD-MM-YYYY"): data.tinvoicebackorder[i].SaleDate,
    ];
    //lineItems.push(lineItemObj);
    splashArray.push(dataList);
    //}

    //records.push(lineItemObj);
    //arrayformid.push(lineItemObj.lineID)


  }
  localStorage.setItem('VS1ShippingList', JSON.stringify(splashArray));
  table = $('#shipping_list').DataTable({
    data : JSON.parse(localStorage.getItem('VS1ShippingList')),
    processing: true,
    paging: true,
    columnDefs: [
        { orderable: false, targets: 0 },
        { orderable: false, targets: 5 }
    ],
    colReorder: true,
    colReorder: {
        fixedColumnsLeft: 1,
        fixedColumnsRight: 1
    },
    bStateSave: true,
    scrollX: 1000,
    rowId: 0,
    pageLength: initialDatatableLoad,
    lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
    info: true,
    responsive: true
    // dom: '<"top"i>rt<"bottom"flp><"clear">'
  });

  table
      .order( [ 1, 'desc' ] )
      .draw();

    $('#shipping_list tbody').on( 'click', 'tr', function () {
        //var listData = table.row( this ).id();
        var listData = $(this).closest('tr').attr('id');

        //for(let i=0 ; i<splashArray.length ;i++){
        if(listData){
          window.open('/shipquickInv?id=' + listData,'_self');

        }
    });
templateObject.records.set(records);
  //templateObject.salesorderRecords.set(lineItems);
  //templateObject.employeeformID.set(arrayformid);
  //templateObject.erpAccessLevelRecord.set(lineItems);

  $('.fullScreenSpin').css('display','none');
});
};

if (!localStorage.getItem('VS1ShippingList')) {
   templateObject.getShippings();
}else{

  table = $('#shipping_list').DataTable({
    data : JSON.parse(localStorage.getItem('VS1ShippingList')),
    processing: true,
    paging: true,
    columnDefs: [
        { orderable: false, targets: 0 },
        { orderable: false, targets: 5 }
    ],
    colReorder: true,
    colReorder: {
        fixedColumnsLeft: 1,
        fixedColumnsRight: 1
    },
    bStateSave: true,
    scrollX: 1000,
    rowId: 0,
    pageLength: initialDatatableLoad,
    lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
    info: true,
    responsive: true
    // dom: '<"top"i>rt<"bottom"flp><"clear">'
  });

  table
      .order( [ 1, 'desc' ] )
      .draw();

    $('#shipping_list tbody').on( 'click', 'tr', function () {
        //var listData = table.row( this ).id();
        var listData = $(this).closest('tr').attr('id');

        //for(let i=0 ; i<splashArray.length ;i++){
        if(listData){
          window.open('/shipquickInv?id=' + listData,'_self');

        }
    });

  $('.fullScreenSpin').css('display','none');

}
  //let tableSalesOrder;

   // table.column(0).visible(false);
});

Template.shippinglist.helpers({
  records: () => {
      return Template.instance().records.get();
  },
  // salesorderRecords: () => {
  //     return Template.instance().allSalesOrdersData.get();
  // }
  });

  Template.shippinglist.events({
    'click #refreshpagelist': function(event){
      $('.fullScreenSpin').css('display','inline-block');
      localStorage.setItem('VS1ShippingList', '');
        Meteor._reload.reload();
        let templateObject = Template.instance();
         templateObject.getShippings();
    }
    });
