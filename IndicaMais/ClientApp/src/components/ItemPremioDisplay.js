import { useState } from "react";
import styles from "./ItemPremioDisplay.module.scss";

function ItemPremioDisplay({ premio, verificar, selecionar, definirId, desselecionar, executarDessel, atualizarSaldo }) {
    const [premioSelecionado, setPremioSelecionado] = useState(false);

    function selecionarPremio() {
        var status = verificar();

        if (status === true) {
            if (premioSelecionado === true) {
                setPremioSelecionado(false);
                definirId(0);
                atualizarSaldo(0);
                selecionar(false);
            } else {
                atualizarSaldo(0);
                executarDessel();
                setPremioSelecionado(true);
                definirId(premio.id);
                selecionar(true);
                atualizarSaldo(premio.valor);
                desselecionar(() => removerSelecao);
            }
        } else {
            setPremioSelecionado(true);
            definirId(premio.id);
            selecionar(true);
            atualizarSaldo(premio.valor);
            desselecionar(() => removerSelecao);
        }
    }

    const removerSelecao = () => {
        setPremioSelecionado(false);
        definirId(0);
        selecionar(false);
    }

    return (
        <>
            <div className={premioSelecionado === true ? styles.premio + " " + styles.selecionado : styles.premio} onClick={() => selecionarPremio()}>
                <div className={styles.itens}>
                    <div className={styles.dados}>
                        <p className={styles.nome}>{premio.nome}</p>
                        <p className={styles.valor}>{premio.valor} pontos</p>
                        <p className={styles.descricao}>{premio.descricao}</p>
                    </div>
                    <div className={styles.imagem}>
                        <img src={premio.imagem} />
                    </div>
                </div>
            </div>
        </>
    );
}

export default ItemPremioDisplay;
