import { useEffect, useState } from "react";
import style from "./DataPage.module.scss";
import Fetch from "../classes/Fetch";
import Utils from "../classes/Utils";
import { faFileLines } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
    
function DataPage() {
    const fetch = new Fetch();
    const utils = new Utils();

    const [usuario, setUsuario] = useState(null);
    const [premios, setPremios] = useState(null);
    const [metricas, setMetricas] = useState({
        indicacoes: 0,
        fechadas: 0,
        transacoes: 0,
        premios: 0
    });

    useEffect(() => {
        const buscarDados = async () => {
            var dados = await fetch.listarPremios();
            setPremios(dados);

            setMetricas({
                indicacoes: await fetch.contarTodasIndicacoes(false, "", ""),
                fechadas: await fetch.contarTodasIndicacoes(true, "", ""),
                transacoes: await fetch.contarTodasTransacoes(false, "", ""),
                premios: await fetch.contarTodasTransacoes(true, "", "")
            });

            var dadosUsuario = await fetch.buscarUsuario();
            setUsuario(dadosUsuario);
        }
        buscarDados();
    }, []);

    useEffect(() => {
        const body = document.querySelector('body');
        body.classList.add(style.bodybg);
    }, []);

    const relacaoIndicadorIndicado = async () => {
        var response = await fetch.gerarRelacaoIndicadorIndicado();
        await utils.baixarRelatorio(response);
    }

    const gerarRelatorioParceiros = async () => {
        var nome = document.getElementById("nomeParceiro").value.trim();
        var tipo = document.getElementById("tipoParceiro").value;
        var fechou = document.getElementById("fechouParceiro").value;
        var foiIndicado = document.getElementById("foiIndicadoParceiro").value;
        var dataInicial = document.getElementById("dataInicialParceiro").value;
        var dataFinal = document.getElementById("dataFinalParceiro").value;
        var tipoData = document.getElementById("tipoDataParceiro").value;

        var response = await fetch.gerarRelatorioParceiros(nome, tipo, fechou, foiIndicado, dataInicial, dataFinal, tipoData);
        await utils.baixarRelatorio(response);
    }

    const gerarRelatorioTransacoes = async () => {
        var nome = document.getElementById("nomeParceiroTransacao").value.trim();
        var tipo = document.getElementById("tipoTransacao").value;
        var baixa = document.getElementById("baixaTransacao").value;
        var dataInicial = document.getElementById("dataInicialTransacao").value;
        var dataFinal = document.getElementById("dataFinalTransacao").value;
        var premio = document.getElementById("premioTransacao").value;

        var response = await fetch.gerarRelatorioTransacoes(nome, tipo, baixa, dataInicial, dataFinal, premio);
        await utils.baixarRelatorio(response);
    }

    const filtrarMetricas = async () => {
        var dataInicial = document.getElementById("dataInicialMetricas").value;
        var dataFinal = document.getElementById("dataFinalMetricas").value;

        setMetricas({
            indicacoes: await fetch.contarTodasIndicacoes(false, dataInicial, dataFinal),
            fechadas: await fetch.contarTodasIndicacoes(true, dataInicial, dataFinal),
            transacoes: await fetch.contarTodasTransacoes(false, dataInicial, dataFinal),
            premios: await fetch.contarTodasTransacoes(true, dataInicial, dataFinal)
        });
    }

    if (usuario !== null && usuario.role === "Admin") {
        return (
            <div className={style.container}>
                <div>
                    <h1 className={style.titulo}>Métricas</h1>
                </div>
                <div className={style.secaometricas}>
                    <div className={style.metricas}>
                        <div className={style.indicacoes}>
                            <p>{metricas.indicacoes}</p>
                            <h4>Total de indicações</h4>
                        </div>
                        <div className={style.indicacoesfechadas}>
                            <p>{metricas.fechadas}</p>
                            <h4>Total de indicações que fecharam</h4>
                        </div>
                        <div className={style.numerotransacoes}>
                            <p>{metricas.transacoes}</p>
                            <h4>Total de transações realizadas</h4>
                        </div>
                        <div className={style.numeropremios}>
                            <p>{metricas.premios}</p>
                            <h4>Total de prêmios resgatados</h4>
                        </div>
                    </div>
                    <div className={style.filtrometricas}>
                        <label for="dataInicialMetricas">Data inicial</label>
                        <input type="date" id="dataInicialMetricas" name="dataInicialMetricas" />
                        <label for="dataFinalMetricas">Data final</label>
                        <input type="date" id="dataFinalMetricas" name="dataFinalMetricas" />
                        <button id="filtrarMetricas" onClick={() => filtrarMetricas()}>Filtrar</button>
                    </div>
                </div>
                <div className={style.filtros}>
                    <div className={style.filtro + " " + style.parceiros}>
                        <h3>Relatório de parceiros</h3>
                        <div className={style.containerfiltros}>
                            <div>
                                <label for="nomeParceiro">Nome</label>
                                <input type="text" id="nomeParceiro" name="nomeParceiro" placeholder="Nome (inicia com)" />
                            </div>
                            <div>
                                <label for="tipoParceiro">Tipo</label>
                                <select id="tipoParceiro" name="tipoParceiro">
                                    <option value="">Indiferente</option>
                                    <option value={0}>Indicador</option>
                                    <option value={1}>Parceiro</option>
                                </select>
                            </div>
                            <div>
                                <label for="fechouParceiro">Fechou?</label>
                                <select id="fechouParceiro" name="fechouParceiro">
                                    <option value="">Indiferente</option>
                                    <option value={true}>Fechou</option>
                                    <option value={false}>Não fechou</option>
                                </select>
                            </div>
                            <div>
                                <label for="foiIndicadoParceiro">Foi indicado?</label>
                                <select id="foiIndicadoParceiro" name="foiIndicadoParceiro">
                                    <option value="">Indiferente</option>
                                    <option value={true}>Foi indicado</option>
                                    <option value={false}>Não foi indicado</option>
                                </select>
                            </div>
                            <div>
                                <label for="dataInicialParceiro">Data inicial</label>
                                <input type="date" id="dataInicialParceiro" name="dataInicialParceiro" />
                            </div>
                            <div>
                                <label for="dataFinalParceiro">Data final</label>
                                <input type="date" id="dataFinalParceiro" name="dataFinalParceiro" />
                            </div>
                            <div>
                                <label for="tipoDataParceiro">Tipo de data</label>
                                <select id="tipoDataParceiro" name="tipoDataParceiro">
                                    <option value="">Indiferente</option>
                                    <option value="criadoEm">Criação</option>
                                    <option value="fechouEm">Fechamento</option>
                                </select>
                            </div>
                        </div>
                        <button onClick={() => gerarRelatorioParceiros()}>Gerar relatório</button>
                    </div>
                    <div className={style.filtro + " " + style.transacoes}>
                        <h3>Relatório de transações</h3>
                        <div className={style.containerfiltros}>
                            <div>
                                <label for="nomeParceiroTransacao">Nome</label>
                                <input type="text" id="nomeParceiroTransacao" name="nomeParceiroTransacao" placeholder="Nome (inicia com)" />
                            </div>
                            <div>
                                <label for="tipoTransacao">Tipo</label>
                                <select id="tipoTransacao" name="tipoTransacao">
                                    <option value="">Indiferente</option>
                                    <option value={0}>Resgate</option>
                                    <option value={1}>Abate</option>
                                    <option value={2}>Prêmio</option>
                                </select>
                            </div>
                            <div>
                                <label for="baixaTransacao">Situação</label>
                                <select id="baixaTransacao" name="baixaTransacao">
                                    <option value="">Indiferente</option>
                                    <option value={false}>Em aberto</option>
                                    <option value={true}>Baixado</option>
                                </select>
                            </div>
                            <div>
                                <label for="dataInicialTransacao">Data inicial</label>
                                <input type="date" id="dataInicialTransacao" name="dataInicialTransacao" />
                            </div>
                            <div>
                                <label for="dataFinalTransacao">Data final</label>
                                <input type="date" id="dataFinalTransacao" name="dataFinalTransacao" />
                            </div>
                            <div>
                                <label for="premioTransacao">Prêmio</label>
                                <select id="premioTransacao" name="premioTransacao">
                                    <option value="">Indiferente</option>
                                    {premios != null && premios.length > 0 ?
                                        premios.map((premio) => (
                                            <option value={premio.id}>{premio.nome}</option>
                                        ))
                                        : ""}
                                </select>
                            </div>
                        </div>
                        <button onClick={() => gerarRelatorioTransacoes()}>Gerar relatório</button>
                    </div>
                </div>
                <div className={style.templates}>
                    <div className={style.relacaoindicadorindicado} onClick={() => relacaoIndicadorIndicado()}>
                        <FontAwesomeIcon icon={faFileLines} />
                        <p>Relação Indicador X Indicado</p>
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            <div className={style.container}>
                <h1 className={style.titulo}>Ops...</h1>
                <p className={style.aviso}>Você não tem permissão para acessar essa página.</p>
            </div>
        );
    }
}

export default DataPage;
