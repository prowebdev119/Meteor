import {BaseService} from "../js/base-service";
export class ContactService extends BaseService {
  getAllCustomers() {
      let options = {
          PropertyList: "ID,GlobalRef,ClientName,FirstName,LastName,Phone,StreetAddress,Suburb,Mobile,Email,Active,ARBalance,Balance,Company,PrintName,IsJob",
          // select: "[deleted]=false"
      };
      return this.getList(this.ERPObjects.TCustomer, options);
  }

  getAllSuppliers() {
      let options = {
          PropertyList: "ID,GlobalRef,ClientName,FirstName,LastName,Phone,StreetAddress,Suburb,Mobile,Email,Active,APBalance,Balance,Company,PrintName",
          // select: "[deleted]=false"
      };
      return this.getList(this.ERPObjects.TSupplier, options);
  }

  getAllEmployees() {
      let options = {
          PropertyList: "ID,GlobalRef,DefaultClassName,EmployeeName,EmployeeNo,FirstName,LastName,Phone,Email,Active",
      };
      return this.getList(this.ERPObjects.TEmployee, options);
  }

  getCheckTimeEmployeeSetting(empID) {
      let options = {
          PropertyList: "ID,CustFld7,CustFld8",
          select: '[Id]="'+empID+'"',
      };
      return this.getList(this.ERPObjects.TEmployee, options);
  }
  getCheckTimeEmployeeSettingByName(empID) {
      let options = {
          PropertyList: "ID,CustFld7,CustFld8",
          select: '[EmployeeName]="'+empID+'"',
      };
      return this.getList(this.ERPObjects.TEmployee, options);
  }


  getAllEmployeesPriority() {
    let options = {
        PropertyList: "ID,CustFld5",
    };
    return this.getList(this.ERPObjects.TEmployee, options);
}

  getAllCustomersData() {
      let options = {
          PropertyList: "ID,Active,ClientName,ContactName,Phone,ARBalance,CreditBalance,Balance,CreditLimit,SalesOrderBalance,CreditBalance,Email,AccountNo,ClientNo,JobTitle,Notes,Country,IsJob",
          select: "[Active]=true"
      };
      return this.getList(this.ERPObjects.TCustomer, options);
  }

  getAllCustomersDataVS1() {
      let options = {
          PropertyList: "ID,Active,Companyname,JobName,ClientName,ContactName,Phone,ARBalance,CreditBalance,Balance,CreditLimit,SalesOrderBalance,CreditBalance,Email,AccountNo,ClientNo,JobTitle,Notes,Country,IsJob,Street,Street2,Street3,Suburb,State,Postcode",
          select: "[Active]=true"
      };
      return this.getList(this.ERPObjects.TCustomerVS1, options);
  }

  getAllJobssDataVS1() {
      let options = {
          PropertyList: "ID,Active,ClientName,ContactName,Phone,ARBalance,CreditBalance,Balance,CreditLimit,SalesOrderBalance,CreditBalance,Email,AccountNo,ClientNo,JobTitle,Notes,Country,IsJob,ParentClientName,JobName",
          select: "[Active]=true"
      };
      return this.getList(this.ERPObjects.TJobVS1, options);
  }

  getCheckCustomersData(customerName) {
      let options = {
          select: '[ClientName]="'+customerName+'" and [Active]=true',
      };
      return this.getList(this.ERPObjects.TCustomer, options);
  }

  getCheckCustomersPriority(priorityData) {
      let options = {
          select: '[CustFld5]="'+priorityData+'" and [Active]=true',
      };
      return this.getList(this.ERPObjects.TEmployee, options);
  }

  getCheckSuppliersData(supplierName) {
      let options = {
          select: '[ClientName]="'+supplierName+'" and [Active]=true',
      };
      return this.getList(this.ERPObjects.TSupplier, options);
  }

  getAllCustomerStatementData() {
      // let options = {
      //     PropertyList: "ID,ClientName,ContactName,Phone,ARBalance,CreditBalance,Balance,CreditLimit,SalesOrderBalance,CreditBalance,Email,AccountNo,ClientNo,JobTitle,Notes,Country",
      //     select: "[Active]=true"
      // };
      return this.getList(this.ERPObjects.TStatementList);
  }

  getCustomerStatementPrintData(clientID) {
      let options = {
          clientID: clientID,
          ListType: "Detail",
          // select: "[Active]=true"
      };
      return this.getList(this.ERPObjects.TStatementForCustomer, options);
  }

  getAllSuppliersData() {
      let options = {
          PropertyList: "ID,ClientName,ContactName,Phone,ARBalance,CreditBalance,Balance,CreditLimit,SalesOrderBalance,CreditBalance,Email,AccountNo,ClientNo,JobTitle,Notes,Country",
          select: "[Active]=true"
      };
      return this.getList(this.ERPObjects.TSupplier, options);
  }

