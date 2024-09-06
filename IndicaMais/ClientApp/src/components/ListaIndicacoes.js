import Recursos from "../classes/Recursos";
import style from "./ListaIndicacoes.module.scss";
import Fetch from "../classes/Fetch";
import { useState, useEffect } from "react";
import Utils from "../classes/Utils";
import { useTenant } from "../TenantContext";

function ListaIndicacoes({ usuario }) {
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
            var itens = await fetch.listarIndicacoes(pagina);
            setDados({ lista: itens.indicacoes, temMais: itens.temMais });
        }

        buscarDados();
    }, [pagina, atualizar]);

    useEffect(() => {
        setCorFundo(tenant.corPrimaria);
    }, [tenant]);

    return (
        <div className={style.indicacoes}>
            <p onClick={() => setExibirLista(!exibirLista)}>
                <SetaColapsarIcone className={exibirLista === true ? style.colapsar + " " + style.aberto : style.colapsar} /> Indicações
            </p>
            {exibirLista ?
                <>
                    {dados.lista ?
                        <>
                            <table>
                                <thead style={{ background: utils.transformarCor(corFundo, -42, -0.78, 0.09) }}>
                                    <tr>
                                        <th scope="col">Nome</th>
                                        <th scope="col">Telefone</th>
                                        <th scope="col">Fechou contrato?</th>
                                        {usuario.Tipo === 1 ? <th scope="col">Percentual repassado?</th> : ""}
                                    </tr>
                                </thead>
                                <tbody>
                                    {dados.lista.length >= 1 ?
                                        dados.lista.map((indicacao, index) => (
                                            <tr style={{ background: index % 2 === 0 ? utils.transformarCor(corFundo, -46, -0.78, 0.21)
                                                    : utils.transformarCor(corFundo, -73, -0.75, 0.43) }}>
                                                <td>{indicacao.nome}</td>
                                                <td>{indicacao.telefone}</td>
                                                <td>{indicacao.fechou ? <img src={recursos.getCheck()} alt="Fechou" /> : <img src={recursos.getCancelar()} alt="Não fechou" />}</td>
                                                {usuario.Tipo === 1 ? <td>{indicacao.repassado === true ? <img src={recursos.getCheck()} alt="Repassado" /> : <img src={recursos.getCancelar()} alt="Não repassado" />}</td> : ""}
                                            </tr>
                                        ))
                                    :
                                        <tr style={{ background: utils.transformarCor(corFundo, -46, -0.78, 0.21) }}>
                                            <td colSpan={usuario.Tipo === 1 ? 4 : 3}>Você ainda não fez nenhuma indicação</td>
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
            : <img className={style.icone} src={recursos.getIndicacoes()} alt="Indicações" />}
        </div>
    );
}

export default ListaIndicacoes;
