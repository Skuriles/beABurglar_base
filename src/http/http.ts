export class http {
  constructor() {}
  async requestJson(fileName: string) {
    this.sendAjaxRequest("POST", "/reqJson", fileName, () => this.test);
  }

  test() {}

  sendAjaxRequest(
    type: string,
    url: string,
    params: string,
    callback: CallableFunction
  ) {
    var xhr = new XMLHttpRequest();
    xhr.open(type, url);
    xhr.onload = function() {
      if (xhr.status === 200) {
        alert("User's name is " + xhr.responseText);
      } else {
        alert("Request failed.  Returned status of " + xhr.status);
      }
    };
    xhr.send();
  }
}
