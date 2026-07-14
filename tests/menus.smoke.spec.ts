/**
 * Smoke Test — Validação de disponibilidade de todas as telas do MultiTMS
 *
 * Navega via URL (#hash) para funcionar em qualquer ambiente,
 * independentemente do nome exibido no menu.
 *
 * Verifica: ausência de erros HTTP, ausência de loading infinito e
 * renderização básica da tela.
 *
 * Execução recomendada (read-only, pode usar workers paralelos):
 *   npx playwright test smoke.spec.ts --project=chromium --workers=4
 */

import { test, Page } from '@playwright/test';
import { login } from './helpers/login';

test.setTimeout(45000);

async function checarTela(page: Page, hash: string): Promise<void> {
  await page.goto(`${process.env.BASE_URL}/#${hash}`, { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(800);

  const body = await page.locator('body').innerText({ timeout: 15000 }).catch(() => '');

  const erroHttp = body.match(/Error requesting [^:]+:\s*(\d{3})/i);
  if (erroHttp) throw new Error(erroHttp[0]);

  if (/internal server error/i.test(body)) throw new Error('Internal Server Error');

  const loadingTexts = ['text=Processando, aguarde...', 'text=Carregando...'];
  for (const sel of loadingTexts) {
    if (await page.locator(sel).isVisible({ timeout: 400 }).catch(() => false)) {
      await page.waitForTimeout(8000);
      if (await page.locator(sel).isVisible({ timeout: 400 }).catch(() => false)) {
        throw new Error('Loading infinito detectado (ainda aguardando após 9s)');
      }
    }
  }
}

//#region Smoke - Home
test.describe('Smoke - Home', () => {
  test('Home / Dashboard', async ({ page }) => { await login(page); await checarTela(page, 'Home'); });
});
//#endregion

//#region Smoke - Gestão de Cargas
test.describe('Smoke - Gestão de Cargas', () => {

  test('Cargas', async ({ page }) => { await login(page); await checarTela(page, 'Cargas/Carga'); });
  test('Cancelamento', async ({ page }) => { await login(page); await checarTela(page, 'Cargas/CancelamentoCarga'); });
  test('Encerramento', async ({ page }) => { await login(page); await checarTela(page, 'Cargas/EncerramentoCarga'); });
  test('Agendar Entrega', async ({ page }) => { await login(page); await checarTela(page, 'Logistica/AgendamentoEntregaPedido'); });
  test('Gestão de Dados da Coleta', async ({ page }) => { await login(page); await checarTela(page, 'Cargas/GestaoDadosColeta'); });
  test('Acompanhamento Pedidos', async ({ page }) => { await login(page); await checarTela(page, 'Pedidos/AcompanhamentoPedido'); });
  test('Agrupar Cargas', async ({ page }) => { await login(page); await checarTela(page, 'Cargas/CargaAgrupada'); });
  test('Pedidos', async ({ page }) => { await login(page); await checarTela(page, 'Pedidos/Pedido'); });
  test('Carregamento', async ({ page }) => { await login(page); await checarTela(page, 'Cargas/MontagemCarga'); });
  test('Transbordo', async ({ page }) => { await login(page); await checarTela(page, 'Cargas/Transbordo'); });
  test('Importar Pedidos', async ({ page }) => { await login(page); await checarTela(page, 'Pedidos/ImportacaoPedido'); });
  test('Integração Evento', async ({ page }) => { await login(page); await checarTela(page, 'Cargas/CargaIntegracaoEvento'); });
  test('Integrações HUB de Ofertas', async ({ page }) => { await login(page); await checarTela(page, 'Integracoes/IntegracaoHUB'); });
  test('Monitor de Geração de Cargas Espelho', async ({ page }) => { await login(page); await checarTela(page, 'Cargas/MonitorGeracaoCargaEspelho'); });

  // ─── Gestão de Cargas / Configurações ────────────────────────────────────────
  test.describe('Configurações', () => {
    test('Dados da Carga (Automatização)', async ({ page }) => { await login(page); await checarTela(page, 'Cargas/TipoCargaModeloVeicularAutoConfig'); });
    test('Tipo de Cargas', async ({ page }) => { await login(page); await checarTela(page, 'Cargas/TipoCarga'); });
    test('Tipos de Operações', async ({ page }) => { await login(page); await checarTela(page, 'Pedidos/TipoOperacao'); });
    test('Produtos', async ({ page }) => { await login(page); await checarTela(page, 'Produtos/ProdutoEmbarcador'); });
    test('Regras Agrupamento Pedido', async ({ page }) => { await login(page); await checarTela(page, 'Cargas/RegrasAgrupamentoPedidos'); });
    test('Grupo de Produtos', async ({ page }) => { await login(page); await checarTela(page, 'Produtos/GrupoProduto'); });
    test('Marca do Produto', async ({ page }) => { await login(page); await checarTela(page, 'Produtos/MarcaProduto'); });
    test('Regra do Tomador', async ({ page }) => { await login(page); await checarTela(page, 'Pedidos/RegraTomador'); });
    test('Canal de Entrega', async ({ page }) => { await login(page); await checarTela(page, 'Pedidos/CanalEntrega'); });
    test('Procedimento de Embarque', async ({ page }) => { await login(page); await checarTela(page, 'Logistica/ProcedimentoEmbarque'); });
    test('Autorização de Pedido', async ({ page }) => { await login(page); await checarTela(page, 'Pedidos/AutorizacaoPedido'); });
    test('Tipo de Trecho', async ({ page }) => { await login(page); await checarTela(page, 'Cargas/TipoTrecho'); });
    test('Produtos Opentech', async ({ page }) => { await login(page); await checarTela(page, 'Produtos/ProdutoOpentech'); });
    test('Tipos de Embalagem', async ({ page }) => { await login(page); await checarTela(page, 'Produtos/TipoEmbalagem'); });
    test('Motivo de Reagendamento', async ({ page }) => { await login(page); await checarTela(page, 'Logistica/MotivoReagendamento'); });
    test('Moedas', async ({ page }) => { await login(page); await checarTela(page, 'Moedas/Moeda'); });
    test('Justificativa Cancelamento de Agendamento', async ({ page }) => { await login(page); await checarTela(page, 'Logistica/JustificativaCancelamentoAgendamento'); });
    test('Tipo de Lacre', async ({ page }) => { await login(page); await checarTela(page, 'Cargas/TipoLacre'); });
    test('Navio', async ({ page }) => { await login(page); await checarTela(page, 'Pedidos/Navio'); });
    test('Canal Venda', async ({ page }) => { await login(page); await checarTela(page, 'Pedidos/CanalVenda'); });
    test('Regras Autorização de Documentos', async ({ page }) => { await login(page); await checarTela(page, 'Documentos/RegraAutorizacaoGestaoDocumentos'); });
    test('Configurações de Pré Planejamento', async ({ page }) => { await login(page); await checarTela(page, 'Configuracoes/ConfiguracaoPreCarga'); });
    test('Regras para Tipo de Operação', async ({ page }) => { await login(page); await checarTela(page, 'Pedidos/RegraTipoOperacao'); });
    test('Tipo de Documento de Transporte', async ({ page }) => { await login(page); await checarTela(page, 'Cargas/TipoDocumentoTransporte'); });
    test('Tipo Anexo', async ({ page }) => { await login(page); await checarTela(page, 'Cargas/TipoAnexo'); });
    test('Tipo Percurso', async ({ page }) => { await login(page); await checarTela(page, 'Cargas/TipoPercurso'); });
    test('Justificativa de Acréscimo e Desconto', async ({ page }) => { await login(page); await checarTela(page, 'Fechamento/FechamentoJustificativaAcrescimoDesconto'); });
    test('Justificativa de Encerramento Manual de Viagem', async ({ page }) => { await login(page); await checarTela(page, 'Justificativas/EncerramentoManualViagem'); });
    test('Justificativa de Cancelamento', async ({ page }) => { await login(page); await checarTela(page, 'Cargas/JustificativaCancelamentoCarga'); });
    test('Tipo Carregamento', async ({ page }) => { await login(page); await checarTela(page, 'Cargas/TipoCarregamento'); });
    test('Ocultar Informações Carga', async ({ page }) => { await login(page); await checarTela(page, 'Cargas/OcultarInformacoesCarga'); });
  });

  // ─── Gestão de Cargas / Relatórios ───────────────────────────────────────────
  test.describe('Relatórios', () => {
    test('Incidência de Frete', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Cargas/TaxaIncidenciaFrete'); });
    test('Ocupação de Veículo', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Cargas/TaxaOcupacaoVeiculo'); });
    test('Valores de Fretes', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Fretes/FreteComponentes'); });
    test('MDF-es Emitidos', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Mdfe/Mdfes'); });
    test('CIOT', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Documentos/CargaCIOT'); });
    test('CIOT - Acrescimos/Descontos', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Fretes/ContratoFreteAcrescimoDesconto'); });
    test('MDF-es não Encerrados', async ({ page }) => { await login(page); await checarTela(page, 'RelatoriosRV/MDFesNaoEncerrados'); });
    test('Complementos de Frete', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Creditos/CargaComplementosFrete'); });
    test('Cargas', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Cargas/Carga'); });
    test('CT-es', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/CTe/CTes'); });
    test('NF-es', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/NFe/NFes'); });
    test('Pedidos', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Cargas/Pedido'); });
    test('Valores de Descarga', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Pallets/ValorDescarga'); });
    test('Produtos Expedidos', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Expedicao/ExpedicaoProdutos'); });
    test('Averbações Seguro', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Seguros/CTesAverbados'); });
    test('Extrato de CT-es', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Financeiros/CTeTituloReceber'); });
    test('Consulta de CT-es', async ({ page }) => { await login(page); await checarTela(page, 'CTe/ConsultaCTe'); });
    test('Consulta de MDF-e', async ({ page }) => { await login(page); await checarTela(page, 'MDFe/ConsultaMDFe'); });
    test('Cargas Produtos', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Cargas/CargaProduto'); });
    test('Produto Embarcador', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Produtos/ProdutoEmbarcador'); });
    test('Documentos para Emissão de NFS Manual', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Cargas/DocumentoEmissaoNFSManual'); });
    test('Vale Pedágio', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/CTe/ValePedagio'); });
    test('MDF-es Averbados', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Mdfe/MDFesAverbados'); });
    test('Download de documentos de cargas', async ({ page }) => { await login(page); await checarTela(page, 'Cargas/DownloadDocumentos'); });
    test('Ocorrências dos Pedidos', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Pedidos/PedidoOcorrencia'); });
    test('Integrações de Carga', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Cargas/CargaIntegracao'); });
    test('Custos e Rentabilidade - CTE/CRT', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/CTe/CustoRentabilidadeCteCrt'); });
    test('Integração dos Dados da Carga', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Cargas/CargaIntegracaoDadosTransportes'); });
    test('Produtividade Equipe', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Cargas/ProdutividadeEquipe'); });
  });

  // ─── Gestão de Cargas / Consultas ────────────────────────────────────────────
  test.describe('Consultas', () => {
    test('Extrato de CT-es', async ({ page }) => { await login(page); await checarTela(page, 'Financeiros/CTeTituloReceber'); });
    test('Retornos de Integrações', async ({ page }) => { await login(page); await checarTela(page, 'Integracoes/IntegradoraIntegracaoRetorno'); });
    test('Integrações com Falha', async ({ page }) => { await login(page); await checarTela(page, 'Cargas/IntegracoesComFalha'); });
    test('Controle Evento Integração', async ({ page }) => { await login(page); await checarTela(page, 'Cargas/ControleEventoIntegracao'); });
  });

});
//#endregion

//#region Smoke - Janela de Cargas
test.describe('Smoke - Janela de Cargas', () => {

  test('Janela de Carregamento', async ({ page }) => { await login(page); await checarTela(page, 'Logistica/JanelaCarregamento'); });
  test('Janela de Descarregamento', async ({ page }) => { await login(page); await checarTela(page, 'Logistica/JanelaDescarga'); });
  test('Guarita', async ({ page }) => { await login(page); await checarTela(page, 'Logistica/Guarita'); });
  test('Expedição', async ({ page }) => { await login(page); await checarTela(page, 'Logistica/Expedicao'); });
  test('Capacidade de Descarregamento Adicional', async ({ page }) => { await login(page); await checarTela(page, 'Logistica/CapacidadeDescarregamentoAdicional'); });
  test('Capacidade de Carga Adicional', async ({ page }) => { await login(page); await checarTela(page, 'Logistica/CapacidadeCarregamentoAdicional'); });
  test('Reserva de Clientes', async ({ page }) => { await login(page); await checarTela(page, 'Logistica/ReservaCargaGrupoPessoa'); });
  test('Janela de Coleta', async ({ page }) => { await login(page); await checarTela(page, 'Logistica/JanelaColeta'); });
  test('Reversas', async ({ page }) => { await login(page); await checarTela(page, 'Logistica/FilaCarregamentoReversa'); });

  // ─── Janela de Cargas / Configurações ────────────────────────────────────────
  test.describe('Configurações', () => {
    test('Centro de Carregamento', async ({ page }) => { await login(page); await checarTela(page, 'Logistica/CentroCarregamento'); });
    test('Janela de Descarga', async ({ page }) => { await login(page); await checarTela(page, 'Logistica/CentroDescarregamento'); });
    test('Exceção de Capacidade de Carga', async ({ page }) => { await login(page); await checarTela(page, 'Logistica/ExcecaoCapacidadeCarregamento'); });
    test('Prazos da Janela', async ({ page }) => { await login(page); await checarTela(page, 'Logistica/PrazoSituacaoCarga'); });
    test('Motivo de Atraso no Carregamento', async ({ page }) => { await login(page); await checarTela(page, 'Logistica/MotivoAtrasoCarregamento'); });
    test('Exceção de Capacidade de Descarga', async ({ page }) => { await login(page); await checarTela(page, 'Logistica/ExcecaoCapacidadeDescarregamento'); });
    test('Motivo Alteração Posição Fila Carregamento', async ({ page }) => { await login(page); await checarTela(page, 'Logistica/MotivoAlteracaoPosicaoFilaCarregamento'); });
    test('Motivo Saída da Fila Carregamento', async ({ page }) => { await login(page); await checarTela(page, 'Logistica/MotivoRetiradaFilaCarregamento'); });
    test('Situações de Descarregamento', async ({ page }) => { await login(page); await checarTela(page, 'Logistica/JanelaDescarregamentoSituacao'); });
    test('Config Filiais Fila Carregamento', async ({ page }) => { await login(page); await checarTela(page, 'Logistica/ConfigFiliaisFilaCarregamento'); });
    test('Distribuidor por Região', async ({ page }) => { await login(page); await checarTela(page, 'Localidades/DistribuidorPorRegiao'); });
  });

  // ─── Janela de Cargas / Relatórios ───────────────────────────────────────────
  test.describe('Relatórios', () => {
    test('Tempos de Carregamento', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Logistica/TempoCarregamento'); });
    test('Quantidades de Cargas', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Cargas/Quantidade'); });
    test('Direcionamento de Cargas', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Cargas/DirecionamentoOperador'); });
    test('Integração Janela de Carregamento', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Logistica/JanelaCarregamentoIntegracao'); });
    test('Agendamentos Cancelados', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Logistica/AgendaCancelada'); });
    test('Janelas Disponíveis do Agendamento', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Logistica/JanelaDisponivelAgendamento'); });
  });

});
//#endregion

//#region Smoke - Gestão de Pátio
test.describe('Smoke - Gestão de Pátio', () => {

  test('Fluxo de Pátio', async ({ page }) => { await login(page); await checarTela(page, 'GestaoPatio/FluxoPatio'); });
  // Guarita: mesmo hash que Janela de Cargas — omitido (duplicado)
  test('Checklist', async ({ page }) => { await login(page); await checarTela(page, 'GestaoPatio/CheckList'); });
  test('Controle de Expedição', async ({ page }) => { await login(page); await checarTela(page, 'Cargas/CargaControleExpedicao'); });
  test('Controle de Chave', async ({ page }) => { await login(page); await checarTela(page, 'GestaoPatio/TravamentoChave'); });
  test('Informar Doca', async ({ page }) => { await login(page); await checarTela(page, 'GestaoPatio/DocaCarregamento'); });
  test('Painel de Carregamentos', async ({ page }) => { await login(page); await checarTela(page, 'Painel/Carregamentos'); });
  test('Disponibilidade de Veículos', async ({ page }) => { await login(page); await checarTela(page, 'GestaoPatio/DisponibilidadeVeiculo'); });
  test('Solicitação de Veículo', async ({ page }) => { await login(page); await checarTela(page, 'GestaoPatio/SolicitacaoVeiculo'); });
  test('Separação de Mercadoria', async ({ page }) => { await login(page); await checarTela(page, 'GestaoPatio/SeparacaoMercadoria'); });
  test('Montagem de Carga no Pátio', async ({ page }) => { await login(page); await checarTela(page, 'GestaoPatio/MontagemCargaPatio'); });
  test('Integração de Pátio', async ({ page }) => { await login(page); await checarTela(page, 'GestaoPatio/FluxoPatioIntegracao'); });

  // ─── Gestão de Pátio / Configurações ─────────────────────────────────────────
  test.describe('Configurações', () => {
    test('Perguntas do Checklist', async ({ page }) => { await login(page); await checarTela(page, 'GestaoPatio/CheckListOpcoes'); });
    test('Observações para impressão do Checklist', async ({ page }) => { await login(page); await checarTela(page, 'GestaoPatio/CheckListObservacao'); });
    test('Configuração Gestão Pátio', async ({ page }) => { await login(page); await checarTela(page, 'Filiais/ConfiguracaoGestaoPatio'); });
    test('Tipos de Checklist', async ({ page }) => { await login(page); await checarTela(page, 'GestaoPatio/CheckListTipo'); });
    test('Tipos de Ocorrência de Pátio', async ({ page }) => { await login(page); await checarTela(page, 'GestaoPatio/OcorrenciaPatioTipo'); });
    test('Regras de Multa por Atraso na Retirada', async ({ page }) => { await login(page); await checarTela(page, 'GestaoPatio/RegrasMultaAtrasoRetirada'); });
    test('Sequência Gestão de Pátio', async ({ page }) => { await login(page); await checarTela(page, 'Filiais/SequenciaGestaoPatio'); });
  });

  // ─── Gestão de Pátio / Relatórios ────────────────────────────────────────────
  test.describe('Relatórios', () => {
    test('Tempos da Gestão de Pátio', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/GestaoPatio/TemposGestaoPatio'); });
    test('Controle de Tempo de Viagem', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Logistica/ControleTempoViagem'); });
    test('Checklist', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/GestaoPatio/CheckList'); });
  });

});
//#endregion

//#region Smoke - Logística
test.describe('Smoke - Logística', () => {

  test('Transportadores', async ({ page }) => { await login(page); await checarTela(page, 'Transportadores/Transportador'); });
  test('Veículos', async ({ page }) => { await login(page); await checarTela(page, 'Veiculos/Veiculo'); });
  test('Percursos', async ({ page }) => { await login(page); await checarTela(page, 'Logistica/Rota'); });
  test('Motoristas', async ({ page }) => { await login(page); await checarTela(page, 'Transportadores/Motorista'); });
  test('Passagens entre Estados', async ({ page }) => { await login(page); await checarTela(page, 'Logistica/PercursosEntreEstados'); });

  // ─── Logística / Configurações ───────────────────────────────────────────────
  test.describe('Configurações', () => {
    test('Rotas de Frete', async ({ page }) => { await login(page); await checarTela(page, 'Logistica/RotaFrete'); });
    test('Fronteiras', async ({ page }) => { await login(page); await checarTela(page, 'Logistica/Fronteira'); });
    test('Modelos Veiculares de Carga', async ({ page }) => { await login(page); await checarTela(page, 'Cargas/ModeloVeicularCarga'); });
    test('Grupo Modelo Veicular', async ({ page }) => { await login(page); await checarTela(page, 'Cargas/GrupoModeloVeicular'); });
    test('Perfil de Acesso', async ({ page }) => { await login(page); await checarTela(page, 'Transportadores/PerfilAcessoTransportador'); });
    test('Localidades', async ({ page }) => { await login(page); await checarTela(page, 'Localidades/Localidade'); });
    test('Modelos de Carrocerias', async ({ page }) => { await login(page); await checarTela(page, 'Veiculos/ModeloCarroceria'); });
    test('Grupo de Motoristas', async ({ page }) => { await login(page); await checarTela(page, 'Logistica/GrupoMotoristas'); });
    test('Trechos de Balsa', async ({ page }) => { await login(page); await checarTela(page, 'Logistica/TrechoBalsa'); });
    test('Regiões', async ({ page }) => { await login(page); await checarTela(page, 'Localidades/Regiao'); });
    test('Classificação da Rota', async ({ page }) => { await login(page); await checarTela(page, 'Logistica/RotaFreteClassificacao'); });
    test('Macros', async ({ page }) => { await login(page); await checarTela(page, 'Veiculos/Macro'); });
    test('Praças de Pedágio', async ({ page }) => { await login(page); await checarTela(page, 'Logistica/PracaPedagio'); });
    test('Tipo de Licença', async ({ page }) => { await login(page); await checarTela(page, 'Configuracoes/Licenca'); });
    test('Via de Transporte', async ({ page }) => { await login(page); await checarTela(page, 'Cargas/ViaTransporte'); });
    test('Marcas de Veículos', async ({ page }) => { await login(page); await checarTela(page, 'Veiculos/MarcaVeiculo'); });
    test('Meso Região', async ({ page }) => { await login(page); await checarTela(page, 'Localidades/MesoRegiao'); });
    test('Grupo de Transportador', async ({ page }) => { await login(page); await checarTela(page, 'Transportadores/GrupoTransportador'); });
    test('Equipamentos', async ({ page }) => { await login(page); await checarTela(page, 'Veiculos/Equipamento'); });
  });

  // ─── Logística / Cadastros ───────────────────────────────────────────────────
  test.describe('Cadastros', () => {
    test('Cor do Veículo', async ({ page }) => { await login(page); await checarTela(page, 'Veiculos/CorVeiculo'); });
    test('Pais', async ({ page }) => { await login(page); await checarTela(page, 'Localidades/Pais'); });
  });

  // ─── Logística / Importações ─────────────────────────────────────────────────
  test.describe('Importações', () => {
    test('Importar Motoristas', async ({ page }) => { await login(page); await checarTela(page, 'Transportadores/ImportacaoMotorista'); });
    test('Importar Veículos', async ({ page }) => { await login(page); await checarTela(page, 'Transportadores/ImportacaoVeiculo'); });
  });

  // ─── Logística / Relatórios ──────────────────────────────────────────────────
  test.describe('Relatórios', () => {
    test('Classificação de Veículos', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Veiculos/ClassificacaoVeiculo'); });
    test('Transportadores', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Transportadores/Transportadores'); });
    test('Veículos', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Veiculos/Veiculo'); });
    test('Aceite do Transportador do Termo', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Transportadores/AceiteContrato'); });
    test('Motoristas', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Frotas/Motorista'); });
    test('Rotas', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Fretes/RotaFrete'); });
    test('Série de Documentos', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Documentos/SerieDocumentos'); });
    test('Licenças de Veículos', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Administrativo/LicencaVeiculo'); });
    test('Modelos Veiculares de Carga', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Cargas/ModeloVeicularCarga'); });
  });

  // ─── Logística / Integração ──────────────────────────────────────────────────
  test.describe('Integração', () => {
    test('Regras Autorização Token', async ({ page }) => { await login(page); await checarTela(page, 'Transportadores/RegrasAutorizacaoToken'); });
    test('Autorização Token Integração', async ({ page }) => { await login(page); await checarTela(page, 'Transportadores/AutorizacaoToken'); });
  });

});
//#endregion

//#region Smoke - Torre de Controle
test.describe('Smoke - Torre de Controle', () => {

  test('Controle de Entregas', async ({ page }) => { await login(page); await checarTela(page, 'Cargas/ControleEntrega'); });
  test('Acompanhamento de Cargas', async ({ page }) => { await login(page); await checarTela(page, 'TorreControle/AcompanhamentoCarga'); });
  test('Monitoramento Mapa', async ({ page }) => { await login(page); await checarTela(page, 'Logistica/MonitoramentoNovo'); });
  test('Planejamento de Volume', async ({ page }) => { await login(page); await checarTela(page, 'TorreControle/PlanejamentoVolume'); });
  test('Monitor de Notificações Super App', async ({ page }) => { await login(page); await checarTela(page, 'TorreControle/MonitorNotificacoesApp'); });
  test('Monitor de Integrações SuperApp', async ({ page }) => { await login(page); await checarTela(page, 'TorreControle/MonitorIntegracoesSuperApp'); });
  test('Finalização em Lote', async ({ page }) => { await login(page); await checarTela(page, 'TorreControle/FinalizacaoColetaEntregaEmLote'); });
  test('Regras de qualidade do monitoramento', async ({ page }) => { await login(page); await checarTela(page, 'TorreControle/RegraQualidadeMonitoramento'); });
  test('Monitor Finalização Entregas Assíncronas', async ({ page }) => { await login(page); await checarTela(page, 'TorreControle/MonitorFinalizacaoEntregaAssincrona'); });
  test('Integração de eventos Coleta/Entrega', async ({ page }) => { await login(page); await checarTela(page, 'Pedidos/PedidoOcorrenciaColetaEntregaIntegracao'); });
  test('Avaliação das Entregas', async ({ page }) => { await login(page); await checarTela(page, 'Cargas/AvaliacaoEntrega'); });
  test('Integração evento carga entrega', async ({ page }) => { await login(page); await checarTela(page, 'Cargas/CargaEntregaEventoIntegracao'); });
  test('Qualidade das Entregas', async ({ page }) => { await login(page); await checarTela(page, 'TorreControle/QualidadeEntrega'); });
  test('Monitor de Integração de Eventos Super App', async ({ page }) => { await login(page); await checarTela(page, 'TorreControle/MonitorIntegracaoEventoSuperApp'); });

  // ─── Torre de Controle / Configurações ───────────────────────────────────────
  test.describe('Configurações', () => {
    test('Configuração Ocorrências Coleta e Entrega', async ({ page }) => { await login(page); await checarTela(page, 'Cargas/ConfiguracaoOcorrenciaEntrega'); });
    test('Configuração Portal do Cliente', async ({ page }) => { await login(page); await checarTela(page, 'GestaoEntregas/ConfiguracaoPortalCliente'); });
    test('Configurações Chat Controle de Entrega', async ({ page }) => { await login(page); await checarTela(page, 'Configuracoes/ConfiguracaoControleEntrega'); });
    test('Motivo Retificação', async ({ page }) => { await login(page); await checarTela(page, 'Cargas/MotivoRetificacaoColeta'); });
    test('Motivos de Avaliação', async ({ page }) => { await login(page); await checarTela(page, 'Cargas/MotivoAvaliacao'); });
    test('Ação Devolução Motorista', async ({ page }) => { await login(page); await checarTela(page, 'GestaoEntregas/AcaoDevolucaoMotorista'); });
    test('Configurações de Integrações de Tecnologias para Monitoramento', async ({ page }) => { await login(page); await checarTela(page, 'Integracoes/ConfiguracaoIntegracaoTecnologiaMonitoramento'); });
    test('Tratativa Ocorrência Entrega', async ({ page }) => { await login(page); await checarTela(page, 'Cargas/TratativaOcorrenciaEntrega'); });
    test('Motivo Devolução Entrega', async ({ page }) => { await login(page); await checarTela(page, 'GestaoEntregas/MotivoDevolucaoEntrega'); });
    test('Notificação Retirada Produto', async ({ page }) => { await login(page); await checarTela(page, 'Pedidos/NotificacaoRetiradaProduto'); });
    test('Motivo para não envio da chave das notas fiscais', async ({ page }) => { await login(page); await checarTela(page, 'Cargas/MotivoFalhaNotaFiscal'); });
    test('Alertas de Cargas', async ({ page }) => { await login(page); await checarTela(page, 'Cargas/ConfiguracaoAlertaCarga'); });
    test('Checklist Super App', async ({ page }) => { await login(page); await checarTela(page, 'TorreControle/ChecklistSuperApp'); });
    test('Lead Time', async ({ page }) => { await login(page); await checarTela(page, 'Configuracoes/LeadTime'); });
    test('Tendência de Prazo das Paradas', async ({ page }) => { await login(page); await checarTela(page, 'TorreControle/TendenciaParadas'); });
  });

  // ─── Torre de Controle / Relatórios ──────────────────────────────────────────
  test.describe('Relatórios', () => {
    test('Rota Controle de Entrega', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Cargas/RotaControleEntrega'); });
    test('Paradas', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Cargas/Paradas'); });
    test('Dados Entrega Pedidos', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Cargas/CargaEntregaPedido'); });
    test('Eventos Viagem', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Cargas/CargaViagemEventos'); });
    test('Permanências', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/TorreControle/Permanencias'); });
    test('Devolução Notas Fiscais', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/TorreControle/DevolucaoNotasFiscais'); });
    test('Consolidado Entregas', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/TorreControle/ConsolidadoEntregas'); });
  });

});
//#endregion

//#region Smoke - Ocorrências
test.describe('Smoke - Ocorrências', () => {

  test('Ocorrência', async ({ page }) => { await login(page); await checarTela(page, 'Ocorrencias/Ocorrencia'); });
  test('Cancelamento Ocorrência', async ({ page }) => { await login(page); await checarTela(page, 'Ocorrencias/OcorrenciaCancelamento'); });
  test('Autorização', async ({ page }) => { await login(page); await checarTela(page, 'Ocorrencias/AutorizacaoOcorrencia'); });

  // ─── Ocorrências / Configurações ─────────────────────────────────────────────
  test.describe('Configurações', () => {
    test('Tipos de Ocorrências', async ({ page }) => { await login(page); await checarTela(page, 'Ocorrencias/TipoOcorrencia'); });
    test('Motivo Rejeição', async ({ page }) => { await login(page); await checarTela(page, 'Ocorrencias/MotivoRejeicaoOcorrencia'); });
    test('Alçadas da Ocorrência', async ({ page }) => { await login(page); await checarTela(page, 'Ocorrencias/RegrasAutorizacaoOcorrencia'); });
    test('Parâmetros da Ocorrência', async ({ page }) => { await login(page); await checarTela(page, 'Ocorrencias/ParametroOcorrencia'); });
    test('Configuração Ocorrência Pedido', async ({ page }) => { await login(page); await checarTela(page, 'Pedidos/ConfiguracaoOcorrenciaPedido'); });
    test('Justificativa Ocorrência', async ({ page }) => { await login(page); await checarTela(page, 'Ocorrencias/JustificativaOcorrencia'); });
    test('Grupo Tipo de Ocorrência', async ({ page }) => { await login(page); await checarTela(page, 'Ocorrencias/GrupoTipoDeOcorrencia'); });
  });

  // ─── Ocorrências / Relatórios ─────────────────────────────────────────────────
  test.describe('Relatórios', () => {
    test('Ocorrências', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Ocorrencias/Ocorrencia'); });
    test('Regras autorização de ocorrências', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Ocorrencias/RegrasAutorizacaoOcorrencia'); });
    test('Relatório de Ocorrência de Entrega', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Ocorrencias/OcorrenciaEntrega'); });
    test('Tipos de Ocorrências', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Ocorrencias/TipoOcorrencia'); });
    test('Pedido Retorno Ocorrência', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Pedidos/PedidoRetornoOcorrencia'); });
  });

});
//#endregion

//#region Smoke - Frete
test.describe('Smoke - Frete', () => {

  test('Tabela de Frete', async ({ page }) => { await login(page); await checarTela(page, 'Fretes/TabelaFrete'); });
  test('Tabela por Rota', async ({ page }) => { await login(page); await checarTela(page, 'Fretes/TabelaFreteRota'); });
  test('Tabela Frete por Cliente', async ({ page }) => { await login(page); await checarTela(page, 'Fretes/TabelaFreteCliente'); });
  test('Reajuste', async ({ page }) => { await login(page); await checarTela(page, 'Fretes/AjusteTabelaFrete'); });
  test('Importar Tabela de Frete', async ({ page }) => { await login(page); await checarTela(page, 'Importacoes/ImportacaoTabelaFrete'); });
  test('Bonificação Transportador', async ({ page }) => { await login(page); await checarTela(page, 'Fretes/BonificacaoTransportador'); });

  // ─── Frete / Comissão ────────────────────────────────────────────────────────
  test.describe('Comissão', () => {
    test('Por Produto', async ({ page }) => { await login(page); await checarTela(page, 'Fretes/TabelaFreteComissaoProduto'); });
    test('Por Grupo de Produto', async ({ page }) => { await login(page); await checarTela(page, 'Fretes/TabelaFreteComissaoGrupoProduto'); });
    test('Replicar Comissões', async ({ page }) => { await login(page); await checarTela(page, 'Fretes/TabelaFreteComissaoImportacao'); });
  });

  // ─── Frete / Contratos Cliente ───────────────────────────────────────────────
  test.describe('Contratos Cliente', () => {
    test('Contrato de Frete Por Cliente', async ({ page }) => { await login(page); await checarTela(page, 'Escrituracao/ContratoFreteCliente'); });
    test('Saldo Contrato de Frete Por Cliente', async ({ page }) => { await login(page); await checarTela(page, 'Escrituracao/SaldoContratoFreteCliente'); });
  });

  // ─── Frete / Configurações ───────────────────────────────────────────────────
  test.describe('Configurações', () => {
    test('Alçadas Reajuste de Frete', async ({ page }) => { await login(page); await checarTela(page, 'Fretes/RegrasAutorizacaoValorFrete'); });
    test('Componente de Frete', async ({ page }) => { await login(page); await checarTela(page, 'Fretes/ComponenteFrete'); });
    test('Motivo Rejeição Reajuste Frete', async ({ page }) => { await login(page); await checarTela(page, 'Fretes/MotivoRejeicaoAjuste'); });
    test('Motivo do Reajuste', async ({ page }) => { await login(page); await checarTela(page, 'Fretes/MotivoReajuste'); });
    test('Motivo Adicional de Frete', async ({ page }) => { await login(page); await checarTela(page, 'Fretes/MotivoAdicionalFrete'); });
    test('Valores de Descarga por Clientes', async ({ page }) => { await login(page); await checarTela(page, 'Fretes/ConfiguracaoDescargaCliente'); });
    test('Regras Para Ajudante de Carga', async ({ page }) => { await login(page); await checarTela(page, 'Fretes/RegrasAjudanteCarga'); });
  });

  // ─── Frete / Relatórios ──────────────────────────────────────────────────────
  test.describe('Relatórios', () => {
    test('Comissão por Produto', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Fretes/ComissaoProduto'); });
    test('Comissão por Grupo de Produto', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Fretes/ComissaoGrupoProduto'); });
    test('Frete por Rota', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Fretes/TabelaFreteRota'); });
    test('Consulta Tabelas De Frete', async ({ page }) => { await login(page); await checarTela(page, 'Fretes/ConsultaTabelaFrete'); });
  });

  // ─── Frete / Consultas ───────────────────────────────────────────────────────
  test.describe('Consultas', () => {
    test('Reajustes', async ({ page }) => { await login(page); await checarTela(page, 'Fretes/ConsultaReajusteTabelaFrete'); });
  });

});
//#endregion

//#region Smoke - Canhotos
test.describe('Smoke - Canhotos', () => {

  test('Canhotos', async ({ page }) => { await login(page); await checarTela(page, 'Canhotos/Canhoto'); });
  test('Baixar Canhoto', async ({ page }) => { await login(page); await checarTela(page, 'Canhotos/BaixarCanhoto'); });
  test('Integração Canhoto', async ({ page }) => { await login(page); await checarTela(page, 'Canhotos/CanhotoIntegracao'); });
  test('Malotes', async ({ page }) => { await login(page); await checarTela(page, 'Canhotos/Malote'); });

  // ─── Canhotos / Configurações ────────────────────────────────────────────────
  test.describe('Configurações', () => {
    test('Armazenamento', async ({ page }) => { await login(page); await checarTela(page, 'Canhotos/LocalArmazenamentoCanhoto'); });
    test('Motivo Inconsistência Digitalização', async ({ page }) => { await login(page); await checarTela(page, 'Canhotos/MotivoInconsistenciaDigitacao'); });
  });

  // ─── Canhotos / Relatórios ───────────────────────────────────────────────────
  test.describe('Relatórios', () => {
    test('Canhotos', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Canhotos/Canhoto'); });
  });

});
//#endregion

//#region Smoke - Tracking
test.describe('Smoke - Tracking', () => {

  test('Monitoramento', async ({ page }) => { await login(page); await checarTela(page, 'Logistica/Monitoramento'); });
  test('Posição da Frota', async ({ page }) => { await login(page); await checarTela(page, 'Logistica/PosicaoFrota'); });
  test('Veículo / Tecnologia', async ({ page }) => { await login(page); await checarTela(page, 'Veiculos/VeiculoMonitoramento'); });
  test('Controle de Pré Viagem', async ({ page }) => { await login(page); await checarTela(page, 'Logistica/ControleViagem'); });
  test('Monitoramento - Tecnologias Rastreadores', async ({ page }) => { await login(page); await checarTela(page, 'Logistica/MonitoramentoTecnologia'); });

  // ─── Tracking / Configurações ────────────────────────────────────────────────
  test.describe('Configurações', () => {
    test('Eventos do Monitoramento', async ({ page }) => { await login(page); await checarTela(page, 'Logistica/MonitoramentoEvento'); });
    test('Ação da Tratativa', async ({ page }) => { await login(page); await checarTela(page, 'Logistica/AlertaTratativaAcao'); });
    test('Responsável da Carga', async ({ page }) => { await login(page); await checarTela(page, 'Cargas/ResponsavelCarga'); });
    test('Categoria do Responsável', async ({ page }) => { await login(page); await checarTela(page, 'Logistica/CategoriaResponsavel'); });
    test('Locais', async ({ page }) => { await login(page); await checarTela(page, 'Logistica/Locais'); });
    test('Alertas de Monitoramento', async ({ page }) => { await login(page); await checarTela(page, 'Logistica/AlertaMonitoramento'); });
    test('Faixa de Temperatura', async ({ page }) => { await login(page); await checarTela(page, 'Cargas/FaixaTemperatura'); });
    test('Tecnologia do Rastreador', async ({ page }) => { await login(page); await checarTela(page, 'Veiculos/TecnologiaRastreador'); });
    test('Comunicação do Rastreador', async ({ page }) => { await login(page); await checarTela(page, 'Veiculos/TipoComunicacaoRastreador'); });
    test('Status de viagem do monitoramento', async ({ page }) => { await login(page); await checarTela(page, 'Logistica/MonitoramentoStatusViagem'); });
    test('Tipo de subárea de cliente', async ({ page }) => { await login(page); await checarTela(page, 'Logistica/TipoSubareaCliente'); });
    test('Grupo de Status de Viagem', async ({ page }) => { await login(page); await checarTela(page, 'Logistica/MonitoramentoGrupoStatusViagem'); });
  });

  // ─── Tracking / Relatórios ───────────────────────────────────────────────────
  test.describe('Relatórios', () => {
    test('Nível de Serviço', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Logistica/MonitoramentoNivelServico'); });
    test('Tratativa dos Alertas', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Logistica/MonitoramentoTratativaAlerta'); });
    test('Histórico Paradas', async ({ page }) => { await login(page); await checarTela(page, 'Logistica/HistoricoParadas'); });
    test('Histórico de Temperatura', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Logistica/MonitoramentoHistoricoTemperatura'); });
    test('Controle de Entrega', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Logistica/MonitoramentoControleEntrega'); });
    test('Relatório Posição Frota Rastreamento', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Logistica/MonitoramentoPosicaoFrotaRastreamento'); });
    test('Alertas de Monitoramento', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Logistica/MonitoramentoAlerta'); });
    test('Tempos de Veículos', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Logistica/MonitoramentoTempoVeiculo'); });
  });

});
//#endregion

//#region Smoke - Atendimento
test.describe('Smoke - Atendimento', () => {

  test('Atendimentos', async ({ page }) => { await login(page); await checarTela(page, 'Chamados/ChamadoOcorrencia'); });
  test('Motivos do Atendimento', async ({ page }) => { await login(page); await checarTela(page, 'Chamados/MotivoChamado'); });
  test('Regras para Analise', async ({ page }) => { await login(page); await checarTela(page, 'Chamados/RegrasAnaliseChamados'); });
  test('Parâmetros de SLA', async ({ page }) => { await login(page); await checarTela(page, 'Atendimentos/ParametroSLA'); });

  // ─── Atendimento / Relatórios ────────────────────────────────────────────────
  test.describe('Relatórios', () => {
    test('Atendimentos', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Chamados/ChamadoOcorrencia'); });
  });

  // ─── Atendimento / Gráficos ──────────────────────────────────────────────────
  test.describe('Gráficos', () => {
    test('Atendimentos', async ({ page }) => { await login(page); await checarTela(page, 'BusinessIntelligence/Chamados/Chamado'); });
  });

});
//#endregion

//#region Smoke - Administrativo
test.describe('Smoke - Administrativo', () => {

  test('Gerenciar Transportador', async ({ page }) => { await login(page); await checarTela(page, 'Transportadores/GerenciarTransportadores'); });
  test('Filiais', async ({ page }) => { await login(page); await checarTela(page, 'Filiais/Filial'); });
  test('Clientes', async ({ page }) => { await login(page); await checarTela(page, 'Pessoas/Pessoa'); });
  test('Grupo de Clientes', async ({ page }) => { await login(page); await checarTela(page, 'Pessoas/GrupoPessoas'); });
  test('Mensagens de Aviso', async ({ page }) => { await login(page); await checarTela(page, 'Notificacoes/MensagemAviso'); });
  test('Manutenção CT-e', async ({ page }) => { await login(page); await checarTela(page, 'Cargas/CargaCTeManual'); });
  test('Controle das Integrações', async ({ page }) => { await login(page); await checarTela(page, 'Integracoes/ControleDasIntegracoes'); });
  test('Monitor de Integração do WebHook', async ({ page }) => { await login(page); await checarTela(page, 'Integracoes/MonitorIntegracaoWebhook'); });

  // ─── Administrativo / Configurações ──────────────────────────────────────────
  test.describe('Configurações', () => {
    test('Integradoras', async ({ page }) => { await login(page); await checarTela(page, 'Integracoes/Integradora'); });
    test('Integrações', async ({ page }) => { await login(page); await checarTela(page, 'Configuracoes/Integracao'); });
    test('Cargo', async ({ page }) => { await login(page); await checarTela(page, 'Pessoas/Cargo'); });
    test('Filiais Integração YMS', async ({ page }) => { await login(page); await checarTela(page, 'Integracoes/ConfiguracaoFilialIntegracao'); });
    test('Configurar E-mail', async ({ page }) => { await login(page); await checarTela(page, 'Email/ConfigEmailDocTransporte'); });
    test('Layout EDI', async ({ page }) => { await login(page); await checarTela(page, 'EDI/LayoutEDI'); });
    test('Configurações de Alertas', async ({ page }) => { await login(page); await checarTela(page, 'Notificacoes/ConfiguracaoAlerta'); });
    test('Naturezas das Operações', async ({ page }) => { await login(page); await checarTela(page, 'OperacoesFiscais/NaturezaOperacao'); });
    test('Regras de ICMS', async ({ page }) => { await login(page); await checarTela(page, 'ICMS/RegraICMS'); });
    test('Tabela de Alíquotas', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Financeiros/AliquotaICMSCTe'); });
    test('Alíquotas padrão', async ({ page }) => { await login(page); await checarTela(page, 'ICMS/AliquotaICMS'); });
    test('Descarga Por Cliente', async ({ page }) => { await login(page); await checarTela(page, 'Pessoas/DescargaPessoa'); });
    test('Fórmula de Rateio', async ({ page }) => { await login(page); await checarTela(page, 'Rateios/RateioFormula'); });
    test('Modelo de Documentos', async ({ page }) => { await login(page); await checarTela(page, 'Documentos/ModeloDocumentoFiscal'); });
    test('Impressoras', async ({ page }) => { await login(page); await checarTela(page, 'Configuracoes/Impressora'); });
    test('Layout Arquivo Importação Nota Fiscal', async ({ page }) => { await login(page); await checarTela(page, 'Configuracoes/ArquivoImportacaoNotaFiscal'); });
    test('Campos CC-e', async ({ page }) => { await login(page); await checarTela(page, 'Documentos/CampoCCe'); });
    test('Monitoria', async ({ page }) => { await login(page); await checarTela(page, 'Integracoes/ControleIntegracao'); });
    test('Feriados', async ({ page }) => { await login(page); await checarTela(page, 'Configuracoes/Feriado'); });
    test('Contingência', async ({ page }) => { await login(page); await checarTela(page, 'Configuracoes/ContingenciaEstado'); });
    test('Contrato Transportador', async ({ page }) => { await login(page); await checarTela(page, 'NotasFiscais/ContratoNotaFiscal'); });
    test('Outras Alíquotas', async ({ page }) => { await login(page); await checarTela(page, 'Imposto/OutrasAliquotas'); });
    test('Vale Pedágio', async ({ page }) => { await login(page); await checarTela(page, 'Frotas/ConfiguracaoValePedagio'); });
    test('Cotação de Moedas', async ({ page }) => { await login(page); await checarTela(page, 'Moedas/Cotacao'); });
    test('Contingência MDFe', async ({ page }) => { await login(page); await checarTela(page, 'Configuracoes/ContingenciaMDFeEstado'); });
    test('Configurações Impostos CIOT', async ({ page }) => { await login(page); await checarTela(page, 'Terceiros/Imposto'); });
    test('Configuração de CIOT', async ({ page }) => { await login(page); await checarTela(page, 'Configuracoes/ConfiguracaoCIOT'); });
    test('Notificação Motorista SMS', async ({ page }) => { await login(page); await checarTela(page, 'Configuracoes/NotificacaoMotoristaSMS'); });
    test('Palletização', async ({ page }) => { await login(page); await checarTela(page, 'Configuracoes/Palletizacao'); });
    test('Alertas e-mail', async ({ page }) => { await login(page); await checarTela(page, 'Notificacoes/AlertaEmail'); });
    test('Motivos', async ({ page }) => { await login(page); await checarTela(page, 'Configuracoes/Motivo'); });
    test('Banco', async ({ page }) => { await login(page); await checarTela(page, 'Financeiros/BancoTMS'); });
  });

  // ─── Administrativo / Relatórios ─────────────────────────────────────────────
  test.describe('Relatórios', () => {
    test('Clientes', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Pessoas/Pessoa'); });
    test('Perfil de Acesso', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Pessoas/PerfilAcesso'); });
    test('Usuários', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Usuarios/Usuario'); });
    test('Descarga', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Pessoas/PessoaDescarga'); });
    test('Regra de ICMS', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/ICMS/RegraICMS'); });
    test('Configuração Operadores', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Operacional/ConfiguracaoOperadores'); });
    test('Endereço Secundário', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Pessoas/EnderecoSecundario'); });
    test('Log de Acesso', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Administrativo/LogAcesso'); });
  });

  // ─── Administrativo / Seguro ─────────────────────────────────────────────────
  test.describe('Seguro', () => {
    test('Seguradoras', async ({ page }) => { await login(page); await checarTela(page, 'Seguros/Seguradora'); });
    test('Apólices', async ({ page }) => { await login(page); await checarTela(page, 'Seguros/ApoliceSeguro'); });
    test('Fechamento das Averbações', async ({ page }) => { await login(page); await checarTela(page, 'Seguros/FechamentoAverbacao'); });
    test('Relatórios - Apólices', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Seguros/Apolices'); });
  });

  // ─── Administrativo / Usuários ───────────────────────────────────────────────
  test.describe('Usuários', () => {
    test('Usuários', async ({ page }) => { await login(page); await checarTela(page, 'Pessoas/Usuario'); });
    test('Configurar Operador', async ({ page }) => { await login(page); await checarTela(page, 'Operacional/ConfigOperador'); });
    test('Perfil de Acesso', async ({ page }) => { await login(page); await checarTela(page, 'Pessoas/PerfilAcesso'); });
    test('Politica de Senhas', async ({ page }) => { await login(page); await checarTela(page, 'Pessoas/PoliticaSenha'); });
    test('Setor', async ({ page }) => { await login(page); await checarTela(page, 'Pessoas/SetorFuncionario'); });
    test('Turno', async ({ page }) => { await login(page); await checarTela(page, 'Filiais/Turno'); });
  });

});
//#endregion

//#region Smoke - Gestão de frota
test.describe('Smoke - Gestão de frota', () => {

  test('Movimentação de Placa', async ({ page }) => { await login(page); await checarTela(page, 'Frotas/MovimentacaoDePlacas'); });
  test('Guarita', async ({ page }) => { await login(page); await checarTela(page, 'Logistica/GuaritaTMS'); });

  // ─── Gestão de frota / Cadastros ─────────────────────────────────────────────
  test.describe('Cadastros', () => {
    test('Segmento do Veículo', async ({ page }) => { await login(page); await checarTela(page, 'Veiculos/SegmentoVeiculo'); });
    test('Responsável do Veículo', async ({ page }) => { await login(page); await checarTela(page, 'Veiculos/ResponsavelVeiculo'); });
    // Equipamento: mesmo hash que Logística/Config — omitido (duplicado)
    test('Marca do Equipamento', async ({ page }) => { await login(page); await checarTela(page, 'Veiculos/MarcaEquipamento'); });
    test('Modelo do Equipamento', async ({ page }) => { await login(page); await checarTela(page, 'Veiculos/ModeloEquipamento'); });
    test('Produto', async ({ page }) => { await login(page); await checarTela(page, 'Produtos/Produto'); });
    test('Unidade de Medida do Fornecedor', async ({ page }) => { await login(page); await checarTela(page, 'Produtos/UnidadeMedidaFornecedor'); });
    test('Grupo de Produto', async ({ page }) => { await login(page); await checarTela(page, 'Produtos/GrupoProdutoTMS'); });
    // Marca do Produto: mesmo hash que GdC/Config — omitido (duplicado)
    test('Local Armazenamento Produto', async ({ page }) => { await login(page); await checarTela(page, 'Produtos/LocalArmazenamentoProduto'); });
    // Tipo de Embalagem: mesmo hash que GdC/Config — omitido (duplicado)
    test('Marca de EPI', async ({ page }) => { await login(page); await checarTela(page, 'Pessoas/MarcaEPI'); });
    test('Tipo de EPI', async ({ page }) => { await login(page); await checarTela(page, 'Pessoas/TipoEPI'); });
    test('EPI', async ({ page }) => { await login(page); await checarTela(page, 'Pessoas/EPI'); });
    test('Centro de Resultado', async ({ page }) => { await login(page); await checarTela(page, 'Financeiros/CentroResultado'); });
  });

  // ─── Gestão de frota / Relatórios ────────────────────────────────────────────
  test.describe('Relatórios', () => {
    test('Equipamentos', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Veiculos/Equipamento'); });
    test('Responsáveis de Veículo', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Veiculos/ResponsavelVeiculo'); });
    test('Histórico de Vinculo do Veículo', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Veiculos/HistoricoVeiculoVinculo'); });
    test('Tempo de Viagem', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/AcertoViagem/TempoDeViagem'); });
    test('Jornada do Motorista', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/AcertoViagem/JornadaMotorista'); });
  });

  // ─── Gestão de frota / Abastecimento ─────────────────────────────────────────
  test.describe('Abastecimento', () => {
    test('Abastecimentos', async ({ page }) => { await login(page); await checarTela(page, 'Frotas/Abastecimento'); });
    test('Fechamento do Abastecimento', async ({ page }) => { await login(page); await checarTela(page, 'Frotas/FechamentoAbastecimento'); });

    test.describe('Configurações', () => {
      test('Configuração do Abastecimento', async ({ page }) => { await login(page); await checarTela(page, 'Frotas/ConfiguracaoAbastecimento'); });
      test('Reprocessar Abastecimentos', async ({ page }) => { await login(page); await checarTela(page, 'Frotas/ReprocessarAbastecimento'); });
      test('Importar Preço de Combustível', async ({ page }) => { await login(page); await checarTela(page, 'Frota/ImportacaoPrecoCombustivel'); });
      test('NCM de Abastecimento', async ({ page }) => { await login(page); await checarTela(page, 'Produtos/ProdutoNCMAbastecimento'); });
    });

    test.describe('Relatórios', () => {
      test('Abastecimentos', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Frotas/Abastecimento'); });
    });
  });

  // ─── Gestão de frota / Pedágio ───────────────────────────────────────────────
  test.describe('Pedágio', () => {
    test('Pedágio', async ({ page }) => { await login(page); await checarTela(page, 'Frotas/Pedagio'); });
    test('Fechamento do Pedágio', async ({ page }) => { await login(page); await checarTela(page, 'Frotas/FechamentoPedagio'); });

    test.describe('Configurações', () => {
      test('Importação do Sem Parar', async ({ page }) => { await login(page); await checarTela(page, 'Frotas/ImportacaoDePedagio'); });
      test('Importação do Pedágio', async ({ page }) => { await login(page); await checarTela(page, 'Frota/ImportacaoPedagio'); });
    });

    test.describe('Relatórios', () => {
      test('Pedágios', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Frotas/Pedagio'); });
    });
  });

  // ─── Gestão de frota / Manutenção ────────────────────────────────────────────
  test.describe('Manutenção', () => {
    test('Ordem de Serviço', async ({ page }) => { await login(page); await checarTela(page, 'Frota/OrdemServico'); });

    test.describe('Configuração', () => {
      test('Serviços de Veículo', async ({ page }) => { await login(page); await checarTela(page, 'Frota/ServicoVeiculo'); });
      test('Finalidade do Produto na Ordem de Serviço', async ({ page }) => { await login(page); await checarTela(page, 'Frota/FinalidadeProdutoOrdemServico'); });
      test('Tipo de Ordem de Serviço', async ({ page }) => { await login(page); await checarTela(page, 'Frota/TipoOrdemServico'); });
      test('Grupo de Serviço da Manutenção', async ({ page }) => { await login(page); await checarTela(page, 'Frota/GrupoServico'); });
      test('Regras Autorização de Ordem de Serviço', async ({ page }) => { await login(page); await checarTela(page, 'Frota/RegraAutorizacaoOrdemServico'); });
      test('Autorização de Ordem de Serviço', async ({ page }) => { await login(page); await checarTela(page, 'Frota/AutorizacaoOrdemServico'); });
    });

    test.describe('Relatórios', () => {
      test('Manutenção de Veículos por Documento de Entrada', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Veiculos/Manutencao'); });
      test('Despesas por Ordem de Serviço', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Frotas/DespesaOrdemServico'); });
      test('Manutenção de Veículos', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Frotas/ManutencaoVeiculo'); });
      test('Dados de Ordem de Serviço', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Frota/OrdemServico'); });
      test('Dados de Serviços de Veículos', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Frota/ServicoVeiculo'); });
      test('Detalhado de Despesas por Ordem de Serviço', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Frotas/DespesaDetalhadaOrdemServico'); });
      test('Ordem Serviço Por Mecânico', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Frotas/OrdemServicoPorMecanico'); });
      test('Despesas de Produtos por Ordem de Serviço', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Frotas/DespesaOrdemServicoProduto'); });
    });
  });

  // ─── Gestão de frota / Infrações ─────────────────────────────────────────────
  test.describe('Infrações', () => {
    test('Infrações', async ({ page }) => { await login(page); await checarTela(page, 'Frota/Infracao'); });

    test.describe('Configuração', () => {
      test('Tipo de Infração', async ({ page }) => { await login(page); await checarTela(page, 'Frota/TipoInfracao'); });
      test('Regras de Autorização de Infração', async ({ page }) => { await login(page); await checarTela(page, 'Frota/RegraAutorizacaoInfracao'); });
      test('Autorização de Infração', async ({ page }) => { await login(page); await checarTela(page, 'Frota/AutorizacaoInfracao'); });
    });

    test.describe('Relatórios', () => {
      test('Infrações', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Frotas/Multa'); });
      test('Parcelas da Infração', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Frotas/MultaParcela'); });
    });
  });

  // ─── Gestão de frota / Pneu ──────────────────────────────────────────────────
  test.describe('Pneu', () => {
    test('Movimentação de Pneu', async ({ page }) => { await login(page); await checarTela(page, 'Frota/MovimentacaoPneu'); });

    test.describe('Configurações', () => {
      test('Pneu', async ({ page }) => { await login(page); await checarTela(page, 'Frota/Pneu'); });
      test('Bandas de Rodagem de Pneu', async ({ page }) => { await login(page); await checarTela(page, 'Frota/BandaRodagemPneu'); });
      test('Marcas de Pneu', async ({ page }) => { await login(page); await checarTela(page, 'Frota/MarcaPneu'); });
      test('Modelos de Pneu', async ({ page }) => { await login(page); await checarTela(page, 'Frota/ModeloPneu'); });
      test('Dimensões do Pneu', async ({ page }) => { await login(page); await checarTela(page, 'Frota/DimensaoPneu'); });
      test('Almoxarifado de Pneu', async ({ page }) => { await login(page); await checarTela(page, 'Frota/Almoxarifado'); });
      test('Motivos de Sucateamento do Pneu', async ({ page }) => { await login(page); await checarTela(page, 'Frota/MotivoSucateamentoPneu'); });
    });

    test.describe('Relatórios', () => {
      test('Histórico do Pneu', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Frota/PneuHistorico'); });
      test('Posição do Pneu', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Frota/MovimentacaoPneuVeiculo'); });
      test('Custo e Estoque de Pneu', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Frota/PneuCustoEstoque'); });
      test('Dados de Pneu', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Frota/Pneu'); });
      test('Pneu por Veículo', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Frota/PneuPorVeiculo'); });
    });
  });

  // ─── Gestão de frota / Programação ───────────────────────────────────────────
  test.describe('Programação', () => {
    test('Painel do Veículo', async ({ page }) => { await login(page); await checarTela(page, 'Veiculos/PainelVeiculo'); });
  });

  // ─── Gestão de frota / Sinistro ──────────────────────────────────────────────
  test.describe('Sinistro', () => {
    test('Sinistro', async ({ page }) => { await login(page); await checarTela(page, 'Frota/Sinistro'); });

    test.describe('Configuração', () => {
      test('Tipo de Sinistro', async ({ page }) => { await login(page); await checarTela(page, 'Frota/TipoSinistro'); });
    });

    test.describe('Relatórios', () => {
      test('Dados do Sinistro', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Frota/Sinistro'); });
    });
  });

  // ─── Gestão de frota / Controle de Tacógrafo ─────────────────────────────────
  test.describe('Controle de Tacógrafo', () => {
    test('Controle de Tacógrafo', async ({ page }) => { await login(page); await checarTela(page, 'Frota/ControleTacografo'); });

    test.describe('Relatórios', () => {
      test('Dados de Tacógrafo', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Veiculos/Tacografo'); });
    });
  });

  // ─── Gestão de frota / Compras ───────────────────────────────────────────────
  test.describe('Compras', () => {
    test('Requisição de Compra', async ({ page }) => { await login(page); await checarTela(page, 'Compras/RequisicaoMercadoria'); });
    test('Cotação de Compra', async ({ page }) => { await login(page); await checarTela(page, 'Compras/CotacaoCompra'); });
    test('Ordem de Compra', async ({ page }) => { await login(page); await checarTela(page, 'Compras/OrdemCompra'); });
    test('Retorno da Cotação', async ({ page }) => { await login(page); await checarTela(page, 'Compras/RespostaCotacao'); });
    test('Fluxo de Compra', async ({ page }) => { await login(page); await checarTela(page, 'Compras/FluxoCompra'); });

    test.describe('Configurações', () => {
      test('Motivo da Compra', async ({ page }) => { await login(page); await checarTela(page, 'Compras/MotivoCompra'); });
      test('Condição de Pagamento', async ({ page }) => { await login(page); await checarTela(page, 'Compras/CondicaoPagamento'); });
      test('Regras para Requisição de Mercadoria', async ({ page }) => { await login(page); await checarTela(page, 'Compras/RegrasRequisicaoMercadoria'); });
      test('Regras para Ordem de Compra', async ({ page }) => { await login(page); await checarTela(page, 'Compras/RegrasOrdemCompra'); });
      test('Autorização da Ordem de Compra', async ({ page }) => { await login(page); await checarTela(page, 'Compras/AutorizacaoOrdemCompra'); });
      test('Autorização da Requisição de Mercadoria', async ({ page }) => { await login(page); await checarTela(page, 'Compras/AutorizacaoRequisicaoMercadoria'); });
    });

    test.describe('Relatórios', () => {
      test('Cotação de Compra', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Compras/CotacaoCompra'); });
      test('Requisição de Mercadoria', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Compras/RequisicaoMercadoria'); });
      test('Ordem de Compra', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Compras/OrdemCompra'); });
      test('Pontuação do Comprador', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Compras/PontuacaoComprador'); });
      test('Nota de Entrada x Ordem de Compra', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Compras/NotaEntradaOrdemCompra'); });
      test('Sugestão de Compra', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Compras/SugestaoCompra'); });
      test('Pontuação do Fornecedor', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Compras/PontuacaoFornecedor'); });
    });
  });

  // ─── Gestão de frota / Documentos Fiscais ────────────────────────────────────
  test.describe('Documentos Fiscais', () => {
    test('Documento de Entrada', async ({ page }) => { await login(page); await checarTela(page, 'Financeiros/DocumentoEntrada'); });
    test('Documentos Destinados', async ({ page }) => { await login(page); await checarTela(page, 'Documentos/DocumentoDestinadoEmpresa'); });
    test('Nota Fiscal Eletrônica', async ({ page }) => { await login(page); await checarTela(page, 'NotasFiscais/NotaFiscalEletronica'); });

    test.describe('Configurações', () => {
      test('Serviços', async ({ page }) => { await login(page); await checarTela(page, 'NotasFiscais/Servico'); });
      test('Observação Fiscal', async ({ page }) => { await login(page); await checarTela(page, 'NotasFiscais/ObservacaoFiscal'); });
      test('Natureza da Operação', async ({ page }) => { await login(page); await checarTela(page, 'NotasFiscais/NaturezaDaOperacao'); });
      test('Imposto IBPT para NF-e', async ({ page }) => { await login(page); await checarTela(page, 'NotasFiscais/ImpostoIBPTNFe'); });
      test('Grupo de Imposto', async ({ page }) => { await login(page); await checarTela(page, 'NotasFiscais/GrupoImposto'); });
      test('CFOP Fiscal', async ({ page }) => { await login(page); await checarTela(page, 'NotasFiscais/CFOP'); });
      test('Regras para Entrada do Documento', async ({ page }) => { await login(page); await checarTela(page, 'Financeiros/RegraEntradaDocumento'); });
      test('Situações do Documento de Entrada', async ({ page }) => { await login(page); await checarTela(page, 'Financeiros/SituacaoLancamentoDocumentoEntrada'); });
    });

    test.describe('Relatórios', () => {
      test('Notas Emitidas', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/NFe/NotasEmitidas'); });
      test('Estoque de Produto', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/NFe/EstoqueProdutos'); });
      test('Histórico do Estoque', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/NFe/HistoricoEstoque'); });
      test('Notas Detalhadas', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/NFe/NotasDetalhadas'); });
      test('Dados de Notas', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/NFe/Notas'); });
      test('Giro de Estoque', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/NFe/GiroEstoque'); });
      test('Curva ABC do Estoque', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/NFe/CurvaABCProduto'); });
      test('CFOP Fiscal', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Financeiros/CFOP'); });
      test('Natureza da Operação', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Financeiros/NaturezaDaOperacao'); });
      test('Dados de Produto', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/Produtos/Produto'); });
      test('Histórico do Produto', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/NFe/HistoricoProduto'); });
      test('Produto sem Movimentação', async ({ page }) => { await login(page); await checarTela(page, 'Relatorios/NFe/ProdutoSemMovimentacao'); });
    });
  });

  // ─── Gestão de frota / Configurações ─────────────────────────────────────────
  test.describe('Configurações', () => {
    test('Tabela de Diária', async ({ page }) => { await login(page); await checarTela(page, 'Acertos/TabelaDiaria'); });
    test('Tabela de Comissão do Motorista', async ({ page }) => { await login(page); await checarTela(page, 'Acertos/TabelaComissaoMotorista'); });
    // Controle de Licenças: mesmo hash que Logística/Config — omitido (duplicado)
    test('Controle de Alertas', async ({ page }) => { await login(page); await checarTela(page, 'Configuracoes/ControleAlerta'); });
  });

});
//#endregion
