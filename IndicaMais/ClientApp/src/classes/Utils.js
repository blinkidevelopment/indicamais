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

    definirIcones(empresa) {
        const favicon = document.getElementById('favicon');
        const shortcutIcon = document.getElementById('shortcut-icon');
        favicon.href = `data:${empresa.faviconMimeType};base64,${empresa.favicon}`;
        shortcutIcon.href = `data:${empresa.faviconMimeType};base64,${empresa.favicon}`;

        let appleIcon = document.getElementById('apple-touch-icon');
        if (!appleIcon) {
            appleIcon = document.createElement('link');
            appleIcon.rel = 'apple-touch-icon';
            appleIcon.id = 'apple-touch-icon';
            document.head.appendChild(appleIcon);
        }
        appleIcon.href = `data:${empresa.appleIconMimeType};base64,${empresa.appleIcon}`;
    }

    gerarManifest(empresa) {
        const manifest = {
            short_name: empresa.nomeApp || "Indica+",
            name: empresa.nomeApp || "Indica+",
            icons: [
                {
                    src: `data:${empresa.faviconMimeType};base64,${empresa.favicon}`,
                    sizes: "64x64 32x32 24x24 16x16",
                    type: empresa.faviconMimeType
                },
                {
                    src: `data:${empresa.appleIconMimeType};base64,${empresa.appleIcon}`,
                    sizes: "180x180",
                    type: empresa.appleIconMimeType
                }
            ],
            start_url: "/",
            display: "standalone",
            background_color: empresa.corFundo || "#2c3e50"
        };

        const manifestJson = JSON.stringify(manifest);

        let manifestLink = document.querySelector('link[rel="manifest"]');
        if (!manifestLink) {
            manifestLink = document.createElement('link');
            manifestLink.rel = 'manifest';
            document.head.appendChild(manifestLink);
        }

        const blob = new Blob([manifestJson], { type: 'application/json' });
        const manifestUrl = URL.createObjectURL(blob);

        manifestLink.href = manifestUrl;
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