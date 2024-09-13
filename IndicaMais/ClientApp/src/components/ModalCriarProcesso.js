import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import style from './ModalCriarProcesso.module.scss';
import Fetch from '../classes/Fetch';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';

function ModalCriarProcesso(props) {
    const fetch = new Fetch();

    const [idParceiro, setIdParceiro] = useState(null);
    const [mensagem, setMensagem] = useState(null);
    const [concluido, setConcluido] = useState(false);
    const [debounceTimeout, setDebounceTimeout] = useState(null);

    const fetchOptions = async (input) => {
        if (!input) {
            return [];
        }

        try {
            const resultado = await fetch.buscarParceirosNome(input);

            return resultado.map(item => ({
                label: item.nome + " - " + item.cpf,
                value: item.id
            }));
        } catch {
            return [{ label: 'Erro ao carregar', value: null }];
        }
    };

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

    function fechar() {
        props.onHide();
        setMensagem(null);
        setConcluido(false);
    }

    async function cadastrar() {
        if (idParceiro != null) {
            var numero = document.getElementById("numero").value;
            var nome = document.getElementById("nome").value;
            var descricao = document.getElementById("descricao").value;

            var resposta = await fetch.criarProcesso(idParceiro, numero, nome, descricao);

            if (resposta === true) {
                setMensagem("Processo cadastrado com sucesso");
                setConcluido(true);
            } else {
                setMensagem("Ocorreu um erro ao cadastrar o processo. Tente novamente");
                setConcluido(false);
            }
        } else {
            alert("Você deve escolher um parceiro válido para cadastrar o processo");
        }
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
                {concluido ?
                    <>
                        <h1>Sucesso!</h1>
                        <p>{mensagem}</p>
                    </> : <>
                        <h1>Cadastro de processo</h1>
                        <div className={style.dados}>
                            <AsyncSelect
                                cacheOptions
                                loadOptions={loadOptions}
                                onChange={(selectedOption) => setIdParceiro(selectedOption ? selectedOption.value : null)}
                                placeholder="Digite para buscar um parceiro..."
                                noOptionsMessage={() => "Nenhuma opção encontrada"}
                                loadingMessage={() => "Carregando..."}
                            />
                            <input placeholder="Número do processo" type="text" id="numero" />
                            <input placeholder="Nome do processo" type="text" id="nome" />
                            <textarea className={style.descricao} placeholder="Descição" id="descricao" />
                        </div>
                        {mensagem ? <p className={style.mensagem}>{mensagem}</p> : ""}
                    </>
                }
            </Modal.Body>
            <Modal.Footer>
                {concluido ?
                    <>
                        <Button onClick={() => fechar()}>Entendi</Button>
                    </> : <>
                        <Button onClick={() => fechar()}>Cancelar</Button>
                        <Button className={style.btresgatar} onClick={() => cadastrar()}>Cadastrar</Button>
                    </>
                }
            </Modal.Footer>
        </Modal>
    );
}

export default ModalCriarProcesso;