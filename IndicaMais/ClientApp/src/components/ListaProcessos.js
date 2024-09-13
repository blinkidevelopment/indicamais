import Recursos from "../classes/Recursos";
import Accordion from 'react-bootstrap/Accordion';
import style from "./ListaProcessos.module.scss";
import Fetch from "../classes/Fetch";
import { useState, useEffect } from "react";
import Utils from "../classes/Utils";

function ListaProcessos() {
    const recursos = new Recursos();
    const fetch = new Fetch();
    const utils = new Utils();
    const SetaColapsarIcone = recursos.getSetaColapsar();
    const ProximoIcone = recursos.getProximo();
    const AnteriorIcone = recursos.getAnterior();
    const RecarregarIcone = recursos.getRecarregar();

    const [exibirLista, setExibirLista] = useState(false);
    const [dados, setDados] = useState({
        lista: null,
        temMais: null
    });
    const [paginaProcessos, setPaginaProcessos] = useState(1);
    const [paginaAndamentos, setPaginaAndamentos] = useState(1);
    const [atualizar, setAtualizar] = useState(false);
    const [processo, setProcesso] = useState(null);
    const [andamentos, setAndamentos] = useState({
        lista: null,
        temMais: null
    });

    const atualizarProcesso = (index, processo) => {
        setProcesso(processo);
    }

    const pedirAndamento = async (id) => {
        await fetch.pedirAndamento(id);
        setAtualizar(!atualizar);
    }

    useEffect(() => {
        const buscarDados = async () => {
            var itens = await fetch.listarProcessosParceiro(paginaProcessos);
            setDados({ lista: itens.processos, temMais: itens.temMais });
        }

        buscarDados();
    }, [paginaProcessos, atualizar]);

    useEffect(() => {
        const buscarAndamentos = async () => {
            if (processo !== null) {
                var dados = await fetch.listarAndamentos(processo, paginaAndamentos, 1);
                setAndamentos({ lista: dados.andamentos, temMais: dados.temMais });
            }
        }

        buscarAndamentos();
    }, [processo, paginaAndamentos]);

    return (
        <div className={style.processos}>
            <p onClick={() => setExibirLista(!exibirLista)}>
                <SetaColapsarIcone className={exibirLista === true ? style.colapsar + " " + style.aberto : style.colapsar} /> Processos
            </p>
            {exibirLista ?
                <>
                    {dados.lista !== null && dados.lista.length >= 0 ?
                        <>
                            <Accordion className={style.acordeao}>
                                {dados.lista.map((processo, index) => (
                                    <Accordion.Item
                                        eventKey={index.toString()}
                                        key={index}
                                        className={style.processo}
                                        onClick={() => atualizarProcesso(index, processo.id)}
                                    >
                                        <Accordion.Header>{processo.numero} - {processo.nome}</Accordion.Header>
                                        <Accordion.Body className={style.containerandamento}>
                                            {andamentos.lista !== null ?
                                                andamentos.lista.map((andamento) => (
                                                    <div className={style.andamento}>
                                                        <div className={style.cabecalho}>
                                                            <h3>Andamento #{paginaAndamentos}</h3>
                                                            <p>{utils.formatarData(andamento.data)}</p>
                                                        </div>
                                                        <p>{andamento.descricao}</p>
                                                    </div>
                                                ))
                                            : ""}
                                            <div className={style.controles}>
                                                <div>
                                                    <button disabled={processo.pendenteAndamento} onClick={() => pedirAndamento(processo.id)}>Pedir andamento</button>
                                                    {processo.pendenteAndamento === true ?
                                                        <p className={style.avisoandamento}>Você pediu por um andamento de processo recentemente</p>
                                                    : ""}
                                                </div>
                                                <div>
                                                    <AnteriorIcone className={paginaAndamentos === 1 ? style.desabilitado : ""} onClick={() => paginaAndamentos > 1 ? setPaginaAndamentos(paginaAndamentos - 1) : ""} />
                                                    <p>{paginaAndamentos}</p>
                                                    <ProximoIcone className={andamentos.temMais === false ? style.desabilitado : ""} onClick={() => andamentos.temMais === true ? setPaginaAndamentos(paginaAndamentos + 1) : ""} />
                                                </div>
                                            </div>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                ))}
                            </Accordion>
                            <div className={style.controles}>
                                <div>
                                    <RecarregarIcone onClick={() => setAtualizar(!atualizar)} />
                                </div>
                                <div>
                                    <AnteriorIcone className={paginaProcessos === 1 ? style.desabilitado : ""} onClick={() => paginaProcessos > 1 ? setPaginaProcessos(paginaProcessos - 1) : ""} />
                                    <p>{paginaProcessos}</p>
                                    <ProximoIcone className={dados.temMais === false ? style.desabilitado : ""} onClick={() => dados.temMais === true ? setPaginaProcessos(paginaProcessos + 1) : ""} />
                                </div>
                            </div>
                        </>
                    :
                        <div className={style.carregando}>
                            <img src={recursos.getCarregando()} alt="Carregando" />
                        </div>
                    }
                </>
            : <img className={style.icone} src={recursos.getProcesso()} alt="Processos" />}
        </div>
    );
}

export default ListaProcessos;
