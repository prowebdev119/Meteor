import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../js/core-service';
import {STSService} from "./sts-service";
import {UtilityService} from "../utility-service";
import '../lib/global/erp-objects';
import XLSX from 'xlsx';
import 'jquery-editable-select';

let utilityService = new UtilityService();

Template.stssettings.onCreated(function(){
    const templateObject = Template.instance();
    templateObject.datatablerecords = new ReactiveVar([]);
    templateObject.tableheaderrecords = new ReactiveVar([]);
    templateObject.clientrecords = new ReactiveVar([]);

});


Template.stssettings.onRendered(function() {
    $('.fullScreenSpin').css('display','inline-block');
    let stsService = new STSService();
    const templateObject = Template.instance();
    const dataTableList = [];
    const tableHeaderList = [];

    // Pulling customer list
    const clientList = [];

    // For storing table headers
    Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblStrains', function(error, result){
        if(error){

        }else{
            if(result){

                for (let i = 0; i < result.customFields.length; i++) {
                    let customcolumn = result.customFields;
                    let columData = customcolumn[i].label;
                    let columHeaderUpdate = customcolumn[i].thclass.replace(/ /g, ".");
                    let hiddenColumn = customcolumn[i].hidden;
                    let columnClass = columHeaderUpdate.split('.')[1];
                    let columnWidth = customcolumn[i].width;
                    // let columnindex = customcolumn[i].index + 1;
                    $("th."+columnClass+"").html(columData);
                    $("th."+columnClass+"").css('width',""+columnWidth+"px");

                }
            }

        }
    });


    templateObject.getStrainLists = function () {
        stsService.getStrainListVS1().then(function (data) {

            for(let i=0; i<data.tstsstrain.length; i++){

                var dataList = {
                    id: data.tstsstrain[i].Id || '',
                    strainname:data.tstsstrain[i].Strainname || '',
                    tested:data.tstsstrain[i].Tested || 'false',
                    inhouse: data.tstsstrain[i].TestedInHouse || 'false',
                    thirdparty: data.tstsstrain[i].TestedBy || '',
                    cbd: data.tstsstrain[i].CBD_Content || '0',
                    thc: data.tstsstrain[i].THC_Content || '0',
                    indica: data.tstsstrain[i].Indica || '0',
                    sativa: data.tstsstrain[i].Sativa || '0'

                };
                dataTableList.push(dataList);
            }
            templateObject.datatablerecords.set(dataTableList);

            if(templateObject.datatablerecords.get()){

                Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblStrains', function(error, result){
                    if(error){

                    }else{
                        if(result){
                            for (let i = 0; i < result.customFields.length; i++) {
                                let customcolumn = result.customFields;
                                let columData = customcolumn[i].label;
                                let columHeaderUpdate = customcolumn[i].thclass.replace(/ /g, ".");
                                let hiddenColumn = customcolumn[i].hidden;
                                let columnClass = columHeaderUpdate.split('.')[1];
                                let columnWidth = customcolumn[i].width;
                                let columnindex = customcolumn[i].index + 1;

                                if(hiddenColumn == true){

                                    $("."+columnClass+"").addClass('hiddenColumn');
                                    $("."+columnClass+"").removeClass('showColumn');
                                }else if(hiddenColumn == false){
                                    $("."+columnClass+"").removeClass('hiddenColumn');
                                    $("."+columnClass+"").addClass('showColumn');
                                }

                            }
                        }

                    }
                });


            }

            $('.fullScreenSpin').css('display','none');
            setTimeout(function () {
                $('#tblStrains').DataTable({
                    select: true,
                    destroy: true,
                    colReorder: true,
                    "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                    buttons: [
                        {
                            extend: 'csvHtml5',
                            text: '',
                            download: 'open',
                            className: "btntabletocsv hiddenColumn",
                            filename: "Strainlist_"+ moment().format(),
                            orientation:'portrait',
                            exportOptions: {
                                columns: ':visible'
                            }
                        },{
                            extend: 'print',
                            download: 'open',
                            className: "btntabletopdf hiddenColumn",
                            text: '',
                            title: 'Strain List',
                            filename: "Strainlist_"+ moment().format(),
                            exportOptions: {
                                columns: ':visible'
                            }
                        },
                        {
                            extend: 'excelHtml5',
                            title: '',
                            download: 'open',
                            className: "btntabletoexcel hiddenColumn",
                            filename: "Strainlist_"+ moment().format(),
                            orientation:'portrait',
                            exportOptions: {
                                columns: ':visible'
                            }
                        }],

                    pageLength: initialDatatableLoad,
                    lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
                    info: true,
                    responsive: true,
                    "order": [[ 0, "asc" ]],

                }).on('page', function () {

                }).on('column-reorder', function () {

                }).on( 'length.dt', function ( e, settings, len ) {

                });

            }, 10);

            var columns = $('#tblStrains th');
            let sTible = "";
            let sWidth = "";
            let sIndex = "";
            let sVisible = "";
            let columVisible = false;
            let sClass = "";
            $.each(columns, function(i,v) {
                if(v.hidden == false){
                    columVisible =  true;
                }
                if((v.className.includes("hiddenColumn"))){
                    columVisible = false;
                }
                sWidth = v.style.width.replace('px', "");
                let datatablerecordObj = {
                    sTitle: v.innerText || '',
                    sWidth: sWidth || '',
                    sIndex: v.cellIndex || '',
                    sVisible: columVisible || false,
                    sClass: v.className || ''
                };
                tableHeaderList.push(datatablerecordObj);
            });
            templateObject.tableheaderrecords.set(tableHeaderList);
            $('div.dataTables_filter input').addClass('form-control form-control-sm');


        }).catch(function (err) {
            // Bert.alert('<strong>' + err + '</strong>!', 'danger');
            $('.fullScreenSpin').css('display','none');

        });
    }

    templateObject.getAllClients = function(){
        stsService.getClientVS1().then(function(data){
            for(let i in data.tcustomervs1){
                let customerrecordObj = {
                    customerid: data.tcustomervs1[i].Id || ' ',
                    customername: data.tcustomervs1[i].ClientName || ' ',
                    customeremail: data.tcustomervs1[i].Email || ' ',
                    street : data.tcustomervs1[i].Street || ' ',
                    street2 : data.tcustomervs1[i].Street2 || ' ',
                    street3 : data.tcustomervs1[i].Street3 || ' ',
                    suburb : data.tcustomervs1[i].Suburb || ' ',
                    statecode : data.tcustomervs1[i].State +' '+data.tcustomervs1[i].Postcode || ' ',
                    country : data.tcustomervs1[i].Country || ' '
                };
                clientList.push(customerrecordObj);
            }
            templateObject.clientrecords.set(clientList.sort(function(a, b){
                if (a.customername == 'NA') {
                    return 1;
                }
                else if (b.customername == 'NA') {
                    return -1;
                }
                return (a.customername.toUpperCase() > b.customername.toUpperCase()) ? 1 : -1;
            }));
            for (var i = 0; i < clientList.length; i++) {
                $('#edtCustomerName').editableSelect('add',clientList[i].customername);
            }

        });
    };

    templateObject.getStrainLists();

    templateObject.getAllClients();

    $(document).ready(function() {
        $('#edtCustomerName').editableSelect();


    });

});


