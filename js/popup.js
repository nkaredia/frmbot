var formbotApp;
(function (formbotApp) {
    'use strict';
    var Popup = (function () {
        function Popup($timeout) {
            var _this = this;
            this.$timeout = $timeout;
            this.searchTextChange = function (searchText) {
            };
            this.selectedItemChange = function (item) {
                _this.selectedItem = item;
            };
            this.querySearch = function (searchText) {
                var results = searchText ? _this.data.filter(_this.createFilterFor(searchText)) : _this.data;
                return results;
            };
            this.data = ['hello', 'world', 'nk', 'noorsil', 'karedia'];
            this.isDisable = true;
            $timeout(function () { _this.isDisable = false; }, 1000);
        }
        Popup.prototype.createFilterFor = function (query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(data) {
                return (data.indexOf(lowercaseQuery) === 0);
            };
        };
        Popup.$inject = [
            '$timeout'
        ];
        return Popup;
    }());
    formbotApp.Popup = Popup;
    angular.module('formbotApp').controller('Popup', Popup);
})(formbotApp || (formbotApp = {}));
//# sourceMappingURL=popup.js.map