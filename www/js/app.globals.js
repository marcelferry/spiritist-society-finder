// ---------------------------------------------------------------------------------------------------
// Adicionar variáveis globais para o 'app.core'  
// ---------------------------------------------------------------------------------------------------
(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('$global', $global);

    $global.$inject = [
        'C_TIPO_AMBIENTE'
    ];

    function $global(
        C_TIPO_AMBIENTE) {

        // As variáveis globais
        return {
            // O ambiente atual (producao, homologacao, teste ou desenvolvimento)
            ambiente: C_TIPO_AMBIENTE.producao,

            // TRUE quando precisamos mudar de ambiente para entrar com esse novo ambiente
            mudarAmbiente: false,

            // Informações sobre o device
            device: {},

            // Desabilitamos o "camelcase", já que o nome dos variáveis vem do Ionic.Io
            /* eslint-disable camelcase */
            // Informações sobre o deploy atual instalado no aparelho
            appDeployInfo: {
                deploy_uuid: "",
                binary_version: ""
            },
            /* eslint-enable camelcase */

            // Informações sobre os meta dados do deploy atual instalado no aparelho
            appDeployMetadata: {
                versao: "" // Versão do Deploy com possível build. Exemplo: 1.2.3-4 (versão 1.2.3, build 4)
            }
        }
    }
})();