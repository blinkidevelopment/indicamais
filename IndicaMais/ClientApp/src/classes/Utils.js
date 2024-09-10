import { parseToHsl, hslToColorString } from 'polished';

class Utils {
    validarCpf(cpf) {
        var Soma;
        var Resto;
        Soma = 0;

        cpf = cpf.replace(/[.\-_]/g, '');

        if (cpf === "00000000000") return false;

        for (var i = 1; i <= 9; i++) {
            Soma = Soma + parseInt(cpf.substring(i - 1, i)) * i;
        }

        Resto = Soma % 11;

        if ((Resto == 10) || (Resto == 11)) {
            Resto = 0
        };

        if (Resto != parseInt(cpf.substring(9, 10))) {
            return false
        };

        Soma = 0;
        for (i = 0; i < 10; i++) {
            Soma = Soma + parseInt(cpf.substring(i, i + 1)) * i;
        }
        Resto = Soma % 11;

        if ((Resto == 10) || (Resto == 11)) {
            Resto = 0;
        }
        if (Resto != parseInt(cpf.substring(10, 11))) {
            return false
        };

        return true;
    }

    validarSenha(senha, metodo) {
        if (metodo === 0) {
            return senha.length >= 6 ? true : false;
        }

        if (metodo === 1) {
            const regex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
            return regex.test(senha)
        }

        if (metodo === 2) {
            const regex = /[0-9]+/;
            return regex.test(senha);
        }

        if (metodo === 3) {
            const regex = /[a-z]+/;
            return regex.test(senha);
        }

        if (metodo === 4) {
            const regex = /[A-Z]+/;
            return regex.test(senha);
        }
    }

    formatarData(data) {
        var dataObj = new Date(data + " UTC");
        return dataObj.toLocaleDateString() + " às " + dataObj.toLocaleTimeString();
    }

    transformarCor(cor, tom, saturacao, luminosidade) {
        try {
            const { hue, saturation, lightness } = parseToHsl(cor);
            const novoTom = (hue + tom + 360) % 360;
            const novaSaturacao = Math.min(Math.max(saturation + saturacao, 0), 1);
            const novaLuminosidade = Math.min(Math.max(lightness + luminosidade, 0), 1);

            return hslToColorString({
                hue: novoTom,
                saturation: novaSaturacao,
                lightness: novaLuminosidade
            });
        } catch {
            return '#ffffff';
        }
    }

    async baixarRelatorio(response) {
        if (response.status === 200) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'relatorio.csv';
            document.body.appendChild(a);
            a.click();
        } else {
            alert("Ocorreu um erro ao gerar o relatório");
        }
    }
}

export default Utils;