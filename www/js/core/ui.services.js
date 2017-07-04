// ---------------------------------------------------------------------------------------------------
// Factory do módulo 'core.ui'  
// ---------------------------------------------------------------------------------------------------
(function() {
    'use strict';

    angular
        .module('core.ui')
        .factory('uiServices', uiServices);

    uiServices.$inject = [
        'C_MENSAGENS',
        '$ionicLoading',
        //'$timeout',
        '$ionicPopup'
    ];

    function uiServices(
        C_MENSAGENS,
        $ionicLoading,
        //$timeout,
        $ionicPopup) {

        // Contador de apariçoes da mensagem "Carregando..."
        var loadingCounter = 0;

        // Retorno do serviço
        var service = {
            showLoading: showLoading,
            hideLoading: hideLoading,
            showUpdatingApp: showUpdatingApp,
            hideUpdatingApp: hideUpdatingApp,
            showPopupInfo: showPopupInfo,
            showPopupAlert: showPopupAlert,
            showPopupConfirm: showPopupConfirm
        }

        return service;

        function showLoading(options) {
            // Verificar se precisamos forçar o primeiro "Carregando..."
            if (options && options.forcarPrimeiro) {
                loadingCounter = 1;
            } else {
                ++loadingCounter;
            }

            // Apresentar a mensagem "Carregando..."
            $ionicLoading.show({
                // Apresentar a mensagem ou uma mensagem padrão caso não recebemos mensagem para apresentar
                template: (options && options.mensagem) || C_MENSAGENS.carregando,
                delay: (options && options.delay) || 500,
                showBackdrop: false,
                hideOnStateChange: false
                //animation: 'fade-in'
            });
        }

        function hideLoading(options) {
            // Verificar se precisamos forçar o fehcamento ou somente temos um "Carregando..."
            if ((options && options.forcarFechamento) || loadingCounter == 1) {
                loadingCounter = 0;
                $ionicLoading.hide();
            } else {
                --loadingCounter;
            }
        }

        function showUpdatingApp(options) {
            var template = (options && options.mensagem) || C_MENSAGENS.atualizandoApp;

            // Verificar se precisamos adicionar o % de progresso
            if (options && (options.percentual != undefined)) {
                template += " " + parseInt(options.percentual) + "%";
            }

            $ionicLoading.show({
                template: template
            });
        }

        function hideUpdatingApp() {
            $ionicLoading.hide();
        }

        function showPopupInfo(titulo, mensagem) {
            $ionicPopup.alert({
                title: titulo,
                template: mensagem
            });
        }

        function showPopupAlert(titulo, mensagem) {
            $ionicPopup.alert({
                title: titulo,
                template: mensagem
            });
        }

        function showPopupConfirm(parametros) {
            $ionicPopup.confirm(parametros);
            /*
            $scope.showConfirm = function() {
                var confirmPopup = $ionicPopup.confirm(parametros);

                confirmPopup.then(function(res) {
                    return res;
                });
            }
            */
        }
    }
})();