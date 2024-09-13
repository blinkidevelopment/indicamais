import React, { useState, useEffect } from "react";
import style from './Navbar.module.scss';
import { faGear, faCircleUser, faGift, faMagnifyingGlass, faRightFromBracket, faUserPlus, faDatabase, faGavel } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Fetch from "../classes/Fetch";
import { useTenant } from '../TenantContext';

function Navbar() {
    const fetch = new Fetch();
    const tenant = useTenant();

    const desconectar = async () => {
        await fetch.desconectarEscritorio();
    }
    const [logo, setLogo] = useState(null);
    const [usuario, setUsuario] = useState(null);

    useEffect(() => {
        const logoBase64 = `data:${tenant.logoMimeType};base64,${tenant.logo}`;
        setLogo(logoBase64);
    }, [tenant]);

    useEffect(() => {
        const buscarDados = async () => {
            var dados = await fetch.buscarUsuario();
            setUsuario(dados);
        }

        buscarDados();
    }, []);

    return (
        <div className={style.navbar}>
            <div className={style.logo} onClick={() => window.location.href = "/escritorio"}>
                <img src={logo} alt="Logo da Empresa" className={style.logo} />
            </div>
            <div className={style.links}>
                <div>
                    <a href="/escritorio"><FontAwesomeIcon icon={faMagnifyingGlass} /> Pesquisar</a>
                </div>
                <div>
                    <a href="/escritorio/novo-parceiro"><FontAwesomeIcon icon={faUserPlus} /> Novo parceiro</a>
                </div>
                <div>
                    <a href="/escritorio/premios"><FontAwesomeIcon icon={faGift} /> Prêmios</a>
                </div>
                {usuario != null && usuario.role === "Admin" ? 
                    <>
                        <div>
                            <a href="/escritorio/processos"><FontAwesomeIcon icon={faGavel} /> Processos</a>
                        </div>
                        <div>
                            <a href="/escritorio/metricas"><FontAwesomeIcon icon={faDatabase} /> Métricas</a>
                        </div>
                        <div>
                            <a href="/escritorio/configuracoes"><FontAwesomeIcon icon={faGear} /> Configurações</a>
                        </div>
                        <div>
                            <a href="/escritorio/usuarios"><FontAwesomeIcon icon={faCircleUser} /> Usuários</a>
                        </div>
                    </>
                : ""}
                <div>
                    <a href="" onClick={() => desconectar()}><FontAwesomeIcon icon={faRightFromBracket} /> Sair</a>
                </div>
            </div>
        </div>
    );
}

export default Navbar;