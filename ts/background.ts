module formbotApp {
  'use strict';
  export class Background {
    port: IPort;
    data: Array<IData>
    responseData: any;
    priority: Array<string>;
    previewData: Array<IPreviewContent>;

    constructor() {
      this.priority = [
        "name",
        "id",
        "type"
      ]
      this.data = [];
      this.responseData = [];
      this.previewData = [];
      this.port = null;
      chrome.runtime.onConnect.addListener(this.connect);
      // chrome.storage.sync.get((data: Array<IData>) => {
      //   this.data = data;
      // });
    }

    private connect = (port: IPort): void => {
      this.port = port;
      this.port.onMessage.addListener(this.onMessageCallback);
      port.onDisconnect.addListener(this.disconnectPort);
    }

    private disconnectPort = () => {
      //this.port = null;
      this.responseData = [];
      this.previewData = [];
    }

    private onMessage = (): void => {
      this.port.onMessage.addListener(this.onMessageCallback);
    }

    private onMessageCallback = (message: IMessage): void => {
      if (message.type === Types.MessageType.READ) {
        chrome.tabs.query({ active: true, currentWindow: true }, this.tabsQueryCallback);
      } else if (message.type === Types.MessageType.SAVE) {
        try {
          chrome.storage.sync.get((items: { data: Array<IData> }) => {
            items.data = items.data && items.data.length ? items.data : [];
            items.data.push({ name: message.data.name, formData: message.data.formData });
            chrome.storage.sync.set({ data: items.data });
            this.port.postMessage({ type: Types.MessageType.SAVE, success: true });
          });
        } catch (e) {
          this.port.postMessage({ type: Types.MessageType.SAVE, success: false });
        }
      }
    }

    private tabsQueryCallback = (tabs: chrome.tabs.Tab[]) => {
      chrome.tabs.sendMessage(tabs[0].id, { type: Types.MessageType.READ }, this.tabsMessageCallback);
    }

    private tabsMessageCallback = (response: IMessage) => {
      if (response.success) {
        this.responseData = response.formData;
        this.previewData = [];
        [].forEach.call(response.formData, (value: string, index: number) => {
          this.decodeFormString(value);
        });
        if (this.previewData) {
          this.port.postMessage({ type: Types.MessageType.READ, success: true, previewData: this.previewData, formData: response.formData });
        } else {
          this.port.postMessage({ type: Types.MessageType.READ, success: false });
        }
      }
    }

    private decodeFormString = (input: string) => {
      let parser = new DOMParser();
      let dom = parser.parseFromString(input, 'text/html');
      [].forEach.call(dom.body.childNodes, (element: HTMLInputElement, index: number) => {
        this.priority.forEach((type: string) => {
          let gotType: boolean = false;
          if (element.hasAttribute(type) && !gotType) {
            if (element.type === 'checkbox' || element.type === 'radio') {
              this.previewData.push({ inputName: element.attributes[type].value, inputValue: element.attributes['checked'] });
            } else {
              this.previewData.push({ inputName: element.attributes[type].value, inputValue: element.attributes['value'].value });
            }
            gotType = true;
          }
        });
      });
    }
  }
}
(() => {
  new formbotApp.Background();
})();