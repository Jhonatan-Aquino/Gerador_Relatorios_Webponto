// ==UserScript==
// @name          Tira Relatorio do WebPonto
// @version       1.1
// @description   Gera links de relatórios para todos os usuários
// @author        Jhonatan Aquino
// @match         https://webponto.seplag.mt.gov.br/Manutencao/frmGeraFolhaFrequencia.aspx
// @match         http://webponto.seplag.mt.gov.br/Manutencao/frmGeraFolhaFrequencia.aspx
// @copyright     none
// @grant         GM_addStyle
// @grant         GM_xmlhttpRequest
// @require       https://code.jquery.com/jquery-3.6.0.min.js
// @updateURL     https://raw.githubusercontent.com/Jhonatan-Aquino/Gerador_Relatorios_Webponto/main/Gerador_Relatorios_Webponto.user.js
// @downloadURL   https://raw.githubusercontent.com/Jhonatan-Aquino/Gerador_Relatorios_Webponto/main/Gerador_Relatorios_Webponto.user.js
// ==/UserScript==

/// Função para esperar um tempo específico (em milissegundos)
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Adicionar os estilos CSS
GM_addStyle(`
    #containerRelatorios {
        background: rgba(220, 220, 220, 0.58);
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(6.6px);
        -webkit-backdrop-filter: blur(6.6px);
        border: 1px solid rgba(214, 214, 214, 0.27);
        border-radius: 20px;
        color: #474e68;
        width: auto;
        text-align: center;
        font-weight: bold;
        position: fixed;
        z-index: 2002;
        padding: 15px;
        bottom: 33px;
        left: 30px;
        height: auto;
        min-width: 350px;
    }

    #containerRelatorios * {
        font-family: "SF Pro Text","SF Pro Icons","Helvetica Neue","Helvetica","Arial",sans-serif !important;
    }

    #containerRelatorios a {
        color: #666 !important;
        font-size: 8pt;
        font-weight: normal;
        font-family: "SF Pro Text","SF Pro Icons","Helvetica Neue","Helvetica","Arial",sans-serif !important;
    }


    #containerRelatorios .botaoRelatorio {
        background: #3982f7;
        color: #fff;
        font-size: 13px;
        font-weight: normal;
        padding: 9px 20px;
        min-width: 124.5px;
        margin: 5px;
        border: none;
        border-radius: 20px;
        cursor: pointer;
        transition: all 0.2s ease-in-out;
    }
      #containerRelatorios  h3 {
            font-size: 28px !important;
            font-weight: 500 !important;
            margin-bottom: 15px;
            color: #1d1d1f;
            letter-spacing: -0.5px;
            font-variant: normal;
        }

    #containerRelatorios .botaoRelatorio:hover {
        opacity: 0.9;
        transform: scale(1.02);
    }

    #containerRelatorios .progress-container {
        width: 100%;
        margin: 10px 0;
        display: none;
    }

    #containerRelatorios .progress-bar-wrapper {
        width: 90%;
        background-color: #f0f0f0;
        border-radius: 10px;
        padding: 3px;
        margin-bottom: 8px;
        overflow: hidden;
        margin-left: 5%;
    }

    #containerRelatorios .progress-bar {
        height: 5px;
        background-color: #4BB543;
        border-radius: 8px;
        width: 0%;
        transition: width 0.5s ease-in-out;
        position: relative;
        overflow: hidden;
    }

    #containerRelatorios .progress-bar::after {
        content: "";
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
        animation: glowingEffect 2s infinite linear;
    }

    #containerRelatorios .progress-text {
        text-align: center;
        color: #474e68;
        font-size: 12px;
        padding: 5px 0;
        font-weight: normal;
        white-space: pre-line;
        line-height: 1.4;
        min-height: 45px;
    }

    #containerRelatorios .progress-text.error {
        color: #FF4B40;
        font-weight: bold;
    }

    @keyframes glowingEffect {
        0% { left: -100%; }
        100% { left: 100%; }
    }

    #iframeDownload {
        position: fixed;
        right: 1px;
        bottom: 1px;
        width: 1000px;
        height: 1000px;
    }

    #containerRelatorios .botoes-container {
        display: flex;
        gap: 10px;
        justify-content: center;
        margin-bottom: 15px;
    }

    #containerRelatorios #btnBaixarRelatorios:hover {
        background: #2d8f59 !important;
    }

    #containerRelatorios .divlog {
        background: rgba(244, 244, 244, 0.58);
        border-radius: 16px;
        box-shadow: 0 5px 10px rgba(0, 0, 0, 0);
        backdrop-filter: blur(6.6px);
        -webkit-backdrop-filter: blur(6.6px);
        border: 1px solid rgba(214, 214, 214, 0.27);
        color: #087eff;
        width: auto;
        text-align: center;
        position: absolute;
        z-index: 2002;
        padding: 5px 15px;
        top: -45px;
        min-height: 25px;
        min-width: 340px;
        font-size: 14px;
        font-weight: normal;
        line-height: 25px;
        display: none;
    }

    #exibirRelatorios {
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(20px);
        font-weight: 500;
        letter-spacing: 0.3px;
        padding: 5px 15px;
    }

    #exibirRelatorios:hover {
        background: rgba(0, 0, 0, 0.9);
    }

    #containerRelatorios .divajuda {
        display: none;
        padding: 20px;
        width: 360px;
        max-height: 700px;
        overflow: hidden;
        line-height: 20px;
        font-size: 11px;
        font-weight: normal;
        text-align: justify;
    }

    #containerRelatorios .divajuda h3 {
    font-size: 15pt !important;
  text-align: center;
  line-height: 10px;
  margin-bottom: 20px;
  color: #474e68;
  font-weight: bold !important;
    }

    #containerRelatorios .divajuda p {
        margin: 10px 0;
        line-height: 1.5;
    }

    #containerRelatorios .divajuda ol {
        padding-left: 20px;
        margin: 15px 0;
    }

    #containerRelatorios .divajuda li {
        margin-bottom: 10px;
        line-height: 1.4;
    }

    #containerRelatorios .divajuda b {
        color: #1d1d1f;
    }

    #containerRelatorios .btnscontrole {
        cursor: pointer;
    }

    #containerRelatorios svg:hover path {
        fill: #087dff !important;
    }

    #containerRelatorios #btnvoltar {
        display: none;
        cursor: pointer;
    }

    #containerRelatorios #btnajuda {
        cursor: pointer;
    }

    #containerRelatorios .conteudo-principal {
        width: 360px;
    }
`);

