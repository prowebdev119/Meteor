import {
    TaxRateService
} from "../settings/settings-service";
import {
    ReactiveVar
} from 'meteor/reactive-var';
import {
    SideBarService
} from '../js/sidebar-service';
import '../lib/global/indexdbstorage.js';
let sideBarService = new SideBarService();
Template.newtermspop.onCreated(function() {
    const templateObject = Template.instance();
    templateObject.datatablerecords = new ReactiveVar([]);
    templateObject.tableheaderrecords = new ReactiveVar([]);

    templateObject.deptrecords = new ReactiveVar();

    templateObject.include7Days = new ReactiveVar();
    templateObject.include7Days.set(false);
    templateObject.include30Days = new ReactiveVar();
    templateObject.include30Days.set(false);
    templateObject.includeCOD = new ReactiveVar();
    templateObject.includeCOD.set(false);
    templateObject.includeEOM = new ReactiveVar();
    templateObject.includeEOM.set(false);
    templateObject.includeEOMPlus = new ReactiveVar();
    templateObject.includeEOMPlus.set(false);

    templateObject.includeSalesDefault = new ReactiveVar();
    templateObject.includeSalesDefault.set(false);
    templateObject.includePurchaseDefault = new ReactiveVar();
    templateObject.includePurchaseDefault.set(false);

});

