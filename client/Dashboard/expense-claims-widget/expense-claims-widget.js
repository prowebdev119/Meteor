import { ReactiveVar } from 'meteor/reactive-var';
const highCharts = require('highcharts');
require('highcharts/modules/exporting')(highCharts);
require('highcharts/highcharts-more')(highCharts);
import {DashBoardService} from '../dashboard-service';
Template.expenseClaimsWidget.onCreated(()=>{
    this.test = new ReactiveVar(0);

    this.expenseClaimsData_yourDraft = new ReactiveVar(0);
    this.expenseClaimsData_all = new ReactiveVar(0);
    this.expenseClaimsData_toReview = new ReactiveVar(0);
    this.expenseClaimsData_toRepay = new ReactiveVar(0);
    this.expenseClaimsData_toRepayC = new ReactiveVar(0);
    this.expenseClaimsData_toReviewC = new ReactiveVar(0);

    let dashBoardService = new DashBoardService();
    dashBoardService.getExpenseClaim().then(data => {
        let yourDraft=0,all=0,toReview=0,toRC=0, toRepay=0, toRepayC=0;
        data.texpenseclaim.forEach(expense => {

            if(Object.prototype.toString.call(expense.fields.Lines) === "[object Array]"){
                expense.fields.Lines.forEach(claim => {

                    if(claim.Active === false){
                        yourDraft+=  (claim.fields.AmountInc || 0);
                    }else

                    if (claim.Approval !== "Approved") {
                        toReview+= (claim.fields.AmountInc || 0);
                        toRC++;
                    }else if(!claim.Processed) {
                        toRepay += (claim.fields.AmountInc || 0);
                        toRepayC++;
                    }
                   all += (claim.fields.AmountInc || 0);
                })
            }else if(Object.prototype.toString.call(expense.fields.Lines) === "[object Object]"){

                if(expense.fields.Lines.fields.Active === false){
                    yourDraft+=  (expense.fields.Lines.fields.AmountInc || 0);
                }else

                if (expense.fields.Lines.fields.Approval !== "Approved") {
                    toReview+= (expense.fields.Lines.fields.AmountInc || 0);
                    toRC++;
                }else if(!expense.fields.Lines.fields.Processed) {
                    toRepay += (expense.fields.Lines.fields.AmountInc || 0);
                    toRepayC++;
                }

                all += expense.fields.Lines.fields.AmountInc;
            }


        });

        this.expenseClaimsData_yourDraft.set(Currency + '' + (parseFloat(yourDraft.toFixed(2))).toLocaleString());
        this.expenseClaimsData_all.set(Currency + '' + (parseFloat(all.toFixed(2))).toLocaleString());
        this.expenseClaimsData_toReview.set(Currency + '' + (parseFloat(toReview.toFixed(2))).toLocaleString());
        this.expenseClaimsData_toRepay.set(Currency + '' + (parseFloat(toRepay.toFixed(2))).toLocaleString());
        this.expenseClaimsData_toRepayC.set(toRepayC);
        this.expenseClaimsData_toReviewC.set(toRC);


    })

});

Template.expenseClaimsWidget.onRendered(()=>{

});

Template.expenseClaimsWidget.helpers({

    yourDraft: () => {
        return this.expenseClaimsData_yourDraft.get();
    },
    all : () =>{
        return this.expenseClaimsData_all.get()
    },
    toReview : () =>{
        return this.expenseClaimsData_toReview.get()
    },
    toRepay : () =>{
        return this.expenseClaimsData_toRepay.get()
    },
    toRepayC : () =>{
        return this.expenseClaimsData_toRepayC.get()
    },
    toReviewC : () =>{
        return this.expenseClaimsData_toReviewC.get()
    },

});

// Listen to event to update reactive variable
Template.expenseClaimsWidget.events({
    //to do
});
