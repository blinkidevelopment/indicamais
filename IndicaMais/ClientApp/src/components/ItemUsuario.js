import { useState, useEffect } from "react";
import styles from "./ItemUsuario.module.scss";
import { faPencil, faXmark, faFloppyDisk, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Fetch from "../classes/Fetch";
import ModalConfirmacao from "./ModalConfirmacao";

function ItemUsuario({ adicionar, usuario, atualizar }) {
    const fetch = new Fetch();
    const [edicao, setEdicao] = useState(false);
    const [exibirModal, setExibirModal] = useState(false);
    const [mensagemModal, setMensagemModal] = useState(null);
    const [cargos, setCargos] = useState(null);

    async function criar() {
        var nome = document.getElementById("nome").value;
        var email = document.getElementById("email").value;
        var senha = document.getElementById("senha").value;
        var cargo = document.getElementById("cargo").value;

        if (nome && email && senha && cargo) {
            var resposta = await fetch.criarUsuario(nome, email, senha, cargo);
            if (resposta) {
                atualizar();
                setEdicao(false);
                alert("Usuário criado");
            } else {
                alert("Ocorreu um erro");
            }
        } else {
            alert("Preencha os campos corretamente");
        }
    }

    async function editar() {
        var id = usuario.id;
        var nome = document.getElementById("nome").value;
        var email = document.getElementById("email").value;
        var senha = document.getElementById("senha").value;
        var cargo = document.getElementById("cargo").value;

        if (nome && email && cargo) {
            var resposta = await fetch.editarUsuario(id, nome, email, senha, cargo);
            if (resposta) {
                atualizar();
                setEdicao(false);
                alert("Usuário atualizado");
            } else {
                alert("Ocorreu um erro");
            }
        } else {
            alert("Preencha os campos corretamente");
        }
    }

    const excluir = async () => {
        var id = usuario.id;
        var resposta = await fetch.excluirUsuario(id);

        if (resposta) {
            return { ok: true, sucesso: true, mensagem: "Usuário excluído com sucesso" };
        } else {
            return { ok: true, sucesso: false, mensagem: "Ocorreu um erro ao tentar excluir o usuário" };
        }
    }

    useEffect(() => {
        const buscarDados = async () => {
            var dados = await fetch.listarCargos();
            setCargos(dados);
        }
        buscarDados();
    }, [])

    if (adicionar === true) {
        if (edicao === false) {
            return (
                <div className={styles.usuario + " " + styles.edicao}>
                    <div>
                        <div>
                            <h2>Adicionar usuário</h2>
                        </div>
                        <div className={styles.divacao}>
                            <p><FontAwesomeIcon className={styles.acao} icon={faPlus} onClick={() => setEdicao(!edicao)} /></p>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className={styles.usuario + " " + styles.edicao}>
                    <div>
                        <div>
                            <input id="nome" placeholder="Nome do usuário" type="text" />
                        </div>
                        <div>
                            <input id="email" placeholder="E-mail" type="email" />
                        </div>
                        <div>
                            <input id="senha" placeholder="Senha" type="password" />
                        </div>
                        <div>
                            <select id="cargo">
                                {cargos && cargos.length > 0 ?
                                    cargos.map((cargo) => (
                                        <option value={cargo}>{cargo}</option>
                                    ))
                                : ""}
                            </select>
                        </div>
                        <div className={styles.divacao}>
                            <p><FontAwesomeIcon className={styles.acao} icon={faFloppyDisk} onClick={() => criar()} /></p>
                            <p><FontAwesomeIcon className={styles.acao} icon={faXmark} onClick={() => setEdicao(!edicao)} /></p>
                        </div>
                    </div>
                </div>
            );
        }
    } else if (edicao === false) {
        return (
            <>
                <div className={styles.usuario}>
                    <div className={styles.nome}>
                        <p>{usuario.name}</p>
                    </div>
                    <div>
                        <p>{usuario.email}</p>
                    </div>
                    <div>
                        <p>{usuario.isRoot === true ? "Usuário raiz" : "Usuário comum"}</p>
                    </div>
                    <div>
                        <p><strong>Cargo:</strong> {usuario.role}</p>
                    </div>
                    <div className={styles.divacao}>
                        <p><FontAwesomeIcon className={styles.acao} icon={faPencil} onClick={() => setEdicao(!edicao)} /></p>
                        {usuario.isRoot === false ? <p><FontAwesomeIcon className={styles.acao} icon={faTrash} onClick={() => setExibirModal(true)} /></p> : ""}
                    </div>
                </div>
                <ModalConfirmacao
                    acao={excluir}
                    onHide={() => setExibirModal(false)}
                    show={exibirModal}
                    titulo="Excluir usuário"
                    mensagemConfirmacao="Tem certeza de que quer excluir este usuário? Essa ação não pode ser desfeita"
                    tituloBotao="Excluir mesmo assim"
                    acaoPosterior={atualizar} />
            </>
        );
    } else {
        return (
            <div className={styles.usuario + " " + styles.edicao}>
                <div>
                    <div>
                        <input id="nome" placeholder="Nome do usuário" type="text" defaultValue={usuario.name} />
                    </div>
                    <div>
                        <input id="email" placeholder="E-mail" type="email" defaultValue={usuario.email} />
                    </div>
                    <div>
                        <input id="senha" placeholder="•••••••••••••••" type="password" />
                    </div>
                    <div>
                        <select id="cargo">
                            {cargos && cargos.length > 0 ?
                                cargos.map((cargo) => (
                                    <option selected={usuario.role === cargo ? true : false} value={cargo}>{cargo}</option>
                                ))
                            : ""}
                        </select>
                    </div>
                    <div className={styles.divacao + " " + styles.divacaomenor}>
                        <p><FontAwesomeIcon className={styles.acao} icon={faFloppyDisk} onClick={() => editar()} /></p>
                        <p><FontAwesomeIcon className={styles.acao} icon={faXmark} onClick={() => setEdicao(!edicao)} /></p>
                    </div>
                </div>
            </div>
        );
    }
}

export default ItemUsuario;
