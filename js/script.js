
/* ==========================================
   CONFIGURAÇÃO DOS CAMINHOS
========================================== */

// Identifica a raiz do projeto, inclusive no GitHub Pages
const caminhoBase = (() => {
    const caminho = window.location.pathname;
    const partes = caminho.split('/').filter(Boolean);

    // Se estiver dentro da pasta html, remove essa pasta
    if (partes[partes.length - 2] === 'html') {
        partes.pop();
        partes.pop();
    } else if (partes[partes.length - 1]?.endsWith('.html')) {
        partes.pop();
    }

    // Identifica a raiz da hospedagem
    const raiz = '/' + partes.join('/');

    return raiz === '/' ? '/' : raiz + '/';
})();


/* ==========================================
   AJUSTA CAMINHOS
========================================== */

function ajustarCaminho(destino) {

    if (
        !destino ||
        destino.startsWith('http') ||
        destino.startsWith('#') ||
        destino.startsWith('mailto:') ||
        destino.startsWith('tel:') ||
        destino.startsWith('javascript:')
    ) {
        return destino;
    }

    return caminhoBase + destino.replace(/^\.?\//, '');
}


/* ==========================================
   AJUSTA LINKS E IMAGENS
========================================== */

function ajustarCaminhos() {

    document.querySelectorAll('#header a, #footer a').forEach(link => {

        const destino = link.getAttribute('href');

        if (destino) {
            link.setAttribute('href', ajustarCaminho(destino));
        }

    });

    document.querySelectorAll('#header img, #footer img').forEach(imagem => {

        const origem = imagem.getAttribute('src');

        if (origem) {
            imagem.setAttribute('src', ajustarCaminho(origem));
        }

    });

}


/* ==========================================
   CARREGAMENTO DOS COMPONENTES
========================================== */

async function carregarComponentes() {

    try {

        const [respostaHeader, respostaFooter] = await Promise.all([

            fetch(`${caminhoBase}components/header.html`),

            fetch(`${caminhoBase}components/footer.html`)

        ]);

        if (!respostaHeader.ok) {
            throw new Error('Não foi possível carregar o cabeçalho.');
        }

        if (!respostaFooter.ok) {
            throw new Error('Não foi possível carregar o rodapé.');
        }

        const header = await respostaHeader.text();
        const footer = await respostaFooter.text();

        const elementoHeader = document.querySelector('#header');
        const elementoFooter = document.querySelector('#footer');

        if (!elementoHeader || !elementoFooter) {
            throw new Error('Elementos #header ou #footer não encontrados.');
        }

        elementoHeader.innerHTML = header;
        elementoFooter.innerHTML = footer;

        ajustarCaminhos();

        configurarMenu();

    } catch (erro) {

        console.error('Erro ao carregar componentes:', erro);

    }

}


/* ==========================================
   MENU HAMBÚRGUER
========================================== */

function configurarMenu() {

    const botaoMenu = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.menu');

    if (!botaoMenu || !menu) {
        console.error('Botão ou menu não encontrado.');
        return;
    }

    botaoMenu.addEventListener('click', () => {

        menu.classList.toggle('ativo');

        const menuAberto = menu.classList.contains('ativo');

        botaoMenu.setAttribute('aria-expanded', menuAberto);

        botaoMenu.setAttribute(
            'aria-label',
            menuAberto ? 'Fechar menu' : 'Abrir menu'
        );

    });

    // Fecha o menu ao clicar em um link
    menu.querySelectorAll('a').forEach(link => {

        link.addEventListener('click', () => {

            menu.classList.remove('ativo');

            botaoMenu.setAttribute('aria-expanded', 'false');

            botaoMenu.setAttribute('aria-label', 'Abrir menu');

        });

    });

    // Fecha o menu ao clicar fora dele
    document.addEventListener('click', evento => {

        if (
            !menu.contains(evento.target) &&
            !botaoMenu.contains(evento.target)
        ) {

            menu.classList.remove('ativo');

            botaoMenu.setAttribute('aria-expanded', 'false');

            botaoMenu.setAttribute('aria-label', 'Abrir menu');

        }

    });

}


/* ==========================================
   INICIALIZAÇÃO
========================================== */

document.addEventListener('DOMContentLoaded', carregarComponentes);
