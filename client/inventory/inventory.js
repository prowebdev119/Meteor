import { jsPDF } from "jspdf";
import "jQuery.print/jQuery.print.js";

import { autoTable } from "jspdf-autotable";
import { ProductService } from "../product/product-service";
import { ReactiveVar } from "meteor/reactive-var";
import { UtilityService } from "../utility-service";
import draggableCharts from "../js/Charts/draggableCharts";
import resizableCharts from "../js/Charts/resizableCharts";
let utilityService = new UtilityService();
const tempObj = Template.instance();

Template.productexpresslist.onCreated(() => {
  const templateObject = Template.instance();
  templateObject.productListID = new ReactiveVar([]);
  templateObject.productListData = new ReactiveVar([]);
});

Template.productexpresslist.onRendered(() => {
  let productService = new ProductService();
  const tempObj2 = Template.instance();
  getAllProducts = async function () {
    let data = await productService.getProductList();
    let lineItems = [];
    let inventoryData = [];
    for (let i = 0; i < data.tproduct.length; i++) {
      let recordObj = {
        id: data.tproduct[i].Id,
        salesDesc: data.tproduct[i].SalesDescription,
        salesPrc: data.tproduct[i].SellQty1PriceInc,
        incomeAmt: data.tproduct[i].IncomeAccount,
        purchasePrc: data.tproduct[i].BuyQty1CostInc,
      };
      var recentTranObject = {
        productId: data.tproduct[i].Id,
        productName: data.tproduct[i].ProductName,
        productDescription: data.tproduct[i].SalesDescription,
        purchasesPrice:
          utilityService.modifynegativeCurrencyFormat(
            data.tproduct[i].BuyQty1CostInc
          ) || 0,
        purchaseAccount: data.tproduct[i].AssetAccount,
        costOfGoodsSoldAccount: data.tproduct[i].CogsAccount,
        unitOfMeasure: data.tproduct[i].UOMPurchases || " ",
        salesDescription: data.tproduct[i].SalesDescription,
        itemName: data.tproduct[i].ProductName,
        salesPrice:
          utilityService.modifynegativeCurrencyFormat(
            data.tproduct[i].SellQty1PriceInc
          ) || 0,
        salesAccount: data.tproduct[i].IncomeAccount,
        taxCodeSales: data.tproduct[i].TaxCodeSales,
      };

      lineItems.push(recordObj);
      inventoryData.push(recentTranObject);
      // break;
    }

    const lineData = await tempObj2.productListID.set(lineItems);
    tempObj2.productListData.set(inventoryData);
    // tempObj2.productListData.set(lineItems);

    if (tempObj2.productListData.get()) {
      exportInventoryToPdf();
      //tempObj2.getAllRecentTransactions();
    }
  };

  getAllRecentTransactions = function () {
    productService.getRecentTransactions().then(function (productData) {
      let inventoryData = [];
      let listId = tempObj2.productListID.get();
      for (let j = 0; j < listId.length; j++) {
        for (
          let i = 0;
          i < productData.tproductsalesdetailsreport.length;
          i++
        ) {
          if (
            productData.tproductsalesdetailsreport[i].ProductID === listId[j].id
          ) {
            var recentTranObject = {
              productId: productData.tproductsalesdetailsreport[i].ProductID,
              productName:
                productData.tproductsalesdetailsreport[i].ProductName,
              productDescription:
                productData.tproductsalesdetailsreport[i].ProductDescription,
              purchasesPrice: listId[j].purchasePrc,
              purchaseAccount:
                productData.tproductsalesdetailsreport[i].TransactionType,
              costOfGoodsSoldAccount:
                productData.tproductsalesdetailsreport[i][
                  "Total Profit (Inc)"
                ] || 0,
              unitOfMeasure:
                productData.tproductsalesdetailsreport[i].UnitOfMeasure || " ",
              salesDescription: listId[j].salesDesc,
              itemName: productData.tproductsalesdetailsreport[i].ProductName,
              salesPrice: listId[j].salesPrc,
              salesAccount: listId[j].IncomeAccount,
            };
            inventoryData.push(recentTranObject);
            break;
          }
        }
      }

      tempObj2.productListData.set(inventoryData);
      if (tempObj2.productListData.get()) {
        exportInventoryToPdf();
      }
    });
  };

  exportInventoryToPdf = function () {
    productService
      .getProductPrintList()
      .then(function (data) {
        let records = [];
        let inventoryData = [];
        for (let i = 0; i < data.tproduct.length; i++) {
          var recentTranObject = {
            productId: data.tproduct[i].Id,
            productName: data.tproduct[i].ProductName,
            productDescription: data.tproduct[i].SalesDescription,
            purchasesPrice:
              utilityService.modifynegativeCurrencyFormat(
                data.tproduct[i].BuyQty1CostInc
              ) || 0,
            purchaseAccount: data.tproduct[i].AssetAccount,
            costOfGoodsSoldAccount: data.tproduct[i].CogsAccount,
            unitOfMeasure: data.tproduct[i].UOMPurchases || " ",
            salesDescription: data.tproduct[i].SalesDescription,
            itemName: data.tproduct[i].ProductName,
            salesPrice:
              utilityService.modifynegativeCurrencyFormat(
                data.tproduct[i].SellQty1PriceInc
              ) || 0,
            salesAccount: data.tproduct[i].IncomeAccount,
            taxCodeSales: data.tproduct[i].TaxCodeSales,
          };
          inventoryData.push(recentTranObject);

          $(".fullScreenSpin").css("display", "none");
        }

        if (inventoryData) {
          let doc = new jsPDF("landscape", "mm", "a3");
          // let listId= tempObj2.productListID.get();
          let inventoryDataList = inventoryData;
          const totalPagesExp = "{total_pages_count_string}";
          let xAxis = 15;
          let yAxis = 70;
          let tableTitle = [
            "Item Code",
            "Item Name",
            "Purchases\n" + "Description",
            "Purchases\n" + "Price",
            "Purchases\n" + "Account",
            "Cost of\n" + "Goods Sold\n" + "Account",
            "Inventory\n" + "Asset\n" + "Account",
            "Unit of\n" + "measure",
            "Sales\n" + "Description",
            "Sales Price",
            "Sales\n" + "Account",
            "Tax\n" + "Code(S)",
          ];
          doc.setFontSize(18);
          doc.setTextColor(0, 123, 169);
          doc.setFontStyle("Roboto Mono");
          doc.text(loggedCompany, 180, 40);
          doc.text("As at " + moment().format("DD MMM YYYY"), 183, 50);
          let totalPage = inventoryDataList.length;
          let pageData = 0;
          let printData = 8;

          if (totalPage % 5 != 0) {
            totalPage = totalPage / 5 + 1;
            totalPage = totalPage.toString().split(".")[0];
          } else {
            totalPage = totalPage / 5;
          }

          for (let k = 1; k <= totalPage; k++) {
            //HEADER
            doc.setFontSize(22);
            doc.setTextColor(30);
            doc.setFontStyle("Roboto Mono");
            doc.text("Inventory", 16, 20);
            doc.setDrawColor(0, 123, 169);
            doc.setLineWidth(1);
            doc.line(15, 25, 408, 25);
            //TABLE HEAD
            doc.setFontSize(12);
            doc.setFontStyle("bold");
            doc.setTextColor(0, 0, 0);
            for (let m = 0; m < 12; m++) {
              doc.text(tableTitle[m], xAxis, yAxis);
              xAxis += 32;
            }
            doc.setDrawColor(179, 179, 179);
            doc.setLineWidth(0.1);
            doc.line(12, yAxis + 13, 390, yAxis + 13);
            xAxis = 18;
            yAxis += 20;
            doc.setFontStyle("normal");
            for (let i = pageData; i < printData; i++) {
              let changeY = yAxis;
              let itemY = yAxis;
              const itmNme = inventoryDataList[i].itemName.split(" ");
              for (let j = 0; j < itmNme.length; j++) {
                doc.text("" + itmNme[j], xAxis, itemY);
                doc.text("" + itmNme[j], xAxis + 32, itemY);
                itemY += 5;
              }
              const prodescription =
                inventoryDataList[i].productDescription.split(" ");
              for (let j = 0; j < prodescription.length; j++) {
                doc.text("" + prodescription[j], xAxis + 64, changeY);
                changeY += 5;
              }
              doc.text(
                "" + inventoryDataList[i].purchasesPrice,
                xAxis + 96,
                yAxis
              );
              doc.text(
                "" + inventoryDataList[i].purchaseAccount,
                xAxis + 128,
                yAxis
              );
              doc.text(
                "" + inventoryDataList[i].costOfGoodsSoldAccount,
                xAxis + 160,
                yAxis
              );
              doc.text(
                "" + inventoryDataList[i].purchaseAccount,
                xAxis + 192,
                yAxis
              );
              doc.text(
                "" + inventoryDataList[i].unitOfMeasure,
                xAxis + 224,
                yAxis
              );
              changeY = yAxis;
              const saledescription =
                inventoryDataList[i].salesDescription.split(" ");
              for (let j = 0; j < saledescription.length; j++) {
                doc.text("" + saledescription[j], xAxis + 256, changeY);
                changeY += 5;
              }
              doc.text(
                "" + inventoryDataList[i].salesPrice,
                xAxis + 288,
                yAxis
              );
              doc.text(
                "" + inventoryDataList[i].purchaseAccount,
                xAxis + 320,
                yAxis
              );
              doc.text(
                "" + inventoryDataList[i].taxCodeSales,
                xAxis + 352,
                yAxis
              );
              if (itmNme > changeY) {
                yAxis = itmNme + 4;
              } else {
                yAxis = changeY + 4;
              }

              yAxis += 5;
            }
            let str =
              "Inventory | " +
              loggedCompany +
              " | " +
              moment().format("DD MMM YYYY");

            let str1 = "Page " + k + " of " + totalPage;
            doc.setDrawColor(0, 123, 169);
            doc.setLineWidth(1);
            doc.line(15, 280, 408, 280);
            doc.setFontSize(10);
            doc.text(str, 16, 285);
            doc.text(str1, 390, 285);

            if (k < totalPage) {
              doc.addPage();
            }
            yAxis = 50;
            let difference = inventoryDataList.length - printData;
            pageData = pageData + 5;
            if (difference < 5) {
              printData = printData + difference;
            } else {
              printData = printData + 5;
            }
          }

          if (inventoryDataList.length != 0) {
            doc.save(loggedCompany + "-inventory.pdf");
          }
        }
        //localStorage.setItem('VS1ProductPrintList', JSON.stringify(inventoryData));
      })
      .catch(function (err) {
        // Bert.alert('<strong>' + err + '</strong> - Error Printing Product!', 'danger');
        swal({
          title: "Error Printing Product!",
          text: err,
          type: "error",
          showCancelButton: false,
          confirmButtonText: "OK",
        }).then((result) => {
          if (result.value) {
            // Meteor._reload.reload();
          } else if (result.dismiss === "cancel") {
          }
        });
        $(".fullScreenSpin").css("display", "none");
      });
  };

  draggableCharts.enable();
  resizableCharts.enable();
});

Template.productexpresslist.events({
  "click #exportinv_pdf": async function () {
    $(".fullScreenSpin").css("display", "inline-block");
    exportInventoryToPdf();
    // const tempObj2 = Template.instance();
    //   if (!localStorage.getItem('VS1ProductPrintList')) {
    //      await getAllProducts();
    //   }else{
    //     tempObj2.productListData.set(JSON.parse(localStorage.getItem('VS1ProductPrintList')));
    //     if(tempObj2.productListData.get()) {
    //       exportInventoryToPdf();
    //     }
    //   }
  },
});
