import React, { createContext, useState, useEffect, useContext } from 'react';
import Fetch from './classes/Fetch';

const fetch = new Fetch();

const TenantContext = createContext();

export const useTenant = () => {
    return useContext(TenantContext);
};

export const TenantProvider = ({ children }) => {
    const [tenant, setTenant] = useState('');

    useEffect(() => {
        const buscarDados = async () => {
            var dados = await fetch.buscarEmpresa();
            setTenant(dados);

            if (dados != null) {
                document.title = dados.nomeApp;
            }
        }

        buscarDados();
    }, []);

    const root = document.documentElement;

    root.style.setProperty('--corPrimaria', tenant.corPrimaria);
    root.style.setProperty('--corSecundaria', tenant.corSecundaria);
    root.style.setProperty('--corTerciaria', tenant.corTerciaria);
    root.style.setProperty('--corFundo', tenant.corFundo);
    root.style.setProperty('--corFonte', tenant.corFonte);
    root.style.setProperty('--corFonteSecundaria', tenant.corFonteSecundaria);

    //TODO: Tratar o que deve ser feito caso o tenant não exista
    return (
        <TenantContext.Provider value={tenant}>
            {tenant !== '' ? children : ''}
        </TenantContext.Provider>
    );
};
