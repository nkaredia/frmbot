module formbotApp {
  'use strict';
  export class Popup {
    static $inject: Array<string> = [
      '$timeout'
    ];

    selectedItem: string;
    searchText: string;
    private data: Array<string>;
    isDisable: boolean;


    constructor(private $timeout: ng.ITimeoutService) {
      this.data = ['hello', 'world', 'nk', 'noorsil', 'karedia'];
      this.isDisable = true;
      $timeout(() => { this.isDisable = false }, 1000);
    }

    searchTextChange = (searchText: string): void => {

    }

    selectedItemChange = (item: string): void => {
      this.selectedItem = item;
    }

    querySearch = (searchText: string): Array<string> => {
      let results = searchText ? this.data.filter(this.createFilterFor(searchText)) : this.data;
      return results;
    }

    createFilterFor(query: string) {
      var lowercaseQuery = angular.lowercase(query);

      return function filterFn(data: string) {
        return (data.indexOf(lowercaseQuery) === 0);
      };

    }
  }
  angular.module('formbotApp').controller('Popup', Popup);
}