document.addEventListener('DOMContentLoaded', () => {
    console.log("Script carregado e monitorando cliques via arquivo externo!");

    // ==========================================================
    // 1. CRIAÇÃO E ESTILIZAÇÃO DO POPUP DIRETO NO JAVASCRIPT
    // ==========================================================
    const overlay = document.createElement('div');
    overlay.id = 'dynamic-js-popup';
    
    // Configura o fundo escurecido com desfoque e transição suave
    Object.assign(overlay.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(8px)',
        webkitBackdropFilter: 'blur(8px)',
        display: 'none',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: '999999',
        opacity: '0',
        transition: 'opacity 0.25s ease',
        fontFamily: 'system-ui, -apple-system, sans-serif'
    });

    // Injeta a estrutura do Card forçando cores escuras para os textos (!important)
    overlay.innerHTML = `
        <div id="popup-card" style="
            background: #ffffff !important;
            width: 90%;
            max-width: 350px;
            padding: 55px 25px 25px 25px;
            border-radius: 16px;
            text-align: center;
            position: relative;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
            transform: scale(0.85);
            transition: transform 0.25s ease;
        ">
            <div id="popup-circle" style="
                position: absolute;
                top: -35px;
                left: 50%;
                transform: translateX(-50%);
                width: 70px;
                height: 70px;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            "></div>
            <h2 id="popup-title" style="color: #1e293b !important; font-size: 24px !important; font-weight: 700 !important; margin: 15px 0 8px 0 !important; display: block !important;"></h2>
            <p id="popup-message" style="color: #64748b !important; font-size: 14px !important; line-height: 1.6 !important; margin: 0 0 24px 0 !important; display: block !important;"></p>
            <button id="popup-btn" style="
                width: 100%;
                padding: 12px;
                color: #ffffff !important;
                border: none;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                text-transform: uppercase;
            ">OK</button>
        </div>
    `;

    document.body.appendChild(overlay);

    // Mapeamento dos elementos internos criados
    const card = document.getElementById('popup-card');
    const circle = document.getElementById('popup-circle');
    const title = document.getElementById('popup-title');
    const message = document.getElementById('popup-message');
    const btn = document.getElementById('popup-btn');

    // Função interna que altera o conteúdo e dispara as transições visuais
    function dispararPopup(txtTitulo, txtMensagem, tipo = 'sucesso') {
        title.innerText = txtTitulo;
        message.innerHTML = txtMensagem;

        if (tipo === 'erro') {
            circle.style.backgroundColor = '#ef4444';
            btn.style.backgroundColor = '#ef4444';
            circle.innerHTML = `
                <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round">
                    <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
            `;
        } else {
            circle.style.backgroundColor = '#22c55e';
            btn.style.backgroundColor = '#22c55e';
            circle.innerHTML = `
                <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 6L9 17l-5-5"/>
                </svg>
            `;
        }

        overlay.style.display = 'flex';
        setTimeout(() => {
            overlay.style.opacity = '1';
            card.style.transform = 'scale(1)';
        }, 10);
    }

    function fecharPopup() {
        overlay.style.opacity = '0';
        card.style.transform = 'scale(0.85)';
        setTimeout(() => { overlay.style.display = 'none'; }, 250);
    }

    // Ouvintes de clique para fechar a janela
    btn.addEventListener('click', fecharPopup);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) fecharPopup(); });

    // ==========================================================
    // 2. CAPTURA DE EVENTOS DE CLIQUES (DE FORMA INTELIGENTE)
    // ==========================================================
    document.body.addEventListener('click', (event) => {
        const target = event.target;

        // Verifica se o clique ocorreu no botão principal de enviar formulário
        if (target.type === 'submit' || (target.tagName === 'BUTTON' && target.innerText.toLowerCase().includes('login') && !target.id.includes('popup'))) {
            event.preventDefault();
            
            const emailInput = document.querySelector('input[type="email"]');
            const emailValue = emailInput ? emailInput.value.trim() : '';

            // Se o e-mail digitado for diferente de admin@admin.com dispara o erro
            if (emailValue.toLowerCase() === 'admin@admin.com') {
                dispararPopup('Thank You!', `Successfully authenticated!<br>Welcome back, <strong>${emailValue}</strong>.`, 'sucesso');
                const form = document.querySelector('form');
                if (form) form.reset();
            } else {
                dispararPopup('User Not Found!', `The user <strong>${emailValue || 'specified'}</strong> does not exist in our database. Please check your typing or register.`, 'erro');
            }
            return;
        }

        // Cliques nos botões de Redes Sociais (Google / Facebook)
        if (target.tagName === 'BUTTON' && (target.innerText.includes('Google') || target.innerText.includes('Facebook'))) {
            event.preventDefault();
            const rede = target.innerText.includes('Google') ? 'Google' : 'Facebook';
            dispararPopup('Connected!', `Successfully authenticated via <strong>${rede}</strong>.`, 'sucesso');
            return;
        }

        // Cliques nos links institucionais
        if (target.tagName === 'A') {
            const txt = target.innerText.toLowerCase();
            if (txt.includes('register') || txt.includes('criar') || txt.includes('registre')) {
                event.preventDefault();
                dispararPopup('Create Account', 'Redirecting you to the project registration form...', 'sucesso');
            } else if (txt.includes('password') || txt.includes('senha') || txt.includes('esqueceu')) {
                event.preventDefault();
                dispararPopup('Reset Password', 'A temporary recovery link has been triggered to your email address.', 'sucesso');
            }
        }
    });
});
