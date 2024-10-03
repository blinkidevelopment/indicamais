import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Recursos from "../classes/Recursos";
import style from "./Cadastro.module.scss";
import Fetch from "../classes/Fetch";
import Utils from "../classes/Utils";
import InputMask from "react-input-mask";
import { faCircleCheck, faCircleXmark, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTenant } from '../TenantContext';

function CadastroIndicado() {
    var { id } = useParams();
    const recursos = new Recursos();
    const fetch = new Fetch();
    const utils = new Utils();
    const tenant = useTenant();
    const EnviandoIcone = recursos.getEnviando();

    const [nomeIndicador, setNomeIndicador] = useState("");
    const [enviado, setEnviado] = useState(null);
    const [mensagem, setMensagem] = useState(null);
    const [concluido, setConcluido] = useState({
        ok: false,
        sucesso: false
    });
    const [exibirBotaoLogin, setExibirBotaoLogin] = useState(false);
    const [logo, setLogo] = useState(null);

    useEffect(() => {
        const buscarDados = async () => {
            var nome = await fetch.buscarNomeCodigo(id);
            setNomeIndicador(nome);
        }

        buscarDados();
    }, [id]);

    useEffect(() => {
        const logoBase64 = `data:${tenant.logoMimeType};base64,${tenant.logo}`;
        setLogo(logoBase64);
    }, [tenant]);

    function resetar() {
        setMensagem(null);
        setExibirBotaoLogin(false);
        setConcluido({
            ok: false,
            sucesso: false
        })
    }

    function cancelar() {
        window.location.href = '/';
    }

    async function enviarSolicitacao() {
        setEnviado(true);
        setMensagem(false);

        var nome = document.getElementById('nome').value.trim();
        var celular = document.getElementById("celular").value.replace(/[()\-_ ]/g, '');

        if (nome !== '' && (celular === '' || celular.length === 11)) {
            var resposta = await fetch.criarIndicacaoCodigo(nome, celular, id);

            if (resposta != null) {
                var status = resposta.status;

                if (status === 200) {
                    setConcluido({
                        ok: true,
                        sucesso: true
                    });
                    setExibirBotaoLogin(false);
                    setMensagem("Agradecemos a sua indicação. Logo entraremos em contato com você!");
                } else if (status === 409) {
                    setConcluido({
                        ok: true,
                        sucesso: false
                    });
                    setExibirBotaoLogin(true);
                    setMensagem("Parece que você já foi indicado por alguém. Tente criar sua conta ou fazer login");
                } else if (status === 400) {
                    setConcluido({
                        ok: true,
                        sucesso: false
                    });
                    setExibirBotaoLogin(false);
                    setMensagem("Ocorreu um erro, tente novamente");
                }

                setEnviado(false);
            }
        } else {
            setEnviado(false);
            setMensagem("Preencha os campos corretamente");
        }
    }

    return (
        <div className={style.cadastro}>
            <div className={style.cadastrocard}>
                <img src={logo} alt="Logo da Empresa" className={style.logo} />
                <div className={style.formulario}>
                    <p className={style.boasvindas}><strong>{nomeIndicador}</strong> está convidando você para conhecer os serviços da <strong>{tenant.nome}</strong>. Cadastre-se abaixo para prosseguir!</p>
                    {concluido.sucesso === false ?
                        <>
                            <div className={style.campo}>
                                <input placeholder="Nome" id="nome" type="text" onChange={() => resetar()} />
                            </div>
                            <div className={style.campo}>
                                <InputMask mask="(99) 99999-9999" placeholder="Celular" id="celular" type="tel" onChange={() => resetar()} />
                            </div>
                        </>
                    : ""}
                    {mensagem ? <p className={concluido.ok === true && concluido.sucesso === true ? style.mensagemindicacao : style.mensagem}>{mensagem}</p> : ""}
                    {concluido.ok === true && concluido.sucesso === true ?
                        ""
                        :
                        <div className={style.botao}>
                            {exibirBotaoLogin === false ?
                                <button className={enviado ? style.enviado : ""} id="btentrar" disabled={enviado} onClick={() => enviarSolicitacao()}>
                                    {enviado ? <EnviandoIcone className={style.enviando} />
                                        : "Cadastrar"}
                                </button>
                                :
                                <div className={style.botoesacao}>
                                    <button className={enviado ? style.enviado : ""} id="btentrar" disabled={enviado} onClick={() => enviarSolicitacao()}>
                                        {enviado ? <EnviandoIcone className={style.enviando} />
                                            : "Criar conta"}
                                    </button>
                                    <button className={enviado ? style.enviado : ""} id="btentrar" disabled={enviado} onClick={() => enviarSolicitacao()}>
                                        {enviado ? <EnviandoIcone className={style.enviando} />
                                            : "Fazer login"}
                                    </button>
                                </div>}
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}

export default CadastroIndicado;