function criarInterface() {
    const container = document.createElement('div');
    container.id = 'containerRelatorios';
    container.innerHTML = `
        <div class="divlog" id="divlog"></div>
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" title="Voltar" version="1.1" class="btnscontrole" width="20" height="20" style="margin: 10px;position: absolute;left: 0; bottom: 0; display:none" id="btnvoltar" viewBox="0 0 256 256" xml:space="preserve">
            <defs></defs>
            <g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)">
                <path d="M 4 49 h 82 c 2.209 0 4 -1.791 4 -4 s -1.791 -4 -4 -4 H 4 c -2.209 0 -4 1.791 -4 4 S 1.791 49 4 49 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: #666; fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round"/>
                <path d="M 16.993 61.993 c 1.023 0 2.048 -0.391 2.828 -1.172 c 1.563 -1.562 1.563 -4.095 0 -5.656 L 9.657 45 l 10.164 -10.164 c 1.563 -1.562 1.563 -4.095 0 -5.657 c -1.561 -1.562 -4.094 -1.562 -5.656 0 L 1.172 42.171 C 0.422 42.922 0 43.939 0 45 c 0 1.061 0.422 2.078 1.172 2.828 l 12.993 12.993 C 14.945 61.603 15.97 61.993 16.993 61.993 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: #666; fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round"/>
            </g>
        </svg>
        <div class="conteudo-principal">
            <h3 style="font-size: 16px; margin-bottom: 15px;">Gerador de Relatórios</h3>
            <p style="font-size: 10pt; font-family: 'SF Pro Text','SF Pro Icons','Helvetica Neue','Helvetica','Arial',sans-serif !important; font-weight: normal; margin-top: -10px;margin-bottom: 20px;">
                Preencha os campos do Ano, Mês e Setor e clique no botão<br>
                para baixar os relatórios de todos os usuários.
            </p>
            <div class="botoes-container">
                <button id="btnGerarLinks" class="botaoRelatorio">Baixar Relatórios</button>
            </div>
            <div class="progress-container">
                <div class="progress-bar-wrapper">
                    <div class="progress-bar"></div>
                </div>
                <div class="progress-text">0% - Aguardando início...</div>
            </div>
        </div>
        <div class="divajuda">
            <h3>Como usar?</h3>
            <p><b>Para que serve?</b><br>
            Este script automatiza o processo de baixar relatórios de ponto dos funcionários, permitindo baixar os relatórios de todos os usuários de um setor de uma só vez.</p>
            
            <p><b>Como usar:</b></p>
            <ol>
                <li>Selecione o Ano, Mês e Setor desejados nos campos correspondentes.</li>
                <li>Clique no botão "Baixar Relatórios" e aguarde o processo.</li>
                <li>O script irá gerar e baixar automaticamente os relatórios de todos os usuários do setor selecionado.</li>
                <li>Uma barra de progresso indicará o andamento do processo.</li>
                <li>Os relatórios serão salvos automaticamente na pasta de downloads do seu navegador.</li>
            </ol>
            
            <p><b>Observações importantes:</b></p>
            <p>Certifique-se de que seu navegador não está bloqueando os downloads múltiplos.</p>
        </div>
        <div><span style='font-size:8pt;font-weight:normal;'><a href="https://github.com/Jhonatan-Aquino/" target="_blank" style="text-color:rgb(71, 78, 104) !important;  text-decoration: none !important;">< Jhonatan Aquino /></a></span>
        </div>
        <div><span style='font-size:8pt;font-weight:normal;'>${GM_info.script.name} v${GM_info.script.version}</span></div>
        <svg xmlns="http://www.w3.org/2000/svg" title="Ajuda" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="20" height="20" class="btnajuda" id="btnajuda" viewBox="0 0 256 256" style="margin: 10px;position: absolute;left: 0; bottom: 0;" xml:space="preserve">
            <defs></defs>
            <g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)">
                <path d="M 45 58.88 c -2.209 0 -4 -1.791 -4 -4 v -4.543 c 0 -1.101 0.454 -2.153 1.254 -2.908 l 8.083 -7.631 c 1.313 -1.377 2.035 -3.181 2.035 -5.087 v -0.302 c 0 -2.005 -0.791 -3.881 -2.228 -5.281 c -1.436 -1.399 -3.321 -2.14 -5.342 -2.089 c -3.957 0.102 -7.175 3.523 -7.175 7.626 c 0 2.209 -1.791 4 -4 4 s -4 -1.791 -4 -4 c 0 -8.402 6.715 -15.411 14.969 -15.623 c 4.183 -0.109 8.138 1.439 11.131 4.357 c 2.995 2.918 4.645 6.829 4.645 11.01 v 0.302 c 0 4.027 -1.546 7.834 -4.354 10.72 c -0.04 0.041 -0.08 0.081 -0.121 0.12 L 49 52.062 v 2.818 C 49 57.089 47.209 58.88 45 58.88 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: #a5a5a5; fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round"/>
                <path d="M 45 71.96 c -1.32 0 -2.61 -0.53 -3.54 -1.46 c -0.23 -0.23 -0.43 -0.49 -0.62 -0.76 c -0.18 -0.271 -0.33 -0.561 -0.46 -0.86 c -0.12 -0.311 -0.22 -0.62 -0.28 -0.94 c -0.07 -0.32 -0.1 -0.65 -0.1 -0.98 c 0 -0.32 0.03 -0.65 0.1 -0.97 c 0.06 -0.32 0.16 -0.641 0.28 -0.94 c 0.13 -0.3 0.28 -0.59 0.46 -0.86 c 0.19 -0.279 0.39 -0.529 0.62 -0.76 c 1.16 -1.16 2.89 -1.7 4.52 -1.37 c 0.32 0.07 0.629 0.16 0.93 0.29 c 0.3 0.12 0.59 0.28 0.859 0.46 c 0.28 0.181 0.53 0.391 0.761 0.62 c 0.239 0.23 0.439 0.48 0.63 0.76 c 0.18 0.271 0.33 0.561 0.46 0.86 c 0.12 0.3 0.22 0.62 0.279 0.94 C 49.97 66.31 50 66.64 50 66.96 c 0 0.33 -0.03 0.66 -0.101 0.979 c -0.06 0.32 -0.159 0.63 -0.279 0.94 c -0.13 0.3 -0.28 0.59 -0.46 0.86 c -0.19 0.27 -0.391 0.529 -0.63 0.76 c -0.23 0.229 -0.48 0.439 -0.761 0.62 c -0.27 0.18 -0.56 0.34 -0.859 0.46 c -0.301 0.13 -0.61 0.22 -0.93 0.279 C 45.65 71.93 45.33 71.96 45 71.96 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: #a5a5a5; fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round"/>
                <path d="M 45 90 C 20.187 90 0 69.813 0 45 S 20.187 0 45 0 s 45 20.187 45 45 S 69.813 90 45 90 z M 45 8 C 24.598 8 8 24.598 8 45 s 16.598 37 37 37 s 37 -16.598 37 -37 S 65.402 8 45 8 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: #bebebe; fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round"/>
            </g>
        </svg>
    `;

    document.body.appendChild(container);

    // Vincular evento ao botão
    document.getElementById('btnGerarLinks').addEventListener('click', async () => {
        const btnGerarLinks = document.getElementById('btnGerarLinks');
        const progressContainer = container.querySelector('.progress-container');
        
        btnGerarLinks.style.display = 'none';
        progressContainer.style.display = 'block';
        
        try {
            await gerarEBaixarRelatorios();
        } catch (error) {
            console.error('Erro:', error);
            exibirLog(error.message, 5000, '#FF4B40');
            btnGerarLinks.style.display = 'inline-block';
        }
    });
}

function atualizarProgresso(porcentagem, texto, isError = false) {
    const progressContainer = document.querySelector('.progress-container');
    const progressBar = document.querySelector('.progress-bar');
    const progressText = document.querySelector('.progress-text');

    if (progressContainer && progressBar && progressText) {
        progressContainer.style.display = 'block';
        progressBar.style.width = `${porcentagem}%`;
        progressText.textContent = texto;
        
        // Adicionar ou remover classe de erro
        if (isError) {
            progressText.classList.add('error');
            progressBar.style.backgroundColor = '#FF4B40';
        } else {
            progressText.classList.remove('error');
            progressBar.style.backgroundColor = '#4BB543';
        }
    }
}

// Adicionar função de exibir log
function exibirLog(texto, tempo, cor = "#087EFF") {
    let divLog = document.getElementById("divlog");
    divLog.innerText = texto;
    divLog.style.color = cor;
    $('.divlog').fadeIn(300);
    setTimeout(() => {$('.divlog').fadeOut(300);}, tempo);
}

async function gerarEBaixarRelatorios() {
    try {
        const links = [];
        
        // Validações iniciais (20% do progresso)
        if (!cbAno.GetValue()) {
            exibirLog('Por favor, selecione o Ano antes de continuar', 3000, '#FF4B40');
            throw new Error('Ano não selecionado');
        }
        if (!cbMes.GetValue()) {
            exibirLog('Por favor, selecione o Mês antes de continuar', 3000, '#FF4B40');
            throw new Error('Mês não selecionado');
        }
        if (!cbSetorFolha.GetValue()) {
            exibirLog('Por favor, selecione o Setor antes de continuar', 3000, '#FF4B40');
            throw new Error('Setor não selecionado');
        }

        // Exibir configurações selecionadas
        exibirLog(`Configurações: Ano ${cbAno.GetText()}, Mês ${cbMes.GetText()}`, 2000);
        atualizarProgresso(5, 'Iniciando processo...');

        // Buscar usuários
        PreenchecbUsuario();
        await sleep(1000);

        let items = cbUsuarioFolha.GetItemCount();
        if (items === 0) {
            throw new Error('Nenhum usuário encontrado para os filtros selecionados');
        }

        exibirLog(`Encontrados ${items} usuários`, 2000);
        
        // Gerar links e baixar (80% do progresso dividido pelo número de usuários)
        const progressoPorUsuario = 90 / items; // 90% restantes divididos pelo número de usuários

        for (let i = 0; i < items; i++) {
            let usuario = cbUsuarioFolha.GetItem(i);
            const progressoAtual = 5 + (progressoPorUsuario * (i + 1));
            
            // Primeira metade do progresso para gerar o link
            atualizarProgresso(progressoAtual - (progressoPorUsuario/2), 
                `Gerando link ${i + 1}/${items}\n${usuario.text}`);

            // Gerar link
            const formData = new URLSearchParams();
            
            // Campos básicos do ASP.NET
            formData.append('__EVENTTARGET', 'ctl00$MainContent$btGerarFolhaFrequencia');
            formData.append('__EVENTARGUMENT', '');
            formData.append('__VIEWSTATE', document.getElementById('__VIEWSTATE').value);
            formData.append('__VIEWSTATEGENERATOR', document.getElementById('__VIEWSTATEGENERATOR').value);
            formData.append('__EVENTVALIDATION', document.getElementById('__EVENTVALIDATION').value);

            // Campos do DevExpress
            formData.append('ctl00_MainContent_cbAno_VI', cbAno.GetValue());
            formData.append('ctl00$MainContent$cbAno', cbAno.GetValue());
            formData.append('ctl00$MainContent$cbAno$DDD$L', cbAno.GetValue());

            formData.append('ctl00_MainContent_cbMes_VI', cbMes.GetValue());
            formData.append('ctl00$MainContent$cbMes', cbMes.GetText());
            formData.append('ctl00$MainContent$cbMes$DDD$L', cbMes.GetValue());

            formData.append('ctl00_MainContent_cbSetorFolha_VI', cbSetorFolha.GetValue());
            formData.append('ctl00$MainContent$cbSetorFolha', cbSetorFolha.GetText());
            formData.append('ctl00$MainContent$cbSetorFolha$DDD$L', cbSetorFolha.GetValue());

            formData.append('ctl00_MainContent_cbUsuario_VI', usuario.value);
            formData.append('ctl00$MainContent$cbUsuario', usuario.text);
            formData.append('ctl00$MainContent$cbUsuario$DDD$L', usuario.value);

            // Campos ocultos
            formData.append('ctl00$MainContent$coIDUsuarioSetorFFrequencia$I', '12|#|IDSetor|4|1|1IDUsuario|4|1|1#');
            formData.append('ctl00$coIDTPUsuarioGeral2$I', '12|#|coIDTPUsuarioGeral2|4|3|110tpusuario|4|3|110#');
            formData.append('ctl00$coIDUsuarioGeral$I', '12|#|coIDUsuarioGeral|18|5|47784#');
            formData.append('ctl00$coIDEmpresaGeral$I', '12|#|#');
            formData.append('ctl00$coIDTPUsuarioGeral', '');

            console.log('Enviando requisição para:', usuario.text);
            const response = await fetch(window.location.href, {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                credentials: 'include'
            });

            const text = await response.text();

            // Tentar diferentes padrões para encontrar os IDs
            let match = text.match(/coIDUsuarioSetorFFrequencia\.properties\s*=\s*{\s*'dxpIDSetor':'([^']+)',\s*'dxpIDUsuario':'([^']+)'/);
            if (!match) {
                match = text.match(/'dxpIDSetor':'([^']+)','dxpIDUsuario':'([^']+)'/);
            }
            if (!match) {
                match = text.match(/IDSetor\|4\|([^\|]+)\|.*?IDUsuario\|4\|([^\|]+)/);
            }
            
            if (!match) {
                console.error('Não foi possível encontrar os IDs para:', usuario.text);
                console.log('Resposta completa:', text);
                continue;
            }

            const [, idSetor, idUsuario] = match;

            // Gerar link do relatório
            const link = `https://webponto.seplag.mt.gov.br/Relatorio/frmVizualizaRelatorio.aspx?Mes=${cbMes.GetValue()}`
                      + `&Setor=${idSetor}`
                      + `&User=${idUsuario}`
                    + `&Ano=${cbAno.GetValue()}`
                    + `&Rel=frmZurel`;

            // Adicionar link ao array com o nome do usuário
            links.push({
                nome: usuario.text,
                link: link
            });

            console.log('Link gerado:', link);
            await sleep(50);

            // Segunda metade do progresso para baixar o relatório
            atualizarProgresso(progressoAtual, 
                `Baixando relatório ${i + 1}/${items}\n${usuario.text}`);

            // Baixar relatório
            try {
                await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: link,
                        responseType: 'blob',
                        onload: function(response) {
                            if (response.status === 200) {
                                const blob = new Blob([response.response], { type: 'application/pdf' });
                                const url = window.URL.createObjectURL(blob);
                                
                                const a = document.createElement('a');
                                a.style.display = 'none';
                                a.href = url;
                                a.download = `Relatorio_WebPonto_${usuario.text.replace(/[^a-z0-9]/gi, '_').toUpperCase()}.pdf`;
                                a.target = '_self';
                                
                                document.body.appendChild(a);
                                a.click();
                                
                                requestAnimationFrame(() => {
                                    document.body.removeChild(a);
                                    window.URL.revokeObjectURL(url);
                                });
                                
                                exibirLog(`Relatório de ${usuario.text} baixado`, 1000, '#34A568');
                                setTimeout(resolve, 1000);
                            } else {
                                reject(new Error(`Erro ao baixar relatório: ${response.status}`));
                            }
                        },
                        onerror: function(error) {
                            reject(new Error(`Erro na requisição: ${error}`));
                        }
                    });
                });
            } catch (error) {
                exibirLog(`Erro ao baixar relatório de ${usuario.text}`, 2000, '#FF4B40');
                console.error(error);
            }

            await sleep(1000); // Esperar entre downloads
        }

        // Processo finalizado
        atualizarProgresso(100, `Processo concluído!\n${items} relatórios processados`);
        exibirLog('Todos os relatórios foram processados!', 3000, '#34A568');
        
        // Restaurar botão
        document.getElementById('btnGerarLinks').style.display = 'inline-block';

    } catch (error) {
        throw error;
    }
}

