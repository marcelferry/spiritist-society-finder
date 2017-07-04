// ---------------------------------------------------------------------------------------------------
// Directive 'PlacarMetasController'
// ---------------------------------------------------------------------------------------------------
(function() {
    'use strict';

    angular
        .module('starter')
        .directive('scrollWatch', ScrollWatchDirective)
        .directive('map', map);

    function map(){
      return {
          restrict: 'A',
          link:function(scope, element, attrs){
            var zValue = scope.$eval(attrs.zoom);
            var lat = scope.$eval(attrs.lat);
            var lng = scope.$eval(attrs.lng);


            var myLatlng = new google.maps.LatLng(lat,lng),
            mapOptions = {
                zoom: zValue,
                center: myLatlng
            },
            map = new google.maps.Map(element[0],mapOptions),
            marker = new google.maps.Marker({
      			    position: myLatlng,
      			    map: map,
      			    draggable:true
      		  });

      		  google.maps.event.addListener(marker, 'dragend', function(evt){
      		    scope.$parent.user.latitude = evt.latLng.lat();
      		    scope.$parent.user.longitude = evt.latLng.lng();
      		    scope.$apply();
      		  });

          }
      };
    }

     // Função para exibir ou ocultar o header
     function ScrollWatchDirective($rootScope) {
        return function(scope, elem, attr) {

            // Tamanho do header que será escondido, mesmo valor utilizado no CSS transform
            var inicio = 59;
            // Valor limite para que o header começe a sumir
            var limite = 100;

            elem.bind('scroll', function(e) {
                // Valor da barra de rolagem em tempo real
                var scrollTop = 0;

                // Verifica se é android para pegar o quanto rolou a página
                if (ionic.Platform.isAndroid()) {
                    scrollTop = e.currentTarget.scrollTop;
                } else {
                    if(e.detail == undefined){
                      scrollTop = e.currentTarget.scrollTop;
                    } else {
                      scrollTop = e.detail.scrollTop;
                    }
                }

                // Define se o header vai aparecer ou não
                if (scrollTop - inicio > limite) {
                    $rootScope.slideHeader = true;
                } else {
                    $rootScope.slideHeader = false;
                }

                $rootScope.$apply();
            });
        };
     }
})();