  getAllSuppliersDataVS1() {
      let options = {
          PropertyList: "ID,ClientName,ContactName,Phone,ARBalance,CreditBalance,Balance,CreditLimit,SalesOrderBalance,CreditBalance,Email,AccountNo,ClientNo,JobTitle,Notes,Country",
          select: "[Active]=true"
      };
      return this.getList(this.ERPObjects.TSupplierVS1, options);
  }

  getAllEmployeesData() {
      let options = {
          PropertyList: "ID,GlobalRef,DefaultClassName,EmployeeName,EmployeeNo,FirstName,LastName,Phone,Email,Active,Street,Country,CustFld1,CustFld2,CustFld3,CustFld4,CustFld5",
          select: "[Active]=true"
      };
      return this.getList(this.ERPObjects.TEmployee, options);
  }

  // getAllClientList() {
  //   let options = {
  //     PropertyList: "ID,EmployeeNo,ClientName,Phone,Mobile,Email,ARBalance,CreditBalance,Balance,CreditLimit,SalesOrderBalance,Street,Country,CUSTFLD1,CUSTFLD2,IsCustomer,IsOtherContact,IsSupplier,",
  //     select: "[Active]=true",
  //   };
  //   return this.getList(this.ERPObjects.TClient, options);
  // }

  getAllContactCombine() {
    let options = {
      PropertyList: "ID,EmployeeNo,ClientName,Phone,Mobile,Email,ARBalance,CreditBalance,Balance,CreditLimit,SalesOrderBalance,Street,Country,CUSTFLD1,CUSTFLD2,IsCustomer,IsOtherContact,IsSupplier,",
      select: "[Active]=true",
    };
    return this.getList(this.ERPObjects.TERPCombinedContacts, options);
  }

  getAllContactCombineVS1() {
    let options = {
      PropertyList: "ID,EmployeeNo,ClientName,Phone,Mobile,Email,ARBalance,CreditBalance,Balance,CreditLimit,SalesOrderBalance,Street,Country,CUSTFLD1,CUSTFLD2,IsCustomer,IsOtherContact,IsSupplier,",
      select: "[Active]=true",
    };
    return this.getList(this.ERPObjects.TERPCombinedContactsVS1, options);
  }

  getOneEmployeeData(id) {
    return this.getOneById(this.ERPObjects.TEmployee, id);
  }

  getOneEmployeeDataEx(id) {
    return this.getOneById(this.ERPObjects.TEmployeeEx, id);
  }

  getOneSupplierData(id) {
    return this.getOneById(this.ERPObjects.TSupplier, id);
  }

  getOneSupplierDataEx(id) {
    return this.getOneById(this.ERPObjects.TSupplierEx, id);
  }

  getOneSupplierDataExByName(dataSearchName) {
    let options = '';
       options = {
        ListType: "Detail",
        select: '[ClientName]="'+dataSearchName+'"'
       };
    return this.getList(this.ERPObjects.TSupplier, options);
  }

  getOneCustomerDataExByName(dataSearchName) {
    let options = '';
       options = {
        ListType: "Detail",
        select: '[ClientName]="'+dataSearchName+'"'
       };
    return this.getList(this.ERPObjects.TCustomer, options);
  }

  getOneCustomerData(id) {
    return this.getOneById(this.ERPObjects.TCustomer, id);
  }

  getOneCustomerDataEx(id) {
    return this.getOneById(this.ERPObjects.TCustomerEx, id);
  }

  getOneCustomerJobData(id) {
    return this.getOneById(this.ERPObjects.TJob, id);
  }

  getOneCustomerJobDataEx(id) {
    return this.getOneById(this.ERPObjects.TJobEx, id);
  }

  saveEmployee(data) {
      return this.POST(this.ERPObjects.TEmployee, data);
  }

  saveEmployeeEx(data) {
      return this.POST(this.ERPObjects.TEmployeeEx, data);
  }

  saveCustomer(data) {
      return this.POST(this.ERPObjects.TCustomer, data);
  }

  saveCustomerEx(data) {
      return this.POST(this.ERPObjects.TCustomerEx, data);
  }

  saveJob(data) {
      return this.POST(this.ERPObjects.TJob, data);
  }

  saveJobEx(data) {
      return this.POST(this.ERPObjects.TJobEx, data);
  }

  saveSupplier(data) {
      return this.POST(this.ERPObjects.TSupplier, data);
  }

  saveSupplierEx(data) {
      return this.POST(this.ERPObjects.TSupplierEx, data);
  }

  getAllCustomerSideData() {
      let options = {
          PropertyList: "ID,ClientName,IsJob,Active",
          select: "[Active]=true"
      };
      return this.getList(this.ERPObjects.TCustomer, options);
  }

