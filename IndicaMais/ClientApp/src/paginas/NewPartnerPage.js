import React, { Component, useState, useEffect } from "react";
import Fetch from "../classes/Fetch";
import InputMask from "react-input-mask";
import { faCircleCheck, faCircleXmark, } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import style from './NewPartnerPage.module.scss';
import Utils from "../classes/Utils";
import Recursos from "../classes/Recursos";
import AsyncSelect from "react-select/async";

function NewPartnerPage() {
    const fetch = new Fetch();
    const utils = new Utils();
    const recursos = new Recursos();
    const EnviandoIcone = recursos.getEnviando();

    const [debounceTimeout, setDebounceTimeout] = useState(null);
    const [enviado, setEnviado] = useState(null);
    const [tipoParceiro, setTipoParceiro] = useState("1");
    const [cpf, setCpf] = useState(null);
    const [idIndicador, setIdIndicador] = useState(null);
    const [contratoFechado, setContratoFechado] = useState(false);
    const [senha, setSenha] = useState(null);
    const [confirmacao, setConfirmacao] = useState(null);
    const [valCpf, setValCpf] = useState(false);
    const [valSenha, setValSenha] = useState({
        minCaract: false,
        confirmacao: null
    });

    function validarSenha() {
        setValSenha({
            minCaract: utils.validarSenha(senha, 0)
        });
    }

    function validarCpf() {
        setValCpf(utils.validarCpf(cpf));
    }

    function confirmarSenha() {
        confirmacao === senha ? setValSenha({ ...valSenha, confirmacao: true }) : setValSenha({ ...valSenha, confirmacao: false });
    }

    useEffect(() => {
        if (senha) {
            validarSenha();
            if (confirmacao) {
                confirmarSenha();
            }
        }
    }, [senha]);

    useEffect(() => {
        if (confirmacao) {
            confirmarSenha();
        }
    }, [confirmacao]);

    useEffect(() => {
        if (cpf) {
            validarCpf();
        }
    }, [cpf]);

    useEffect(() => {
        if (idIndicador === null) {
            setContratoFechado(false);
        }
    }, [idIndicador])

    useEffect(() => {
        const body = document.querySelector('body');
        body.classList.add(style.bodybg);
    }, []);

    const loadOptions = (input, callback) => {
        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }
        const timeout = setTimeout(async () => {
            const options = await fetchOptions(input);
            callback(options);
        }, 500);

        setDebounceTimeout(timeout);
    };

    const fetchOptions = async (input) => {
        if (!input) {
            return [];
        }

        try {
            const resultado = await fetch.buscarParceirosNome(input);

            return resultado.map(item => ({
                label: item.nome + " - " + (item.cpf ? ("CPF: " + item.cpf) : "[SEM CPF]"),
                value: item.id
            }));
        } catch {
            return [{ label: 'Erro ao carregar', value: null }];
        }
    };

    async function enviarSolicitacao() {
        setEnviado(true);
        var nome = document.getElementById('nome').value;
        var celular = document.getElementById('celular').value.replace(/[()\-_ ]/g, '');
        var tipo = document.getElementById('tipo').value;

        if (nome && celular && valCpf === true && valSenha.confirmacao === true) {
            var resultado = await fetch.criarParceiro(nome, celular, cpf.replace(/[.\-_]/g, ''), tipo, senha, idIndicador, contratoFechado);

            if (resultado === true) {
                alert('Parceiro criado');
                setEnviado(false);
            } else {
                alert('Não foi possível cadastrar. Verifique se não há um parceiro já cadastrado com o CPF e/ou celular informados');
                setEnviado(false);
            }
        } else {
            alert('Preencha os campos corretamente');
            setEnviado(false);
        }
    }

    return (
        <div className={style.container}>
            <h1>Cadastrar parceiro</h1>
            <div className={style.cardcadastro}>
                <div className={style.campo}>
                    <input type="text" id="nome" placeholder="Nome" />
                </div>
                <div className={style.campo}>
                    <InputMask mask="(99) 99999-9999" placeholder="Celular" id="celular" type="tel" />
                </div>
                <div className={style.campo}>
                    <InputMask mask="999.999.999-99" placeholder="CPF" id="cpf" type="text" onChange={(e) => setCpf(e.target.value)} />
                    {cpf ?
                        <div className={style.requisitos}>
                            {valCpf === true ? <p className={style.valido}><FontAwesomeIcon icon={faCircleCheck} /> CPF válido</p> : <p className={style.invalido}><FontAwesomeIcon icon={faCircleXmark} /> CPF inválido</p>}
                        </div>
                        : ""}
                </div>
                <div className={style.campo}>
                    <select id="tipo" onChange={(e) => setTipoParceiro(e.target.value)}>
                        <option value="1">Parceiro</option>
                        <option value="0">Indicador</option>
                    </select>
                </div>
                {tipoParceiro === "0" ? 
                    <div className={style.campo}>
                        <p>Selecione abaixo a pessoa que indicou esse cliente. Deixe em branco caso queira criar um cadastro sem indicação</p>
                        <AsyncSelect
                            cacheOptions
                            isClearable
                            loadOptions={loadOptions}
                            onChange={(selectedOption) => setIdIndicador(selectedOption ? selectedOption.value : null)}
                            placeholder="Digite para pesquisar..."
                            noOptionsMessage={() => "Nenhum resultado encontrado"}
                            loadingMessage={() => "Carregando..."}
                        />
                        {idIndicador !== null ?
                            <>
                                <label htmlFor="contratoFechado">Marcar como contrato fechado</label>
                                <input type="checkbox" id="contratoFechado" checked={contratoFechado} onChange={(e) => setContratoFechado(e.target.checked)} />
                                <p className={style.aviso}>Ao selecionar essa opção, o indicador será marcado como contrato fechado e a pessoa que o indicou terá o valor da carteira atualizado</p>
                            </>
                        : ""}
                    </div>
                : ""}
                <div className={style.campo}>
                    <input placeholder="Senha" id="senha" type="password" onChange={(e) => setSenha(e.target.value)} />
                    {senha ?
                        <div className={style.requisitos}>
                            <h5>Sua senha deve conter:</h5>
                            <p className={valSenha.minCaract === true ? style.valido : style.invalido}><FontAwesomeIcon icon={valSenha.minCaract === true ? faCircleCheck : faCircleXmark} /> No mínimo 6 caracteres</p>
                        </div>
                    : ""}
                </div>
                <div className={style.campo}>
                    <input placeholder="Confirmação da senha" id="confirmacaoSenha" type="password" onChange={(e) => setConfirmacao(e.target.value)} />
                    {senha && valSenha.confirmacao !== null ?
                        <div className={style.requisitos}>
                            {valSenha.confirmacao === true ? <p className={style.valido}><FontAwesomeIcon icon={faCircleCheck} /> As senhas são iguais</p> : <p className={style.invalido}><FontAwesomeIcon icon={faCircleXmark} /> As senhas devem ser iguais</p>}
                        </div>
                        : ""}
                </div>
                <div className={style.campo}>
                    <button className={enviado ? style.enviado : ""} id="btentrar" type="button" disabled={enviado} onClick={() => enviarSolicitacao()}>
                        {enviado ? <EnviandoIcone className={style.enviando} />
                            : "Cadastrar"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default NewPartnerPage;
