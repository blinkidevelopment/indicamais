import React, { Component, useState, useEffect } from "react";
import Recursos from "../classes/Recursos";
import style from "./Login.module.scss";
import Fetch from "../classes/Fetch";
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTenant } from '../TenantContext';

function LoginEscritorio() {
    var recursos = new Recursos();
    var fetch = new Fetch();
    const tenant = useTenant();

    const EnviandoIcone = recursos.getEnviando();
    const [enviado, setEnviado] = useState(null);
    const [exibirSenha, setExibirSenha] = useState(false);
    const [logo, setLogo] = useState(null);

    function enviar(e) {
        if (e.keyCode === 13) {
            enviarSolicitacao();
        }
    }

    async function enviarSolicitacao() {
        setEnviado(true);

        var email = document.getElementById("email").value;
        var senha = document.getElementById("senha").value;

        if (email && senha) {
            var resultado = await fetch.conectarEscritorio(email, senha);

            if (resultado.status === 200) {
                window.location.href = "/escritorio";
            } else if (resultado.status === 401) {
                alert('O e-mail ou senha inseridos não existem');
                setEnviado(false);
            }
        } else {
            alert('Digite um e-mail e senha válidos!');
            setEnviado(false);
        }
    }

    useEffect(() => {
        const logoBase64 = `data:${tenant.logoMimeType};base64,${tenant.logo}`;
        setLogo(logoBase64);
    }, [tenant]);

    return (
        <div className={style.login}>
            <div className={style.logincard}>
                <img src={logo} alt="Logo da Empresa" className={style.logo} />
                <div className={style.formulario}>
                    <h1>{tenant.nomeApp}</h1>
                    <div className={style.campo}>
                        <input type="text" placeholder="E-mail" id="email" />
                    </div>
                    <div className={style.campo}>
                        <input placeholder="Senha" id="senha" type={exibirSenha === false ? "password" : "text"} onKeyDown={(e) => enviar(e)} />
                        <p className={style.exibirsenha}><FontAwesomeIcon icon={exibirSenha === false ? faEye : faEyeSlash} onClick={() => setExibirSenha(!exibirSenha)} /></p>
                    </div>
                    <div className={style.botao}>
                        <button className={enviado ? style.enviado : ""} id="btentrar" type="button" disabled={enviado} onClick={() => enviarSolicitacao()}>
                            {enviado ? <EnviandoIcone className={style.enviando} />
                                : "Entrar"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginEscritorio;