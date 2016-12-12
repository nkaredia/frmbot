module formbotApp {
  'use strict';
  export class Popup {
    static $inject: Array<string> = [
      '$timeout',
      '$mdToast'
    ];

    selectedItem: IData;
    searchText: string;
    isDisable: boolean;
    port: IPort;
    private data: Array<IData>;
    private previewContent: Array<IPreviewContent>;
    openPreviewWindow: boolean;
    formData: Array<string>;
    clientName: string;
    saveForm: angular.IFormController;

    constructor(private $timeout: ng.ITimeoutService, private $mdToast: ng.material.IToastService) {
      chrome.storage.sync.get((items: { data: Array<IData> }) => {
        this.data = items.data && items.data.length ? items.data : [];
      });
      this.port = chrome.runtime.connect({ name: 'formBot' });
      //this.data = [{ name: 'hello', formData: [''] }, { name: 'world', formData: [''] }, { name: 'nk', formData: [''] }, { name: 'erferf', formData: [''] }, { name: 'kared', formData: [''] }];
      this.isDisable = true;
      $timeout(() => { this.isDisable = false }, 1000);
      this.port.onMessage.addListener(this.onMessage);
      this.openPreviewWindow = false;
      this.formData = [];
      this.previewContent = [];
      this.clientName = '';
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
      if (message.type === Types.MessageType.READ) {
        this.previewContent = message.previewData;
        this.formData = message.formData;
        document.getElementById('clientName').focus();
        this.openPreviewWindow = this.openPreviewWindow ? false : true
      } else if (message.type === Types.MessageType.SAVE) {
        if (message.success) {
          this.$mdToast.show(
            this.$mdToast.simple()
              .textContent('Saved successfully')
              .position('top')
              .hideDelay(2000)
          );
          this.clientName = '';
          this.formData = [];
          this.openPreviewWindow = false;
          let elem = $('.read-container').removeClass('md-input-invalid');
          console.log(document.getElementsByClassName('').item(0).className);
        } else {
          this.$mdToast.show(
            this.$mdToast.simple()
              .textContent('Error: Please try again!')
              .position('top')
              .hideDelay(4000)
          );
        }
      }
    }

    deleteItem = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
    }

    read = (): void => {
      this.port.postMessage({ type: Types.MessageType.READ });
    }

    save = (e: Event): void => {
      if (this.clientName != null || this.clientName != '') {
        this.port.postMessage({ type: Types.MessageType.SAVE, data: { name: this.clientName, formData: this.formData } });
      }
      //this.data.push(newData);
      //chrome.storage.sync.set({data: this.data});
    }

    readForm = () => {
      this.read();
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