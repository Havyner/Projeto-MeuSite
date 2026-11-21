
// Identifica se a página está na raiz ou dentro da pasta html
const caminhoBase = window.location.pathname.includes('/html/')
    ? '../'
    : './';

// Carrega o cabeçalho e o rodapé
async function carregarComponentes() {

    try {

        const respostaHeader = await fetch(
            `${caminhoBase}components/header.html`
        );

        const respostaFooter = await fetch(
            `${caminhoBase}components/footer.html`
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

// Ajusta os caminhos dos links e das imagens
function ajustarCaminhos() {

    document.querySelectorAll('#header a, #footer a').forEach(link => {

        const destino = link.getAttribute('href');

        if (
            destino &&
            !destino.startsWith('http') &&
            !destino.startsWith('#') &&
            !destino.startsWith('mailto:')
        ) {
            link.setAttribute(
                'href',
                caminhoBase + destino.replace(/^\.\//, '')
            );
        }

    });

    document.querySelectorAll('#header img, #footer img').forEach(imagem => {

        const origem = imagem.getAttribute('src');

        if (origem && !origem.startsWith('http')) {
            imagem.setAttribute(
                'src',
                caminhoBase + origem.replace(/^\.\//, '')
            );
        }

    });

}

// Configura o menu hambúrguer
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

// Inicia o carregamento
carregarComponentes();
