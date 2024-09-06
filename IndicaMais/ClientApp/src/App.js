import React, { Component } from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import { TenantProvider } from './TenantContext';
import { Layout } from './components/Layout';
import './custom.css';

export default class App extends Component {
    static displayName = App.name;

    render() {
        return (
            <TenantProvider>
                <Layout>
                    <AppRoutes />
                </Layout>
            </TenantProvider>
        );
    }
}