Template.newtermspop.onRendered(function() {
    $('.fullScreenSpin').css('display', 'inline-block');
    let templateObject = Template.instance();
    let taxRateService = new TaxRateService();
    const dataTableList = [];
    const tableHeaderList = [];
    const deptrecords = [];
    let deptprodlineItems = [];
    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'termsList', function(error, result) {
        if (error) {

        } else {
            if (result) {
                for (let i = 0; i < result.customFields.length; i++) {
                    let customcolumn = result.customFields;
                    let columData = customcolumn[i].label;
                    let columHeaderUpdate = customcolumn[i].thclass.replace(/ /g, ".");
                    let hiddenColumn = customcolumn[i].hidden;
                    let columnClass = columHeaderUpdate.split('.')[1];
                    let columnWidth = customcolumn[i].width;

                    $("th." + columnClass + "").html(columData);
                    $("th." + columnClass + "").css('width', "" + columnWidth + "px");

                }
            }

        }
    });

    function MakeNegative() {
        $('td').each(function() {
            if ($(this).text().indexOf('-' + Currency) >= 0) $(this).addClass('text-danger')
        });
    };

    templateObject.getTaxRates = function() {
        getVS1Data('TTermsVS1').then(function(dataObject) {
            if (dataObject.length == 0) {
                taxRateService.getTermsVS1().then(function(data) {
                    let lineItems = [];
                    let lineItemObj = {};
                    let setISCOD = false;
                    for (let i = 0; i < data.ttermsvs1.length; i++) {
                        if ((data.ttermsvs1[i].IsDays == true) && (data.ttermsvs1[i].Days == 0)) {

                            setISCOD = true;
                        } else {
                            setISCOD = false;
                        }
                        // let taxRate = (data.tdeptclass[i].fields.Rate * 100).toFixed(2) + '%';
                        var dataList = {
                            id: data.ttermsvs1[i].Id || '',
                            termname: data.ttermsvs1[i].TermsName || '',
                            termdays: data.ttermsvs1[i].Days || 0,
                            iscod: setISCOD || false,
                            description: data.ttermsvs1[i].Description || '',
                            iseom: data.ttermsvs1[i].IsEOM || 'false',
                            iseomplus: data.ttermsvs1[i].IsEOMPlus || 'false',
                            isPurchasedefault: data.ttermsvs1[i].isPurchasedefault || 'false',
                            isSalesdefault: data.ttermsvs1[i].isSalesdefault || 'false'
                        };

                        dataTableList.push(dataList);
                        //}
                    }


                    templateObject.datatablerecords.set(dataTableList);

                    if (templateObject.datatablerecords.get()) {

                        Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'termsList', function(error, result) {
                            if (error) {

                            } else {
                                if (result) {
                                    for (let i = 0; i < result.customFields.length; i++) {
                                        let customcolumn = result.customFields;
                                        let columData = customcolumn[i].label;
                                        let columHeaderUpdate = customcolumn[i].thclass.replace(/ /g, ".");
                                        let hiddenColumn = customcolumn[i].hidden;
                                        let columnClass = columHeaderUpdate.split('.')[1];
                                        let columnWidth = customcolumn[i].width;
                                        let columnindex = customcolumn[i].index + 1;

                                        if (hiddenColumn == true) {

                                            $("." + columnClass + "").addClass('hiddenColumn');
                                            $("." + columnClass + "").removeClass('showColumn');
                                        } else if (hiddenColumn == false) {
                                            $("." + columnClass + "").removeClass('hiddenColumn');
                                            $("." + columnClass + "").addClass('showColumn');
                                        }

                                    }
                                }

                            }
                        });


                        setTimeout(function() {
                            MakeNegative();
                        }, 100);
                    }

                    $('.fullScreenSpin').css('display', 'none');

                    var columns = $('#termsList th');
                    let sTible = "";
                    let sWidth = "";
                    let sIndex = "";
                    let sVisible = "";
                    let columVisible = false;
                    let sClass = "";
                    $.each(columns, function(i, v) {
                        if (v.hidden == false) {
                            columVisible = true;
                        }
                        if ((v.className.includes("hiddenColumn"))) {
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

                }).catch(function(err) {
                    $('.fullScreenSpin').css('display', 'none');
                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.ttermsvs1;
                let lineItems = [];
                let lineItemObj = {};
                let setISCOD = false;
                for (let i = 0; i < useData.length; i++) {
                    if ((useData[i].IsDays == true) && (useData[i].Days == 0)) {

                        setISCOD = true;
                    } else {
                        setISCOD = false;
                    }
                    var dataList = {
                        id: useData[i].Id || '',
                        termname: useData[i].TermsName || '',
                        termdays: useData[i].Days || 0,
                        iscod: setISCOD || false,
                        description: useData[i].Description || '',
                        iseom: useData[i].IsEOM || 'false',
                        iseomplus: useData[i].IsEOMPlus || 'false',
                        isPurchasedefault: useData[i].isPurchasedefault || 'false',
                        isSalesdefault: useData[i].isSalesdefault || 'false'
                    };

                    dataTableList.push(dataList);
                }


                templateObject.datatablerecords.set(dataTableList);

                if (templateObject.datatablerecords.get()) {

                    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'termsList', function(error, result) {
                        if (error) {

                        } else {
                            if (result) {
                                for (let i = 0; i < result.customFields.length; i++) {
                                    let customcolumn = result.customFields;
                                    let columData = customcolumn[i].label;
                                    let columHeaderUpdate = customcolumn[i].thclass.replace(/ /g, ".");
                                    let hiddenColumn = customcolumn[i].hidden;
                                    let columnClass = columHeaderUpdate.split('.')[1];
                                    let columnWidth = customcolumn[i].width;
                                    let columnindex = customcolumn[i].index + 1;

                                    if (hiddenColumn == true) {

                                        $("." + columnClass + "").addClass('hiddenColumn');
                                        $("." + columnClass + "").removeClass('showColumn');
                                    } else if (hiddenColumn == false) {
                                        $("." + columnClass + "").removeClass('hiddenColumn');
                                        $("." + columnClass + "").addClass('showColumn');
                                    }

                                }
                            }

                        }
                    });


                    setTimeout(function() {
                        MakeNegative();
                    }, 100);
                }

                $('.fullScreenSpin').css('display', 'none');


                var columns = $('#termsList th');
                let sTible = "";
                let sWidth = "";
                let sIndex = "";
                let sVisible = "";
                let columVisible = false;
                let sClass = "";
                $.each(columns, function(i, v) {
                    if (v.hidden == false) {
                        columVisible = true;
                    }
                    if ((v.className.includes("hiddenColumn"))) {
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

            }
        }).catch(function(err) {
            taxRateService.getTermsVS1().then(function(data) {
                let lineItems = [];
                let lineItemObj = {};
                let setISCOD = false;
                for (let i = 0; i < data.ttermsvs1.length; i++) {
                    if ((data.ttermsvs1[i].IsDays == true) && (data.ttermsvs1[i].Days == 0)) {

                        setISCOD = true;
                    } else {
                        setISCOD = false;
                    }
                    var dataList = {
                        id: data.ttermsvs1[i].Id || '',
                        termname: data.ttermsvs1[i].TermsName || '',
                        termdays: data.ttermsvs1[i].Days || 0,
                        iscod: setISCOD || false,
                        description: data.ttermsvs1[i].Description || '',
                        iseom: data.ttermsvs1[i].IsEOM || 'false',
                        iseomplus: data.ttermsvs1[i].IsEOMPlus || 'false',
                        isPurchasedefault: data.ttermsvs1[i].isPurchasedefault || 'false',
                        isSalesdefault: data.ttermsvs1[i].isSalesdefault || 'false'
                    };

                    dataTableList.push(dataList);
                }


                templateObject.datatablerecords.set(dataTableList);

                if (templateObject.datatablerecords.get()) {

                    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'termsList', function(error, result) {
                        if (error) {

                        } else {
                            if (result) {
                                for (let i = 0; i < result.customFields.length; i++) {
                                    let customcolumn = result.customFields;
                                    let columData = customcolumn[i].label;
                                    let columHeaderUpdate = customcolumn[i].thclass.replace(/ /g, ".");
                                    let hiddenColumn = customcolumn[i].hidden;
                                    let columnClass = columHeaderUpdate.split('.')[1];
                                    let columnWidth = customcolumn[i].width;
                                    let columnindex = customcolumn[i].index + 1;

                                    if (hiddenColumn == true) {

                                        $("." + columnClass + "").addClass('hiddenColumn');
                                        $("." + columnClass + "").removeClass('showColumn');
                                    } else if (hiddenColumn == false) {
                                        $("." + columnClass + "").removeClass('hiddenColumn');
                                        $("." + columnClass + "").addClass('showColumn');
                                    }

                                }
                            }

                        }
                    });


                    setTimeout(function() {
                        MakeNegative();
                    }, 100);
                }

                $('.fullScreenSpin').css('display', 'none');


                var columns = $('#termsList th');
                let sTible = "";
                let sWidth = "";
                let sIndex = "";
                let sVisible = "";
                let columVisible = false;
                let sClass = "";
                $.each(columns, function(i, v) {
                    if (v.hidden == false) {
                        columVisible = true;
                    }
                    if ((v.className.includes("hiddenColumn"))) {
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

            }).catch(function(err) {
                $('.fullScreenSpin').css('display', 'none');
            });
        });

    }

    templateObject.getTaxRates();

    $(document).on('click', '.table-remove', function() {
        event.stopPropagation();
        event.stopPropagation();
        var targetID = $(event.target).closest('tr').attr('id');
        $('#selectDeleteLineID').val(targetID);
        $('#deleteLineModal').modal('toggle');
    });

    $('#termsList tbody').on('click', 'tr .colName, tr .colIsDays, tr .colIsEOM, tr .colDescription, tr .colIsCOD, tr .colIsEOMPlus, tr .colCustomerDef, tr .colSupplierDef', function() {
        var listData = $(this).closest('tr').attr('id');
        var is7days = false;
        var is30days = false;
        var isEOM = false;
        var isEOMPlus = false;
        var isSalesDefault = false;
        var isPurchaseDefault = false;
        if (listData) {
            $('#add-terms-title').text('Edit Term ');
            if (listData !== '') {
                listData = Number(listData);

                var termsID = listData || '';
                var termsName = $(event.target).closest("tr").find(".colName").text() || '';
                var description = $(event.target).closest("tr").find(".colDescription").text() || '';
                var days = $(event.target).closest("tr").find(".colIsDays").text() || 0;
                //let isDays = data.fields.IsDays || '';
                if ($(event.target).closest("tr").find(".colIsEOM .chkBox").is(':checked')) {
                    isEOM = true;
                }

                if ($(event.target).closest("tr").find(".colIsEOMPlus .chkBox").is(':checked')) {
                    isEOMPlus = true;
                }

                if ($(event.target).closest("tr").find(".colCustomerDef .chkBox").is(':checked')) {
                    isSalesDefault = true;
                }

                if ($(event.target).closest("tr").find(".colSupplierDef .chkBox").is(':checked')) {
                    isPurchaseDefault = true;
                }

                if (isEOM == true || isEOMPlus == true) {
                    isDays = false;
                } else {
                    isDays = true;
                }


                $('#edtTermsID').val(termsID);
                $('#edtName').val(termsName);
                $('#edtName').prop('readonly', true);
                $('#edtDesc').val(description);
                $('#edtDays').val(days);

                if ((isDays == true) && (days == 0)) {
                    templateObject.includeCOD.set(true);
                } else {
                    templateObject.includeCOD.set(false);
                }

                if ((isDays == true) && (days == 30)) {
                    templateObject.include30Days.set(true);
                } else {
                    templateObject.include30Days.set(false);
                }

                if (isEOM == true) {
                    templateObject.includeEOM.set(true);
                } else {
                    templateObject.includeEOM.set(false);
                }

                if (isEOMPlus == true) {
                    templateObject.includeEOMPlus.set(true);
                } else {
                    templateObject.includeEOMPlus.set(false);
                }


                if (isSalesDefault == true) {
                    templateObject.includeSalesDefault.set(true);
                } else {
                    templateObject.includeSalesDefault.set(false);
                }

                if (isPurchaseDefault == true) {
                    templateObject.includePurchaseDefault.set(true);
                } else {
                    templateObject.includePurchaseDefault.set(false);
                }

                $(this).closest('tr').attr('data-target', '#myModal');
                $(this).closest('tr').attr('data-toggle', 'modal');

            }

        }

    });
});


Template.newtermspop.events({
    'click .chkDatatable': function(event) {
        var columns = $('#termsList th');
        let columnDataValue = $(event.target).closest("div").find(".divcolumn").text();

        $.each(columns, function(i, v) {
            let className = v.classList;
            let replaceClass = className[1];

            if (v.innerText == columnDataValue) {
                if ($(event.target).is(':checked')) {
                    $("." + replaceClass + "").css('display', 'table-cell');
                    $("." + replaceClass + "").css('padding', '.75rem');
                    $("." + replaceClass + "").css('vertical-align', 'top');
                } else {
                    $("." + replaceClass + "").css('display', 'none');
                }
            }
        });
    },
    'click .resetTable': function(event) {
        var getcurrentCloudDetails = CloudUser.findOne({
            _id: Session.get('mycloudLogonID'),
            clouddatabaseID: Session.get('mycloudLogonDBID')
        });
        if (getcurrentCloudDetails) {
            if (getcurrentCloudDetails._id.length > 0) {
                var clientID = getcurrentCloudDetails._id;
                var clientUsername = getcurrentCloudDetails.cloudUsername;
                var clientEmail = getcurrentCloudDetails.cloudEmail;
                var checkPrefDetails = CloudPreference.findOne({
                    userid: clientID,
                    PrefName: 'termsList'
                });
                if (checkPrefDetails) {
                    CloudPreference.remove({
                        _id: checkPrefDetails._id
                    }, function(err, idTag) {
                        if (err) {

                        } else {
                            Meteor._reload.reload();
                        }
                    });

                }
            }
        }
    },
    'click .saveTable': function(event) {
        let lineItems = [];
        $('.columnSettings').each(function(index) {
            var $tblrow = $(this);
            var colTitle = $tblrow.find(".divcolumn").text() || '';
            var colWidth = $tblrow.find(".custom-range").val() || 0;
            var colthClass = $tblrow.find(".divcolumn").attr("valueupdate") || '';
            var colHidden = false;
            if ($tblrow.find(".custom-control-input").is(':checked')) {
                colHidden = false;
            } else {
                colHidden = true;
            }
            let lineItemObj = {
                index: index,
                label: colTitle,
                hidden: colHidden,
                width: colWidth,
                thclass: colthClass
            }

            lineItems.push(lineItemObj);
        });

        var getcurrentCloudDetails = CloudUser.findOne({
            _id: Session.get('mycloudLogonID'),
            clouddatabaseID: Session.get('mycloudLogonDBID')
        });
        if (getcurrentCloudDetails) {
            if (getcurrentCloudDetails._id.length > 0) {
                var clientID = getcurrentCloudDetails._id;
                var clientUsername = getcurrentCloudDetails.cloudUsername;
                var clientEmail = getcurrentCloudDetails.cloudEmail;
                var checkPrefDetails = CloudPreference.findOne({
                    userid: clientID,
                    PrefName: 'termsList'
                });
                if (checkPrefDetails) {
                    CloudPreference.update({
                        _id: checkPrefDetails._id
                    }, {
                        $set: {
                            userid: clientID,
                            username: clientUsername,
                            useremail: clientEmail,
                            PrefGroup: 'salesform',
                            PrefName: 'termsList',
                            published: true,
                            customFields: lineItems,
                            updatedAt: new Date()
                        }
                    }, function(err, idTag) {
                        if (err) {
                            $('#myModal2').modal('toggle');
                        } else {
                            $('#myModal2').modal('toggle');
                        }
                    });

                } else {
                    CloudPreference.insert({
                        userid: clientID,
                        username: clientUsername,
                        useremail: clientEmail,
                        PrefGroup: 'salesform',
                        PrefName: 'termsList',
                        published: true,
                        customFields: lineItems,
                        createdAt: new Date()
                    }, function(err, idTag) {
                        if (err) {
                            $('#myModal2').modal('toggle');
                        } else {
                            $('#myModal2').modal('toggle');

                        }
                    });
                }
            }
        }
        $('#myModal2').modal('toggle');
    },
    'blur .divcolumn': function(event) {
        let columData = $(event.target).text();

        let columnDatanIndex = $(event.target).closest("div.columnSettings").attr('id');
        var datable = $('#termsList').DataTable();
        var title = datable.column(columnDatanIndex).header();
        $(title).html(columData);

    },
    'change .rngRange': function(event) {
        let range = $(event.target).val();
        $(event.target).closest("div.divColWidth").find(".spWidth").html(range + 'px');

        let columData = $(event.target).closest("div.divColWidth").find(".spWidth").attr("value");
        let columnDataValue = $(event.target).closest("div").prev().find(".divcolumn").text();
        var datable = $('#termsList th');
        $.each(datable, function(i, v) {

            if (v.innerText == columnDataValue) {
                let className = v.className;
                let replaceClass = className.replace(/ /g, ".");
                $("." + replaceClass + "").css('width', range + 'px');

            }
        });

    },
    'click .btnOpenSettings': function(event) {
        let templateObject = Template.instance();
        var columns = $('#termsList th');

        const tableHeaderList = [];
        let sTible = "";
        let sWidth = "";
        let sIndex = "";
        let sVisible = "";
        let columVisible = false;
        let sClass = "";
        $.each(columns, function(i, v) {
            if (v.hidden == false) {
                columVisible = true;
            }
            if ((v.className.includes("hiddenColumn"))) {
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
    },
    'click #exportbtn': function() {
        $('.fullScreenSpin').css('display', 'inline-block');
        jQuery('#termsList_wrapper .dt-buttons .btntabletoexcel').click();
        $('.fullScreenSpin').css('display', 'none');

    },
    'click .btnRefresh': function() {
        $('.fullScreenSpin').css('display', 'inline-block');
        sideBarService.getTermsVS1().then(function(dataReload) {
            addVS1Data('TTermsVS1', JSON.stringify(dataReload)).then(function(datareturn) {
                location.reload(true);
            }).catch(function(err) {
                location.reload(true);
            });
        }).catch(function(err) {
            location.reload(true);
        });
    },
    'click .btnDeleteTerms': function() {
        let taxRateService = new TaxRateService();
        let termsId = $('#selectDeleteLineID').val();


        let objDetails = {
            type: "TTerms",
            fields: {
                Id: parseInt(termsId),
                Active: false
            }
        };

        taxRateService.saveTerms(objDetails).then(function(objDetails) {
            sideBarService.getTermsVS1().then(function(dataReload) {
                addVS1Data('TTermsVS1', JSON.stringify(dataReload)).then(function(datareturn) {
                    Meteor._reload.reload();
                }).catch(function(err) {
                    Meteor._reload.reload();
                });
            }).catch(function(err) {
                Meteor._reload.reload();
            });
        }).catch(function(err) {
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
            $('.fullScreenSpin').css('display', 'none');
        });

    },
    'click .btnSaveTerms': function() {
        $('.fullScreenSpin').css('display', 'inline-block');
        let taxRateService = new TaxRateService();
        let termsID = $('#edtTermsID').val();
        let termsName = $('#edtName').val();
        let description = $('#edtDesc').val();
        let termdays = $('#edtDays').val();

        let isDays = false;
        let is30days = false;
        let isEOM = false;
        let isEOMPlus = false;
        let days = 0;

        let isSalesdefault = false;
        let isPurchasedefault = false;
        if (termdays.replace(/\s/g, '') != "") {
            isDays = true;
        } else {
            isDays = false;
        }

        if ($('#isEOM').is(':checked')) {
            isEOM = true;
        } else {
            isEOM = false;
        }

        if ($('#isEOMPlus').is(':checked')) {
            isEOMPlus = true;
        } else {
            isEOMPlus = false;
        }

        if ($('#chkCustomerDef').is(':checked')) {
            isSalesdefault = true;
        } else {
            isSalesdefault = false;
        }

        if ($('#chkSupplierDef').is(':checked')) {
            isPurchasedefault = true;
        } else {
            isPurchasedefault = false;
        }

        let objDetails = '';
        if (termsName === '') {
            $('.fullScreenSpin').css('display', 'none');
            Bert.alert('<strong>WARNING:</strong> Term Name cannot be blank!', 'warning');
            e.preventDefault();
        }

        if (termsID == "") {
            taxRateService.checkTermByName(termsName).then(function(data) {
                termsID = data.tterms[0].Id;
                objDetails = {
                    type: "TTerms",
                    fields: {
                        ID: parseInt(termsID),
                        Active: true,
                        //TermsName: termsName,
                        Description: description,
                        IsDays: isDays,
                        IsEOM: isEOM,
                        IsEOMPlus: isEOMPlus,
                        isPurchasedefault: isPurchasedefault,
                        isSalesdefault: isSalesdefault,
                        Days: termdays || 0,
                        PublishOnVS1: true
                    }
                };

                taxRateService.saveTerms(objDetails).then(function(objDetails) {
                    sideBarService.getTermsVS1().then(function(dataReload) {
                        $('#sltTerms').val(termsName);
                        addVS1Data('TTermsVS1', JSON.stringify(dataReload)).then(function(datareturn) {
                            $('#newTermsModal').modal('toggle');
                            $('.fullScreenSpin').css('display', 'none');
                        }).catch(function(err) {
                            $('#newTermsModal').modal('toggle');
                            $('.fullScreenSpin').css('display', 'none');
                        });
                    }).catch(function(err) {
                        $('#newTermsModal').modal('toggle');
                        $('.fullScreenSpin').css('display', 'none');
                    });
                }).catch(function(err) {
                    swal({
                        title: 'Oooops...',
                        text: err,
                        type: 'error',
                        showCancelButton: false,
                        confirmButtonText: 'Try Again'
                    }).then((result) => {
                        if (result.value) {
                            $('#newTermsModal').modal('toggle');
                            $('.fullScreenSpin').css('display', 'none');
                        } else if (result.dismiss === 'cancel') {

                        }
                    });
                    $('.fullScreenSpin').css('display', 'none');
                });
            }).catch(function(err) {
                objDetails = {
                    type: "TTerms",
                    fields: {
                        Active: true,
                        TermsName: termsName,
                        Description: description,
                        IsDays: isDays,
                        IsEOM: isEOM,
                        IsEOMPlus: isEOMPlus,
                        Days: termdays || 0,
                        PublishOnVS1: true
                    }
                };

                taxRateService.saveTerms(objDetails).then(function(objDetails) {
                    sideBarService.getTermsVS1().then(function(dataReload) {
                        $('#sltTerms').val(termsName);
                        addVS1Data('TTermsVS1', JSON.stringify(dataReload)).then(function(datareturn) {
                            $('#newTermsModal').modal('toggle');
                            $('.fullScreenSpin').css('display', 'none');
                        }).catch(function(err) {
                            $('#newTermsModal').modal('toggle');
                            $('.fullScreenSpin').css('display', 'none');
                        });
                    }).catch(function(err) {
                        $('#newTermsModal').modal('toggle');
                        $('.fullScreenSpin').css('display', 'none');
                    });
                }).catch(function(err) {
                    swal({
                        title: 'Oooops...',
                        text: err,
                        type: 'error',
                        showCancelButton: false,
                        confirmButtonText: 'Try Again'
                    }).then((result) => {
                        if (result.value) {
                            $('#newTermsModal').modal('toggle');
                            $('.fullScreenSpin').css('display', 'none');
                        } else if (result.dismiss === 'cancel') {

                        }
                    });
                    $('.fullScreenSpin').css('display', 'none');
                });
            });

        } else {
            objDetails = {
                type: "TTerms",
                fields: {
                    ID: parseInt(termsID),
                    TermsName: termsName,
                    Description: description,
                    IsDays: isDays,
                    IsEOM: isEOM,
                    isPurchasedefault: isPurchasedefault,
                    isSalesdefault: isSalesdefault,
                    IsEOMPlus: isEOMPlus,
                    Days: termdays || 0,
                    PublishOnVS1: true
                }
            };

            taxRateService.saveTerms(objDetails).then(function(objDetails) {
                sideBarService.getTermsVS1().then(function(dataReload) {
                    $('#sltTerms').val(termsName);
                    addVS1Data('TTermsVS1', JSON.stringify(dataReload)).then(function(datareturn) {
                        $('#newTermsModal').modal('toggle');
                        $('.fullScreenSpin').css('display', 'none');
                    }).catch(function(err) {
                        $('#newTermsModal').modal('toggle');
                        $('.fullScreenSpin').css('display', 'none');
                    });
                }).catch(function(err) {
                    $('#newTermsModal').modal('toggle');
                    $('.fullScreenSpin').css('display', 'none');
                });
            }).catch(function(err) {
                swal({
                    title: 'Oooops...',
                    text: err,
                    type: 'error',
                    showCancelButton: false,
                    confirmButtonText: 'Try Again'
                }).then((result) => {
                    if (result.value) {
                        $('#newTermsModal').modal('toggle');
                        $('.fullScreenSpin').css('display', 'none');
                    } else if (result.dismiss === 'cancel') {

                    }
                });
                $('.fullScreenSpin').css('display', 'none');
            });
        }




    },
    'click .btnAddTerms': function() {
        let templateObject = Template.instance();
        $('#add-terms-title').text('Add New Term ');
        $('#edtTermsID').val('');
        $('#edtName').val('');
        $('#edtName').prop('readonly', false);
        $('#edtDesc').val('');
        $('#edtDays').val('');

        templateObject.include7Days.set(false);
        templateObject.includeCOD.set(false);
        templateObject.include30Days.set(false);
        templateObject.includeEOM.set(false);
        templateObject.includeEOMPlus.set(false);
    },
    'click .btnBack': function(event) {
        event.preventDefault();
        history.back(1);
    },
    'click .chkTerms': function(event) {
        var $box = $(event.target);

        if ($box.is(":checked")) {
            var group = "input:checkbox[name='" + $box.attr("name") + "']";
            $(group).prop("checked", false);
            $box.prop("checked", true);
        } else {
            $box.prop("checked", false);
        }
    },
    'keydown #edtDays': function(event) {
        if ($.inArray(event.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 ||
            (event.keyCode === 65 && (event.ctrlKey === true || event.metaKey === true)) ||
            (event.keyCode >= 35 && event.keyCode <= 40)) {
            return;
        }

        if (event.shiftKey == true) {
            event.preventDefault();
        }

        if ((event.keyCode >= 48 && event.keyCode <= 57) ||
            (event.keyCode >= 96 && event.keyCode <= 105) ||
            event.keyCode == 8 || event.keyCode == 9 ||
            event.keyCode == 37 || event.keyCode == 39 ||
            event.keyCode == 46 || event.keyCode == 190) {} else {
            event.preventDefault();
        }
    }


});

Template.newtermspop.helpers({
    datatablerecords: () => {
        return Template.instance().datatablerecords.get().sort(function(a, b) {
            if (a.termname == 'NA') {
                return 1;
            } else if (b.termname == 'NA') {
                return -1;
            }
            return (a.termname.toUpperCase() > b.termname.toUpperCase()) ? 1 : -1;
        });
    },
    tableheaderrecords: () => {
        return Template.instance().tableheaderrecords.get();
    },
    salesCloudPreferenceRec: () => {
        return CloudPreference.findOne({
            userid: Session.get('mycloudLogonID'),
            PrefName: 'termsList'
        });
    },
    deptrecords: () => {
        return Template.instance().deptrecords.get().sort(function(a, b) {
            if (a.department == 'NA') {
                return 1;
            } else if (b.department == 'NA') {
                return -1;
            }
            return (a.department.toUpperCase() > b.department.toUpperCase()) ? 1 : -1;
        });
    },
    include7Days: () => {
        return Template.instance().include7Days.get();
    },
    include30Days: () => {
        return Template.instance().include30Days.get();
    },
    includeCOD: () => {
        return Template.instance().includeCOD.get();
    },
    includeEOM: () => {
        return Template.instance().includeEOM.get();
    },
    includeEOMPlus: () => {
        return Template.instance().includeEOMPlus.get();
    },
    includeSalesDefault: () => {
        return Template.instance().includeSalesDefault.get();
    },
    includePurchaseDefault: () => {
        return Template.instance().includePurchaseDefault.get();
    },
    loggedCompany: () => {
        return localStorage.getItem('mySession') || '';
    }
});

Template.registerHelper('equals', function(a, b) {
    return a === b;
});
