import InputMask from "react-input-mask";
import style from "./ItemProcesso.module.scss";
import { faUser, faIdCard } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function ItemProcesso({ processo, atualizarProcesso }) {
    return (
        <div className={style.processo} onClick={() => atualizarProcesso(processo)}>
            <h3>{processo.numero}</h3>
            <p>{processo.nome}</p>
            <hr></hr>
            <p><FontAwesomeIcon icon={faUser} /> {processo.nomeParceiro}</p>
            <p><FontAwesomeIcon icon={faIdCard} /> <InputMask mask="999.999.999-99" value={processo.cpfParceiro} className={style.cpf} disabled /></p>
            <p className={style.descricao}><strong>Descrição:</strong> {processo.descricao}</p>
        </div>
    );
}

export default ItemProcesso;
