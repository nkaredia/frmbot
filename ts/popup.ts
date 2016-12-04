module formbotApp {
  'use strict';
  export class Popup {
    static $inject: Array<string> = [
      '$timeout'
    ];

    selectedItem: IData;
    searchText: string;
    private data: Array<IData>;
    isDisable: boolean;


    constructor(private $timeout: ng.ITimeoutService) {
      this.data = [{ name: 'hello', formData: '' }, { name: 'world', formData: '' }, { name: 'nk', formData: '' }, { name: 'erferf', formData: '' }, { name: 'kared', formData: '' }];
      this.isDisable = true;
      $timeout(() => { this.isDisable = false }, 1000);
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

    createFilterFor(value: IData, index: number, array: Array<IData>) {
      let lowercaseQuery = angular.lowercase(value.name);
      return (data: string) => {
        return (data.indexOf(lowercaseQuery) === 0);
      }
    }
  }
  angular.module('formbotApp').controller('Popup', Popup);
}