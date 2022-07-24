import {
    CRMService
} from '../../crm-service';
let crmService = new CRMService();

Template.taskdatatable.onCreated(function() {

});

Template.taskdatatable.onRendered(function() {
    setTimeout(function() {
        $('#tblTaskListDatatable').DataTable({
            // columnDefs: [{
            //     type: 'date',
            //     targets: -1
            // }],
            columnDefs: [{
                    "orderable": false,
                    "targets": 0
                },
                {
                    "orderable": false,
                    "targets": 5
                }
            ],
            colReorder: {
                fixedColumnsLeft: 0
            },
            "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
            buttons: [{
                extend: 'excelHtml5',
                text: '',
                download: 'open',
                className: "btntabletocsv hiddenColumn",
                filename: "Task List" + moment().format(),
                orientation: 'portrait',
                exportOptions: {
                    columns: ':visible',
                    format: {
                        body: function(data, row, column) {
                            if (data.includes("</span>")) {
                                var res = data.split("</span>");
                                data = res[1];
                            }

                            return column === 1 ? data.replace(/<.*?>/ig, "") : data;

                        }
                    }
                }
            }, {
                extend: 'print',
                download: 'open',
                className: "btntabletopdf hiddenColumn",
                text: '',
                title: 'Shipping List',
                filename: "Shipping List" + moment().format(),
                exportOptions: {
                    columns: ':visible',
                    stripHtml: false
                }
            }],
            select: true,
            destroy: true,
            colReorder: true,
            pageLength: initialDatatableLoad,
            lengthMenu: [
                [initialDatatableLoad, -1],
                [initialDatatableLoad, "All"]
            ],
            info: true,
            responsive: true,
            "order": [
                [4, "desc"],
                [1, "desc"]
            ],
            action: function() {
                $('#tblTaskListDatatable').DataTable().ajax.reload();
            },
            "fnDrawCallback": function(oSettings) {
                setTimeout(function() {
                    MakeNegative();
                }, 100);
            },
            "fnInitComplete": function() {
                $("<button class='btn btn-primary btnRefreshShipping' type='button' id='btnRefreshStockAdjustment' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblTaskListDatatable_filter");
            }
        });
        $('.fullScreenSpin').css('display', 'none');
    }, 0);
});

Template.taskdatatable.events({
    'click #tblTaskListDatatable td.colOpenTask': function(event) {
        $('#taskModal').modal('toggle');
    },
    'click .btnEditTask': function(event) {
        $('#taskModal').modal('toggle');
    },
    'click .btnCommentTask': function(event) {
        $('#taskModal').modal('toggle');
    }
});

Template.taskdatatable.helpers({

});
