/**
 * @author : Shankar.
 * this is main service class. Any other service class will extend this class.
 * this provides wrapper for headers, response handler. it acts like interceptor.
 */
import { HTTP } from "meteor/http";
export class BaseService {
  constructor() {
    this.erpGet = erpDb();
    this.ERPObjects = ERPObjects();
  }
  getHeaders() {
    var headers = {
      database: this.erpGet.ERPDatabase,
      username: this.erpGet.ERPUsername,
      password: this.erpGet.ERPPassword,
    };
    return headers;
  }
  getBaseUrl() {
    return (
      URLRequest +
      this.erpGet.ERPIPAddress +
      ":" +
      this.erpGet.ERPPort +
      "/" +
      this.erpGet.ERPApi +
      "/"
    );
  }

  getPostHeaders() {
    var postHeaders = {
      database: this.erpGet.ERPDatabase,
      username: this.erpGet.ERPUsername,
      password: this.erpGet.ERPPassword,
    };

    return postHeaders;
  }

  responseHandler(url, response) {
    if (response === undefined) {
      let getResponse =
        "You have lost internet connection, please log out and log back in.";
      return getResponse;
    } else {
      if (response.statusCode === 200) {
        try {
          var content = JSON.parse(response.content);

          return content;
        } catch (e) {}
      } else {
        return response.headers.errormessage;
      }
    }
  }

  GET(url) {
    var that = this;
    var promise = new Promise(function (resolve, reject) {
      HTTP.get(
        that.getBaseUrl() + url,
        { headers: that.getHeaders() },
        function (err, response) {
          var data = that.responseHandler(url, response);
          if (err || !data) {
            reject(err);
          }
          if (data) {
            resolve(data);
          }
        }
      );
    });
    return promise;
  }
  getList(objName, options) {
    var that = this;
    let url = objName;
    function jsonToQueryString(json) {
      return (
        "?" +
        Object.keys(json)
          .map(function (key) {
            return (
              encodeURIComponent(key) + "=" + encodeURIComponent(json[key])
            );
          })
          .join("&")
      );
    }
    if (options) {
      url += jsonToQueryString(options);
    }
    return that.GET(url);
  }
  getOneById(objName, id) {
    let url = objName + "/" + id;
    return this.GET(url);
  }

  POST(url, data) {
    let that = this;
    let promise = new Promise(function (resolve, reject) {
      HTTP.post(
        that.getBaseUrl() + url,
        { headers: that.getPostHeaders(), data: data },
        function (err, response) {
          let data = that.responseHandler(url, response);
          if (err) {
            reject(data);
          } else {
            resolve(data);
          }
        }
      );
    });
    return promise;
  }

  POSTJsonIn(url, data) {
    let that = this;
    var erpGetData = erpDb();
    let promise = new Promise(function (resolve, reject) {
      var oPost = new XMLHttpRequest();
      oPost.open("POST", that.getBaseUrl() + url, true);
      oPost.setRequestHeader("database", erpGetData.ERPDatabase);
      oPost.setRequestHeader("username", erpGetData.ERPUsername);
      oPost.setRequestHeader("password", erpGetData.ERPPassword);
      oPost.setRequestHeader("Accept", "application/json");
      oPost.setRequestHeader("Accept", "application/html");
      oPost.setRequestHeader("Content-type", "application/json");
      oPost.send(data);
      oPost.onreadystatechange = function () {
        if (oPost.readyState == 4 && oPost.status == 200) {
          var data = JSON.parse(oPost.responseText);
          resolve(data);
        } else if (oPost.readyState == 4 && oPost.status == 403) {
          let data = oPost.getResponseHeader("errormessage");
          reject(data);
        } else if (oPost.readyState == 4 && oPost.status == 406) {
          let data = oPost.getResponseHeader("errormessage");
          reject(data);
        } else if (oPost.readyState == "") {
          let data = oPost.getResponseHeader("errormessage");
          reject(data);
        }
      };
    });
    return promise;
  }
}
