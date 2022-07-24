import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../js/core-service';
import {STSService} from "./sts-service";
import {UtilityService} from "../utility-service";
import '../lib/global/erp-objects';
import "../lib/global/indexdbstorage.js";
import draggableCharts from "../js/Charts/draggableCharts";
import ChartHandler from "../js/Charts/ChartHandler";
import Tvs1CardPreference from "../js/Api/Model/Tvs1CardPreference";
import Tvs1CardPreferenceFields from "../js/Api/Model/Tvs1CardPreferenceFields";
import XLSX from 'xlsx';
let utilityService = new UtilityService();
const templateObject = Template.instance();
const _tabGroup = 10;
Template.stsdashboard.onCreated(function(){

});


Template.stsdashboard.onRendered(function() {
    $('.fullScreenSpin').css('display','inline-block');
    $('.fullScreenSpin').css('display','none');
    const templateObject = Template.instance();
    templateObject.deactivateDraggable = () => {
        draggableCharts.disable();
    };
    templateObject.activateDraggable = () => {
        draggableCharts.enable();
    };

    templateObject.setCardPositions = async () => {
        let Tvs1CardPref = await getVS1Data('Tvs1CardPreference');
        const cardList = [];
        if( Tvs1CardPref.length ){
            let Tvs1CardPreferenceData = JSON.parse(Tvs1CardPref[0].data);
            let employeeID = Session.get("mySessionEmployeeLoggedID");
            cardList = new Tvs1CardPreference.fromList(
                Tvs1CardPreferenceData.tvs1cardpreference
            ).filter((card) => {
                if ( parseInt( card.fields.EmployeeID ) == employeeID && parseInt( card.fields.TabGroup ) == _tabGroup ) {
                return card;
                }
            });
        }

        if( cardList.length ){
            let cardcount = 0;
            cardList.forEach((card) => {
            $(`[card-key='${card.fields.CardKey}']`).attr("position", card.fields.Position);
            $(`[card-key='${card.fields.CardKey}']`).attr("card-active", card.fields.Active);
            if( card.fields.Active == false ){
                cardcount++;
                $(`[card-key='${card.fields.CardKey}']`).addClass("hideelement");
                $(`[card-key='${card.fields.CardKey}']`).find('.cardShowBtn .far').removeClass('fa-eye');
                $(`[card-key='${card.fields.CardKey}']`).find('.cardShowBtn .far').addClass('fa-eye-slash');
            }
            })
            if( cardcount == cardList.length ){
            $('.card-visibility').eq(0).removeClass('hideelement')
            }
            let $chartWrappper = $(".connectedCardSortable");
            $chartWrappper
            .find(".card-visibility")
            .sort(function (a, b) {
                return +a.getAttribute("position") - +b.getAttribute("position");
            })
            .appendTo($chartWrappper);
        }
    };
    templateObject.setCardPositions();

    templateObject.saveCards = async () => {
        // Here we get that list and create and object
        const cards = $(".connectedCardSortable .card-visibility");
        const cardList = [];
        let Tvs1CardPref = await getVS1Data('Tvs1CardPreference');
        if( Tvs1CardPref.length ){
            let Tvs1CardPreferenceData = JSON.parse(Tvs1CardPref[0].data);
            let employeeID = Session.get("mySessionEmployeeLoggedID");
            cardList = new Tvs1CardPreference.fromList(
                Tvs1CardPreferenceData.tvs1cardpreference
            ).filter((card) => {
                if ( parseInt( card.fields.EmployeeID ) != employeeID && parseInt( card.fields.TabGroup ) != _tabGroup ) {
                return card;
                }
            });
        }
        // console.log(cards);
        for (let i = 0; i < cards.length; i++) {
            cardList.push(
            new Tvs1CardPreference({
                type: "Tvs1CardPreference",
                fields: new Tvs1CardPreferenceFields({
                EmployeeID: Session.get("mySessionEmployeeLoggedID"),
                CardKey: $(cards[i]).attr("card-key"),
                Position: $(cards[i]).attr("position"),
                TabGroup: _tabGroup,
                Active: ( $(cards[i]).attr("card-active") == 'true' )? true : false
                })
            })
            );
        }
        let updatedTvs1CardPreference = {
            tvs1cardpreference: cardList,
        }
        await addVS1Data('Tvs1CardPreference', JSON.stringify(updatedTvs1CardPreference));
    };

    templateObject.activateDraggable();
    $(".connectedCardSortable")
    .sortable({
      disabled: false,
      connectWith: ".connectedCardSortable",
      placeholder: "portlet-placeholder ui-corner-all",
      stop: async (event, ui) => {
        // console.log($(ui.item[0]));
        console.log("Dropped the sortable chart");

        // Here we rebuild positions tree in html
        ChartHandler.buildCardPositions(
          $(".connectedCardSortable .card-visibility")
        );

        // Here we save card list
        templateObject.saveCards()
      },
    })
    .disableSelection(); 
});