Template.stssettings.events({

    'click #formCheck-tested': function () {
        if($('#formCheck-tested').is(':checked')){
            $('#formCheck-inHouse').attr( "disabled", false);
            $('#edtCustomerName').attr( "disabled", false);
        }
        else {
            $('#formCheck-inHouse').attr( "disabled", true);
            $('#edtCustomerName').attr( "disabled", true);
        }
    },
    'click .btnCreateStrain': function () {
        $('.fullScreenSpin').css('display','inline-block');
        let stsService = new STSService();
        var strainname = $('#Strainname').val();
        var thirdparty = $('#edtCustomerName').val();
        var formChecktested = false;
        var formCheckinHouse = false;
        var thcContent = $('#THC_Content').val();
        var cbdContent = $('#CBD_Content').val();
        var indica = $('#Indica').val();
        var sativa = $('#Sativa').val();
        var immatureProductName = $('#ImmatureProductName').val();
        var vegetativeProductName = $('#VegetativeProductName').val();
        var floweringProductName = $('#FloweringProductName').val();
        var harvestProductName = $('#HarvestProductName').val();

        if($('#formCheck-tested').is(':checked')){
            formChecktested = true;
        }else{
            formChecktested = false;
        }

        if($('#formCheck-inHouse').is(':checked')){
            formCheckinHouse = true;
        }else{
            formCheckinHouse = false;
        }

        let data = '';

        data = {
            type: "TStSStrain",
            fields: {
                CBD_Content: parseFloat(cbdContent)|| 0,
                Indica: parseFloat(indica)|| 0,
                Sativa: parseFloat(sativa)|| 0,
                Strainname: strainname|| '',
                Tested: formChecktested || false,
                TestedInHouse: formCheckinHouse || false,
                TestedBy: thirdparty|| '',
                THC_Content: parseFloat(thcContent)|| 0,
                ImmatureProductName: immatureProductName|| '',
                VegetativeProductName: vegetativeProductName|| '',
                FloweringProductName: floweringProductName|| '',
                HarvestProductName: harvestProductName|| '',

            }
        };


        stsService.saveStrain(data).then(function (data) {
            window.open('/stssettings','_self');
        }).catch(function (err) {

            $('.fullScreenSpin').css('display','none');
        });
    },
    'click .printConfirm' : function(event){

        $('.fullScreenSpin').css('display','inline-block');
        jQuery('#tblStrains_wrapper .dt-buttons .btntabletopdf').click();
        $('.fullScreenSpin').css('display','none');
    },
    'click .exportbtn': function () {
        $('.fullScreenSpin').css('display','inline-block');
        jQuery('#tblStrains_wrapper .dt-buttons .btntabletocsv').click();
        $('.fullScreenSpin').css('display','none');
    }

});

Template.stssettings.helpers({
    datatablerecords : () => {
        return Template.instance().datatablerecords.get().sort(function(a, b){
            if (a.strainname == 'NA') {
                return 1;
            }
            else if (b.strainname == 'NA') {
                return -1;
            }
            return (a.strainname.toUpperCase() > b.strainname.toUpperCase()) ? 1 : -1;
        });
    },
    tableheaderrecords: () => {
        return Template.instance().tableheaderrecords.get();
    }

});
