class Fetch {
    async conectar(cpf, senha) {
        var response;

        try {
            response = await fetch('api/parceiro/autenticar', {
                method: 'post',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    cpf: cpf,
                    senha: senha
                })
            });
        } catch {
            response = null;
        }

        return response;
    }

    async checarLogin() {
        var resposta;
        await fetch('api/parceiro/validar', {
            method: 'get',
            headers: {
                "Content-Type": "application/json"
            }
        }).then((response) => response.json()).then((data) => { resposta = data });

        return resposta;
    }

    async buscarParceiro() {
        var resposta;

        try {
            await fetch('api/parceiro', {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => response.json()).then((data) => { resposta = data });
        } catch {
            resposta = null;
        }
        return resposta;
    }

    async buscarParceirosNome(nome) {
        var resposta;

        try {
            await fetch('api/parceiro/buscar/' + nome, {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => response.json()).then((data) => { resposta = data });
        } catch (er) {
            console.log(er)
            resposta = null;
        }
        return resposta;
    }

    async buscarNomeCodigo(codigoIndicacao) {
        var resposta;

        try {
            await fetch('api/parceiro/' + codigoIndicacao + '/nome', {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => response.text()).then((data) => { resposta = data });
        } catch {
            resposta = null;
        }
        return resposta;
    }

    async buscarUsuario() {
        var resposta;

        try {
            await fetch('api/usuario', {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => response.json()).then((data) => { resposta = data });
        } catch {
            resposta = null;
        }
        return resposta;
    }

    async verificarNovoParceiro(celular) {
        var response;

        try {
            response = await fetch('api/parceiro/checar?telefone=' + celular, {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        } catch {
            response = null;
        }
        return response;
    }

    async verificarNovoParceiroCliente(cpf) {
        var response;

        try {
            response = await fetch('api/parceiro/checar?cpf=' + cpf, {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        } catch {
            response = null;
        }
        return response;
    }

    async verificarDadosRecuperarSenha(cpf, celular) {
        var resposta;

        try {
            await fetch('api/parceiro/recuperar/validar', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    cpf: cpf,
                    telefone: celular
                })
            }).then((response) => response.json()).then((data) => { resposta = data });
        } catch {
            resposta = null;
        }
        return resposta;
    }

    async atualizarDadosParceiro(celular, cpf, senha, confirmacao) {
        var response;

        try {
            response = await fetch('api/parceiro/' + celular, {
                method: 'PATCH',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    cpf: cpf,
                    senha: senha,
                    confirmacao: confirmacao
                })
            });
        } catch {
            response = null;
        }

        return response;
    }

    async recuperarSenha(cpf, celular, senha, confirmacao) {
        var resposta;

        try {
            await fetch('api/parceiro/recuperar', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    cpf: cpf,
                    telefone: celular,
                    senha: senha,
                    confirmacao: confirmacao
                })
            }).then((response) => response.json()).then((data) => { resposta = data });
        } catch {
            resposta = null
        }
        return resposta;
    }

    async desconectar() {
        await fetch('api/parceiro/desconectar', {
            method: 'get',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(() => { window.location.href = "/" });
    }

    async desconectarEscritorio() {
        await fetch('api/usuario/desconectar', {
            method: 'get',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(() => { window.location.href = "/escritorio" });
    }

    async cadastrarParceiro(nome, celular, cpf, senha, confirmacao) {
        var response;

        try {
            response = await fetch('api/parceiro', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nome: nome,
                    telefone: celular,
                    cpf: cpf,
                    senha: senha,
                    confirmacao: confirmacao
                })
            });
        } catch (e) {
            alert(e);
            response = null;
        }
        return response;
    }

    async criarParceiro(nome, celular, cpf, tipo, senha, idIndicador, contratoFechado) {
        var resposta;

        try {
            await fetch('api/parceiro/criar-interno', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nome: nome,
                    telefone: celular,
                    cpf: cpf,
                    tipo: tipo,
                    senha: senha,
                    confirmacao: senha,
                    idIndicador: idIndicador,
                    contratoFechado: contratoFechado
                })
            }).then((response) => response.json()).then((data) => { resposta = data });
        } catch {
            resposta = null;
        }
        return resposta;
    }

    async resgatarPremio(id) {
        var resposta;

        try {
            await fetch('api/premio/' + id + '/resgatar', {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => response.json()).then((data) => { resposta = data });
        } catch {
            resposta = null;
        }
        return resposta;
    }

    async criarTransacao(valor) {
        var resposta;

        try {
            await fetch('api/transacao', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    valor: valor
                })
            }).then((response) => response.json()).then((data) => { resposta = data });
        } catch {
            resposta = null;
        }
        return resposta;
    }

    async criarIndicacao(nome, celular) {
        var response;

        try {
            response = await fetch('api/parceiro/indicar', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nome: nome,
                    telefone: celular
                })
            });
        } catch {
            response = null;
        }
        return response;
    }

    async criarIndicacaoCodigo(nome, celular, codigoIndicacao) {
        var response;

        try {
            response = await fetch('api/parceiro/indicar/' + codigoIndicacao, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nome: nome,
                    telefone: celular
                })
            });
        } catch {
            response = null;
        }
        return response;
    }

    async buscarParceiroId(id) {
        var resposta;

        try {
            await fetch('api/parceiro/' + id, {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => response.json()).then((data) => { resposta = data });
        } catch {
            resposta = null;
        }
        return resposta;
    }

    async contarIndicacoes(fechadas) {
        var resposta;

        try {
            await fetch('api/parceiro/indicacoes/contar?fechadas=' + fechadas, {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => response.json()).then((data) => { resposta = data });
        } catch {
            resposta = null;
        }
        return resposta;
    }

    async contarIndicacoesId(id, fechadas) {
        var resposta;

        try {
            await fetch('api/parceiro/' + id + '/indicacoes/contar?fechadas=' + fechadas, {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => response.json()).then((data) => { resposta = data });
        } catch {
            resposta = null;
        }
        return resposta;
    }

    async contarTodasIndicacoes(fechadas, dataInicial, dataFinal) {
        var resposta;

        try {
            await fetch('api/parceiro/indicacoes/contar/todas?fechadas=' + fechadas + "&dataInicial=" + dataInicial + "&dataFinal=" + dataFinal, {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => response.json()).then((data) => { resposta = data });
        } catch {
            resposta = null;
        }
        return resposta;
    }

    async contarTodasTransacoes(premio, dataInicial, dataFinal) {
        var resposta;

        try {
            await fetch('api/transacao/contar/todas?premio=' + premio + "&dataInicial=" + dataInicial + "&dataFinal=" + dataFinal, {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => response.json()).then((data) => { resposta = data });
        } catch {
            resposta = null;
        }
        return resposta;
    }

    async listarIndicacoes(pagina) {
        var resposta;

        try {
            await fetch('api/parceiro/indicacoes?pagina=' + pagina + "&tamanho=5", {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => response.json()).then((data) => { resposta = data });
        } catch {
            resposta = null;
        }
        return resposta;
    }

    async listarIndicacoesPorId(id, pagina) {
        var resposta;

        try {
            await fetch('api/parceiro/' + id + '/indicacoes?pagina=' + pagina + "&tamanho=5", {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => response.json()).then((data) => { resposta = data });
        } catch {
            resposta = null;
        }
        return resposta;
    }

    async listarTransacoes(pagina) {
        var resposta;

        try {
            await fetch('api/parceiro/transacoes?pagina=' + pagina + "&tamanho=5", {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => response.json()).then((data) => { resposta = data });
        } catch {
            resposta = null;
        }
        return resposta;
    }

    async listarTransacoesPorParceiro(id, pagina) {
        var resposta;

        try {
            await fetch('api/parceiro/' + id + '/transacoes?pagina=' + pagina + "&tamanho=5", {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => response.json()).then((data) => { resposta = data });
        } catch {
            resposta = null;
        }
        return resposta;
    }

    async listarTransacoesFiltro(pagina, tamanhoPagina, tipo, baixa, nome, cpf) {
        var resposta;

        try {
            await fetch('api/transacao/listar?pagina=' + pagina + "&tamanho=" + tamanhoPagina + '&tipo=' + tipo + '&baixa=' + baixa + '&nome=' + nome + '&cpf=' + cpf, {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => response.json()).then((data) => { resposta = data });
        } catch {
            resposta = null;
        }
        return resposta;
    }

    async listarParceiros(nome, cpf, tipo, fechou, foiIndicado, pagina, tamPagina) {
        var resposta;

        try {
            await fetch('api/parceiro/listar?nome=' + nome + '&cpf=' + cpf + '&tipo=' + tipo + '&fechou=' + fechou + '&indicado=' + foiIndicado + '&pagina=' + pagina + '&tamanho=' + tamPagina, {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => response.json()).then((data) => { resposta = data });
        } catch {
            resposta = null;
        }
        return resposta;
    }

    async criarProcesso(idParceiro, numero, nome, descricao) {
        var resposta;

        try {
            await fetch('api/parceiro/' + idParceiro + '/processo', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    numero: numero,
                    nome: nome,
                    descricao: descricao
                })
            }).then((response) => response.json()).then((data) => { resposta = data });
        } catch {
            resposta = null;
        }
        return resposta;
    }

    async listarProcessosParceiro(pagina) {
        var resposta;

        try {
            await fetch('api/parceiro/processos?pagina=' + pagina + "&tamanho=5", {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => response.json()).then((data) => { resposta = data });
        } catch {
            resposta = null;
        }
        return resposta;
    }

    async buscarDadosProcesso(id) {
        var resposta;

        try {
            await fetch('api/processo/' + id, {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => response.json()).then((data) => { resposta = data });
        } catch {
            resposta = null;
        }
        return resposta;
    }

    async excluirProcesso(id) {
        var resposta;

        try {
            await fetch('api/processo/' + id, {
                method: 'delete',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => response.json()).then((data) => { resposta = data });
        } catch {
            resposta = null;
        }
        return resposta;
    }

    async listarAndamentos(id, pagina, tamanho) {
        var resposta;

        try {
            await fetch('api/processo/' + id + '/andamentos?pagina=' + pagina + '&tamanho=' + tamanho, {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => response.json()).then((data) => { resposta = data });
        } catch {
            resposta = null;
        }
        return resposta;
    }

    async adicionarAndamento(id, descricao) {
        var resposta;

        try {
            await fetch('api/processo/' + id + '/andamento', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    descricao: descricao
                })
            }).then((response) => response.json()).then((data) => { resposta = data });
        } catch {
            resposta = null;
        }
        return resposta;
    }

    async pedirAndamento(id) {
        var resposta;

        try {
            await fetch('api/processo/' + id + '/andamento/solicitar', {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => response.json()).then((data) => { resposta = data });
        } catch {
            resposta = null;
        }
        return resposta;
    }

    async excluirAndamento(id, idAndamento) {
        var resposta;

        try {
            await fetch('api/processo/' + id + '/andamento/' + idAndamento, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => response.json()).then((data) => { resposta = data });
        } catch {
            resposta = null;
        }
        return resposta;
    }

    async mudarStatusTransacao(id) {
        var resposta;

        try {
            await fetch('api/transacao/' + id + '/mudar-status', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => response.json()).then((data) => { resposta = data });
        } catch {
            resposta = null;
        }
        return resposta;
    }

    async mudarStatusRepasse(id) {
        var resposta;

        try {
            await fetch('api/parceiro/' + id + '/alterar-status-repasse', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => response.json()).then((data) => { resposta = data });
        } catch {
            resposta = null;
        }
        return resposta;
    }

    async mudarStatusParceiro(id) {
        var resposta;

        try {
            await fetch('api/parceiro/' + id + '/alterar-status', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => response.json()).then((data) => { resposta = data });
        } catch {
            resposta = null;
        }
        return resposta;
    }

    async listarCobrancas(pagina) {
        var resposta;

        try {
            await fetch('api/parceiro/cobrancas?pagina=' + pagina, {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => response.json()).then((data) => { resposta = data });
        } catch {
            resposta = null;
        }
        return resposta;
    }

    async editarDados(nome, telefone, senha) {
        var resposta;

        try {
            await fetch('api/parceiro', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nome: nome,
                    telefone: telefone,
                    senha: senha
                })
            }).then((response) => response.json()).then((data) => { resposta = data });
        } catch {
            resposta = null;
        }
        return resposta;
    }

    async atualizarSenhaParceiro(id, senha, confirmacao) {
        var resposta;

        try {
            await fetch('api/parceiro/' + id + '/alterar-senha', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    senha: senha,
                    confirmacao: confirmacao
                })
            }).then((response) => response.json()).then((data) => { resposta = data });
        } catch {
            resposta = null;
        }
        return resposta;
    }

    async excluirConta() {
        var resposta;

        try {
            await fetch('api/parceiro', {
                method: 'delete',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => response.json()).then((data) => { resposta = data });
        } catch {
            resposta = null
        }
        return resposta;
    }

    async listarConfiguracoes() {
        var resposta;

        try {
            await fetch('api/empresa/configuracoes', {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => response.json()).then((data) => { resposta = data });
        } catch {
            resposta = null;
        }
        return resposta;
    }

    async atualizarConfiguracao(chave, valor) {
        var resposta;

        try {
            await fetch('api/empresa/configuracao/' + chave + "?valor=" + valor, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => response.json()).then((data) => { resposta = data });
        } catch {
            resposta = null;
        }
        return resposta;
    }

    async obterRealPonto() {
        var resposta;

        try {
            await fetch('api/empresa/valor-ponto', {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => response.json()).then((data) => { resposta = data });
        } catch {
            resposta = null;
        }
        return resposta;
    }

    async criarPremio(nome, valor, descricao, imagem, disponivel) {
        var resposta;

        try {
            await fetch('api/premio', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nome: nome,
                    valor: valor,
                    descricao: descricao,
                    imagem: imagem,
                    disponivel: disponivel
                })
            }).then((response) => response.json()).then((data) => { resposta = data });
        } catch {
            resposta = null;
        }
        return resposta;
    }

    async editarPremio(id, nome, valor, descricao, imagem, disponivel, premioAntigo) {
        var resposta;

        try {
            await fetch('api/premio/' + id, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nome: nome,
                    valor: valor,
                    descricao: descricao,
                    imagem: imagem,
                    disponivel: disponivel
                })
            }).then((response) => response.json()).then((data) => { resposta = data });
        } catch {
            resposta = null;
        }
        return resposta;
    }

    async criarUsuario(nome, email, senha, cargo) {
        var resposta;

        try {
            await fetch('api/usuario', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nome: nome,
                    email: email,
                    senha: senha,
                    confirmacao: senha,
                    cargo: cargo
                })
            }).then((response) => response.json()).then((data) => { resposta = data });
        } catch {
            resposta = null;
        }
        return resposta;
    }

    async listarPremios() {
        var resposta;

        try {
            await fetch('api/premio/listar', {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => response.json()).then((data) => { resposta = data });
        } catch {
            resposta = null;
        }
        return resposta;
    }

    async listarPremiosDisponiveis() {
        var resposta;

        try {
            await fetch('api/premio', {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => response.json()).then((data) => { resposta = data });
        } catch {
            resposta = null;
        }
        return resposta;
    }

    async listarProcessos(pagina, tamanho, nomeParceiro, cpf, nomeProcesso, numeroProcesso, pendenteAndamento) {
        var resposta;

        pendenteAndamento = pendenteAndamento === "" ? null : (pendenteAndamento === "true");

        try {
            await fetch('api/processo/listar?nomeParceiro=' + nomeParceiro + '&cpf=' + cpf + '&nomeProcesso=' + nomeProcesso + '&numeroProcesso=' + numeroProcesso + '&pendenteAndamento=' + pendenteAndamento + '&pagina=' + pagina + '&tamanho=' + tamanho, {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => response.json()).then((data) => { resposta = data });
        } catch {
            resposta = null;
        }
        return resposta;
    }

    async editarUsuario(id, nome, email, senha, cargo) {
        var resposta;

        try {
            await fetch('api/usuario/' + id, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nome: nome,
                    email: email,
                    senha: senha,
                    confirmacao: senha,
                    cargo: cargo
                })
            }).then((response) => response.json()).then((data) => { resposta = data });
        } catch {
            resposta = null;
        }
        return resposta;
    }

    async excluirPremio(id) {
        var resposta;

        try {
            await fetch('api/premio/' + id, {
                method: 'delete',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => response.json()).then((data) => { resposta = data });
        } catch {
            resposta = null;
        }
        return resposta;
    }

    async listarUsuarios() {
        var resposta;

        try {
            await fetch('api/usuario/listar', {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => response.json()).then((data) => { resposta = data });
        } catch {
            resposta = null;
        }
        return resposta;
    }

    async excluirUsuario(id) {
        var resposta;

        try {
            await fetch('api/usuario/' + id, {
                method: 'delete',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => response.json()).then((data) => { resposta = data });
        } catch {
            resposta = null;
        }
        return resposta;
    }

    async conectarEscritorio(email, senha) {
        var response;

        try {
            response = await fetch('api/usuario/autenticar', {
                method: 'post',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    senha: senha
                })
            });
        } catch {
            response = null;
        }

        return response;
    }

    async checarLoginEscritorio() {
        var resposta;
        await fetch('api/usuario/validar', {
            method: 'get',
            headers: {
                "Content-Type": "application/json"
            }
        }).then((response) => response.json()).then((data) => { resposta = data });

        return resposta;
    }

    async buscarEmpresa() {
        var resposta;

        try {
            await fetch('api/empresa', {
                method: 'get',
                headers: {
                    "Content-Type": "application/json"
                }
            }).then((response) => response.json()).then((data) => { resposta = data });
        } catch {
            resposta = null;
        }

        return resposta;
    }

    async editarEmpresa(nome, logo, corPrimaria, corSecundaria, corTerciaria, corFundo, corFonte, corFonteSecundaria) {
        var resposta;

        var formData = new FormData();

        formData.append("nome", nome);
        formData.append("corPrimaria", corPrimaria);
        formData.append("corSecundaria", corSecundaria);
        formData.append("corTerciaria", corTerciaria);
        formData.append("corFundo", corFundo);
        formData.append("corFonte", corFonte);
        formData.append("corFonteSecundaria", corFonteSecundaria);

        if (logo) {
            formData.append("logo", logo);
        }

        await fetch('api/empresa', {
            method: 'PATCH',
            body: formData
        }).then((response) => response.json()).then((data) => { resposta = data });

        return resposta;
    }

    async listarCargos() {
        var resposta;

        await fetch('api/usuario/cargos', {
            method: 'get',
            headers: {
                "Content-Type": "application/json"
            }
        }).then((response) => response.json()).then((data) => { resposta = data });

        return resposta;
    }

    async gerarRelatorioParceiros(nome, tipo, fechou, foiIndicado, dataInicial, dataFinal, tipoData) {
        var response = await fetch('api/parceiro/relatorio', {
            method: 'post',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nome: nome,
                tipo: tipo === "" ? null : tipo,
                fechou: fechou === "" ? null : (fechou === "true"),
                foiIndicado: foiIndicado === "" ? null : (foiIndicado === "true"),
                dataInicial: dataInicial === "" ? null : dataInicial,
                dataFinal: dataFinal === "" ? null : dataFinal,
                tipoData: tipoData === "" ? null : tipoData
            })
        });

        return response;
    }

    async gerarRelatorioTransacoes(nome, tipo, baixa, dataInicial, dataFinal, premio) {
        var response = await fetch('api/transacao/relatorio', {
            method: 'post',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nome: nome,
                tipo: tipo === "" ? null : tipo,
                baixa: baixa === "" ? null : (baixa === "true"),
                dataInicial: dataInicial === "" ? null : dataInicial,
                dataFinal: dataFinal === "" ? null : dataFinal,
                premio: premio === "" ? null : premio
            })
        });

        return response;
    }

    async gerarRelacaoIndicadorIndicado() {
        var response = await fetch('api/parceiro/relatorio/relacao-indicador-indicado', {
            method: 'get',
            headers: {
                "Content-Type": "application/json"
            }
        });

        return response;
    }
}

export default Fetch;