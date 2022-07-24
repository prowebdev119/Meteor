import {FittingService} from "../fittings/fitting-service";
import {ReactiveVar} from "meteor/reactive-var";

Template.manufacturinglist.onCreated(function () {
  const templateObject = Template.instance();
      templateObject.records = new ReactiveVar([]);
      templateObject.allCount = new ReactiveVar();
      templateObject.salesorderRecords = new ReactiveVar({});
      templateObject.allSalesOrdersData = new ReactiveVar([]);
});

Template.manufacturinglist.onRendered(function () {
  let templateObject = Template.instance();
  let fittingService = new FittingService();
  let table;
  var splashArray = new Array();
  $('.fullScreenSpin').css('display','inline-block');
  templateObject.getManufacturings = function () {
  fittingService.getAllSalesOrder().then(function(data){
  let records = [];
  let lineItemObj = {};


  for(let i=0; i<data.tsalesorder.length; i++){
     let recordObj = {};
     let deleteOption = data.tsalesorder[i].deleted;
     // if(data.tsalesorder[i].deleted == false){
     //   deleteOption = "F";
     // }else if(data.tsalesorder[i].deleted == true){
     //   deleteOption = "T";
     // }
     recordObj.id = data.tsalesorder[i].Id;
     recordObj.active = data.tsalesorder[i].Deleted;
    recordObj.dataArr = [
        // data.tsalesorder[i].Id || '',
        data.tsalesorder[i].Id || '',
        data.tsalesorder[i].Id || '',
        data.tsalesorder[i].EmployeeName || '',
        data.tsalesorder[i].SaleClassName || '',
        data.tsalesorder[i].SaleDate !=''? moment(data.tsalesorder[i].SaleDate).format("DD-MM-YYYY"): data.tsalesorder[i].SaleDate,
        data.tsalesorder[i].ClientName || '',

    ];
    records.push(recordObj);
    if(deleteOption === false){
    var dataList = [data.tsalesorder[i].Id || '',
    data.tsalesorder[i].Id || '',
    data.tsalesorder[i].EmployeeName || '',
    // data.tsalesorder[i].SaleClassName || '',
    data.tsalesorder[i].SaleClassName || '',
    data.tsalesorder[i].ClientName || '',
    data.tsalesorder[i].SaleDate !=''? moment(data.tsalesorder[i].SaleDate).format("DD-MM-YYYY"): data.tsalesorder[i].SaleDate,

    deleteOption];

    //lineItems.push(lineItemObj);
    splashArray.push(dataList);
  }

  }
  localStorage.setItem('VS1ManufacturingList', JSON.stringify(splashArray));
  table = $('#manufacturing_list').DataTable({
    data : JSON.parse(localStorage.getItem('VS1ManufacturingList')),
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
    // "dom": '<"top"i>rt<"bottom"flp><"clear">'
  });

  table
      .order( [ 1, 'desc' ] )
      .draw();
  $('#manufacturing_list tbody').on( 'click', 'tr', function () {
      //var listData = table.row( this ).id();
      var listData = $(this).closest('tr').attr('id');

      //for(let i=0 ; i<splashArray.length ;i++){
      if(listData){
        window.open('/manufacturingquickSO?id=' + listData,'_self');
      }
      //}
  });
templateObject.records.set(records);
  //templateObject.salesorderRecords.set(lineItems);
  //templateObject.employeeformID.set(arrayformid);
  //templateObject.erpAccessLevelRecord.set(lineItems);

$('.fullScreenSpin').css('display','none');
});

};

if (!localStorage.getItem('VS1ManufacturingList')) {
   templateObject.getManufacturings();
}else{

  table = $('#manufacturing_list').DataTable({
    data : JSON.parse(localStorage.getItem('VS1ManufacturingList')),
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
    // "dom": '<"top"i>rt<"bottom"flp><"clear">'
  });

  table
      .order( [ 1, 'desc' ] )
      .draw();
  $('#manufacturing_list tbody').on( 'click', 'tr', function () {
      //var listData = table.row( this ).id();
      var listData = $(this).closest('tr').attr('id');

      //for(let i=0 ; i<splashArray.length ;i++){
      if(listData){
        window.open('/manufacturingquickSO?id=' + listData,'_self');
      }
      //}
  });

$('.fullScreenSpin').css('display','none');

}

  //let tableSalesOrder;

   // table.column(0).visible(false);
});

Template.manufacturinglist.helpers({
  records: () => {
      return Template.instance().records.get();
  },
  // salesorderRecords: () => {
  //     return Template.instance().allSalesOrdersData.get();
  // }
  });

  Template.manufacturinglist.events({
    'click #refreshpagelist': function(event){
      $('.fullScreenSpin').css('display','inline-block');
      localStorage.setItem('VS1ManufacturingList', '');
        Meteor._reload.reload();
        let templateObject = Template.instance();
         templateObject.getManufacturings();
    }
    });
