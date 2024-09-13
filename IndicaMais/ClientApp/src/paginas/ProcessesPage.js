import InputMask from "react-input-mask";
import Fetch from "../classes/Fetch";
import Recursos from "../classes/Recursos";
import { useEffect, useState } from "react";
import style from './ProcessesPage.module.scss';
import { faMagnifyingGlass, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DadosProcesso from "../components/DadosProcesso";
import ItemProcesso from "../components/ItemProcesso";
import ModalCriarProcesso from "../components/ModalCriarProcesso";

function ProcessesPage() {
    const fetch = new Fetch();
    const recursos = new Recursos();
    const ProximoIcone = recursos.getProximo();
    const AnteriorIcone = recursos.getAnterior();

    const [dados, setDados] = useState({
        lista: null,
        temMais: null
    });
    const [pagina, setPagina] = useState(1);
    const [tamPagina, setTamPagina] = useState(5);
    const [processo, setProcesso] = useState(null);
    const [atualizar, setAtualizar] = useState(false);
    const [exibirModal, setExibirModal] = useState(false);

    useEffect(() => {
        const body = document.querySelector('body');
        body.classList.add(style.bodybg);
    }, []);

    function botaoPesquisar() {
        setPagina(1);
        pesquisar();
    }

    async function pesquisar() {
        var nomeParceiro = document.getElementById("nomeParceiro").value.replace(/\s+/g, " ").trim();
        var cpf = document.getElementById("cpf").value.replace(/[.\-_]/g, '');
        var nomeProcesso = document.getElementById("nomeProcesso").value.replace(/\s+/g, " ").trim();
        var numeroProcesso = document.getElementById("numeroProcesso").value.trim();
        var pendenteAndamento = document.getElementById("pendenteAndamento").value;

        var itens = await fetch.listarProcessos(pagina, tamPagina, nomeParceiro, cpf, nomeProcesso, numeroProcesso, pendenteAndamento);
        setDados({ lista: itens.processos, temMais: itens.temMais });
    }

    const atualizarProcesso = (novoProcesso) => {
        setProcesso(novoProcesso);
    }

    useEffect(() => {
        pesquisar();
    }, [pagina, atualizar]);

    return (
        <>
            <div className={style.container}>
                <div className={style.caixapesquisa}>
                    <div className={style.pesquisa}>
                        <div>
                            <input type="text" placeholder="Nome do parceiro" id="nomeParceiro" />
                        </div>
                        <div>
                            <InputMask mask="999.999.999-99" placeholder="CPF" id="cpf" type="text" />
                        </div>
                        <div>
                            <input type="text" placeholder="Nome do processo" id="nomeProcesso" />
                        </div>
                        <div>
                            <input type="text" placeholder="Número do processo" id="numeroProcesso" />
                        </div>
                        <div>
                            <select id="pendenteAndamento">
                                <option value="-">Indiferente</option>
                                <option selected value={true}>Pendente de andamento</option>
                                <option value={false}>Sem pendência de andamento</option>
                            </select>
                        </div>
                        <div className={style.botao}>
                            <select id="tamPagina" onChange={(e) => setTamPagina(e.target.value)}>
                                <option>5</option>
                                <option>10</option>
                                <option>20</option>
                                <option>50</option>
                            </select>
                            <button title="Adicionar processo" onClick={() => setExibirModal(true)}><FontAwesomeIcon icon={faPlus} /></button>
                            <button title="Pesquisar" onClick={() => botaoPesquisar()}><FontAwesomeIcon icon={faMagnifyingGlass} /></button>
                        </div>
                    </div>
                    <div className={style.resultados}>
                        <h1>Processos</h1>
                        <div className={style.listaprocessos}>
                            {dados.lista && dados.lista.length > 0 ?
                                dados.lista.map((item) => (
                                    <ItemProcesso processo={item} atualizarProcesso={atualizarProcesso} />
                                ))
                            : <p>Nenhum resultado com esses filtros foi encontrado</p>}
                        </div>
                    </div>
                    {dados.lista && dados.lista.length > 0 ?
                        <div className={style.controles}>
                            <AnteriorIcone className={pagina === 1 ? style.desabilitado : ""} onClick={() => pagina > 1 ? setPagina(pagina - 1) : ""} />
                            <p>{pagina}</p>
                            <ProximoIcone className={dados.temMais === false ? style.desabilitado : ""} onClick={() => dados.temMais === true ? setPagina(pagina + 1) : ""} />
                        </div>
                    : ""}
                </div>
                <DadosProcesso dadosProcesso={processo} fechar={atualizarProcesso} atualizarPesquisa={() => setAtualizar(!atualizar)} />
                <ModalCriarProcesso
                    show={exibirModal}
                    onHide={() => setExibirModal(false)}
                    atualizar={() => setAtualizar(!atualizar)}
                />
            </div>
        </>
    );
}

export default ProcessesPage;