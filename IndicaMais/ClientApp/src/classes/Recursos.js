import carregando from '../imagens/carregando.svg';
import indicacoes from '../imagens/indicacoes.svg';
import olho from '../imagens/olho.svg';
import olho_fechado from '../imagens/olho-fechado.svg';
import cancelar from '../imagens/cancelar.svg';
import check from '../imagens/check.svg';
import dinheiro from '../imagens/dinheiro.svg';
import filtro from '../imagens/filtro.svg';
import remover_filtro from '../imagens/remover-filtro.svg';
import aplicar_filtro from '../imagens/aplicar-filtro.svg';
import logout from '../imagens/logout.svg';
import cobranca from '../imagens/cobranca.svg';
import { ReactComponent as LMRLogo } from '../imagens/lmr-logo.svg';
import { ReactComponent as LMRLogoVazado } from '../imagens/lmr-logo-vazado.svg';
import { ReactComponent as ContaIcone } from '../imagens/conta.svg';
import { ReactComponent as IndicarIcone } from '../imagens/indicar.svg';
import { ReactComponent as ResgatarIcone } from '../imagens/resgatar.svg';
import { ReactComponent as AbaterIcone } from '../imagens/abater.svg';
import { ReactComponent as SetaColapsarIcone } from '../imagens/seta-colapsar.svg';
import { ReactComponent as ProximoIcone } from '../imagens/proximo.svg';
import { ReactComponent as AnteriorIcone } from '../imagens/anterior.svg';
import { ReactComponent as RecarregarIcone } from '../imagens/recarregar.svg';
import { ReactComponent as Enviando } from '../imagens/enviando.svg';

class Recursos {
    getCarregando() {
        return carregando;
    }

    getEnviando() {
        return Enviando;
    }

    getAbater() {
        return AbaterIcone;
    }

    getIndicacoes() {
        return indicacoes;
    }

    getIndicar() {
        return IndicarIcone;
    }

    getOlho() {
        return olho;
    }

    getOlhoFechado() {
        return olho_fechado;
    }

    getResgatar() {
        return ResgatarIcone;
    }

    getConta() {
        return ContaIcone;
    }

    getCancelar() {
        return cancelar;
    }

    getCheck() {
        return check;
    }

    getProximo() {
        return ProximoIcone;
    }

    getAnterior() {
        return AnteriorIcone;
    }

    getSetaColapsar() {
        return SetaColapsarIcone;
    }

    getDinheiro() {
        return dinheiro;
    }

    getRecarregar() {
        return RecarregarIcone;
    }

    getFiltro() {
        return filtro;
    }

    getRemoverFiltro() {
        return remover_filtro;
    }

    getAplicarFiltro() {
        return aplicar_filtro;
    }

    getLogout() {
        return logout;
    }

    getCobranca() {
        return cobranca;
    }

    getLMRLogo() {
        return LMRLogo;
    }

    getLMRLogoVazado() {
        return LMRLogoVazado;
    }
}

export default Recursos;