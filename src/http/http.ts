export class http {
  constructor() {}
  async requestJson(fileName: string, callback: CallableFunction) {
    this.sendPostRequest("POST", "/reqJson", { fileName }, callback);
  }

  async requestBaseWindowJson(fileName: string, callback: CallableFunction) {
    this.sendPostRequest("POST", "/reqBaseWindowJson", { fileName }, callback);
  }

  private sendPostRequest(
    type: string,
    url: string,
    params: any,
    callback: CallableFunction
  ) {
    var xhr = new XMLHttpRequest();
    xhr.open(type, url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4 && xhr.status === 200 && xhr.response != "") {
        callback(xhr.response);
      } else {
        // todo handle error
      }
    };
    xhr.send(JSON.stringify(params));
  }
}
