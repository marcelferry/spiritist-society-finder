// ---------------------------------------------------------------------------------------------------
// Adicionar constantes globais para 'app.core'
// ---------------------------------------------------------------------------------------------------
(function () {
    'use strict';

    angular
        .module('app.core')

        .constant('C_TIPO_AMBIENTE', {
            desenvolvimento: 1,     // Ambiente de desenvolvimento (uso exclusivo pela equipe Késsem/TI)
            teste: 2,               // Ambiente de TESTE do Cliente (uso exclusivo pelo Cliente)
            homologacao: 3,         // Ambiente de HOMOLOGAÇÃO (uso exclusivo pelo Cliente)
            producao: 4             // Ambiente de PRODUÇÃO (uso exclusivo pelo Cliente)
        })

        .constant('C_URL_SERVIDOR', {
            ambienteProducao: "http://guiaespirita.mythe.com.br/",
            ambienteHomologacao: "http://guiaespirita.mythe.com.br/",
            ambienteTeste: "http://guiaespirita.mythe.com.br/",
            ambienteDesenvolvimento: "http://guiaespirita.mythe.com.br/",
            login: "validate_usuario.php",
            config: "get_config.php",
            comercial: "get_dados_comercial.php",
            comercial2: "get_farol_comercial2.php",
            notificacoesNaoExcluidas: "get_todas_notificacoes_nao_excluidas.php",
            notificacoesExcluidas: "get_todas_notificacoes_excluidas.php",
            notificacoesNaoLidas: "get_qtd_notificacoes_nao_lidas.php",
            notificacoesMarcarComoLida: "mark_as_read_notificacao.php",
            notificacoesMarcarComoNaoLida: "mark_as_not_read_notificacao.php",
            notificacoesAtualizarAvaliacao: "update_avaliacao_notificacao.php",
            notificacoesExcluirUma: "delete_uma_notificacao.php",
            notificacoesListaMarcarLidas: "mark_list_as_read_notificacoes.php",
            notificacoesListaMarcarNaoLidas: "mark_list_as_not_read_notificacoes.php",
            notificacoesListaExcluir: "delete_list_notificacoes.php",
            notificacoesListaRecuperar: "recover_list_notificacoes.php",
            notificacoesListaExcluirPermanentemente: "delete_permanent_list_notificacoes.php"
        })

        .constant('C_FAROL', {
            azul: 1,
            verde: 2,
            amarelo: 3,
            vermelho: 4,
            cinza: 5
        })

        .constant('C_APP_MENSAGENS', {
            // Erros
            erroConectarInternet: "Parece que não está conectado a Internet (WiFi/3G/4G). Favor tentar novamente. Caso persiste, favor contatar a Produção.",
            erroMatriculaVazia: "Favor preencher uma matricula",
            erroSenhaVazia: "Favor preencher uma senha",
            erroAtualizacoesNaoInstaladas: "Atualização não foi instalada com sucesso. Favor tentar novamente. Caso persiste, favor contatar a Produção",
            erroVerificandoAtualizacoes: "Erro verificando atualização. Nenhuma atualização será instalada. Favor tentar novamente. Caso persiste, favor contatar a Produção",
            erroAtualizacaoAutomatica: "Erro na atualização automática. Nenhuma atualização será instalada. Favor tentar novamente. Caso persiste, favor contatar a Produção",
            erroAtualizacaoManual: "Erro na atualização manual. Nenhuma atualização será instalada. Favor tentar novamente. Caso persiste, favor contatar a Produção",
            erroImagemGaleria: "Por favor verifique a origem da imagem!",
            erroCompartilhar: "Não foi possível compartilhar esse conteúdo!",
            erro: "Erro",

            // Informações
            infoInstalandoAtualizacao: "Instalando atualização...",
            infoAplicacaoOffline: "Estamos atualizando as informações.",
            infoAplicacaoOfflineData: "Estamos atualizando as informações, voltaremos às ",
            infoAtualizacoVersao: "Atualização de Versão"
        })

        .constant('C_STORAGE', {
            usuario: 'USUARIO',
            comercial: 'COMERCIAL',
            ambiente: 'AMBIENTE'
        })

        .constant('C_RETURN_CODE', {
            RES_SUCESSO: 0,
            RES_CAMPO_OBRIGATORIO_NAO_ENCONTRADO: 1,
            RES_USUARIO_NAO_ENCONTRADO: 2,
            RES_ERRO_GENERICO: 3,
            RES_ERRO_INSERINDO_CONSULTA_HISTORICO: 4,
            RES_USUARIO_NAO_VALIDADO: 5,
            RES_DADOS_NAO_ENCONTRADOS: 6,
            RES_PRODUTOS_NAO_ENCONTRADOS: 7,
            RES_CARTEIRA_PADRAO_NAO_ENCONTRADA: 8,
            RES_REGISTROS_NAO_ENCONTRADOS: 9,
            RES_ETAPA_CARGA_INVALIDA: 10,
            RES_ID_CARGA_INVALIDO: 11,
            RES_ERRO_INSERINDO_LOG_CARGA: 12,
            RES_NOME_TABELA_CARGA_INVALIDO: 13,
            RES_DADOS_CARGA_INVALIDOS: 14,
            RES_ERRO_CONECTANDO_AO_BANCO: 15,
            RES_CARGA_NAO_INICIADA: 16,
            RES_CARGA_COM_ERRO: 17,
            RES_ERRO_BANCO_DE_DADOS: 18
        })
})();
