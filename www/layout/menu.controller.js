// ---------------------------------------------------------------------------------------------------
// Controller 'MenuCtrl'
// ---------------------------------------------------------------------------------------------------
(function () {
    'use strict';

    angular
        .module('starter')
        .controller('MenuCtrl', MenuCtrl);

    MenuCtrl.$inject = [
        'utilsServices',
        'uiServices',
        'appServices',

        'C_STORAGE',
        'C_TIPO_AMBIENTE',
        'C_APP_MENSAGENS',

        '$global',
        '$rootScope',
        '$scope',
        '$window',
        '$state',

        '$ionicModal',
        '$ionicSideMenuDelegate',
        '$ionicPopover',
        '$ionicHistory'
    ];

    function MenuCtrl(
        utilsServices,
        uiServices,
        appServices,

        C_STORAGE,
        C_TIPO_AMBIENTE,
        C_APP_MENSAGENS,

        $global,
        $rootScope,
        $scope,
        $window,
        $state,

        $ionicModal,
        $ionicSideMenuDelegate,
        $ionicPopover,
        $ionicHistory) {

        appServices.verbose('========== MenuCtrl-Init', 2);

        // Definir as rotinas de inicializar/finalização do controller
        $scope.$on('$destroy', onDestroyMenu);

        // Constante Tipo do Ambiente
        $scope.C_TIPO_AMBIENTE = C_TIPO_AMBIENTE;

        // Função para tirar foto
        $scope.takePicture = takePicture;

        // Função para Alta Performance
        $scope.menuCasasProximas = menuCasasProximas;

        // Função para Alta Performance
        $scope.menuPorEstado = menuPorEstado;

        // Função para Notificações
        $scope.menuNotificacoes = menuNotificacoes;

        // Função para fazer Logoff
        $scope.logoff = appServices.logoff;

        // Função para mudar de ambiente
        $scope.mudarAmbiente = mudarAmbiente;

        // Função para apresentar o nome do nível da hierarquia do comercial
        $scope.getNomeHierarquiaComercial = appServices.getNomeHierarquiaComercial;

        /*
            EYAL: Teste criando uma função quando clica no botão "<"

            $scope.backButtonClick = backButtonClick;

            function backButtonClick() {
                uiServices.showLoading();

                $ionicHistory.goBack();
            }
        */

        /*
            Retirado para mantis 2718

            // Configurar o template do botão "?" (modal regras da campanha)
            $ionicModal
                .fromTemplateUrl('placarMetas/regrasCampanha.html', {
                    scope: $scope
                })
                .then(function (modal) {
                    $scope.regrasCampanhaModal = modal;
                });
        */

        // Configurar o template do popoverAmbientes (usamos para lista de ambientes)
        if ($scope.popoverAmbientes == undefined) {
            $ionicPopover
                .fromTemplateUrl('layout/ambientes.html', {
                    scope: $scope
                })
                .then(function (popover) {
                    $scope.popoverAmbientes = popover;
                });
        }

        // Configurar o template de escolha de avatar (popover avatar)
        if ($rootScope.popoverAvatar == undefined) {
            $ionicPopover
                .fromTemplateUrl('layout/popoverAvatar.html', {
                    scope: $scope
                })
                .then(function (popover) {
                    $scope.popoverAvatar = popover;
                });
        }

        // -------------------------------------------------------------
        // Saída do controller
        // -------------------------------------------------------------
        function onDestroyMenu() {
            appServices.verbose('===== onDestroyMenu-Init', 3);

            // Remover os popovers
            try {
                $scope.popoverAmbientes.remove();
            } catch (error) {
            }

            // Verificar se instanciamos o popover de avatar
            try {
                // Garantir que removemos da memória o popover quando destruímos o controller
                $scope.popoverAvatar.remove();
            } catch (error) {
            }

            /*
                Retirado para mantis 2718

                // Verificar se instanciamos o modal de regras da campanha
                try {
                    // Garantir que removemos da memória o modal quando destruímos o controller
                    $rootScope.regrasCampanhaModal.remove();
                } catch (error) {
                }
            */

            appServices.verbose('===== onDestroyMenu-Fim', 3);
        }

        // -------------------------------------------------------------
        // Tira a foto
        // -------------------------------------------------------------
        //$scope.ImageURI = 'Selecione...';

        function takePicture(matricula, isCamera) {
            try {
                // Esconder o popover de escolha avatar
                $scope.popoverAvatar.hide();
            } catch (error) {
            }

            var sourceType = undefined;

            if (isCamera) {
                // Pegar a foto da camera
                sourceType = navigator.camera.PictureSourceType.CAMERA;
            } else {
                // Pegar a foto da galeria
                sourceType = navigator.camera.PictureSourceType.PHOTOLIBRARY;
            }

            function savePicture(imageURI) {
                // Salvar o caminho
                var newImageURI = imageURI;

                // Apresentar a mensagem "Carregando..."
                uiServices.showLoading();

                //TODO: Eyal - Precisa pesquisar uma forma deste trecho do código ficar mais robusto,
                // pois utilizamos variação de string para contornar o bug do Cordova

                // Correção de bug do Cordova para Android
                if ((ionic.Platform.isAndroid()) &&
                    (sourceType == navigator.camera.PictureSourceType.PHOTOLIBRARY)) {
                    try {
                        // Verifica se imagem vem da Galeria
                        if (newImageURI.substring(0, 21) == "content://com.android") {
                            var imagemSplit = newImageURI.split("%3A");

                            if (imagemSplit.length == 2) {
                                newImageURI = "content://media/external/images/media/" + imagemSplit[1];
                            }
                        }

                        // Verifica se imagem vem do Google Photos
                        if (newImageURI.substring(0, 40) == "content://com.google.android.apps.photos") {
                            var inicioIndex = newImageURI.indexOf("file%2F");
                            var fimIndex = newImageURI.indexOf("/ORIGINAL");

                            if ((inicioIndex !== 0) && (fimIndex !== 0)) {
                                var imagemNome = newImageURI.substring((inicioIndex + 7), fimIndex);

                                newImageURI = "content://media/external/images/media/" + imagemNome;
                            }
                        }
                    } catch (error) {
                        uiServices.showPopupAlert(
                            "Galeria",
                            C_APP_MENSAGENS.erroImagemGaleria);
                    }
                }

                // Atualizar a imagem (avatar) do usuário
                $rootScope.usuario.avatarStyle = "background-image:url('" + newImageURI + "')!important"; // Adicionar o novo avatar
                $rootScope.usuario.avatarURI = newImageURI; // Colocar nos dados do usuario

                // Salvar os dados do usuário com o novo Avatar
                utilsServices.setStorage(C_STORAGE.usuario, $rootScope.usuario);

                // Esconder a mensagem "Carregando..."
                uiServices.hideLoading();
            }

            // Conforme a origem da foto
            switch (sourceType) {
                case navigator.camera.PictureSourceType.CAMERA:
                    // Tirar foto via camera
                    navigator.camera.getPicture(
                        // Callback quando foto foi tirada/escolhida com sucesso
                        savePicture,

                        // Callback quando dá erro
                        function (err) {
                            uiServices.showPopupAlert("Camera", err);
                        },

                        // Opções da camera
                        {
                            correctOrientation: true
                        });
                    break;

                case navigator.camera.PictureSourceType.PHOTOLIBRARY:
                    // Escolher uma foto já existente
                    navigator.camera.getPicture(
                        // Callback quando foto foi escolhida com sucesso
                        savePicture,

                        // Callback quando dá erro
                        function (err) {
                            uiServices.showPopupAlert("Galeria", err);
                        },

                        // Opções da escolha da foto
                        {
                            quality: 50,
                            destinationType: navigator.camera.DestinationType.FILE_URI,
                            sourceType: sourceType
                        });
                    break;
            }
        }

        // -------------------------------------------------------------
        // Mudar o ambiente
        // -------------------------------------------------------------
        function mudarAmbiente(tipoAmbiente) {
            appServices.verbose("mudarAmbiente #01 ($global.ambiente= " + appServices.getNomeAmbiente({ ambiente: $global.ambiente }) + ")", 1);

            try {
                // Esconder o popover dos Ambientes
                $scope.popoverAmbientes.hide();
            } catch (error) {
            }

            // Sinalizar que queremos mudar de ambiente (somente se o ambiente atual e o selecionado são diferentes)
            $global.mudarAmbiente = ($global.ambiente != tipoAmbiente);

            // Guardar o novo ambiente que queremos mudar para ele
            $global.ambiente = tipoAmbiente;

            // Guardar localmente o novo ambiente
            utilsServices.setStorage(C_STORAGE.ambiente, $global.ambiente);

            appServices.verbose("mudarAmbiente #02 ($global.ambiente= " + appServices.getNomeAmbiente({ ambiente: $global.ambiente }) + ")", 1);

            // Desabilitar o botão voltar para voltar para essa tela
            $ionicHistory.nextViewOptions({
                disableBack: true
            });

            // Voltar para a tela de Login (automaticamente vai mudar de ambiente)
            appServices.logoff();

            //TODO Eyal: O app volta para tela de login, mas não executa o Download da nova versão
            //if (ionic.Platform.isAndroid()) {
            //ionic.Platform.exitApp();
            //} else {
            //}
            // Caso não funciona, outras alternativas são:
            // ionic.Platform.exitApp();
            // navigator.app.exitApp();
            // app.navigator.appExit();
            // $state.go('app.login');
        }

        // -------------------------------------------------------------
        // Casas Proximas
        // -------------------------------------------------------------
        function menuCasasProximas() {
            // Preparar os paramêtros para ir para a tela de Alta Performance
            var stateParams = {
                openSideMenu: false,
                searchType: 'PROXIMITY'
            };

            appServices.verbose('menuCasasProximas|stateParams=' + JSON.stringify(stateParams), 4);

            // Desabilitar o botão voltar para voltar para essa tela
            $ionicHistory.nextViewOptions({
                disableBack: true
            });

            // Ir para a tela de Casas Proximas
            $state.go('app.places', stateParams);
        }

        // -------------------------------------------------------------
        // Alta Performance
        // -------------------------------------------------------------
        function menuPorEstado() {
          // Preparar os paramêtros para ir para a tela de Alta Performance
          var stateParams = {
              openSideMenu: false,
          };

          appServices.verbose('menuCasasProximas|stateParams=' + JSON.stringify(stateParams), 4);

          // Desabilitar o botão voltar para voltar para essa tela
          $ionicHistory.nextViewOptions({
              disableBack: true
          });

          // Ir para a tela de Casas Proximas
          $state.go('app.countries', stateParams);
        }

        // -------------------------------------------------------------
        // Notificações
        // -------------------------------------------------------------
        function menuNotificacoes() {
            // Preparar os paramêtros para ir para a tela de notificações
            var stateParams = {
                modoSelecao: C_TIPO_SELECAO_NOTIFICACOES.nenhum
            };

            appServices.verbose('menuNotificacoes|stateParams=' + JSON.stringify(stateParams), 4);

            // Desabilitar o botão voltar para voltar para essa tela
            $ionicHistory.nextViewOptions({
                disableBack: true
            });

            // Ir para a tela de Notificações
            $state.go('app.notificacoes', stateParams);
        }

        appServices.verbose('========== MenuCtrl-Fim', 2);
    }
})();