   getClientType() {
        let options = {
            PropertyList: "ID,TypeDescription,TypeName,Active",
            select: "[Active]=true",
        };
        return this.getList(this.ERPObjects.TClientType, options);
    }

  getAllCustomerSideDataVS1() {
      let options = {
          PropertyList: "ID,ClientName,IsJob,Active",
          select: "[Active]=true"
      };
      return this.getList(this.ERPObjects.TCustomerVS1, options);
  }

  getAllSupplierSideData() {
      let options = {
          PropertyList: "ID,ClientName",
          select: "[Active]=true"
      };
      return this.getList(this.ERPObjects.TSupplier, options);
  }

  getAllSupplierSideDataVS1() {
      let options = {
          PropertyList: "ID,ClientName",
          select: "[Active]=true"
      };
      return this.getList(this.ERPObjects.TSupplierVS1, options);
  }

  getAllEmployeeSideData() {
      let options = {
          // PropertyList: "ID,EmployeeName",
          ListType: "Detail",
          select: "[Active]=true"
      };
      return this.getList(this.ERPObjects.TEmployee, options);
  }

  getProductRecentTransactions(customerName) {
      let options = {
          CustomerName:"'"+customerName+"'"
      };
      return this.getList(this.ERPObjects.TProductSalesDetailsReport, options);
  }

  getAllInvoiceListByCustomer(customerName) {
    let options = {
      PropertyList: "ID,EmployeeName,SaleClassName,SaleDate,CustomerName,TotalAmount,SalesStatus,ShipDate,SalesDescription,CustPONumber,TermsName,TotalTax,TotalAmountInc,TotalPaid,TotalBalance,Comments",
      select: "CustomerName='"+customerName+"' and [Deleted]=false",
    };
    return this.getList(this.ERPObjects.TInvoice, options);
  }

  getAllJobListByCustomer(customerName) {
      let options = {
          PropertyList: "ID,Active,ClientName,ContactName,Phone,ARBalance,CreditBalance,Balance,CreditLimit,SalesOrderBalance,CreditBalance,Email,AccountNo,ClientNo,JobTitle,Notes,Country,IsJob,ParentCustomerName",
          select: "[Active]=true",
      };
      //LastName='"+customerName+"' and
      return this.getList(this.ERPObjects.TJob, options);
  }

  getAllInvoiceListByEmployee(employeeName) {
    let options = {
      PropertyList: "ID,EmployeeName,SaleClassName,SaleDate,CustomerName,TotalAmount,SalesStatus,ShipDate,SalesDescription,CustPONumber,TermsName,TotalTax,TotalAmountInc,TotalPaid,TotalBalance,Comments",
      select: "EmployeeName='"+employeeName+"' and [Deleted]=false",
    };
    return this.getList(this.ERPObjects.TInvoice, options);
  }

  getAllPurchaseOrderListBySupplier(supplierName) {
    let options = {
      PropertyList: "ID,EmployeeName,SaleClassName,OrderDate,SupplierName,TotalAmount,OrderStatus,ShipDate,SalesDescription,CustPONumber,TermsName,TotalTax,TotalAmountInc,TotalPaid,TotalBalance,comments",
      select: "SupplierName='"+supplierName+"' and [Deleted]=false",
    };
    return this.getList(this.ERPObjects.TPurchaseOrder, options);
  }

  getAllTransListBySupplier(supplierName) {
    let options = {
      IgnoreDates:true,
      IncludePOs:true,
      IncludeBills:true,
      select: "SupplierName='"+supplierName+"' and [Deleted]=false",
    };
    return this.getList(this.ERPObjects.TbillReport, options);

    // let options = {
    //   PropertyList: "ID,EmployeeName,SaleClassName,OrderDate,SupplierName,TotalAmount,OrderStatus,ShipDate,SalesDescription,CustPONumber,TermsName,TotalTax,TotalAmountInc,TotalPaid,TotalBalance,comments",
    //   select: "SupplierName='"+supplierName+"' and [Deleted]=false",
    // };
    // return this.getList(this.ERPObjects.tbillreport, options);
  }

  getDetailAccountTransactions() {
        let options = {
            PropertyList: "ClientID,TransactionDate,CustomerName,InvoiceNumber,TransType,Status,TotalAmount,OutstandingAmount,SaleID",
            CustomerName:"'"+customerName+"'"
        };
        return this.getList(this.ERPObjects.TRepObjStatementList, options);
    }


    getEmpUserDetail(EmployeeId) {
      let options = {
              PropertyList: "PropertyList==ID,EmployeeName,LogonName",
              Select: "[EmployeeId]='"+EmployeeId+"'"
          };
        return this.getList(this.ERPObjects.TUser, options);
    }

