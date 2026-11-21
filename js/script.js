async function carregarComponentes() {

    const respostaHeader = await fetch('./components/header.html');
    const respostaFooter = await fetch('./components/footer.html');

    const header = await respostaHeader.text();
    const footer = await respostaFooter.text();

    document.querySelector('#header').innerHTML = header;
    document.querySelector('#footer').innerHTML = footer;

    configurarMenu();
}

function configurarMenu() {

    const botaoMenu = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.menu');

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

carregarComponentes();