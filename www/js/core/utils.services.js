// ---------------------------------------------------------------------------------------------------
// Factory do módulo 'core.utils'
// ---------------------------------------------------------------------------------------------------
(function () {
    'use strict';

    angular
        .module('core.utils')
        .factory('utilsServices', utilsServices);

    utilsServices.$inject = [
        'C_ORDEM',
        'C_DIRECAO',
        'C_MENSAGENS',

        '$rootScope',

        '$ionicLoading',
        '$ionicPopup',
        '$window'
    ];

    function utilsServices(
        C_ORDEM,
        C_DIRECAO,
        C_MENSAGENS,

        $rootScope,

        $ionicLoading,
        $ionicPopup,
        $window) {

        // Retorno do serviço
        var service = {
            reverseOrdem: reverseOrdem,
            reverseDirecao: reverseDirecao,
            isDirecaoReverse: isDirecaoReverse,
            setStorage: setStorage,
            getStorage: getStorage,
            notEmpty: notEmpty,
            htmlEntities: htmlEntities
        };

        return service;

        // ---------------------------------------------------------------------------------------------------
        //@desenvolvedor Internet
        //@descricao Função para encoding de string para html
        //@data 03/04/2016
        //@param str
        // ---------------------------------------------------------------------------------------------------

        function htmlEntities(str) {
            return String(str)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;');
        }

        // ---------------------------------------------------------------------------------------------------
        //@desenvolvedor Frente Mobile Produção Porto
        //@descricao Função para inverter a ordem
        //@data 12/01/2016
        //@param function
        //@param function
        // ---------------------------------------------------------------------------------------------------
        function reverseOrdem(ordem, padrao) {
            if (ordem == C_ORDEM.decrescente) {
                return C_ORDEM.crescente;
            }

            if (ordem == C_ORDEM.crescente) {
                return C_ORDEM.decrescente;
            }

            return padrao;
        }

        // ---------------------------------------------------------------------------------------------------
        //@desenvolvedor Frente Mobile Produção Porto
        //@descricao Função para inverter a ordem
        //@data 12/01/2016
        //@param function
        //@param function
        // ---------------------------------------------------------------------------------------------------
        function reverseDirecao(direcao, padrao) {
            if (direcao == C_DIRECAO.reverse) {
                return C_DIRECAO.forward;
            }

            if (direcao == C_DIRECAO.forward) {
                return C_DIRECAO.reverse;
            }

            return padrao;
        }

        // ---------------------------------------------------------------------------------------------------
        //@desenvolvedor Frente Mobile Produção Porto
        //@descricao Função para devolver TRUE se a direção é reversa
        //@data 17/01/2016
        //@param function
        //@param function
        // ---------------------------------------------------------------------------------------------------
        function isDirecaoReverse(direcao) {
            return (direcao == C_DIRECAO.reverse);
        }

        // ---------------------------------------------------------------------------------------------------
        //@desenvolvedor Frente Mobile
        //@descricao Função para guardar um valor no local storage
        //@param {C_STORAGE} chave - chave do Local Storage para salvar
        //@param {object} valor - valor do objeto a ser salvo (em formato JSON)
        // ---------------------------------------------------------------------------------------------------
        function setStorage(chave, valor) {
            try {
                $window.localStorage[chave] = JSON.stringify(valor);
            } catch (error) {
                console.log("setStorage: Erro [" + error + "] [" + chave + "] [" + valor + "]", 1);
            }
        }

        // ---------------------------------------------------------------------------------------------------
        //@desenvolvedor Frente Mobile
        //@descricao Função para buscar um valor no local storage (sempre no formato JSON)
        //@param {C_STORAGE} chave - chave do Local Storage para buscar
        //@param {object} padrao - valor padrao para devolver caso não achamos a chave
        // ---------------------------------------------------------------------------------------------------
        function getStorage(chave, padrao) {
            var retorno = padrao;

            try {
                retorno = JSON.parse($window.localStorage[chave]);
            } catch (error) {
                console.log("getStorage: Erro [" + error + "] [" + chave + "]", 1);
            }

            return retorno;
        }

        // ---------------------------------------------------------------------------------------------------
        //@desenvolvedor Frente Mobile
        //@descricao Função para devoler um valor ou um padrão caso o valor é vazio/undefined
        //@param {object} valor - o valor a ser devolvido
        //@param {object} padrao - o valor padrão a ser devolvido caso o "valor" é vazio/undefined
        // ---------------------------------------------------------------------------------------------------
        function notEmpty(valor, padrao) {
            // Verificar se o valor não está definido, ou está vazio
            if ((valor == undefined) || (valor == "")) {
                return padrao;
            }

            return valor;
        }
    }
})();
