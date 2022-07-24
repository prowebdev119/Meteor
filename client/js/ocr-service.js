/**
 * @author : Dusko.
 * this is ocr service class.
 */
export class OCRService {
  constructor() {

  }

  POST(imageData, fileName) {
    // var dummyData = '{"abn_number":"28 864 970 579","account_number":"521729","bill_to_address":"","bill_to_name":"","bill_to_vat_number":"","card_number":"2855","cashback":0,"category":"Job Supplies","created":"2022-04-20 10:54:21","currency_code":"AUD","date":"2021-09-03 14:47:00","delivery_date":"","discount":0,"document_reference_number":"024456144717","document_title":"TAX INVOICE","document_type":"receipt","due_date":"","duplicate_of":"","external_id":"","id":66591987,"img_file_name":"66591987.jpg","insurance":0,"invoice_number":"442159","is_duplicate":0,"notes":"","order_date":"","payment_display_name":"Master Card ***2855","payment_terms":"","payment_type":"master_card","phone_number":"","purchase_order_number":"","rounding":0,"service_end_date":"","service_start_date":"","ship_date":"","ship_to_address":"","ship_to_name":"","shipping":0,"store_number":"4211","subtotal":3.18,"tax":0.32,"tip":0,"total":3.5,"total_weight":"","tracking_number":"","updated":"2022-04-20 10:54:22","vat_number":"","vendor":{"address":"","category":"Shipping","email":"","fax_number":"","name":"Australia Post","phone_number":"","raw_name":"Australia Post","vendor_logo":"https://cdn.veryfi.com/logos/us/969546280.png","vendor_reg_number":"","vendor_type":"Shipping","web":"www.auspost.com.au"},"vendor_account_number":"","vendor_bank_name":"","vendor_bank_number":"","vendor_bank_swift":"","vendor_iban":""}';
    let promise = new Promise(function (resolve, reject) {
      Meteor.call("getOcrResultFromVerifi", imageData, fileName, function(error, results) {
        if (error) {
          reject(error);
        } else {
          if (results.statusCode == 201) {
            resolve(JSON.parse(results.content));
          } else {
            reject(results);
          }          
        }
      });
      // resolve(JSON.parse(dummyData));
    });
    return promise;
  }
}
