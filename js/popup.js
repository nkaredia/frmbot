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
                var results = searchText ? _this.data.filter(_this.createFilterFor) : _this.data;
                return results;
            };
            this.data = [{ name: 'hello', formData: '' }, { name: 'world', formData: '' }, { name: 'nk', formData: '' }, { name: 'erferf', formData: '' }, { name: 'kared', formData: '' }];
            this.isDisable = true;
            $timeout(function () { _this.isDisable = false; }, 1000);
        }
        Popup.prototype.createFilterFor = function (value, index, array) {
            var lowercaseQuery = angular.lowercase(value.name);
            return function (data) {
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