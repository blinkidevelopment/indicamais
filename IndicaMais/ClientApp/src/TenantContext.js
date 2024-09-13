import React, { createContext, useState, useEffect, useContext } from 'react';
import Fetch from './classes/Fetch';
import Utils from './classes/Utils';
import EmpresaInexistente from './components/EmpresaInexistente';

const fetch = new Fetch();
const utils = new Utils();
const TenantContext = createContext();

export const useTenant = () => {
    return useContext(TenantContext);
};

export const TenantProvider = ({ children }) => {
    const [tenant, setTenant] = useState(null);

    useEffect(() => {
        const buscarDados = async () => {
            var dados = await fetch.buscarEmpresa();
            setTenant(dados);

            if (dados != null) {
                document.title = dados.nomeApp;
                utils.definirIcones(dados);
                utils.gerarManifest(dados);
            }
        }

        buscarDados();
    }, []);

    const root = document.documentElement;

    if (tenant != null) {
        root.style.setProperty('--corPrimaria', tenant.corPrimaria);
        root.style.setProperty('--corSecundaria', tenant.corSecundaria);
        root.style.setProperty('--corTerciaria', tenant.corTerciaria);
        root.style.setProperty('--corFundo', tenant.corFundo);
        root.style.setProperty('--corFonte', tenant.corFonte);
        root.style.setProperty('--corFonteSecundaria', tenant.corFonteSecundaria);
    }

    return (
        <TenantContext.Provider value={tenant}>
            {tenant !== null ? children : <EmpresaInexistente />}
        </TenantContext.Provider>
    );
};
