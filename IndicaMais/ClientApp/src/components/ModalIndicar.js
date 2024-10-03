import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import style from './ModalIndicar.module.scss';
import Fetch from '../classes/Fetch';
import Utils from '../classes/Utils';
import InputMask from "react-input-mask";
import QRCode from "react-qr-code";
import { faQrcode, faLink } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function ModalIndicar(props) {
    const fetch = new Fetch();

    const [exibirCodigo, setExibirCodigo] = useState(false);
    const [mensagem, setMensagem] = useState(null);
    const [concluido, setConcluido] = useState({
        ok: false,
        sucesso: false
    });

    function fechar() {
        props.onHide();
        resetar();
    }

    function resetar() {
        setExibirCodigo(false);
        setMensagem(null);
        setConcluido(false);
    }

    function mostrarCodigo() {
        setMensagem(null);
        setExibirCodigo(true);
    }

    function exibirMensagemToast(mensagem) {
        setMensagem(mensagem);
        setTimeout(() => {
            setMensagem(null);
        }, 4000);
    }

    async function indicar() {
        var nome = document.getElementById("nome").value.replace(/\s+/g, " ").trim();
        var celular = document.getElementById("celular").value.replace(/[()\-_ ]/g, '');

        if (nome !== '' && celular.length === 11) {
            setMensagem(null);

            var resposta = await fetch.criarIndicacao(nome, celular);
            if (resposta != null) {
                var status = resposta.status;

                if (status === 200) {
                    setConcluido({
                        ok: true,
                        sucesso: true
                    });
                    setMensagem("Indicação concluída");
                } else if (status === 409) {
                    setConcluido({
                        ok: true,
                        sucesso: false
                    });
                    setMensagem("Parece que essa pessoa já foi indicada por alguém ou já é cliente...");
                } else if (status === 400) {
                    setConcluido({
                        ok: true,
                        sucesso: false
                    });
                    setMensagem("Ocorreu um erro, tente novamente");
                }
            }
        } else {
            setMensagem("Digite um nome e celular válidos");
        }
    }

    function gerarLink() {
        const urlAtual = window.location.origin + window.location.pathname;
        return urlAtual + "indicar/" + props.codigoIndicacao;
    }

    function copiarLink() {
        const link = gerarLink();

        navigator.clipboard.writeText(link)
            .then(() => {
                exibirMensagemToast("Link copiado com sucesso");
            })
            .catch(() => {
                exibirMensagemToast("Não foi possível copiar o link, tente novamente")
            });
    }

    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            className={style.modal}
        >
            <Modal.Body>
                {exibirCodigo === true ?
                    <>
                        <h1>Código de indicação</h1>
                        <div className={style.containerqrcode}>
                            <div className={style.qrcode}>
                                <QRCode value={gerarLink()} className={style.codigo} />
                            </div>
                        </div>
                        <p className={style.copiarlink} onClick={() => copiarLink()}><FontAwesomeIcon icon={faLink} /> Copiar link de indicação</p>
                        {mensagem ? <p className={style.mensagemcodigo}>{mensagem}</p> : ""}
                    </>
                : concluido.ok ? 
                    <>
                        <h1>{concluido.sucesso ? "Sucesso!" : "Ops..."}</h1>
                        <p>{mensagem}</p>
                    </> : <>
                        <h1>Indicar</h1>
                        <p>Digite abaixo os dados da pessoa que você quer indicar, ou:</p>
                        <p className={style.gerarlink} onClick={() => mostrarCodigo()}><FontAwesomeIcon icon={faQrcode} /> Gere um código de indicação</p>
                        <div className={style.dados}>
                            <label>Nome</label>
                            <input placeholder="___________________" id="nome" type="text" />
                            <label>Celular</label>
                            <InputMask mask="(99) 99999-9999" placeholder="(__) _____-____" id="celular" type="tel" />
                        </div>
                        {mensagem ? <p className={style.mensagem}>{mensagem}</p> : ""}
                    </>    
                }
            </Modal.Body>
            <Modal.Footer>
                {concluido.ok ?
                    <>
                        <Button onClick={() => fechar()}>Fechar</Button>
                        {concluido.sucesso === false ?
                            <Button className={style.btindicar} onClick={() => resetar()}>Indicar outra pessoa</Button>
                            : ""
                        }
                    </> : <>
                        <Button onClick={() => fechar()}>{exibirCodigo === false ? "Cancelar" : "Fechar"}</Button>
                        {exibirCodigo === false ? <Button className={style.btindicar} onClick={() => indicar()}>Indicar</Button> : ""}
                    </>
                }
            </Modal.Footer>
        </Modal>
    );
}

export default ModalIndicar;