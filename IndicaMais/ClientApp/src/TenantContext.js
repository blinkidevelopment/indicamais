import React, { createContext, useState, useEffect, useContext } from 'react';
import Fetch from './classes/Fetch';

const fetch = new Fetch();

// Criação do contexto
const TenantContext = createContext();

// Hook para usar o contexto do Tenant
export const useTenant = () => {
    return useContext(TenantContext);
};

// Provedor do contexto
export const TenantProvider = ({ children }) => {
    const [tenant, setTenant] = useState('');

    useEffect(() => {
        const buscarDados = async () => {
            var dados = await fetch.buscarEmpresa();
            setTenant(dados);
        }

        buscarDados();
        /*fetch('api/empresa')
            .then(response => response.json())
            .then(data => setTenant(data))
            .catch(error => console.error('Error fetching tenant name:', error));*/
    }, []);

    const root = document.documentElement;

    root.style.setProperty('--corPrimaria', tenant.corPrimaria);
    root.style.setProperty('--corSecundaria', tenant.corSecundaria);
    root.style.setProperty('--corTerciaria', tenant.corTerciaria);
    root.style.setProperty('--corFundo', tenant.corFundo);
    root.style.setProperty('--corFonte', tenant.corFonte);
    root.style.setProperty('--corFonteSecundaria', tenant.corFonteSecundaria);

    //tratar o que deve ser feito caso o tenant não exista
    return (
        <TenantContext.Provider value={tenant}>
            {tenant !== '' ? children : ''}
        </TenantContext.Provider>
    );
};
