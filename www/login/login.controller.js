(function () {
    'use strict';

    angular
        .module('starter')
        .controller('LoginCtrl', LoginCtrl);

    LoginCtrl.$inject = [
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
        '$ionicSideMenuDelegate',
    ];

    function LoginCtrl(
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
        $ionicSideMenuDelegate) {

        appServices.verbose('========== LoginController-Init', 2);

        // Definir as rotinas de inicializar/finalização do controller
        $scope.$on('$ionicView.beforeEnter', onBeforeEnterLogin);
        $scope.$on('$ionicView.enter', onEnterLogin);

        $scope.data = {};

        $scope.loginWithFacebook = loginWithFacebook;
        $scope.loginWithGoogle = loginWithGoogle;
        $scope.doLogin = doLogin;
        $scope.signupEmail = signupEmail;

        // -------------------------------------------------------------
        // Executado antes da View ser carregada
        // -------------------------------------------------------------
        function onBeforeEnterLogin() {
            appServices.verbose('===== onBeforeEnterLogin-Init', 3);

            // Garantir que não temos nada no histórico (para que o botão "Back" não volta para dentro do App)
            $ionicHistory.clearHistory();

            appServices.verbose("onBeforeEnterLogin #01 ($global.ambiente= " + appServices.getNomeAmbiente({ ambiente: $global.ambiente }) + ")", 1);

            appServices.verbose('===== onBeforeEnterLogin-Fim', 3);
        }

        // -------------------------------------------------------------
        // Executado quando a View está 100% carregada
        // -------------------------------------------------------------
        function onEnterLogin() {
            appServices.verbose('===== onEnterLogin-Init', 3);

            // Garantir que o "config" é definido
            if ($rootScope.config == undefined) {
                $rootScope.config = {};
            }

            // Garantir que o "loginData" é definido (usado no template para guardar a matricula e senha)
            if ($rootScope.loginData == undefined) {
                $rootScope.loginData = {};
            }

            // Garantir que o "usuario" é definido
            if ($rootScope.usuario == undefined) {
                $rootScope.usuario = {};
            }

            // Sempre temos que limpar os dados do comercial quando entramos na tela de login
            $rootScope.comercial = {};
            $rootScope.comercial.listaProdutos = {};
            $rootScope.comercial.listaPeriodos = {};

            // Não permitir que usuário abre o sidemenu
            $ionicSideMenuDelegate.canDragContent(false);

            // Ler as configurações do usuário salvas localmente
            appServices.getStorageUsuario();

            // Verificar se temos atualizações do App (precisa ser o último comando na rotina)
            checkForUpdates();

            appServices.verbose('===== onEnterLogin-Fim', 3);
        }

        // -------------------------------------------------------------
        // Verificar se temos uma nova versão para atualizar, ou se
        // mudamos de ambiente de temos que fazer download da versão do
        // novo ambiente selecionado
        // -------------------------------------------------------------
        function checkForUpdates() {
            appServices.verbose("checkForUpdates-Init", 1);

            // Não temos nenhuma informação de deploy
            $global.appDeployInfo = {};

            // Não temos nenhuma informação de Meta Dados
            $global.appDeployMetadata = {};

            // Verificar se tem uma nova versão e já faça download caso exista
            doUpdateCheck();

            appServices.verbose("checkForUpdates-Fim", 1);
        }

        // -------------------------------------------------------------
        // Verificar se existe uma nova versão
        // -------------------------------------------------------------
        function doUpdateCheck() {
            appServices.verbose("doUpdateCheck-Init", 1);

            try {
                /* deploy.check().then(
                    // Success
                    function(hasUpdate) {
                        appServices.verbose("doUpdateCheck Success [" + hasUpdate + "|" + $global.mudarAmbiente + "]", 1);

                        // Verificar se precisamos atualizar a versão
                        if ($global.mudarAmbiente || hasUpdate) {
                            // Fazer download da versão
                            doUpdateDownload();
                        } else {
                            // Buscar as informações (info + metadata) da versão atual
                            doUpdateGetInfo();
                        }
                    },
                    // Error
                    function(error) {
                        appServices.verbose("doUpdateCheck Error [" + error + "]", 1);

                        // Apresentar a mensagem de erro
                        uiServices.showPopupAlert(
                            C_APP_MENSAGENS.infoAtualizacoVersao,
                            JSON.stringify(error));

                        // Buscar as informações (info + metadata) da versão atual
                        doUpdateGetInfo();
                    });*/
            } catch (error) {
                appServices.verbose("doUpdateCheck Error [" + error + "]", 1);

                // Apresentar uma mensagem de erro no processo de verificação de atualizações
                uiServices.showPopupAlert(
                    C_APP_MENSAGENS.infoAtualizacoVersao,
                    JSON.stringify(error));

                // Buscar as informações (info + metadata) da versão atual
                doUpdateGetInfo();
            }

            appServices.verbose("doUpdateCheck-Fim", 1);
        }

        // -------------------------------------------------------------
        // Fazer o download da versão a ser atualizada
        // -------------------------------------------------------------
        function doUpdateDownload() {
            appServices.verbose("doUpdateDownload-Init", 1);

            // Apresentar a mensagem "Baixando atualização 0%"
            uiServices.showUpdatingApp({
                percentual: 0
            });

            try {
                // Fazer download da versão do ambiente atual
                /* deploy.download().then(
                    // Success
                    function() {
                        appServices.verbose("doUpdateDownload Success", 1);

                        // Descompactar (extrair) a versão que acabamos de fazer download
                        doUpdateExtract();
                    },
                    // Error
                    function(error) {
                        appServices.verbose("doUpdateDownload Error [" + error + "]", 1);

                        // Esconder a mensagem "Baixando atualizações"
                        uiServices.hideUpdatingApp();

                        // Apresentar a mensagem de erro
                        uiServices.showPopupAlert(
                            C_APP_MENSAGENS.infoAtualizacoVersao,
                            JSON.stringify(error));

                        // Buscar as informações (info + metadata) da versão atual
                        doUpdateGetInfo();
                    },
                    // Progress
                    function(progress) {
                        // Apresentar a mensagem "Baixando atualização XX%"
                        uiServices.showUpdatingApp({
                            percentual: progress
                        });
                    });*/
            } catch (error) {
                appServices.verbose("doUpdateDownload Error [" + error + "]", 1);

                // Esconder a mensagem "Baixando atualizações"
                uiServices.hideUpdatingApp();

                // Apresentar uma mensagem de erro no processo de verificação de atualizações
                uiServices.showPopupAlert(
                    C_APP_MENSAGENS.infoAtualizacoVersao,
                    JSON.stringify(error));

                // Buscar as informações (info + metadata) da versão atual
                doUpdateGetInfo();
            }

            // Esconder a mensagem "Baixando atualizações"
            uiServices.hideUpdatingApp();

            appServices.verbose("doUpdateDownload-Fim", 1);
        }

        // -------------------------------------------------------------
        // Descompactar (extrair) a versão que acabamos de fazer download
        // -------------------------------------------------------------
        function doUpdateExtract() {
            appServices.verbose("doUpdateExtract-Init", 1);

            // Apresentar a mensagem "Instalando atualização 0%"
            uiServices.showUpdatingApp({
                mensagem: C_APP_MENSAGENS.infoInstalandoAtualizacao,
                percentual: 0
            });

            try {
                deploy.extract().then(
                    // Success
                    function() {
                        appServices.verbose("doUpdateExtract Success", 1);

                        // Esconder a mensagem "Instalando atualização"
                        uiServices.hideUpdatingApp();

                        // Não precisamos mais mudar de ambiente, já que acabamos de mudar
                        $global.mudarAmbiente = false;

                        // Recomeçar o App (restart/reload)
                        deploy.load();
                    },
                    // Error
                    function(error) {
                        appServices.verbose("doUpdateExtract Error [" + error + "]", 1);

                        // Esconder a mensagem "Instalando atualização"
                        uiServices.hideUpdatingApp();

                        // Apresentar a mensagem de erro
                        uiServices.showPopupAlert(
                            C_APP_MENSAGENS.infoAtualizacoVersao,
                            JSON.stringify(error));

                        // Buscar as informações (info + metadata) da versão atual
                        doUpdateGetInfo();
                    },
                    // Progress
                    function(progress) {
                        // Apresentar a mensagem "Instalando atualização XX%"
                        uiServices.showUpdatingApp({
                            mensagem: C_APP_MENSAGENS.infoInstalandoAtualizacao,
                            percentual: progress
                        });
                    });
            } catch (error) {
                appServices.verbose("doUpdateExtract Error [" + error + "]", 1);

                // Esconder a mensagem "Instalando atualização"
                uiServices.hideUpdatingApp();

                // Apresentar uma mensagem de erro no processo de verificação de atualizações
                uiServices.showPopupAlert(
                    C_APP_MENSAGENS.infoAtualizacoVersao,
                    JSON.stringify(error));

                // Buscar as informações (info + metadata) da versão atual
                doUpdateGetInfo();
            }

            // Esconder a mensagem "Extraíndo atualização"
            uiServices.hideUpdatingApp();

            appServices.verbose("doUpdateExtract-Fim", 1);
        }

        // -------------------------------------------------------------
        // Buscar as informações da versão atual e depois exclui versões
        // anteriores do despositivo para liberar espaço
        // -------------------------------------------------------------
        function doUpdateGetInfo() {
            appServices.verbose("doUpdateGetInfo-Init", 1);

            try {
                deploy.info().then(
                    // Success
                    function(deployInfo) {
                        appServices.verbose("doUpdateGetInfo Success [" + JSON.stringify(deployInfo) + "]", 1);

                        // Guardar as informações da versão atual
                        $global.appDeployInfo = deployInfo;

                        appServices.verbose("$global.appDeployInfo=[" + JSON.stringify($global.appDeployInfo) + "]", 1);

                        // Buscar os meta dados da versão
                        doUpdateGetMetadata();
                    },
                    // Error
                    function(error) {
                        appServices.verbose("doUpdateGetInfo Error [" + error + "]", 1);

                        // Mesmo com erro, buscar os meta dados da versão
                        doUpdateGetMetadata();
                    });
            } catch (error) {
                appServices.verbose("doUpdateGetInfo Error []" + error + "]", 1);

                // Apresentar uma mensagem de erro no processo de verificação de atualizações
                uiServices.showPopupAlert(
                    C_APP_MENSAGENS.infoAtualizacoVersao,
                    JSON.stringify(error));

                // Mesmo com erro, buscar os meta dados da versão
                doUpdateGetMetadata();
            }

            appServices.verbose("doUpdateGetInfo-Fim", 1);
        }

        // -------------------------------------------------------------
        // Buscar os meta dados da versão atual
        // -------------------------------------------------------------
        function doUpdateGetMetadata() {
            appServices.verbose("doUpdateGetMetadata-Init", 1);

            try {
                deploy.getMetadata().then(
                    // Success
                    function(metadata) {
                        appServices.verbose("doUpdateGetMetadata Success [" + JSON.stringify(metadata) + "]", 1);

                        // Adicionar os meta dados para as informações do Deploy
                        $global.appDeployMetadata = metadata;

                        appServices.verbose("$global.appDeployMetadata=[" + JSON.stringify($global.appDeployMetadata) + "]", 1);

                        // Excluir as versões anterior no aparelho para aumentar espaço livre
                        doDeleteOldVersions();
                    },
                    // Error
                    function(error) {
                        appServices.verbose("doUpdateGetMetadata Error [" + error + "]", 1);
                    });
            } catch (error) {
                appServices.verbose("doUpdateGetMetadata Error [" + error + "]", 1);

                // Apresentar uma mensagem de erro no processo de verificação de atualizações
                uiServices.showPopupAlert(
                    C_APP_MENSAGENS.infoAtualizacoVersao,
                    JSON.stringify(error));
            }

            appServices.verbose("doUpdateGetMetadata-Fim", 1);
        }

        // -------------------------------------------------------------
        // Excluir as versões anterior no aparelho para aumentar espaço livre
        // -------------------------------------------------------------
        function doDeleteOldVersions() {
            appServices.verbose("doDeleteOldVersions-Init|$global.appDeployInfo=" + JSON.stringify($global.appDeployInfo), 1);

            // Verificar se o deploy_uuid está vazio
            if (($global.appDeployInfo == undefined) ||
                ($global.appDeployInfo.deploy_uuid == undefined) ||
                ($global.appDeployInfo.deploy_uuid == "") ||
                ($global.appDeployInfo.deploy_uuid == "NO_DEPLOY_AVAILABLE")) {

                // Continua sem excluir nenhuma versão (não temos o uuid da versão atual, então não exclua nenhuma)
                return;
            }

            try {
                // Excluir todas as versões instaladas no aparelho (para liberar espaço)
                deploy.getVersions().then(
                    function(versions) {
                        appServices.verbose("doDeleteOldVersions Success [" + JSON.stringify(versions) + "]", 1);

                        versions.forEach(function(element) {
                            // Verificar se não é a última versão instalada no aparelho
                            // Não queremos excluí-la se vai dar problema na atualização na nova versão
                            if (element != $global.appDeployInfo.deploy_uuid) {
                                appServices.verbose("doDeleteOldVersions About To Delete [" + element + "]", 1);

                                // Excluir a versão que está no cache
                                deploy.deleteVersion(element).then(
                                    // Success
                                    function(success) {
                                        appServices.verbose("doDeleteOldVersions Version deleted [" + element + "] Success [" + success + "]", 1);
                                    },
                                    // Error
                                    function(error) {
                                        appServices.verbose("doDeleteOldVersions Unable to delete version [" + element + "] Error [" + error + "]", 1);

                                        // Apresentar a mensagem de erro
                                        uiServices.showPopupAlert(
                                            C_APP_MENSAGENS.infoAtualizacoVersao,
                                            JSON.stringify(error));
                                    });
                            }
                        });
                    });
            } catch (error) {
                appServices.verbose("doDeleteOldVersions Error [" + error + "]", 1);

                // Apresentar uma mensagem de erro no processo de verificação de atualizações
                uiServices.showPopupAlert(
                    C_APP_MENSAGENS.infoAtualizacoVersao,
                    JSON.stringify(error));
            }

            appServices.verbose("doDeleteOldVersions-Fim", 1);
        }

        function signupEmail(){
            var username = $scope.data.username;
            var email = $scope.data.email;
            var password = $scope.data.password;

            if (username.length < 4) {
              alert('Please enter an username.');
              return;
            }

            if (email.length < 4) {
              alert('Please enter an email address.');
              return;
            }
            if (password.length < 4) {
              alert('Please enter a password.');
              return;
            }
            // Sign in with email and pass.
            // [START createwithemail]
            firebase.auth().createUserWithEmailAndPassword(email, password)
              .then(function(userData) {
                  var user = firebase.auth().currentUser;
                  user.updateProfile({
                      displayName: username
                  }).then(function() {
                      // Update successful.
                  }, function(error) {
                      // An error happened.
                  });
                  alert('Conta Criada. Confira sua caixa de entrada para ativacao da conta.');
                  console.log("Successfully created user account with uid:", userData.uid);
                  $state.go("app.signin");
              })
              .catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // [START_EXCLUDE]
                if (errorCode == 'auth/weak-password') {
                  alert('The password is too weak.');
                } else {
                  alert(errorMessage);
                }
                console.log("Error creating user:", error);
              // [END_EXCLUDE]
            });
            // [END createwithemail]
        };

        // -------------------------------------------------------------
        // Realiza o login do usuario
        //
        // Parâmetros de entrada:
        //      $scope.data.email - matricula do usuário
        //      $scope.data.senha - senha do usuário
        // -------------------------------------------------------------
        function doLogin(){

            appServices.verbose('doLogin-Init|' + $scope.data.email + '|' + $scope.data.password, 4);

            // Verificar se temos matricula
            if (($scope.data.email == undefined) ||
                ($scope.data.email == '')) {
                uiServices.showPopupAlert("Login", C_APP_MENSAGENS.erroMatriculaVazia);
                return;
            }

            // Verificar se temos senha
            if (($scope.data.password == undefined) ||
                ($scope.data.password == '')) {
                uiServices.showPopupAlert("Login", C_APP_MENSAGENS.erroSenhaVazia);
                return;
            }

            // Apresentar a mensagem "Carregando..."
            uiServices.showLoading();

            firebase.auth().signInWithEmailAndPassword($scope.data.email, $scope.data.password)
                .then(function(userData){
                  appServices.verbose('doLogin-Sucesso', 4);

                  // User is signed in.
                  $rootScope.usuario.nome = userData.displayName;
                  $rootScope.usuario.email = userData.email;
                  $rootScope.usuario.senha = $rootScope.loginData.senha;
                  $rootScope.usuario.emailVerified = userData.emailVerified;
                  $rootScope.usuario.photoURL = userData.photoURL;
                  $rootScope.usuario.isAnonymous = userData.isAnonymous;
                  $rootScope.usuario.uid = userData.uid;
                  $rootScope.usuario.dados = userData.providerData;
                  $rootScope.usuario.provider = 'email';
                  $rootScope.usuario.avatarURI = appServices.showAvatar();

                  // Salvar os dados do usuário localmente
                  utilsServices.setStorage(C_STORAGE.usuario, $rootScope.usuario);

                  // Preparar os paramêtros para ir para a tela de Alta Performance
                  var stateParams = {
                      openSideMenu: false, // Sinalizar que queremos o sidemenu aberto
                  };

                  // Esconder a mensagen "carregando..."
                  uiServices.hideLoading({
                      forcarFechamento: true
                  });

                  // Desabilitar o botão voltar para voltar para essa tela
                  $ionicHistory.nextViewOptions({
                      disableBack: true
                  });

                  $state.go("app.map", stateParams);

                })
                .catch(function(error){
                  appServices.verbose('doLogin-Erro', 4);

                  // Esconder a mensagen "carregando..."
                  uiServices.hideLoading({ forcarFechamento: true });

                  // Esconder a mensagen "carregando..."
                  uiServices.hideLoading({
                      forcarFechamento: true
                  });
                  // Handle Errors here.
                  var errorCode = error.code;
                  var errorMessage = error.message;
                  if (errorCode === 'auth/wrong-password') {
                    uiServices.showPopupAlert("Login", 'Senha Inválida.');
                  } else if (errorCode === 'auth/network-request-failed') {
                    uiServices.showPopupAlert("Login", "Não foi possivel conectar ao servidor. Verifique sua conexão de Internet, ou tente novamente mais tarde.");
                  } else {
                    uiServices.showPopupAlert("Login", errorMessage);
                  }
                  console.log(error);
                });
        };


        // LOGIN WITH GOOGLE (POPUP)
        // Apps connected to your account:
        // https://security.google.com/settings/security/permissions?pli=1
        function loginWithGoogle(){

            var provider = new firebase.auth.GoogleAuthProvider();
            //firebase.auth().signInWithRedirect(provider).then(function(result) {
            firebase.auth().signInWithPopup(provider)
            .then(function(result) {
                //alert('User is logged in with Google');
               // This gives you a Google Access Token. You can use it to access the Google API.
                console.log('Token',result.credential.accessToken);
                var token = result.credential.accessToken;
                // The signed-in user info.
                console.log('User',result.user);
                var user = result.user;

                // User is signed in.
                $rootScope.usuario.nome = user.displayName;
                $rootScope.usuario.email = user.email;
                $rootScope.usuario.senha = $rootScope.loginData.senha;
                $rootScope.usuario.emailVerified = user.emailVerified;
                $rootScope.usuario.photoURL = user.photoURL;
                $rootScope.usuario.isAnonymous = user.isAnonymous;
                $rootScope.usuario.uid = user.uid;
                $rootScope.usuario.dados = user.providerData;
                $rootScope.usuario.provider = 'google';
                $rootScope.usuario.avatarURI = appServices.showAvatar();
                $rootScope.usuario.token = token;

                // Salvar os dados do usuário localmente
                utilsServices.setStorage(C_STORAGE.usuario, $rootScope.usuario);

                // Preparar os paramêtros para ir para a tela de Alta Performance
                var stateParams = {
                    openSideMenu: false, // Sinalizar que queremos o sidemenu aberto
                };

                // Desabilitar o botão voltar para voltar para essa tela
                $ionicHistory.nextViewOptions({
                    disableBack: true
                });

                $state.go("app.map", stateParams);

            }).catch(function(error) {
                console.log('Authentification failed with',error);
            });
        }

        function loginWithFacebook(){
            var provider = new firebase.auth.FacebookAuthProvider();
            // [END createprovider]
            // [START addscopes]
            provider.addScope('user_birthday');
            // [END addscopes]
            // [START signin]

            firebase.auth().getRedirectResult()
            .then(function(result) {

            //firebase.auth().signInWithPopup(provider)
            //.then(function(result) {
              //alert('User is logged in with Facebook');
              // This gives you a Facebook Access Token. You can use it to access the Facebook API.
              console.log('Token',result.credential.accessToken);
              var token = result.credential.accessToken;

              // The signed-in user info.
              console.log('User',result.user);
              var user = result.user;

              // User is signed in.
              $rootScope.usuario.nome = user.displayName;
              $rootScope.usuario.email = user.email;
              $rootScope.usuario.senha = $rootScope.loginData.senha;
              $rootScope.usuario.emailVerified = user.emailVerified;
              $rootScope.usuario.photoURL = user.photoURL;
              $rootScope.usuario.isAnonymous = user.isAnonymous;
              $rootScope.usuario.uid = user.uid;
              $rootScope.usuario.dados = user.providerData;
              $rootScope.usuario.provider = 'facebook';
              $rootScope.usuario.avatarURI = appServices.showAvatar();
              $rootScope.usuario.token = token;

              // Salvar os dados do usuário localmente
              utilsServices.setStorage(C_STORAGE.usuario, $rootScope.usuario);

              // Preparar os paramêtros para ir para a tela de Alta Performance
              var stateParams = {
                  openSideMenu: false, // Sinalizar que queremos o sidemenu aberto
              };

              // Desabilitar o botão voltar para voltar para essa tela
              $ionicHistory.nextViewOptions({
                  disableBack: true
              });

              $state.go("app.map", stateParams);


            }).catch(function(error) {
              // Handle Errors here.
              var errorCode = error.code;
              var errorMessage = error.message;
              // The email of the user's account used.
              var email = error.email;
              // The firebase.auth.AuthCredential type that was used.
              var credential = error.credential;
              // [START_EXCLUDE]
              if (errorCode === 'auth/account-exists-with-different-credential') {
                alert('You have already signed up with a different auth provider for that email.');
                // If you are using multiple auth providers on your app you should handle linking
                // the user's accounts here.
              } else {
                console.error(error);
              }
              // [END_EXCLUDE]
            });

            // [START signin]
            firebase.auth().signInWithRedirect(provider);
            // [END signin]
        }

        /**
         * Sends an email verification to the user.
         */
        function sendEmailVerification() {
          // [START sendemailverification]
          firebase.auth().currentUser.sendEmailVerification().then(function() {
            // Email Verification sent!
            // [START_EXCLUDE]
            alert('Email Verification Sent!');
            // [END_EXCLUDE]
          });
          // [END sendemailverification]
        }

        function sendPasswordReset() {
          var email = document.getElementById('email').value;
          // [START sendpasswordemail]
          firebase.auth().sendPasswordResetEmail(email).then(function() {
            // Password Reset Email Sent!
            // [START_EXCLUDE]
            alert('Password Reset Email Sent!');
            // [END_EXCLUDE]
          }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // [START_EXCLUDE]
            if (errorCode == 'auth/invalid-email') {
              alert(errorMessage);
            } else if (errorCode == 'auth/user-not-found') {
              alert(errorMessage);
            }
            console.log(error);
            // [END_EXCLUDE]
          });
          // [END sendpasswordemail];
        }

        appServices.verbose('========== LoginController-Fim', 2);

    }
})();
