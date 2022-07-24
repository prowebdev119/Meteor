import {BaseService} from "../../js/base-service";

export class InventoryService extends BaseService{

    getSalesByItemData(dateFrom,dateTo){
        let options = {
            ListType:"Detail",
            DateTo: '"'+moment(dateTo).format('YYYY-MM-DD')+'"',
            DateFrom: '"'+moment(dateFrom).format('YYYY-MM-DD')+'"'
        };
        return this.getList(this.ERPObjects.TProductSalesDetailsReport,options);
    }
    getProductList(){
        let options = {
             PropertyList:"ID,PRODUCTCODE,ProductName,PurchaseDescription,SNTracking,BuyQty1CostInc,SellQty1PriceInc,TotalQtyInStock",
        };
        return this.getList(this.ERPObjects.TProduct,options);
    }
    // getEachItemTransactionDetail(invoiceNo)
    // {
    //     let options = {
    //         ListType:"Detail",
    //         InvoiceNo: '"'+invoiceNo+'"',
    //     };
    //     return this.getList(this.ERPObjects.TProductSalesDetailsReport,options);
    // }
    //
    // getOneInvoicedata(InvoiceNo) {
    //
    //     return this.getOneById(this.ERPObjects.TProductSalesDetailsReport, InvoiceNo);
    // }
}