    saveTUser(data) {
        return this.POST(this.ERPObjects.TUser, data);
    }

    getTermData() {
        let options = {
            PropertyList: "ID,TermsName,",
        };
        return this.getList(this.ERPObjects.TTerms, options);
    }

    getTermDataVS1() {
        let options = {
            PropertyList: "ID,TermsName,",
        };
        return this.getList(this.ERPObjects.TTermsVS1, options);
    }

    getPaymentMethodData() {
        let options = {
            PropertyList: "ID,PaymentMethodName,",
        };
        return this.getList(this.ERPObjects.TPaymentMethod, options);
    }

    getPaymentMethodDataVS1() {
        let options = {
            PropertyList: "ID,PaymentMethodName,",
        };
        return this.getList(this.ERPObjects.TPaymentMethodVS1, options);
    }

    getShippingMethodData() {
        let options = {
            PropertyList: "ID,ShippingMethod,",
        };
        return this.getList(this.ERPObjects.TShippingMethod, options);
    }

    getClientTypeData() {
        let options = {
            PropertyList: "ID,TypeName,TypeDescription",
            select: "[Active]=true"
        };
        return this.getList(this.ERPObjects.TClientType, options);
    }

    saveClientTypeData(data) {
        return this.POST(this.ERPObjects.TClientType, data);
    }

    getTaxCodes() {
        let options = {
            PropertyList: "CodeName,Rate,Description",
            select: "[Active]=true"
        };
        return this.getList(this.ERPObjects.TTaxCode, options);
    }

    getTaxCodesVS1() {
        let options = {
            PropertyList: "CodeName,Rate,Description",
            select: "[Active]=true"
        };
        return this.getList(this.ERPObjects.TTaxcodeVS1, options);
    }

    saveCustomerAttachment(data){
        return this.POST(this.ERPObjects.TAttachment,data);
    }

    getCustomerAttachmentList(lineID){
    let options = {
        PropertyList: "Attachment,AttachmentName,Description,TableId,TableName",
        select: "[TableName]='tblClients' and [TableID]="+lineID
    };
    return this.getList(this.ERPObjects.TAttachment, options);
   }

   getCurrentLoggedUser() {
     var erpGetData = erpDb();
       let options = {
           PropertyList: "ID,DatabaseName,UserName,MultiLogon,EmployeeID,FirstName,LastName,LastTime",
           select: "[DatabaseName]='"+erpGetData.ERPDatabase+"'"
       };
       return this.getList(this.ERPObjects.TAppUser, options);
   }

   getEmployeeProfileImageByName(employeeName) {
       let options = {
           PropertyList: "ID,EncodedPic,EmployeeName",
           // select: "[EmployeeName]='"+employeeName+"'",
       };
       return this.getList(this.ERPObjects.TemployeePicture, options);
   }

   saveEmployeePicture(data) {
       return this.POST(this.ERPObjects.TemployeePicture, data);
   }

   getCheckEmployeePictureData(employeeName) {
       let options = {
           select: '[EmployeeName]="'+employeeName+'"',
       };
       return this.getList(this.ERPObjects.TemployeePicture, options);
   }

   getJobIds(){
        let options = {
            PropertyList: "ID",
        };
        return this.getList(this.ERPObjects.TJobVS1, options);
    }

    getAllTimeSheetList(){
     let options = {
            ListType: "Detail",
            select: "[Active]=true"
      }
         return this.getList(this.ERPObjects.TTimeSheet, options);
     }
    getAllTimeSheetListEmp(){
     let options = {
            ListType: "Detail",
            select: "[EmployeeName]='"+Session.get('mySessionEmployee')+"' and [Active]=true",
      }
         return this.getList(this.ERPObjects.TTimeSheet, options);
     }

     saveTimeSheet(data) {
         return this.POST(this.ERPObjects.TTimeSheetEntry, data);
     }

      saveClockTimeSheet(data) {
         return this.POST(this.ERPObjects.TTimeSheet, data);
     }

     saveTimeSheetLog(data) {
         return this.POST(this.ERPObjects.TTimeLog, data);
     }

     saveTimeSheetUpdate(data) {
         return this.POST(this.ERPObjects.TTimeSheet, data);
     }

     getAllJobsNameData() {
         let options = {
             PropertyList: "ID,Active,ClientName,ContactName,JobName",
             select: "[Active]=true"
         };
         return this.getList(this.ERPObjects.TJobVS1, options);
     }

     getEmpUserCount() {
       let options = {
               PropertyList: "PropertyList==ID,EmployeeName,LogonName",
           };
         return this.getList(this.ERPObjects.TUser, options);
     }

     saveEmployeeProducts(data){
         return this.POST(this.ERPObjects.TRepServices, data);
     }
  }
