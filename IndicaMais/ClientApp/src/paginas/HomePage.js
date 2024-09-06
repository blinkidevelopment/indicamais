import style from './HomePage.module.scss';
import Recursos from '../classes/Recursos';
import { useEffect, useState } from 'react';
import Fetch from '../classes/Fetch';
import ModalResgatar from '../components/ModalResgatar';
import ModalIndicar from '../components/ModalIndicar';
import ListaIndicacoes from '../components/ListaIndicacoes';
import ListaTransacoes from '../components/ListaTransacoes';
import ListaCobrancas from '../components/ListaCobrancas';
import { faRightFromBracket, faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ModalAbater from '../components/ModalAbater';

function HomePage() {
    const recursos = new Recursos();
    const fetch = new Fetch();
    const ContaIcone = recursos.getConta();
    const IndicarIcone = recursos.getIndicar();
    const ResgatarIcone = recursos.getResgatar();
    const AbaterIcone = recursos.getAbater();

    const [usuario, setUsuario] = useState(null);
    const [exibir, setExibir] = useState(false);
    const [atualizar, setAtualizar] = useState(false);
    const [modalResgatarShow, setModalResgatarShow] = useState(false);
    const [modalAbaterShow, setModalAbaterShow] = useState(false);
    const [modalIndicarShow, setModalIndicarShow] = useState(false);
    const [acoesConta, setAcoesConta] = useState(false);
    const [qtdIndicacoes, setQtdIndicacoes] = useState({
        total: 0,
        fechadas: 0
    })

    function editarDados() {
        window.location.href = "/editar-dados";
    }

    const atualizarQtdIndicacoes = async () => {
        setQtdIndicacoes({
            total: await fetch.contarIndicacoes(false),
            fechadas: await fetch.contarIndicacoes(true)
        });
    }

    useEffect(() => {
        const body = document.querySelector('body');
        body.classList.add(style.bodybg);
    }, []);

    useEffect(() => {
        const buscarDados = async () => {
            var dados = await fetch.buscarUsuario();
            setUsuario(dados);

            if (dados.tipo === 1) {
                atualizarQtdIndicacoes();
            }
        }

        buscarDados();
    }, [atualizar]);

    return (
        <div>
            <div className={style.cabecalho}>
                <div className={style.menuconta}>
                    <ContaIcone className={style.conta} onClick={() => setAcoesConta(!acoesConta)} />
                    {acoesConta === true ?
                        <div className={style.blocoacao}>
                            <p onClick={() => editarDados()}><FontAwesomeIcon icon={faPencil} /> Editar dados</p>
                            <p onClick={() => fetch.desconectar()}><FontAwesomeIcon icon={faRightFromBracket} /> Desconectar</p>
                        </div>
                    : ""}
                </div>
                <h1>Olá, {usuario ? usuario.nome : ""}</h1>
            </div>
            <div className={style.saldo}>
                {usuario ? usuario.tipo === 0 ?
                    <>
                        <div className={style.exibir}>
                            <h1>Saldo de indicação</h1>
                            <p className={style.exibir} onClick={() => setExibir(!exibir)}>{exibir ? <FontAwesomeIcon icon={faEye} /> : <FontAwesomeIcon icon={faEyeSlash} />}</p>
                        </div>
                        <div>
                            <p>R$</p>
                            <p id="valor">{usuario ? exibir ? usuario.credito + ",00" : "***" : ""} {exibir ? <FontAwesomeIcon icon={faArrowsRotate} className={style.atualizarcredito} onClick={() => setAtualizar(!atualizar)} /> : ""}</p>
                        </div>
                    </>
                    : usuario.tipo === 1 ?
                        <>
                            <div className={style.exibir}>
                                <h1>Suas indicações</h1>
                                <p className={style.exibir} onClick={() => atualizarQtdIndicacoes()}><FontAwesomeIcon icon={faArrowsRotate} /></p>
                            </div>
                            <div>
                                <p>{qtdIndicacoes.fechadas}</p><span>fecharam</span>
                                <p>{qtdIndicacoes.total}</p><span>totais</span>
                            </div>
                        </>
                    : "" : ""}
            </div>
            <div className={style.servicos}>
                <div>
                    <div id={style["indicar"]} className={style.servico} onClick={() => setModalIndicarShow(true)}>
                        <IndicarIcone className={style.icone} />
                    </div>
                    <p>Indicar</p>
                </div>
                {usuario ? usuario.tipo === 0 ?
                    <div>
                        <div id={style["resgatar"]} className={style.servico} onClick={() => setModalResgatarShow(true)}>
                            <ResgatarIcone className={style.icone} />
                        </div>
                        <p>Resgatar</p>
                    </div>
                : "" : ""}
                {usuario ? usuario.tipo === 0 ?
                    <div>
                        <div id={style["abater"]} className={style.servico} onClick={() => setModalAbaterShow(true)}>
                            <AbaterIcone className={style.icone} />
                        </div>
                        <p>Abater</p>
                    </div>
                : "" : ""}
            </div>
            <div className={style.listas}>
                <ListaIndicacoes usuario={usuario} />
                {usuario ? usuario.tipo == 0 ? <ListaTransacoes /> : "" : ""}
                {usuario ? usuario.tipo === 0 ? <ListaCobrancas /> : "" : ""}
            </div>
            {usuario ?
                <>
                    {usuario.tipo === 0 ?
                        <ModalResgatar
                            show={modalResgatarShow}
                            onHide={() => setModalResgatarShow(false)}
                            usuario={usuario.id}
                            saldo={usuario.credito}
                            resgate={true}
                            atualizar={() => setAtualizar(!atualizar)}
                        />
                    : ""}
                    {usuario.tipo === 0 ?
                        <ModalAbater
                            show={modalAbaterShow}
                            onHide={() => setModalAbaterShow(false)}
                            usuario={usuario.id}
                            saldo={usuario.credito}
                            atualizar={() => setAtualizar(!atualizar)}
                        />
                    : ""}
                    <ModalIndicar
                        show={modalIndicarShow}
                        onHide={() => setModalIndicarShow(false)}
                        idParceiro={usuario.id}
                    />
                </>
            : ""}
        </div>
    );
}

export default HomePage;