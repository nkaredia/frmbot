module formbotApp {
  'use strict';
  export class Popup {
    static $inject: Array<string> = [
      '$timeout',
      '$mdToast'
    ];

    selectedItem: IData;
    searchText: string;
    port: IPort;
    private data: Array<IData>;
    private previewContent: Array<IPreviewContent>;
    openPreviewWindow: boolean;
    formData: Array<string>;
    clientName: string;
    saveForm: angular.IFormController;
    isSelectDisable: boolean;

    constructor(private $timeout: ng.ITimeoutService, private $mdToast: ng.material.IToastService) {
      this.getUpdatedSyncData();
      this.port = chrome.runtime.connect({ name: 'formBot' });
      //this.data = [{ name: 'hello', formData: [''] }, { name: 'world', formData: [''] }, { name: 'nk', formData: [''] }, { name: 'erferf', formData: [''] }, { name: 'kared', formData: [''] }];
      this.port.onMessage.addListener(this.onMessage);
      this.openPreviewWindow = false;
      this.formData = [];
      this.previewContent = [];
      this.clientName = '';
      this.isSelectDisable = true;
      this.$timeout(() => { this.isSelectDisable = this.getData().length > 0 ? false : true }, 1000);
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

    getData = () => {
      return this.data;
    }

    onMessage = (message: IMessage): void => {
      if (message.type === Types.MessageType.READ) {
        this.previewContent = message.previewData;
        this.formData = message.formData;
        this.$timeout(() => { document.getElementById('clientName').focus(); }, 10);
        this.openPreviewWindow = this.openPreviewWindow ? false : true
      } else if (message.type === Types.MessageType.SAVE) {
        if (message.success) {
          this.$mdToast.show(
            this.$mdToast.simple()
              .textContent('Saved successfully')
              .position('top right')
              .hideDelay(1000)
          );
          this.getUpdatedSyncData();
          this.clientName = '';
          this.formData = [];
          this.previewContent = [];
          this.openPreviewWindow = false;
          this.isSelectDisable = false;
          this.$timeout(() => {
            document.getElementsByClassName('read-container').item(0).classList.remove('md-input-invalid');
          }, 10);
        } else {
          this.$mdToast.show(
            this.$mdToast.simple()
              .textContent('Error: Please try again!')
              .position('top right')
              .hideDelay(4000)
          );
        }
      } else if (message.type === Types.MessageType.PREVIEW) {
        this.previewContent = message.previewData;
        this.openPreviewWindow = true;
      }
    }

    deleteItem = (e: Event, i: number) => {
      e.preventDefault();
      e.stopPropagation();
      this.data.splice(i, 1);
      this.updateSyncData(this.data);
      this.isSelectDisable = this.getData().length > 0 ? false : true;
      this.port.postMessage({ type: Types.MessageType.UPDATE });
    }

    previewItem = (e: Event, i: number) => {
      e.preventDefault();
      e.stopPropagation();
      this.port.postMessage({ type: Types.MessageType.PREVIEW, formData: this.data[i].formData });
    }

    read = (): void => {
      this.port.postMessage({ type: Types.MessageType.READ });
    }

    save = (e: Event): void => {
      if (this.clientName != null || this.clientName != '') {
        this.port.postMessage({ type: Types.MessageType.SAVE, data: { name: this.clientName, formData: this.formData } });
      }
    }

    readForm = () => {
      this.read();
    }

    getUpdatedSyncData = () => {
      chrome.storage.sync.get((items: { data: Array<IData> }) => {
        this.data = items.data && items.data.length ? items.data : [];
      });
    }

    updateSyncData = (newData: Array<IData>) => {
      chrome.storage.sync.set({ data: newData });
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