// ---------------------------------------------------------------------------------------------------
// Constantes globais do 'core.utils'
// ---------------------------------------------------------------------------------------------------
(function () {
    'use strict';

    angular
        .module('core.utils')

        .constant('C_ORDEM', {
            crescente: 1,
            decrescente: 2
        })

        .constant('C_DIRECAO', {
            reverse: 1,
            forward: 0
        })

        .constant('C_MENSAGENS', {
            carregando: 'Carregando...',
            atualizandoApp: 'Baixando atualização...',
            popupInfo: 'Informação',
            popupAlert: 'Alerta'
        })        
})();