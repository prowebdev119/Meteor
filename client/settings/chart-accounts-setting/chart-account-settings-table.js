Template.chartaccountsettingtable.onCreated(function (){
    let templateObject = Template.instance();
    templateObject.currentId = new ReactiveVar();
    templateObject.currentId.set(Template.currentData().type);
});

Template.chartaccountsettingtable.helpers({
    currentId: () => {
        return Template.instance().currentId.get();
    }
});

Template.chartaccountsettingtable.events({

    'click .showModal-allaccountlist, click .showModal-accountassetslist, click .showModal-accountliabilitylist,  click .showModal-accountequitylist, click .showModal-accountexpenselist, click .showModal-accountrevenuelist,  click .showModal-accountarchivelist ' : function () {
        $("#detail-modal-"+Template.currentData().type).show();
    },
    'click .closeCurrModel-allaccountlist, click .closeCurrModel-accountassetslist, click .closeCurrModel-accountliabilitylist,  click .closeCurrModel-accountequitylist, click .closeCurrModel-accountexpenselist, click .closeCurrModel-accountrevenuelist,  click .closeCurrModel-accountarchivelist ' : function () {
        $("#detail-modal-"+Template.currentData().type).hide();
        // $('.addActivityStatement').hide();
    }
});
