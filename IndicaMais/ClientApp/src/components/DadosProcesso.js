import { useState, useEffect } from 'react';
import style from './DadosProcesso.module.scss';
import Fetch from '../classes/Fetch';
import { faScaleBalanced, faXmark, faHandPointRight, faIdCard, faTriangleExclamation, faTrash, faPencil } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Recursos from '../classes/Recursos';
import Utils from '../classes/Utils';
import InputMask from "react-input-mask";
import ModalConfirmacao from './ModalConfirmacao';

function DadosProcesso({ dadosProcesso, fechar, atualizarPesquisa }) {
    const fetch = new Fetch();
    const recursos = new Recursos();
    const utils = new Utils();
    const ProximoIcone = recursos.getProximo();
    const AnteriorIcone = recursos.getAnterior();
    const RecarregarIcone = recursos.getRecarregar();

    const [exibirModalExcluirAndamento, setExibirModalExcluirAndamento] = useState(false);
    const [exibirModalExcluirProcesso, setExibirModalExcluirProcesso] = useState(false);
    const [processo, setProcesso] = useState(dadosProcesso);
    const [idAndamento, setIdAndamento] = useState(null);
    const [atualizar, setAtualizar] = useState(false);
    const [dados, setDados] = useState({
        lista: null,
        temMais: null
    });
    const [pagina, setPagina] = useState(1);

    const adicionarAndamento = async () => {
        var descricao = document.getElementById("addAndamento").value.trim();

        if (descricao !== '') {
            var resposta = await fetch.adicionarAndamento(processo.id, descricao);

            if (resposta === true) {
                alert("Andamento adicionado com sucesso");
                setAtualizar(!atualizar);
                document.getElementById("addAndamento").value = "";
            } else {
                alert("Não foi possível adicionar o andamento. Tente novamente");
            }
        }
    }

    const excluirProcesso = async () => {
        var resposta = await fetch.excluirProcesso(processo.id);

        if (resposta) {
            return { ok: true, sucesso: true, mensagem: "Processo excluído com sucesso" };
        } else {
            return { ok: true, sucesso: false, mensagem: "Não foi possível excluir o processo. Tente novamente" };
        }
    }

    const excluirAndamento = async () => {
        var resposta = await fetch.excluirAndamento(processo.id, idAndamento);

        if (resposta) {
            return { ok: true, sucesso: true, mensagem: "Andamento excluído com sucesso" };
        } else {
            return { ok: true, sucesso: false, mensagem: "Não foi possível excluir o andamento. Tente novamente" };
        }
    }

    const exibirModalConfirmacao = (idAndamento) => {
        setIdAndamento(idAndamento);
        setExibirModalExcluirAndamento(true);
    }

    const fecharModalExcluirProcesso = () => {
        atualizarPesquisa();
        fechar();
    }

    useEffect(() => {
        const buscarDados = async () => {
            if (processo != null) {
                var dados = await fetch.listarAndamentos(processo.id, pagina, 3);
                setDados({ lista: dados.andamentos, temMais: dados.temMais });
            }
        }

        buscarDados();
    }, [pagina]);

    useEffect(() => {
        const buscarDados = async () => {
            if (processo != null) {
                var processoAtualizado = await fetch.buscarDadosProcesso(processo.id);
                setProcesso(processoAtualizado);
            }
            
            if (processo != null) {
                var dados = await fetch.listarAndamentos(processo.id, pagina, 3);
                setDados({ lista: dados.andamentos, temMais: dados.temMais });
            }
        }

        buscarDados();
    }, [atualizar]);

    useEffect(() => {
        const buscarDados = async () => {
            if (processo != null) {
                var dados = await fetch.listarAndamentos(processo.id, pagina, 3);
                setPagina(1);
                setDados({ lista: dados.andamentos, temMais: dados.temMais });
            }
        }

        buscarDados();
    }, [processo]);

    useEffect(() => {
        setProcesso(dadosProcesso);
    }, [dadosProcesso]);

    //TODO: Implementar edição de andamentos
    if (processo != null) {
        return (
            <>
                <div className={style.dados}>
                    <p className={style.fechar}><FontAwesomeIcon onClick={() => fechar(null)} icon={faXmark} /></p>
                    <div className={style.nome}>
                        <p className={style.iconeconta}><FontAwesomeIcon icon={faScaleBalanced} /></p>
                        <h2>{processo.numero}</h2>
                        <p><em>{processo.nome}</em></p>
                        <>
                            <div className={style.informacoes}>
                                <p title="Cliente do processo"><FontAwesomeIcon icon={faHandPointRight} /> {processo.nomeParceiro}</p>
                                <p title="CPF"><FontAwesomeIcon icon={faIdCard} /> {processo.cpfParceiro ? <InputMask mask="999.999.999-99" disabled value={processo.cpfParceiro} /> : "[Sem CPF]"}</p>
                            </div>
                        </>
                    </div>
                    <div className={style.botoes}>
                        <button className={style.excluirprocesso} onClick={() => setExibirModalExcluirProcesso(true)}><FontAwesomeIcon icon={faTrash} /> Excluir processo</button>
                    </div>
                    <hr />
                    <div className={style.andamentos}>
                        <p>Andamentos</p>
                        {processo.pendenteAndamento === true ? <p className={style.avisoandamento}><FontAwesomeIcon icon={faTriangleExclamation} /> Andamento solicitado</p> : ""}
                        <div className={style.containertabela}>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Data</th>
                                        <th>Descrição</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dados.lista && dados.lista.length > 0 ?
                                        dados.lista.map((andamento) => (
                                            <tr>
                                                <td>{utils.formatarData(andamento.data)}</td>
                                                <td>{andamento.descricao}</td>
                                                <td>
                                                    <FontAwesomeIcon icon={faPencil} className={style.editar} />
                                                    <FontAwesomeIcon icon={faTrash} className={style.excluir} onClick={() => exibirModalConfirmacao(andamento.id)} />
                                                </td>
                                            </tr>
                                        ))
                                    : <tr><td colSpan={3}>Nenhum andamento encontrado</td></tr>}
                                    <tr>
                                        <td colSpan={3} className={style.addandamento}>
                                            <textarea placeholder="Adicionar andamento" id="addAndamento" />
                                            <button onClick={() => adicionarAndamento()}>Adicionar</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className={style.controles}>
                            <div>
                                <RecarregarIcone onClick={() => setAtualizar(!atualizar)} />
                            </div>
                            <div>
                                <AnteriorIcone className={pagina === 1 ? style.desabilitado : ""} onClick={() => pagina > 1 ? setPagina(pagina - 1) : ""} />
                                <p>{pagina}</p>
                                <ProximoIcone className={dados.temMais === false ? style.desabilitado : ""} onClick={() => dados.temMais === true ? setPagina(pagina + 1) : ""} />
                            </div>
                        </div>
                    </div>
                </div>
                <ModalConfirmacao
                    acao={excluirProcesso}
                    onHide={() => setExibirModalExcluirProcesso(false)}
                    show={exibirModalExcluirProcesso}
                    titulo="Excluir processo"
                    mensagemConfirmacao="Você tem certeza de que quer excluir este processo? Todos os andamentos vinculados a ele serão perdidos"
                    tituloBotao="Excluir"
                    acaoPosterior={fecharModalExcluirProcesso} />
                <ModalConfirmacao
                    acao={excluirAndamento}
                    onHide={() => setExibirModalExcluirAndamento(false)}
                    show={exibirModalExcluirAndamento}
                    titulo="Excluir andamento"
                    mensagemConfirmacao="Você tem certeza de que quer excluir este andamento? Essa ação não poderá ser desfeita"
                    tituloBotao="Excluir"
                    acaoPosterior={() => setAtualizar(!atualizar)} />
            </>
        );
    }
}

export default DadosProcesso;