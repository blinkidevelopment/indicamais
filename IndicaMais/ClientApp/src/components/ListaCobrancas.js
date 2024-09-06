import Recursos from "../classes/Recursos";
import style from "./ListaCobrancas.module.scss";
import Fetch from "../classes/Fetch";
import { useState, useEffect } from "react";
import Utils from "../classes/Utils";
import { useTenant } from "../TenantContext";

function ListaCobrancas() {
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
            var itens = await fetch.listarCobrancas(pagina);
            setDados({ lista: itens.data, temMais: itens.hasMore });
        }

        buscarDados();
    }, [pagina, atualizar]);

    useEffect(() => {
        setCorFundo(tenant.corSecundaria);
    }, [tenant]);

    const soma = () => {
        let soma = 0;

        dados.lista.forEach(cobranca => {
            soma += cobranca.value
        });

        return soma;
    }

    return (
        <div className={style.indicacoes}>
            <p onClick={() => setExibirLista(!exibirLista)}>
                <SetaColapsarIcone className={exibirLista === true ? style.colapsar + " " + style.aberto : style.colapsar} /> Cobranças
            </p>
            {exibirLista ?
                <>
                    {dados.lista ?
                        <>
                            <table>
                                <thead style={{ background: utils.transformarCor(corFundo, -10, 0, 0) }}>
                                    <tr>
                                        <th scope="col">Data</th>
                                        <th scope="col">Descrição</th>
                                        <th scope="col">Valor</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dados.lista.length >= 1 ?
                                        dados.lista.map((cobranca, index) => (
                                            <tr style={{ background: index % 2 === 0 ? utils.transformarCor(corFundo, 0, -0.10, 0.05)
                                                : utils.transformarCor(corFundo, -1, 0, 0.29) }}>
                                                <td>{new Intl.DateTimeFormat('pt-BR', { day: "numeric", month: "numeric", year: "numeric" }).format(new Date(cobranca.dateCreated))}</td>
                                                <td>{cobranca.description}</td>
                                                <td>R$ {cobranca.value}</td>
                                            </tr>
                                        ))
                                    :
                                        <tr style={{ background: utils.transformarCor(corFundo, 0, -0.10, 0.05) }}>
                                            <td colSpan="3">Você não tem nenhuma cobrança em aberto</td>
                                        </tr>
                                    }
                                </tbody>
                                {dados.lista.length >= 1 ?
                                    <tfoot style={{ background: utils.transformarCor(corFundo, -10, 0, 0) }}>
                                        <tr>
                                            <th colSpan="2">Valor total</th>
                                            <td>R$ {soma()}</td>
                                        </tr>
                                    </tfoot>
                                : null}
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
            : <img className={style.icone} src={recursos.getCobranca()} alt="Cobranças" />}
        </div>
    );
}

export default ListaCobrancas;
