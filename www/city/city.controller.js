(function () {
    'use strict';

    angular
        .module('starter')
        .controller('CityCtrl', CityCtrl);

    CityCtrl.$inject = [
        'utilsServices',
        'uiServices',
        'appServices',

        'C_STORAGE',
        'C_TIPO_AMBIENTE',
        'C_APP_MENSAGENS',
        'C_RETURN_CODE',

        '$global',
        '$rootScope',
        '$scope',
        '$window',
        '$state',
        '$filter',
        '$ionicPopup',
        '$timeout',
        '$cordovaFacebook',

        '$ionicHistory',
        '$ionicNavBarDelegate',
        '$ionicScrollDelegate',
        '$ionicSideMenuDelegate',
        'Cities'
    ];

    function CityCtrl(
          utilsServices,
          uiServices,
          appServices,

          C_STORAGE,
          C_TIPO_AMBIENTE,
          C_APP_MENSAGENS,
          C_RETURN_CODE,


          $global,
          $rootScope,
          $scope,
          $window,
          $state,
          $filter,
          $ionicPopup,
          $timeout,
          $cordovaFacebook,

          $ionicHistory,
          $ionicNavBarDelegate,
          $ionicScrollDelegate,
          $ionicSideMenuDelegate,
          Cities) {


        appServices.verbose('========== CityController-Init', 2);

        // Definir as rotinas de inicializar/finalização do controller
        $scope.$on('$ionicView.beforeEnter', onBeforeEnterCity);
        $scope.$on('$ionicView.enter', onEnterCity);

        $scope.$on('$destroy', onDestroyCity);

        $scope.onClickItem = onClickItem;

        // Mostrar o botão voltar
        $ionicNavBarDelegate.showBackButton(true);

        // Garantir que o "placarMetas" é definido (temos que usar "$rootScope")
        if ($rootScope.cities == undefined) {
            $rootScope.cities = {};
        }

        if ($scope.country != undefined) {
            $scope.country = {};
        }
        if ($scope.state != undefined) {
            $scope.state = {};
        }

        // -------------------------------------------------------------
        // Inicializar o controller (toda vez que apresentamos a View ?????)
        // -------------------------------------------------------------
        function onBeforeEnterCity() {
            appServices.verbose('===== onBeforeEnterCity-Init', 3);

            // Apresentar a mensagem "Carregando..."
            uiServices.showLoading({
                forcarPrimeiro: false
            });

            // Apresenta o menu(top) ao trocar de tela
            $rootScope.slideHeader = false;

            // Permitir que o usuário abre o sidemenu
            $ionicSideMenuDelegate.canDragContent(true);

            console.log($state.params);

            $scope.country = $state.params.country;
            $scope.state = $state.params.state;

            var filter = {
              country : $state.params.country,
              state : $state.params.state
            }

            var params = {
              "filter": filter
            };

            Cities.getCities(params).then(function(cities){
              console.log("Cities: ", cities);
              $scope.cities.list = cities.data.result;
            });
            //

            appServices.verbose('===== onBeforeEnterCity-Fim', 3);
        }

        // -------------------------------------------------------------
        // Executar quando a view está 100% carregada
        // -------------------------------------------------------------
        function onEnterCity() {
            appServices.verbose('===== onEnterCity-Init');



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

            appServices.verbose('===== onEnterCity-Fim', 3);
        }

        // -------------------------------------------------------------
        // Executado quando a View está 100% descarregada
        // -------------------------------------------------------------
        function onDestroyCity() {
            appServices.verbose('===== onDestroyCity-Init', 3);

            appServices.verbose('===== onDestroyCity-Fim', 3);
        }

        // -------------------------------------------------------------
        // On Click num item na lista (Produto/Comercial/Corretor)
        //
        // Parâmetros de entrada:
        // @param {objeto} parâmetros:
        //      {integer} ordemProduto - ordem do produto novo
        //      {string} nivelHierarquiaComCorDestino - nível da hierarquia do Comercial ou Corretor destino
        //      {string} codigoComCorDestino - codigo do Comercial ou Corretor destino
        //      {string} nomeComCorDestino - nome do Comercial ou Corretor destino
        // -------------------------------------------------------------
        function onClickItem(parametros) {
            appServices.verbose('===== onClickItem-Init|parametros=' + JSON.stringify(parametros), 3);

            // Apresenta o menu(top) ao trocar de tela
            $rootScope.slideHeader = false;

            // Deixar desabilitado a transição do menu(top), enquanto muda de tela
            $rootScope.slideHeaderTransition = false;

            // Apresentar a mensagem "Carregando..."
            uiServices.showLoading({
                forcarPrimeiro: true,
                delay: 0
            });

            var stateParams = undefined;

            console.log(parametros);

            // Da visão "produto" sempre descemos para visão "comercial" do mesmo comercial que estamos apresentando na tela
            stateParams = {
                openSideMenu: false,
                searchType: 'FILTER',
                country: parametros.country,
                state: parametros.state,
                city: parametros.city
            };

            appServices.verbose('onClickItem|stateParamsProdutos=' + JSON.stringify(stateParams), 4);


            // Verificar se temos parametros para redirecionar para Placar de Metas
            if (stateParams != undefined) {
                // Sempre é bom manter "$state.go"" como último comando da função
                $state.go('app.places', stateParams);
            }

            // Esconder a mensagen "carregando..."
            uiServices.hideLoading({
                forcarFechamento: false
            });

            appServices.verbose('===== onClickItem-Fim', 3);
        }

        appServices.verbose('========== LoginController-Fim', 2);

  }
})();
