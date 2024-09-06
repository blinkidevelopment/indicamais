import { useEffect, useState } from "react";
import Fetch from "../classes/Fetch";
import style from "./GiftsPage.module.scss";
import ItemPremio from "../components/ItemPremio";

function GiftsPage() {
    const fetch = new Fetch();
    const [premios, setPremios] = useState(null);
    const [atualizar, setAtualizar] = useState(false);

    const atualizarLista = () => {
        setAtualizar(!atualizar);
    };

    useEffect(() => {
        const buscarDados = async () => {
            var dados = await fetch.listarPremios();
            setPremios(dados);
        }
        buscarDados();
    }, [atualizar]);

    useEffect(() => {
        const body = document.querySelector('body');
        body.classList.add(style.bodybg);
    }, []);

    return (
        <div className={style.container}>
            <div>
                <h1 className={style.titulo}>Prêmios</h1>
            </div>
            <div className={style.containeritens}>
                <ItemPremio adicionar={true} atualizar={atualizarLista} />
                {premios && premios.length > 0 ?
                    premios.map((premio) => (
                        <ItemPremio premio={premio} atualizar={atualizarLista} />
                    ))
                    : ""}
            </div>
        </div>
    );
}

export default GiftsPage;
