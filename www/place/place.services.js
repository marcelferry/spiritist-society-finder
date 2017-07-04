// ---------------------------------------------------------------------------------------------------
// Adicionar serviços para o 'app.placarMetas'
// ---------------------------------------------------------------------------------------------------
(function () {
    'use strict';

    angular
        .module('starter')
        .factory('PlaceServices', PlaceServices);

    PlaceServices.$inject = [
        'utilsServices',
        'appServices',

        'C_DIRECAO',

        '$rootScope',
        '$filter'
    ];

    function PlaceServices(
        utilsServices,
        appServices,

        C_DIRECAO,

        $rootScope,
        $filter) {

        // Retorno do serviço
        var service = {
            orderListaInformacoes: orderListaInformacoes,
            getTituloJanela: getTituloJanela,
            isTotalizador: isTotalizador
        };

        return service;

        // -------------------------------------------------------------
        // Ordenar a lista de produtos/comerciais/corretores (clique em qualquer campo do cabeçalho)
        //
        // Parâmetros de entrada:
        // @param {objeto} - parametros
        //      {string} predicateAtual - nome da coluna que a lista é ordenada atualmente
        //      {string} predicateNovo - nome da coluna que a lista deverá ser ordenada
        //      {integer} direcaoPadrao - a direção padrão, caso necessário usar (C_DIRECAO)
        //      {objeto} listaInformacoes - a lista das informacoes para ordenar
        //
        // Retorno:
        // {string} predicateNovo - o novo predicate
        // {integer} direcaoNova - a nova direção (C_DIRECAO)
        // {objeto} listaInformacoes - a lista das informações ordenada
        // -------------------------------------------------------------
        function orderListaInformacoes(parametros) {
            //appServices.verbose('orderListaInformacoes|parametros=' + JSON.stringify(parametros).substr(0, 100), 4);

            var retorno = {};

            // Verificar se clicamos no mesmo campo (nesse caso teremos que inverter a ordem da lista)
            if (parametros.predicateAtual == parametros.predicateNovo) {
                retorno.direcaoNova = utilsServices.reverseDirecao(parametros.direcaoAtual, C_DIRECAO.forward);
            } else {
                // Qaundo usuário clica no campo que não é o campo atualmente ordenado,
                // temos que usamos a ordenação padrão
                retorno.direcaoNova = parametros.direcaoPadrao;
            }

            // Guardar a informação sobre o campo atualmente ordenado
            retorno.predicateNovo = parametros.predicateNovo;

            // Ordenar as linhas conforme o novo campo e ordem
            retorno.listaInformacoes = $filter('orderBy')(
                // Lista a ser odenada
                parametros.listaInformacoes,

                // Campo para ordenar
                parametros.predicateNovo,

                // 'true' se precisamos inverter a ordem da lista
                retorno.direcaoNova == C_DIRECAO.reverse);

            return retorno;
        }

        // -------------------------------------------------------------
        // Devolver o título da janela de placar de metas
        //
        // Parâmetros de entrada:
        // @param {objeto} - parâmetros
        //      {integer} tipoPlacarMetas - tipo do placar de metas (C_TIPO_PLACAR_METAS)
        //      {integer} ordemProduto - ordem do produto selecionado (caso tipo != produtos)
        // -------------------------------------------------------------
        function getTituloJanela(parametros) {
            //appServices.verbose('getTituloJanela|parametros=' + JSON.stringify(parametros), 4);

            var retorno = "";

            if (parametros.tipoPlacarMetas == C_TIPO_PLACAR_METAS.produto) {
                retorno = "Alta Performance";
            } else {
                var produto = appServices.getProdutoByOrdem(parametros.ordemProduto);

                if (produto != undefined) {
                    retorno = produto.nome;
                } else {
                    retorno = "Produto Inexistente";
                    appServices.verbose('ERRO: setTituloJanela: produto não encontrado', 4);
                }
            }

            //appServices.verbose('getTituloJanela|retorno=' + retorno, 4);

            return retorno;
        }

        // -------------------------------------------------------------
        // Devolver o título da janela de placar de metas
        //
        // Parâmetros de entrada:
        // @param {objeto} - parâmetros
        //        {objeto} produtos - produtos
        //
        // Retorno:
        // {boolean} possuiTotalizador - verifica se tem um totalizador na lista de produtos
        // -------------------------------------------------------------
        function isTotalizador(paramentros) {
            var retorno = false;

            angular.forEach(paramentros, function (value, key) {
                if (value.totflg == true) {
                    retorno = true;
                }
            });

            return retorno;
        }
    }
})();
