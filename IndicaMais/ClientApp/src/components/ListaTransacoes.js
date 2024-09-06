import Recursos from "../classes/Recursos";
import style from "./ListaTransacoes.module.scss";
import Fetch from "../classes/Fetch";
import { useState, useEffect } from "react";
import { faGift } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Utils from "../classes/Utils";
import { useTenant } from "../TenantContext";

function ListaTransacoes() {
    const recursos = new Recursos();
    const fetch = new Fetch();
    const utils = new Utils();
    const SetaColapsarIcone = recursos.getSetaColapsar();
    const ProximoIcone = recursos.getProximo();
    const AnteriorIcone = recursos.getAnterior();
    const RecarregarIcone = recursos.getRecarregar();
    const tenant = useTenant();

    const [corFundo, setCorFundo] = useState(null);
    const [exibirLista, setExibirLista] = useState(false);
    const [dados, setDados] = useState({
        lista: null,
        temMais: null
    });
    const [pagina, setPagina] = useState(1);
    const [atualizar, setAtualizar] = useState(false);

    useEffect(() => {
        const buscarDados = async () => {
            var itens = await fetch.listarTransacoes(pagina);
            setDados({ lista: itens.transacoes, temMais: itens.temMais });
        }

        buscarDados();
    }, [pagina, atualizar]);

    useEffect(() => {
        setCorFundo(tenant.corTerciaria);
    }, [tenant]);

    return (
        <div className={style.indicacoes}>
            <p onClick={() => setExibirLista(!exibirLista)}>
                <SetaColapsarIcone className={exibirLista === true ? style.colapsar + " " + style.aberto : style.colapsar} /> Transações
            </p>
            {exibirLista ?
                <>
                    {dados.lista ?
                        <>
                            <table>
                                <thead style={{ background: utils.transformarCor(corFundo, -32, -0.71, -0.02) }}>
                                    <tr>
                                        <th scope="col">Data</th>
                                        <th scope="col">Valor</th>
                                        <th scope="col">Tipo</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dados.lista.length >= 1 ?
                                        dados.lista.map((transacao, index) => (
                                            <tr style={{ background: index % 2 === 0 ? utils.transformarCor(corFundo, -32, -0.75, 0.20) 
                                                    : utils.transformarCor(corFundo, -32, -0.54, 0.35) }}>
                                                <td>{utils.formatarData(transacao.data)}</td>
                                                {transacao.tipo === 0 || transacao.tipo === 1 ? <td>R$ {transacao.valor}</td> : <td>{transacao.valor} pontos</td>}
                                                <td>{transacao.tipo === 0 ? "Resgate" : transacao.tipo === 1 ? "Abate" : <p className={style.premioresgatado}><FontAwesomeIcon icon={faGift} /> {transacao.nomePremio}</p>}</td>
                                            </tr>
                                        ))
                                    :
                                        <tr style={{ background: utils.transformarCor(corFundo, -32, -0.75, 0.20) }}>
                                            <td colSpan="3">Você ainda não fez nenhuma transação</td>
                                        </tr>
                                    }
                                </tbody>
                            </table>
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
                        </> :
                        <div className={style.carregando}>
                            <img src={recursos.getCarregando()} alt="Carregando" />
                        </div>
                    }
                </>
            : <img className={style.icone} src={recursos.getDinheiro()} alt="Transações" />}
        </div>
    );
}

export default ListaTransacoes;
