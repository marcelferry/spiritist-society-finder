// ---------------------------------------------------------------------------------------------------
// Adicionar serviços para o 'app.core'
// ---------------------------------------------------------------------------------------------------
(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('appServices', appServices);

    appServices.$inject = [
        'utilsServices',

        'C_TIPO_AMBIENTE',
        'C_FAROL',
        'C_DIRECAO',
        'C_APP_MENSAGENS',
        'C_STORAGE',
        'C_URL_SERVIDOR',

        '$global',
        '$rootScope',
        '$window',
        '$filter',
        '$state',

        '$ionicSideMenuDelegate'
    ];

    function appServices(
        utilsServices,

        C_TIPO_AMBIENTE,
        C_FAROL,
        C_DIRECAO,
        C_APP_MENSAGENS,
        C_STORAGE,
        C_URL_SERVIDOR,

        $global,
        $rootScope,
        $window,
        $filter,
        $state,

        $ionicSideMenuDelegate) {

        // Retorno do serviço
        var service = {
            verbose: verbose,
            getProdutoByOrdem: getProdutoByOrdem,
            getPeriodos: getPeriodos,
            getProdutos: getProdutos,
            formatPercentualAtingimento: formatPercentualAtingimento,
            formatPosicaoRanking: formatPosicaoRanking,
            getPeriodoByCodigo: getPeriodoByCodigo,
            getNomePeriodoByCodigo: getNomePeriodoByCodigo,
            getNomeProdutoByOrdem: getNomeProdutoByOrdem,
            showAvatar: showAvatar,
            getStorageUsuario: getStorageUsuario,
            logoff: logoff,
            getNomeAmbiente: getNomeAmbiente
        };

        return service;

        // ---------------------------------------------------------------------------------------------------
        //@desenvolvedor Frente Mobile
        //@descricao Função para escrever para o console (caso estamos em modo DEBUG)
        //@param {string} mensagem - mensagem a ser apresentada no console
        // ---------------------------------------------------------------------------------------------------
        function verbose(mensagem, nivel) {
            // Verificar se não estamos em produção
            if (($global.ambiente != C_TIPO_AMBIENTE.producao) && (nivel >= 0)) {
                console.log(mensagem);
            }
        }

        // -------------------------------------------------------------
        // Buscar o produto pelo seu código (Ordem Produto = Código do Produto)
        // -------------------------------------------------------------
        function getProdutoByOrdem(ordemProduto) {
            var produto = undefined;

            try {
                angular.forEach(
                    $rootScope.comercial.listaProdutos,

                    /* eslint-disable no-unused-vars */
                    function (value, key) {
                        // Verificar se achamos o produto
                        if (value.ordem == ordemProduto) {
                            // Apontar para o produto escolhido
                            produto = value;
                        }
                    });
                    /* eslint-enable no-unused-vars */
            } catch (error) {
            }

            verbose('getProdutoByOrdem|produto=' + JSON.stringify(produto));

            return produto;
        }

        // -------------------------------------------------------------
        // Extrair a lista de períodos a partir dos dados do Comercial
        // -------------------------------------------------------------
        function getPeriodos(comercial) {
            verbose('getPeriodos-Init');

            // Criar a lista de periodos do placar de metas
            var periodos = [];

            try {
                angular.forEach(
                    comercial.dados.periodos,

                    function (value) {
                        var ordem = 0;

                        // Definir a ordem que os períodos aparecem na lista
                        switch (value.pedcod) {
                            case C_TIPO_PERIODO.mesAtual:
                                ordem = 1;
                                break;

                            case C_TIPO_PERIODO.acumuladoIncluindoMesAtual:
                                ordem = 2;
                                break;

                            case C_TIPO_PERIODO.acumuladoAteUltimoMes:
                                ordem = 3;
                                break;
                        }

                        periodos.push({
                            codigo: value.pedcod,
                            descricao: value.peddes,
                            ordem: ordem
                        });
                    });
            } catch (error) {
            }

            return periodos;
        }

        // -------------------------------------------------------------
        // Extrair a lista de produtos a partir dos dados do Comercial
        // -------------------------------------------------------------
        function getProdutos(comercial) {
            verbose('getProdutos-Init');

            // Criar a lista de periodos do placar de metas
            var produtos = [];

            try {
                // Para cada uma dos produtos no primeiro período (considerando que o primeiro período tem todos
                // os produtos que o comercial pode ver no placar de metas)
                angular.forEach(
                    comercial.dados.periodos[0].produtos,

                    function (value) {
                        produtos.push({
                            ordem: value.proord,
                            nome: value.pronom
                        });
                    });
            } catch (error) {
            }

            return produtos;
        }

        // -------------------------------------------------------------
        // Formatar o percentual de atingimento
        // -------------------------------------------------------------
        function formatPercentualAtingimento(percentualAtingimento) {
            return $filter('number')(percentualAtingimento, 0) + '%';
        }

        // -------------------------------------------------------------
        // Formatar a posição do ranking
        // -------------------------------------------------------------
        function formatPosicaoRanking(posicaoRanking) {
            return (posicaoRanking == 0) ? '- -' : posicaoRanking + "º";
        }

        // ---------------------------------------------------------------------------------------------------
        //@desenvolvedor Frente Mobile
        //@descricao Função para devolver o período atual conforme o código
        //@param {integer} codigoPeriodo - código do período para buscar
        // ---------------------------------------------------------------------------------------------------
        function getPeriodoByCodigo(codigoPeriodo) {
            var retorno = undefined;

            // Para cada período do comercial atual
            angular.forEach(
                // 1o parâmetro do "forEach"
                $rootScope.comercial.dados.periodos,

                /* eslint-disable no-unused-vars */
                // 2o parâmetro do "forEach"
                function (value, key) {
                    // Verificar se achamos o período desejado
                    if (value.pedcod == codigoPeriodo) {
                        // Guardar os produtos do período selecionado
                        retorno = value;
                    }
                });
                /* eslint-enable no-unused-vars */

            return retorno;
        }

        // ---------------------------------------------------------------------------------------------------
        //@desenvolvedor Frente Mobile
        //@descricao Função para devolver o nome do período atual conforme o código
        //@param {integer} codigoPeriodo - código do período para buscar
        // ---------------------------------------------------------------------------------------------------
        function getNomePeriodoByCodigo(codigoPeriodo) {
            // Buscar o período pelo código
            var periodo = getPeriodoByCodigo(codigoPeriodo);

            // Devolver o nome do período
            return (periodo == undefined) ? '' : periodo.peddes;
        }

        // ---------------------------------------------------------------------------------------------------
        //@desenvolvedor Frente Mobile
        //@descricao Função para devolver o nome do período atual conforme o código
        //@param {integer} codigoPeriodo - código do período para buscar
        // ---------------------------------------------------------------------------------------------------
        function getNomeProdutoByOrdem(ordemProduto) {
            // Buscar o período pelo código
            var produto = getProdutoByOrdem(ordemProduto);

            // Devolver o nome do produto
            return (produto == undefined) ? '' : produto.nome;
        }

        // ---------------------------------------------------------------------------------------------------
        //@desenvolvedor Frente Mobile
        //@descricao Função para verificar se o usuário tem um Avatar e caso positivo mostrá-lo
        // ---------------------------------------------------------------------------------------------------
        function showAvatar() {
            verbose("showAvatar-Init", 4);

            var retorno = undefined;

            // Garantimos que não há informações antigas
            $rootScope.usuario.avatarStyle = undefined;
            $rootScope.usuario.avatarURI = undefined;

            try {
                var usuario = utilsServices.getStorage(C_STORAGE.usuario, undefined);

                if (($rootScope.usuario.photoURL != undefined)) {
                    $rootScope.usuario.avatarStyle = "background-image:url('" + $rootScope.usuario.photoURL + "')!important";
                    $rootScope.usuario.avatarURI = $rootScope.usuario.photoURL; // Colocar nos dados do usuario
                    return usuario.avatarURI;
                }

                if ((usuario.avatarURI != undefined) &&
                     ($rootScope.usuario.email == usuario.email)) {
                    $rootScope.usuario.avatarStyle = "background-image:url('" + usuario.avatarURI + "')!important";
                    $rootScope.usuario.avatarURI = usuario.avatarURI; // Colocar nos dados do usuario
                }

                retorno = usuario.avatarURI;
            } catch (error) {
                verbose("Erro ao tentar pegar avatar do usuario na checagem do usuário: Informações do usuario inválidas " + error, 1);
            }

            return retorno;
        }

        // ---------------------------------------------------------------------------------------------------
        //@desenvolvedor Frente Mobile
        //@descricao Função para Ler as configuração salvas localmente dop usuário
        // ---------------------------------------------------------------------------------------------------
        function getStorageUsuario() {
            verbose('getStorageUsuario-Init', 4);

            // Verificar se temos no Storege os dados do usuário
            var usuario = utilsServices.getStorage(C_STORAGE.usuario, undefined);

            if (usuario != undefined) {
                try {
                    $rootScope.usuario = usuario;

                    // Verificar existe matricula e senha no Storage
                    if ($rootScope.usuario.email != undefined) {

                        // Recuperar somente a matricula do usuário (não recuperamos a senha)
                        $rootScope.loginData = {
                            matricula: $rootScope.usuario.email
                        }
                    }
                } catch (error) {
                    verbose("LOCAL_STORAGE: Dados não se referem a um usuário [" + error + "]", 4);
                }
            }
        }

        // -------------------------------------------------------------
        //@desenvolvedor Frente Mobile
        //@descricao Função para fazer logoff e ir para tela de Login
        // -------------------------------------------------------------
        function logoff() {

            // [START signout]
           firebase.auth().signOut();
           // [END signout]

            // Não permitir que usuário abre o sidemenu
            $ionicSideMenuDelegate.canDragContent(false);

            // Limpar os dados locais
            utilsServices.setStorage(C_STORAGE.comercial, undefined);

            // Voltar para a tela de Login
            $state.go('app.login');
        }

        // ---------------------------------------------------------------------------------------------------
        //@desenvolvedor Frente Mobile
        //@descricao Função para devolver o nome do ambiente
        //@param {C_TIPO_AMBIENTE} ambiente - o ambiente para devolver seu nome
        //@param {boolean} producaoSemTitulo - se TRUE e é ambiente produção, então devolve vazio
        // ---------------------------------------------------------------------------------------------------
        function getNomeAmbiente(options) {
            var retorno = "";

            // Verificar se temos o parâmetro "options"
            if (options) {
                // Definir o canal do Deploy conforme o ambiente
                switch (options.ambiente) {
                    // Ambiente de desenvolvimento (somente equipe TI)
                    case C_TIPO_AMBIENTE.desenvolvimento:
                        retorno = "Desenvolvimento"
                        break;

                    // Ambiente de teste do Cliente
                    case C_TIPO_AMBIENTE.teste:
                        retorno = "Teste"
                        break;

                    // Ambiente de homologação do Cliente
                    case C_TIPO_AMBIENTE.homologacao:
                        retorno = "Homologação"
                        break;

                    // Ambiente de produção
                    case C_TIPO_AMBIENTE.producao:
                        if (options.producaoSemTitulo == false) {
                            retorno = "Produção"
                        }

                        break;
                }
            }

            return retorno;
        }

        // -------------------------------------------------------------
        // Atualizar o nome do ambiente mais a versão dow binários e a versão do deploy.
        // -------------------------------------------------------------
        function updateNomeAmbienteMaisVersoes() {
            // Buscar o nome do ambiente
            var retorno = getNomeAmbiente({
                ambiente: $global.ambiente,
                producaoSemTitulo: true
            });

            // Verificar se o nome do ambiente não está vazio
            if (retorno != "") {
                retorno += " / ";
            }

            // Verificar se temos informações do Deploy atual
            if ($global.appDeployInfo) {
                // Adicionar a versão dos binários
                retorno += "V " + utilsServices.notEmpty($global.appDeployInfo.binary_version, "0.0.0");
            } else {
                retorno += "V 0.0.0";
            }

            // Verificar se temos os meta dados do Deploy
            if ($global.appDeployMetadata) {
                // Adicionar a versão do Ionic Deploy
                retorno += " / " + utilsServices.notEmpty($global.appDeployMetadata.versao, "0.0.0");
            } else {
                retorno += " / 0.0.0";
            }

            // Guardar o nome do ambiente mais versões num variável globla e atualizr o $rootScope para aparecer na tela
            $global.nomeAmbienteMaisVersoes = retorno;
            $rootScope.nomeAmbienteMaisVersoes = $global.nomeAmbienteMaisVersoes;

            verbose("updateNomeAmbienteMaisVersoes=" + retorno, 1);
        }
    }
})();
