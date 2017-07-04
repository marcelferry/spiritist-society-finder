(function () {
    'use strict';

    angular
        .module('starter')
        .controller('PlaceCtrl', PlaceCtrl);

    PlaceCtrl.$inject = [
        'uiServices',
        'appServices',

        '$global',
        '$rootScope',
        '$scope',
        '$window',
        '$state',
        '$ionicPopup',
        '$timeout',

        '$ionicHistory',
        '$ionicNavBarDelegate',
        '$ionicScrollDelegate',
        '$ionicSideMenuDelegate',
        'Places',
        'PlaceServices'
    ];

    function PlaceCtrl(
          uiServices,
          appServices,

          $global,
          $rootScope,
          $scope,
          $window,
          $state,
          $ionicPopup,
          $timeout,

          $ionicHistory,
          $ionicNavBarDelegate,
          $ionicScrollDelegate,
          $ionicSideMenuDelegate,
          Places,
          PlaceServices) {


        appServices.verbose('========== PlaceController-Init', 2);

        // Definir as rotinas de inicializar/finalização do controller
        $scope.$on('$ionicView.beforeEnter', onBeforeEnterPlace);
        $scope.$on('$ionicView.enter', onEnterPlace);

        $scope.$on('$destroy', onDestroyPlace);

        $scope.loadEstados = loadEstados;

        // Mostrar o botão voltar
        $ionicNavBarDelegate.showBackButton(true);

        // Garantir que o "placarMetas" é definido (temos que usar "$rootScope")
        if ($rootScope.places == undefined) {
            $rootScope.places = {};
        }

        // -------------------------------------------------------------
        //          $global, Inicializar o controller (toda vez que apresentamos a View ?????)
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

            //
            var centerNorm = null;
            if($rootScope.mapCenter){
              //Convert objects returned by Google to be more readable
              centerNorm = {
                  lat: $rootScope.mapCenter.lat(),
                  lng: $rootScope.mapCenter.lng()
              };
            } else {
              //Convert objects returned by Google to be more readable
              centerNorm = {
                  lat: 0,
                  lng: 0
              };
            }

            var filter = {
              country : $state.params.country,
              state : $state.params.state,
              city : $state.params.city,
            }

            var params = {
              "searchType": $state.params.searchType,
              "centre": centerNorm,
              "filter": filter
            };

            Places.getPlaces(params).then(function(places){
              console.log("Places: ", places);
              $scope.places.list = places.data.result;
            });
            //

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


        // -------------------------------------------------------------
        // Executar quando clicamos no cabeçalho de qualquer coluna no modo "Places"
        // -------------------------------------------------------------
        function onClickColunaPlaces(predicateNovo, direcaoPadrao) {
            // Preparar os parâmetros da rotina de ordenação
            var params = {
                predicateAtual: $rootScope.places.placesPredicate,
                direcaoAtual: $rootScope.places.placesDirecao,
                predicateNovo: predicateNovo,
                direcaoPadrao: direcaoPadrao,
                list: $rootScope.places.list
            };

            // Executar a ordenação da lista de Places
            var retorno = PlaceServices.orderListaInformacoes(params);

            // Atualizar as informações já ordenadas
            $rootScope.places.placesPredicate = retorno.predicateNovo;
            $rootScope.places.placesDirecao = retorno.direcaoNova;
            $rootScope.places.listaInformacoes = retorno.list;

            //appServices.verbose('onClickColunaPlaces|retorno=' + JSON.stringify(retorno).substr(0, 100), 4);
        }

        // -------------------------------------------------------------
        // Executar um "refresh" da tela Placar de Metas
        // Obs. Essa função é chamada sempre que o periodo, produto e/ou comercial é modificado
        // @parametros.codigoPeriodo - código do período novo (opcional)
        // @parametros.ordemProduto - ordem do produto movo (opcional)
        // Exemplos:
        //     refreshTela() --> refresh sem mudar nada
        //     refreshTela({codigoPeriodo: 1}) --> mudar somente período
        //     refreshTela({ordemProduto: 15}) --> mudar somente produto
        //     refreshTela({codigoPeriodo: 3, ordemProduto: 21}) --> mudar periodo e produto ao mesmo tempo
        // -------------------------------------------------------------
        function refreshTela(parametros) {
            appServices.verbose('===== refreshTela-Init|Parametros=' + JSON.stringify(parametros), 3);

            var params = {};

            // Faz com que o scroll da tela volte para a posição inicial (topo da página)
            $ionicScrollDelegate.scrollTop();

            // Apresentar a mensagem "Carregando..."
            uiServices.showLoading({
                forcarPrimeiro: false
            });

            // Verificar se recebemos parâmetros novos
            if (parametros != undefined) {
                // verificar se mudou o produto
                if (parametros.ordemPlace != undefined) {
                    // Guardar o código do produto escolhido
                    $rootScope.places.ordemPlace = parametros.ordemPlace;
                }
            }

            // Atalhos para a seleção atual de produto e período
            var ordemPlace = $rootScope.places.ordemPlace;
            var codigoPeriodoSelecionado = $rootScope.places.codigoPeriodo;

            appServices.verbose('refreshTela|produto=' + ordemProduto + '|periodo=' + codigoPeriodoSelecionado + '|tipoPlacarMetas=' + $rootScope.placarMetas.tipo, 4);

            // Buscar o nome do produto
            $rootScope.places.nomeProduto = appServices.getNomeProdutoByOrdem(ordemProduto);

            var periodo = appServices.getPeriodoByCodigo(codigoPeriodoSelecionado);

            if (periodo == undefined) {
                // Esconder a mensagen "carregando..."
                uiServices.hideLoading({
                    forcarFechamento: true
                });

                uiServices.showPopupAlert("Alta Performance", "refreshTela: ERRO BUSCANDO PERÍODO");
                appServices.verbose('refreshTela: ERRO BUSCANDO PERÍODO', 4);
                return;
            }

            // Guardar os produtos do período selecionado
            $rootScope.places.list = periodo.produtos;

            // Guardar informação para apresentar ou não o resumo do Placar de Metas
            $rootScope.places.isApresentarResumo = (periodo.rsmshw == "1");

            // Verifica se devemos apresentar o Placar de Metas Resumido
            if ($rootScope.places.isApresentarResumo) {
                // Guardar as informações do cabeçalho (bolinhas, atingimento, ranking etc.)
                $rootScope.places.azulCount = periodo.azuboltot;
                $rootScope.places.vermelhoCount = periodo.vrmboltot;
                $rootScope.places.amareloCount = periodo.amaboltot;
                $rootScope.places.verdeCount = periodo.verboltot;
                $rootScope.places.atingimento = appServices.formatPercentualAtingimento(periodo.ptotot);
                $rootScope.places.ranking = appServices.formatPosicaoRanking(periodo.rkgpos);
            } else {
                // Não são apresentadas as informações de placar se não tiver permissão
                $rootScope.places.azulCount = '-';
                $rootScope.places.vermelhoCount = '-';
                $rootScope.places.amareloCount = '-';
                $rootScope.places.verdeCount = '-';
                $rootScope.places.atingimento = '-';
                $rootScope.places.ranking = '- -';
            }

            // Guardar as informações do Comercial/Corretor atual
            $rootScope.places.nivelHierarquiaComCor = periodo.comhienivcod;
            $rootScope.places.codigoComCor = periodo.comcod;
            $rootScope.places.nomeComCor = $rootScope.usuario.nome;

            // Preparar os parâmetros da rotina de ordenação
            params = {
                predicateAtual: '', // Considerar que não temos campo atual de ordenação (forçar nosso campo)
                direcaoAtual: C_DIRECAO.forward,
                predicateNovo: 'nome',
                direcaoPadrao: C_DIRECAO.forward,
                listaInformacoes: $rootScope.placarMetas.listaInformacoes
            };

            // Executar a ordenação da lista de produtos
            var retorno = PlaceServices.orderListaInformacoes(params);

            // Atualizar as informações já ordenadas
            $rootScope.places.placesPredicate = retorno.predicateNovo;
            $rootScope.places.placesDirecao = retorno.direcaoNova;
            $rootScope.places.lista = retorno.listaInformacoes;

            // Atualizar o título da janela
            setTituloJanela();

            // Esconder a mensagen "carregando..."
            uiServices.hideLoading({
                forcarFechamento: false
            });

            appServices.verbose('===== refreshTela-Fim', 3);
        }

        function loadEstados() {
           var allEstados = 'Acre (AC), Alagoas (AL), Amapá (AP), Amazonas (AM), Bahia (BA), Ceará (CE), Distrito Federal (DF), Espírito Santo (ES), Goiás (GO), Maranhão (MA), Mato Grosso (MT), Mato Grosso do Sul (MS), Minas Gerais (MG), Pará (PA) , Paraíba (PB), Paraná (PR), Pernambuco (PE), Piauí (PI), Rio de Janeiro (RJ), Rio Grande do Norte (RN), Rio Grande do Sul (RS), Rondônia (RO), Roraima (RR), Santa Catarina (SC), São Paulo (SP), Sergipe (SE), Tocantins (TO)';
           return allEstados.split(/, +/g).map( function (state) {
                      return {
                                value: state.toLowerCase(),
                                display: state
                      };
           });
        }

        appServices.verbose('========== LoginController-Fim', 2);

  }
})();
