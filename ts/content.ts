module formbotApp {
  'use strict'
  export class Content {
    queryString: string;
    formData: Array<string>;

    constructor() {
      //this.queryString = ":input:visible[type='text'],:input:visible[type='number'],:input:visible[type='checkbox'],:input:visible[type='radio'],:input:visible[type='date'],:input:visible[type='color'],:input:visible[type='range'],:input:visible[type='month'],:input:visible[type='week'],:input:visible[type='time'],:input:visible[type='datetime'],:input:visible[type='datetime-local'],:input:visible[type='email'],:input:visible[type='search'],:input:visible[type='tel'],:input:visible[type='url'],select:visible,textarea:visible";
      this.queryString = "input[type = 'text']:not([hidden])," + 
                         "input[type = 'number']:not([hidden])," + 
                         "input[type = 'checkbox']:not([hidden])," + 
                         "input[type = 'radio']:not([hidden])," + 
                         "input[type = 'date']:not([hidden])," + 
                         "input[type = 'color']:not([hidden])," + 
                         "input[type = 'range']:not([hidden])," + 
                         "input[type = 'month']:not([hidden])," + 
                         "input[type = 'week']:not([hidden])," + 
                         "input[type = 'time']:not([hidden])," + 
                         "input[type = 'datetime']:not([hidden])," + 
                         "input[type = 'datetime-local']:not([hidden])," + 
                         "input[type = 'email']:not([hidden])," + 
                         "input[type = 'search']:not([hidden])," + 
                         "input[type = 'tel']:not([hidden])," + 
                         "input[type = 'url']:not([hidden])," + 
                         "input[type = 'search']:not([hidden])," + 
                         "select," + 
                         "textarea:not([hidden])";
      this.formData = [];
      chrome.runtime.onMessage.addListener(this.onMessage);
    }

    private onMessage = (request: IMessage, sender: chrome.runtime.MessageSender, sendResponse: (response: IMessage) => {}) => {
      if (request.type === Types.MessageType.READ) {
        this.formData = [];
        let fd = document.querySelectorAll(this.queryString);
        [].forEach.call(fd, (input: HTMLInputElement) => {
          this.handleInputTypes(input);
        });
        if (this.formData.length > 0) {
          sendResponse({ type: Types.MessageType.READ, success: true, formData: this.formData });
        } else {
          sendResponse({ type: Types.MessageType.READ, success: false });
        }
      }
    }

    private handleInputTypes = (input: HTMLInputElement) => {
      if (input.type === 'checkbox' || input.type === 'radio') {
        if (input.checked) {
          input.setAttribute('checked', 'checked');
          this.formData.push(input.outerHTML);
        }
      } else if (input.localName === 'input' || input.localName === 'select' || input.localName === 'textarea') {
        if (input.value !== '') {
          input.setAttribute('value', input.value);
          this.formData.push(input.outerHTML);
        }
      }
    }
  }
}
(() => {
  new formbotApp.Content();
})();