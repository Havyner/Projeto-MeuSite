
/* ==========================================
   IDENTIFICA A RAIZ DO PROJETO
========================================== */

const caminhoBase = window.location.pathname.includes('/html/')
    ? '../'
    : './';

// Converte o caminho relativo em endereço absoluto da raiz
const raizProjeto = new URL(caminhoBase, window.location.href);


/* ==========================================
   NORMALIZA OS CAMINHOS
========================================== */

function ajustarDestino(destino) {

    if (
        !destino ||
        destino.startsWith('http') ||
        destino.startsWith('//') ||
        destino.startsWith('#') ||
        destino.startsWith('mailto:') ||
        destino.startsWith('tel:') ||
        destino.startsWith('javascript:')
    ) {
        return destino;
    }

    // Remove ../ e ./ do início do caminho
    const caminhoLimpo = destino.replace(/^(\.\.\/|\.\/)+/, '');

    // Monta o endereço correto a partir da raiz do projeto
    return new URL(caminhoLimpo, raizProjeto).href;
}


/* ==========================================
   AJUSTA LINKS E IMAGENS
========================================== */

function ajustarCaminhos() {

    document.querySelectorAll('#header a, #footer a').forEach(link => {

        const destino = link.getAttribute('href');

        if (destino) {
            link.setAttribute('href', ajustarDestino(destino));
        }

    });

    document.querySelectorAll('#header img, #footer img').forEach(imagem => {

        const origem = imagem.getAttribute('src');

        if (origem) {
            imagem.setAttribute('src', ajustarDestino(origem));
        }

    });

}


/* ==========================================
   CARREGA CABEÇALHO E RODAPÉ
========================================== */

async function carregarComponentes() {

    try {

        const respostaHeader = await fetch(
            new URL('components/header.html', raizProjeto)
        );

        const respostaFooter = await fetch(
            new URL('components/footer.html', raizProjeto)
        );

        if (!respostaHeader.ok || !respostaFooter.ok) {
            throw new Error('Erro ao carregar componentes.');
        }

        const header = await respostaHeader.text();
        const footer = await respostaFooter.text();

        document.querySelector('#header').innerHTML = header;
        document.querySelector('#footer').innerHTML = footer;

        ajustarCaminhos();

        configurarMenu();

    } catch (erro) {

        console.error('Erro ao carregar componentes:', erro);

    }

}


/* ==========================================
   CONFIGURA MENU HAMBÚRGUER
========================================== */

function configurarMenu() {

    const botaoMenu = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.menu');

    if (!botaoMenu || !menu) {
        console.error('Botão ou menu não encontrado.');
        return;
    }

    botaoMenu.addEventListener('click', function() {

        menu.classList.toggle('ativo');

        const menuAberto = menu.classList.contains('ativo');

        botaoMenu.setAttribute('aria-expanded', menuAberto);

        botaoMenu.setAttribute(
            'aria-label',
            menuAberto ? 'Fechar menu' : 'Abrir menu'
        );

    });

}


/* ==========================================
   INICIA O CARREGAMENTO
========================================== */

carregarComponentes();