// Funções para manipular cookies
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// Criar botão de exibir/ocultar
const btnExibir = document.createElement('input');
btnExibir.type = 'button';
btnExibir.id = 'exibirRelatorios';
btnExibir.value = 'MINIMIZAR';
btnExibir.className = 'menuSCT';
btnExibir.style = `
    background: #474e68;
    color: #ffffff;
    font-size: 12px;
    border: none;
    height: 30px;
    position: fixed;
    z-index: 2002;
    bottom: 1px;
    left: 30px;
    cursor: pointer;
    transition: background-color 0.1s ease-in-out;
    border-radius: 15px;
    padding: 0 15px;
`;

// Configurar eventos do botão
btnExibir.onmouseover = () => btnExibir.style.backgroundColor = "#3982F7";
btnExibir.onmouseout = () => btnExibir.style.backgroundColor = "#474e68";
btnExibir.onclick = function() {
    $("#containerRelatorios").slideToggle();
    this.value = this.value === "MINIMIZAR" ? "ABRIR | Gerador de Relatórios" : "MINIMIZAR";
    setCookie('containerRelatoriosState', this.value === "MINIMIZAR", 30);
};

// Função para inicializar tudo
function inicializar() {
    criarInterface();
    document.body.appendChild(btnExibir);
    
    // Verificar estado inicial do container
    let containerState = getCookie('containerRelatoriosState');
    if(containerState !== null) {
        containerState = containerState === 'true';
        if(!containerState) {
            $("#containerRelatorios").hide();
            btnExibir.value = "ABRIR | Gerador de Relatórios";
        }
    }
}

// Aguardar o documento estar pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializar);
} else {
    inicializar();
}

function voltar() {
    $('.divajuda').slideUp(500, 'swing');
    $('.btnscontrole').fadeOut(500);
    $('.conteudo-principal').slideDown(500, 'swing');
    $('#btnajuda').fadeIn(500);
}

function ajuda() {
    $('.divajuda').slideDown(500, 'swing');
    $('.btnajuda').fadeOut(500);
    $('.conteudo-principal').slideUp(500, 'swing');
    $('#btnvoltar').slideDown(500, 'swing');
}

    document.getElementById('btnajuda')?.addEventListener('click', ajuda);
    document.getElementById('btnvoltar')?.addEventListener('click', voltar);
