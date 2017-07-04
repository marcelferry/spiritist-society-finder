(function () {
    'use strict';

    angular
        .module('starter')
        .controller('PlaceNewCtrl', PlaceNewCtrl);

    PlaceNewCtrl.$inject = [
        'uiServices',
        'appServices',

        '$global',
        '$rootScope',
        '$scope',
        '$window',
        '$state',
        '$filter',
        '$ionicPopup',
        '$timeout',

        '$ionicHistory',
        '$ionicNavBarDelegate',
        '$ionicScrollDelegate',
        '$ionicSideMenuDelegate',
        'Places',
        'PlaceServices',
        'GoogleMaps'
    ];

    function PlaceNewCtrl(
          uiServices,
          appServices,

          $global,
          $rootScope,
          $scope,
          $window,
          $state,
          $filter,
          $ionicPopup,
          $timeout,

          $ionicHistory,
          $ionicNavBarDelegate,
          $ionicScrollDelegate,
          $ionicSideMenuDelegate,
          Places,
          PlaceServices,
          GoogleMaps) {


        appServices.verbose('========== PlaceNewCtrl-Init', 2);

        // Definir as rotinas de inicializar/finalização do controller
        $scope.$on('$ionicView.beforeEnter', onBeforeEnterPlace);
        $scope.$on('$ionicView.enter', onEnterPlace);

        $scope.$on('$destroy', onDestroyPlace);

        $scope.place = {};

        $scope.savePlace = savePlace;

        // Mostrar o botão voltar
        $ionicNavBarDelegate.showBackButton(true);

        // Garantir que o "placarMetas" é definido (temos que usar "$rootScope")
        if ($rootScope.places == undefined) {
            $rootScope.places = {};
        }

        // -------------------------------------------------------------
        // Inicializar o controller (toda vez que apresentamos a View ?????)
        // -------------------------------------------------------------
        function onBeforeEnterPlace() {
            appServices.verbose('===== onBeforeEnterPlace-Init', 3);

            // Apresentar a mensagem "Carregando..."
            uiServices.showLoading({
                forcarPrimeiro: false
            });

            // Apresenta o menu(top) ao trocar de tela
            $rootScope.slideHeader = false;

            // Permitir que o usuário abre o sidemenu
            $ionicSideMenuDelegate.canDragContent(true);

            GoogleMaps.init("AIzaSyDoaI19bAhbtMsy_NRgOMKnNFodFD5wA_w", "intmap");

            appServices.verbose('===== onBeforeEnterPlace-Fim', 3);
        }

        // -------------------------------------------------------------
        // Executar quando a view está 100% carregada
        // -------------------------------------------------------------
        function onEnterPlace() {
            appServices.verbose('===== onEnterPlace-Init');

            // Esconder a mensagen "carregando..."
            uiServices.hideLoading({
                forcarFechamento: false
            });

            // Verificar se precisamos abrir o sidemenu
            if ($state.params.openSideMenu != undefined &&
                $state.params.openSideMenu != null &&
                $state.params.openSideMenu.toUpperCase() == 'TRUE') {
                $ionicSideMenuDelegate.toggleLeft(true);
            }

            // Deixar habilitado a transição do menu(top), enquanto muda de tela
            $rootScope.slideHeaderTransition = true;

            appServices.verbose('===== onEnterPlace-Fim', 3);
        }

        // -------------------------------------------------------------
        // Executado quando a View está 100% descarregada
        // -------------------------------------------------------------
        function onDestroyPlace() {
            appServices.verbose('===== onDestroyPlace-Init', 3);

            appServices.verbose('===== onDestroyPlace-Fim', 3);
        }

        function savePlace() {
           alert($rootScope.latitude);
        }

        appServices.verbose('========== PlaceNewCtrl-Fim', 2);

  }
})();
