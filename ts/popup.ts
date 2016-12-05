module formbotApp {
  'use strict';
  export class Popup {
    static $inject: Array<string> = [
      '$timeout'
    ];

    selectedItem: IData;
    searchText: string;
    isDisable: boolean;
    port: IPort;
    private data: Array<IData>;
    private previewContent: Array<IPreviewContent>;

    constructor(private $timeout: ng.ITimeoutService) {
      // chrome.storage.sync.get((items: Array<IData>) => {
      //   this.data = items ? items : [];
      // });
      this.port = chrome.runtime.connect({name: 'formBot'});
      this.data = [{ name: 'hello', formData: '' }, { name: 'world', formData: '' }, { name: 'nk', formData: '' }, { name: 'erferf', formData: '' }, { name: 'kared', formData: '' }];
      this.isDisable = true;
      $timeout(() => { this.isDisable = false }, 1000);
      this.port.onMessage.addListener(this.onMessage);
    }

    searchTextChange = (searchText: string): void => {

    }

    selectedItemChange = (item: IData): void => {
      this.selectedItem = item;
    }

    querySearch = (searchText: string): Array<IData> => {
      let results = searchText ? this.data.filter(this.createFilterFor) : this.data;
      return results;
    }

    onMessage = (message: IMessage): void => {
      if(message.type == MessageType.READ) {
        this.previewContent = message.previewData;
      }
    }

    read = (): void => {
      this.port.postMessage({type: MessageType.READ});
    }

    save = (name: string, formData: string): void => {
      let newData: IData = { name: name, formData: formData };
      this.port.postMessage({type: MessageType.SAVE, data: newData});
      //this.data.push(newData);
      //chrome.storage.sync.set({data: this.data});
    }

    createFilterFor(value: IData, index: number, array: Array<IData>) {
      let lowercaseQuery = angular.lowercase(value.name);
      return (data: string) => {
        return (data.indexOf(lowercaseQuery) === 0);
      }
    }
  }
  angular.module('formbotApp').controller('Popup', Popup);
}