Template.stsdashboard.events({

    //Dashboard buttons
    'click #btnPlants':function(event){
        FlowRouter.go('/stsplants');
    },
    'click #btnHarvests':function(event){
        FlowRouter.go('/stsharvests');
    },
    'click #btnPackages':function(event){
        FlowRouter.go('/stspackages');
    },
    'click #btnTransfers':function(event){
        FlowRouter.go('/ststransfers');
    },
    'click #btnOverviews':function(event){
        FlowRouter.go('/stsoverviews');
    },
    'click #btnSettings':function(event){
        FlowRouter.go('/stssettings');
    },

    //Buttons inside Scan Modal
    'click #btnCreatePlantings':function(event){
        window.open('/stscreateplantings','_self');
    },
    'click #btnRecordAdditives':function(event){
        window.open('/stsrecordadditives','_self');
    },
    'click #btnChangeRoom':function(event){
        window.open('/stschangeroom','_self');
    },
    'click #btnManicurePlants':function(event){
        window.open('/stsmanicureplants','_self');
    },
    'click #btnDestroyPlants':function(event){
        window.open('/stsdestroyplants','_self');
    },
    'click #btnTransactionHistory':function(event){
        window.open('/','_self');
    },
    //handle cards buttons
    "click .editCardBtn": function (e) {
        e.preventDefault();
        $(".card-visibility").removeClass('hideelement');
        if( $('.editCardBtn').find('i').hasClass('fa-cog') ){
            $('.cardShowBtn').removeClass('hideelement');
            $('.editCardBtn').find('i').removeClass('fa-cog')
            $('.editCardBtn').find('i').addClass('fa-save')      
        }else{
            $('.cardShowBtn').addClass('hideelement');
            $('.editCardBtn').find('i').removeClass('fa-save')
            $('.editCardBtn').find('i').addClass('fa-cog')
            let templateObject = Template.instance();
            templateObject.setCardPositions();
        }
        if( $('.card-visibility').hasClass('dimmedChart') ){
            $('.card-visibility').removeClass('dimmedChart');
        }else{
            $('.card-visibility').addClass('dimmedChart');
        }
        return false
    },
    "click .cardShowBtn": function(e){
        e.preventDefault();
        if( $(e.target).find('.far').hasClass('fa-eye') ){
            $(e.target).find('.far').removeClass('fa-eye')
            $(e.target).find('.far').addClass('fa-eye-slash')
            $(e.target).parents('.card-visibility').attr('card-active', 'false') 
        }else{
            $(e.target).find('.far').removeClass('fa-eye-slash')
            $(e.target).find('.far').addClass('fa-eye')
            $(e.target).parents('.card-visibility').attr('card-active', 'true')
        } 
        let templateObject = Template.instance();
        templateObject.saveCards()
        return false
    },
});


Template.stsdashboard.helpers({
  loggedCompany: () => {
    return localStorage.getItem('mySession') || '';
 }
});
