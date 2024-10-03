import HomePage from "./paginas/HomePage";
import Login from "./components/Login";
import Cadastro from "./components/Cadastro";
import CadastroIndicado from "./components/CadastroIndicado";
import RecuperarSenha from "./components/RecuperarSenha";
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import PrivateRoute from "./paginas/PrivateRoute";
import PrivateRouteEscritorio from "./paginas/PrivateRouteEscritorio";
import SearchPage from "./paginas/SearchPage";
import EditarDados from "./components/EditarDados";
import SettingsPage from "./paginas/SettingsPage";
import GiftsPage from "./paginas/GiftsPage";
import UsersPage from "./paginas/UsersPage";
import PrivacyPolicyPage from "./paginas/PrivacyPolicyPage";
import NewPartnerPage from "./paginas/NewPartnerPage";
import DataPage from "./paginas/DataPage";
import ProcessesPage from "./paginas/ProcessesPage";

export async function loader({ params }) {
    return params;
}

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<PrivateRoute />}>
                <Route index path="" element={<HomePage />} />
                <Route path="editar-dados" element={<EditarDados />} />
            </Route>
            <Route path="/indicar/:id" loader={loader} element={<CadastroIndicado />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/recuperar" element={<RecuperarSenha />} />
            <Route path="politica-de-privacidade" element={<PrivacyPolicyPage />} />
            <Route path="/escritorio" element={<PrivateRouteEscritorio />}>
                <Route path="" element={<SearchPage />} />
                <Route path="metricas" element={<DataPage />} />
                <Route path="novo-parceiro" element={<NewPartnerPage />} />
                <Route path="configuracoes" element={<SettingsPage />} />
                <Route path="premios" element={<GiftsPage />} />
                <Route path="usuarios" element={<UsersPage />} />
                <Route path="processos" element={<ProcessesPage />} />
            </Route>
        </Routes>
    );
}

export default AppRoutes;
