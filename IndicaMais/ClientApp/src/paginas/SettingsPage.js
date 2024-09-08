import { useEffect, useState } from "react";
import Recursos from "../classes/Recursos";
import Fetch from "../classes/Fetch";
import Navbar from "../components/Navbar";
import style from './SettingsPage.module.scss';
import { useTenant } from '../TenantContext';

function SettingsPage() {
    const fetch = new Fetch();
    const tenant = useTenant();

    const [configuracoes, setConfiguracoes] = useState(null);
    const [logo, setLogo] = useState(null);
    const [usuario, setUsuario] = useState(null);

    async function atualizarConfiguracao(chave){
        var valor = document.getElementById(chave).value;
        var resposta = await fetch.atualizarConfiguracao(chave, valor);

        if (resposta) {
            alert("Configuração atualizada com sucesso");
        } else {
            alert("Não foi possível atualizar a configuração")
        }
    }

    async function atualizarEmpresa() {
        var nome = document.getElementById("nome").value.trim();
        var logo;
        var corPrimaria = document.getElementById("corPrimaria").value.trim();
        var corSecundaria = document.getElementById("corSecundaria").value.trim();
        var corTerciaria = document.getElementById("corTerciaria").value.trim();
        var corFundo = document.getElementById("corFundo").value.trim();
        var corFonte = document.getElementById("corFonte").value.trim();
        var corFonteSecundaria = document.getElementById("corFonteSecundaria").value.trim();

        const tiposSuportados = ["image/jpeg", "image/png", "image/svg+xml"];

        try {
            logo = document.getElementById('logo').files[0];
        } catch {
            logo = null;
        }

        if (nome === "") {
            alert("O nome da empresa não pode ser vazio!");
        } else if (logo != null && !tiposSuportados.includes(logo.type)) {
            alert("Tipo de arquivo não suportado. Apenas arquivos JPG, PNG e SVG são aceitos.");
        } else {
            var resposta = await fetch.editarEmpresa(nome, logo, corPrimaria, corSecundaria, corTerciaria, corFundo, corFonte, corFonteSecundaria);

            if (resposta) {
                alert("Sucesso! As alterações estarão disponíveis assim que você recarregar a página");
            } else {
                alert("Não foi possível atualizar a sua empresa");
            }
        }
    }

    useEffect(() => {
        const buscarDados = async () => {
            var dados = await fetch.listarConfiguracoes();
            setConfiguracoes(dados);

            var dadosUsuario = await fetch.buscarUsuario();
            setUsuario(dadosUsuario);
        }
        buscarDados();
    }, []);

    useEffect(() => {
        const body = document.querySelector('body');
        body.classList.add(style.bodybg);
    }, []);

    useEffect(() => {
        const logoBase64 = `data:${tenant.logoMimeType};base64,${tenant.logo}`;
        setLogo(logoBase64);
    }, [tenant]);

    if (usuario !== null && usuario.role === "Admin") {
        return (
            <div className={style.container}>
                <h1 className={style.titulo}>Configurações</h1>
                <div className={style.configuracoes}>
                    {configuracoes && configuracoes.length > 0 ?
                        configuracoes.map((configuracao) => (
                            <div className={style.configuracao}>
                                <p>{configuracao.nome}</p>
                                <input id={configuracao.chave} defaultValue={configuracao.valor} type="number" />
                                <button onClick={() => atualizarConfiguracao(configuracao.chave)}>Salvar</button>
                            </div>
                        ))
                        : ""}
                </div>
                <hr />
                <div>
                    {tenant != null ?
                        <div className={style.editarempresa}>
                            <div className={style.empresa}>
                                <div className={style.dadosempresa}>
                                    <label for="nome">Nome da empresa</label>
                                    <input type="text" name="nome" id="nome" defaultValue={tenant.nome} />
                                    <div className={style.logoempresa}>
                                        <img src={logo} alt="Logo da Empresa" className={style.logo} />
                                        <input type="file" name="logo" id="logo" accept=".jpg,.jpeg,.png,.svg" />
                                    </div>
                                </div>
                                <div className={style.cores}>
                                    <div>
                                        <label for="corPrimaria">Cor primária</label>
                                        <input type="color" name="corPrimaria" id="corPrimaria" defaultValue={tenant.corPrimaria} />
                                    </div>
                                    <div>
                                        <label for="corSecundaria">Cor secundária</label>
                                        <input type="color" name="corSecundaria" id="corSecundaria" defaultValue={tenant.corSecundaria} />
                                    </div>
                                    <div>
                                        <label for="corTerciaria">Cor terciária</label>
                                        <input type="color" name="corTerciaria" id="corTerciaria" defaultValue={tenant.corTerciaria} />
                                    </div>
                                    <div>
                                        <label for="corFundo">Cor do fundo</label>
                                        <input type="color" name="corFundo" id="corFundo" defaultValue={tenant.corFundo} />
                                    </div>
                                    <div>
                                        <label for="corFonte">Cor da fonte</label>
                                        <input type="color" name="corFonte" id="corFonte" defaultValue={tenant.corFonte} />
                                    </div>
                                    <div>
                                        <label for="corFonteSecundaria">Cor secundária da fonte</label>
                                        <input type="color" name="corFonteSecundaria" id="corFonteSecundaria" defaultValue={tenant.corFonteSecundaria} />
                                    </div>
                                </div>
                            </div>
                            <div className={style.botaosalvar}>
                                <button onClick={() => atualizarEmpresa()}>Salvar alterações</button>
                            </div>
                        </div>
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

export default SettingsPage;