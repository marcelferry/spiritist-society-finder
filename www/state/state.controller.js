(function () {
    'use strict';

    angular
        .module('starter')
        .controller('StateCtrl', StateCtrl);

    StateCtrl.$inject = [
        'utilsServices',
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
        'States'
    ];

    function StateCtrl(
          utilsServices,
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
          States) {


        appServices.verbose('========== StateController-Init', 2);

        // Definir as rotinas de inicializar/finalização do controller
        $scope.$on('$ionicView.beforeEnter', onBeforeEnterState);
        $scope.$on('$ionicView.enter', onEnterState);

        $scope.$on('$destroy', onDestroyState);

        // Mostrar o botão voltar
        $ionicNavBarDelegate.showBackButton(true);

        $scope.onClickItem = onClickItem;

        // Garantir que o "placarMetas" é definido (temos que usar "$rootScope")
        if ($rootScope.states == undefined) {
            $rootScope.states = {};
        }

        if ($scope.country != undefined) {
            $scope.country = {};
        }

        // -------------------------------------------------------------
        // Inicializar o controller (toda vez que apresentamos a View ?????)
        // -------------------------------------------------------------
        function onBeforeEnterState() {
            appServices.verbose('===== onBeforeEnterState-Init', 3);

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

            var filter = {
              country : $state.params.country
            }

            var params = {
              "filter": filter
            };

            States.getStates(params).then(function(states){
              console.log("States: ", states);
              $scope.states.list = states.data.result;
            });
            //

            appServices.verbose('===== onBeforeEnterState-Fim', 3);
        }

        // -------------------------------------------------------------
        // Executar quando a view está 100% carregada
        // -------------------------------------------------------------
        function onEnterState() {
            appServices.verbose('===== onEnterState-Init');



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

            appServices.verbose('===== onEnterState-Fim', 3);
        }

        // -------------------------------------------------------------
        // Executado quando a View está 100% descarregada
        // -------------------------------------------------------------
        function onDestroyState() {
            appServices.verbose('===== onDestroyState-Init', 3);

            appServices.verbose('===== onDestroyState-Fim', 3);
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
                country: parametros.country,
                state: parametros.state
            };

            appServices.verbose('onClickItem|stateParamsProdutos=' + JSON.stringify(stateParams), 4);

            // Verificar se temos parametros para redirecionar para Placar de Metas
            if (stateParams != undefined) {
                // Sempre é bom manter "$state.go"" como último comando da função
                $state.go('app.cities', stateParams);
            }

            // Esconder a mensagen "carregando..."
            uiServices.hideLoading({
                forcarFechamento: false
            });

            appServices.verbose('===== onClickItem-Fim', 3);
        }

        appServices.verbose('========== StateCtrl-Fim', 2);

  }
})();
