import ApiEndPoint from "./ApiEndPoint";

export default class ApiCollectionHelper {
  constructor(collection = []) {
    this.name = null;

    this.debug = false;

    this.collection = collection;
    

    //console.log("ApiCollectionHelper module loaded");
  }

  debugMe(message = null, params = []) {
    if (this.debug == true) {
      const startString = `==========================  ${this.constructor.name} ==========================`;
      const endString = (startString) => {
        let string = "";

        for (let i = 0; i < startString.length; i++) {
          string += "=";
        }
        return string;
      };

      console.log(startString);
      console.log(message, ...params);
      console.log(endString(startString));
      console.log(`You see this because debug mode is active`);
    }
  }

  /**
   *
   * @param {string} name
   * @returns {ApiEndPoint}
   *
   */
  findByName(name) {
    let endpoint;

    this.collection.forEach((apiEndpoint) => {
      this.debugMe(`Searching endpoint: ${name}`);
      if (apiEndpoint.name.toLocaleLowerCase() == name.toLocaleLowerCase()) {
        this.debugMe(`${name} endpoint found`);
        endpoint = apiEndpoint;
      }
    });

    return endpoint;
  }
}
