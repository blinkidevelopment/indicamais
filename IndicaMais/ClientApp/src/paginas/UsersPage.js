import { useEffect, useState } from "react";
import Fetch from "../classes/Fetch";
import style from "./GiftsPage.module.scss";
import ItemUsuario from "../components/ItemUsuario";

function UsersPage() {
    const fetch = new Fetch();
    const [usuarios, setUsuarios] = useState(null);
    const [usuario, setUsuario] = useState(null);
    const [atualizar, setAtualizar] = useState(false);

    const atualizarLista = () => {
        setAtualizar(!atualizar);
    };

    useEffect(() => {
        const buscarDados = async () => {
            var dados = await fetch.listarUsuarios();
            setUsuarios(dados);

            var dadosUsuario = await fetch.buscarUsuario();
            setUsuario(dadosUsuario);
        }
        buscarDados();
    }, [atualizar]);

    useEffect(() => {
        const body = document.querySelector('body');
        body.classList.add(style.bodybg);
    }, []);

    if (usuario !== null && usuario.role === "Admin") {
        return (
            <div className={style.container}>
                <div>
                    <h1 className={style.titulo}>Usuários</h1>
                </div>
                <div className={style.containeritens}>
                    <ItemUsuario adicionar={true} atualizar={atualizarLista} />
                    {usuarios && usuarios.length > 0 ?
                        usuarios.map((usuario) => (
                            <ItemUsuario usuario={usuario} atualizar={atualizarLista} />
                        ))
                    : ""}
                </div>
            </div>
        );
    } else {
        return (
            <div className={style.container}>
                <h1 className={style.titulo}>Ops...</h1>
                <p className={style.aviso}>Você não tem permissão para acessar essa página.</p>
            </div>
        );
    }
}

export default UsersPage;
