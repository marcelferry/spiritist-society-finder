// ---------------------------------------------------------------------------------------------------
// Adicionar filtros para 'app.core'
// ---------------------------------------------------------------------------------------------------
(function() {
    'use strict';

    angular
        .module('app.core')

        // ---------------------------------------------------------------------------------------------------
        // Sobreescrever o filtro 'array'
        // ---------------------------------------------------------------------------------------------------
        .filter('unsafe', function($sce) {
            return function(val) {
                return $sce.trustAsHtml(val);
            };
        })

        // ---------------------------------------------------------------------------------------------------
        // Sobreescrever o filtro 'array'
        // ---------------------------------------------------------------------------------------------------
        .filter('array', function() {
            return function(items) {
                var filtered = [];

                angular.forEach(items, function(item) {
                    filtered.push(item);
                });

                return filtered;
            };
        })

        // ---------------------------------------------------------------------------------------------------
        // Sobreescrever o filtro 'number:0'
        // ---------------------------------------------------------------------------------------------------
        .filter('number:0', ['$filter', '$locale', function(filter, locale) {
            var currencyFilter = filter('currency');
            var formats = locale.NUMBER_FORMATS;

            return function(amount, currencySymbol) {
                var value = currencyFilter(amount, '');
                var sep = value.indexOf(formats.DECIMAL_SEP);

                if (amount >= 0) {
                    return value.substring(0, sep);
                }

                return value.substring(0, sep) + ')';
            };
        }])
})();