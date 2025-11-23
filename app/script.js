// ===== SISTEMA DE CINEMA - JAVASCRIPT ORGANIZADO =====
// Autor: Sistema de Cinema
// Data: 2024
// Descrição: Sistema completo de gerenciamento de cinema com CRUD para filmes e usuários

// ===== VARIÁVEIS GLOBAIS E CONFIGURAÇÕES =====
const CONFIG = {
    ADMIN_EMAIL: "admin",
    ADMIN_PASSWORD: "admin",
    STORAGE_KEYS: {
        USUARIOS: "usuarios",
        USUARIO_LOGADO: "usuarioLogado",
        FILMES: "movies",
        EDIT_INDEX: "editMovieIndex",
        USERS: "users"
    }
};

// ===== FUNÇÕES DE AUTENTICAÇÃO E CADASTRO =====

/**
 * Alterna entre os formulários de login e cadastro
 */
function toggleCadastro() {
    const loginForm = document.getElementById("loginForm");
    const cadastroForm = document.getElementById("cadastroForm");

    if (loginForm && cadastroForm) {
        loginForm.classList.toggle("hidden");
        cadastroForm.classList.toggle("hidden");
    }
}

/**
 * Realiza o cadastro de novo usuário
 */
function cadastrar() {
    const nome = document.getElementById("cadastroNome").value;
    const email = document.getElementById("cadastroEmail").value;
    const senha = document.getElementById("cadastroSenha").value;

    const usuarios = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.USUARIOS)) || [];

    // Verifica se usuário já existe
    if (usuarios.find(u => u.email === email)) {
        alert("Usuário já cadastrado!");
        return;
    }

    // Adiciona novo usuário
    usuarios.push({ nome, email, senha, tipo: "Cliente" });
    localStorage.setItem(CONFIG.STORAGE_KEYS.USUARIOS, JSON.stringify(usuarios));
    alert("Cadastro realizado com sucesso!");
    toggleCadastro();
}

/**
 * Realiza o login no sistema
 */
/**
 * Realiza o login no sistema
 */
function login() {
    const email = document.getElementById("loginEmail").value;
    const senha = document.getElementById("loginSenha").value;

    // Login como administrador
    if (email === CONFIG.ADMIN_EMAIL && senha === CONFIG.ADMIN_PASSWORD) {
        window.location.href = "admin_dashboard.html";
        return;
    }

    // Carregar usuários de ambas as origens
    const usuarios = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.USUARIOS)) || [];
    const users = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.USERS)) || [];

    // Unificar listas
    const todosUsuarios = [...usuarios, ...users];

    // Buscar usuário correspondente
    const usuario = todosUsuarios.find(u => u.email === email && u.senha === senha || u.email === email && u.password === senha);

    if (usuario) {
        localStorage.setItem(CONFIG.STORAGE_KEYS.USUARIO_LOGADO, JSON.stringify(usuario));
        window.location.href = "cliente.html";
    } else {
        alert("E-mail ou senha incorretos!");
    }
}

/**
 * Realiza logout do sistema
 */
function logout() {
    if (confirm("Deseja realmente sair do sistema?")) {
        localStorage.removeItem(CONFIG.STORAGE_KEYS.USUARIO_LOGADO);
        localStorage.removeItem(CONFIG.STORAGE_KEYS.EDIT_INDEX);
        window.location.href = "index.html";
    }
}

// ===== FUNÇÕES AUXILIARES E UTILITÁRIOS =====

/**
 * Formata CPF no padrão brasileiro
 */
function formatCPF(cpf) {
    if (!cpf) return "";
    return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
}

/**
 * Formata data no padrão DD/MM/AAAA
 */
function formatDate(dateStr) {
    if (!dateStr) return "";
    const data = new Date(dateStr);
    if (isNaN(data)) return "";
    return data.toLocaleDateString("pt-BR", { timeZone: "UTC" });
}

/**
 * Carrega lista de usuários na tabela (função legada)
 */
function carregarUsuarios() {
    const usuarios = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.USUARIOS)) || [];
    const tbody = document.querySelector("#tabelaUsuarios tbody");
    if (!tbody) return;

    tbody.innerHTML = "";
    usuarios.forEach(u => {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${u.nome}</td><td>${u.email}</td>`;
        tbody.appendChild(tr);
    });
}

/**
 * Carrega lista de filmes na tabela (função legada)
 */
function carregarFilmes() {
    const filmes = JSON.parse(localStorage.getItem("filmes")) || [];
    const tabela = document.querySelector("#tabelaFilmes tbody");
    if (!tabela) return;

    tabela.innerHTML = "";
    filmes.forEach(f => {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${f.titulo}</td><td>${f.genero}</td>`;
        tabela.appendChild(tr);
    });
}

/**
 * Carrega catálogo de filmes para clientes (função legada)
 */
function carregarCatalogo() {
    const filmes = JSON.parse(localStorage.getItem("filmes")) || [];
    const catalogo = document.getElementById("catalogo");
    if (!catalogo) return;

    catalogo.innerHTML = "";
    filmes.forEach(f => {
        const card = document.createElement("div");
        card.className = "filme-card";
        card.innerHTML = `
            <img src="${f.cartaz}" alt="${f.titulo}">
            <h3>${f.titulo}</h3>
            <p>${f.genero}</p>
        `;
        catalogo.appendChild(card);
    });
}

/**
 * Controla a navegação entre seções (função legada)
 */
function mostrarSecao(secao) {
    document.querySelectorAll(".section").forEach(s => s.classList.add("hidden"));
    const secaoAlvo = document.querySelector(`#${secao}Secao`);
    if (secaoAlvo) secaoAlvo.classList.remove("hidden");

    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    const tabAlvo = document.querySelector(`.tab[onclick*='${secao}']`);
    if (tabAlvo) tabAlvo.classList.add("active");
}

// ===== SISTEMA DE EVENT LISTENERS POR PÁGINA =====

document.addEventListener("DOMContentLoaded", function () {
    console.log("🎬 Sistema de Cinema - Inicializando...");

    const path = window.location.pathname;
    const currentPage = path.split('/').pop() || 'index.html';
    console.log("📄 Página atual:", currentPage);

    // ===== PÁGINA: PAINEL ADMINISTRATIVO =====
    if (currentPage === "admin_dashboard.html") {
        console.log("⚙️ Configurando Painel Administrativo");

        const logoutBtn = document.getElementById("logoutBtn");
        if (logoutBtn) {
            logoutBtn.addEventListener("click", logout);
        }
    }

    // ===== PÁGINA: ADICIONAR/EDITAR FILME =====
    if (currentPage === "add_filme.html") {
        console.log("🎞️ Configurando Página de Filmes");

        const form = document.getElementById("formFilmes");
        const backToAdminBtn = document.getElementById("backToAdminBtn");
        const logoutBtn = document.getElementById("logoutBtn");
        const generoContainer = document.getElementById("generoContainer");

        // Lista de gêneros disponíveis
        const GENEROS = [
            "Ação", "Aventura", "Comédia", "Drama",
            "Fantasia", "Ficção Científica", "Romance",
            "Suspense", "Terror"
        ];

        /**
         * Cria botões de gênero dinamicamente
         */
        function criarBotoesGenero() {
            if (!generoContainer) return;

            generoContainer.innerHTML = '';
            GENEROS.forEach(genero => {
                const botao = document.createElement('div');
                botao.className = 'genero-botao';
                botao.textContent = genero;
                botao.dataset.value = genero;

                // Aplicar estilos diretamente
                Object.assign(botao.style, {
                    display: 'inline-block',
                    padding: '8px 16px',
                    margin: '4px',
                    border: '2px solid #333',
                    borderRadius: '6px',
                    backgroundColor: '#222',
                    color: '#f5f5f5',
                    cursor: 'pointer',
                    fontSize: '14px',
                    transition: 'all 0.3s ease',
                    userSelect: 'none'
                });

                botao.addEventListener('click', function () {
                    const estaSelecionado = this.classList.contains('selecionado');
                    if (estaSelecionado) {
                        this.classList.remove('selecionado');
                        Object.assign(this.style, {
                            backgroundColor: '#222',
                            color: '#f5f5f5',
                            borderColor: '#333',
                            fontWeight: 'normal'
                        });
                    } else {
                        this.classList.add('selecionado');
                        Object.assign(this.style, {
                            backgroundColor: '#f4d03f',
                            color: '#000',
                            borderColor: '#f4d03f',
                            fontWeight: 'bold'
                        });
                    }
                    atualizarGenerosSelecionados();
                });

                generoContainer.appendChild(botao);
            });
        }

        /**
         * Atualiza campo hidden com gêneros selecionados
         */
        function atualizarGenerosSelecionados() {
            const botoesSelecionados = generoContainer.querySelectorAll('.genero-botao.selecionado');
            const generosSelecionados = Array.from(botoesSelecionados).map(botao => botao.dataset.value);
            document.getElementById('generoFilme').value = generosSelecionados.join(', ');
        }

        /**
         * Pré-preenche gêneros no modo edição
         */
        function preencherGeneros(generosFilme) {
            if (!generosFilme || !generoContainer) return;
            const generosArray = generosFilme.split(', ');
            const botoes = generoContainer.querySelectorAll('.genero-botao');

            botoes.forEach(botao => {
                if (generosArray.includes(botao.dataset.value)) {
                    botao.classList.add('selecionado');
                    Object.assign(botao.style, {
                        backgroundColor: '#f4d03f',
                        color: '#000',
                        borderColor: '#f4d03f',
                        fontWeight: 'bold'
                    });
                }
            });
        }

        /**
         * Manipula o envio do formulário de filme
         */
        function handleFormSubmit() {
            console.log("📤 Processando formulário de filme...");

            // Captura gêneros selecionados
            const botoesSelecionados = generoContainer.querySelectorAll('.genero-botao.selecionado');
            const generosSelecionados = Array.from(botoesSelecionados).map(botao => botao.dataset.value);

            if (generosSelecionados.length === 0) {
                alert("Selecione pelo menos um gênero!");
                return;
            }

            // Captura dados do formulário
            const movieData = {
                titulo: document.getElementById("tituloFilme").value.trim(),
                genero: generosSelecionados.join(", "),
                duracao: document.getElementById("duracaoFilme").value.trim(),
                classificacao: document.getElementById("classificacaoIndicativaFilme").value,
                sinopse: document.getElementById("sinopseFilme").value.trim(),
                dataEstreia: document.getElementById("dataEstreiaFilme").value,
                cartaz: document.getElementById("cartazFilme").value.trim(),
                status: document.getElementById("statusFilme").value
            };

            // Validações básicas
            if (!movieData.titulo) {
                alert("Preencha o título do filme!");
                return;
            }

            if (!movieData.duracao) {
                alert("Preencha a duração do filme!");
                return;
            }

            // Salva no localStorage
            let movies = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.FILMES)) || [];
            const editIndex = localStorage.getItem(CONFIG.STORAGE_KEYS.EDIT_INDEX);

            if (editIndex !== null) {
                movies[editIndex] = movieData;
                localStorage.removeItem(CONFIG.STORAGE_KEYS.EDIT_INDEX);
                // alert("🎉 Filme atualizado com sucesso!");
            } else {
                movies.push(movieData);
                alert("🎉 Filme cadastrado com sucesso!");
            }

            localStorage.setItem(CONFIG.STORAGE_KEYS.FILMES, JSON.stringify(movies));
            window.location.href = "crud_filme.html";
        }

        // INICIALIZAÇÃO DA PÁGINA
        if (generoContainer) {
            criarBotoesGenero();
            atualizarGenerosSelecionados();
        }

        // EVENT LISTENERS
        if (form) {
            form.addEventListener("submit", function (e) {
                e.preventDefault();
                handleFormSubmit();
            });
        }

        if (backToAdminBtn) {
            backToAdminBtn.addEventListener("click", function () {
                console.log("⬅️ Voltando para gerenciamento de filmes");
                localStorage.removeItem(CONFIG.STORAGE_KEYS.EDIT_INDEX);
                window.location.href = "crud_filme.html";
            });
        }

        if (logoutBtn) {
            logoutBtn.addEventListener("click", logout);
        }

        // PRÉ-PREENCHIMENTO PARA EDIÇÃO
        const editIndexStr = localStorage.getItem(CONFIG.STORAGE_KEYS.EDIT_INDEX);
        if (editIndexStr !== null) {
            const movies = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.FILMES)) || [];
            const movie = movies[editIndexStr];

            if (movie) {
                console.log("✏️ Preenchendo formulário para edição");
                document.getElementById("tituloFilme").value = movie.titulo || "";
                document.getElementById("duracaoFilme").value = movie.duracao || "";
                document.getElementById("classificacaoIndicativaFilme").value = movie.classificacao || "L";
                document.getElementById("sinopseFilme").value = movie.sinopse || "";
                document.getElementById("dataEstreiaFilme").value = movie.dataEstreia || "";
                document.getElementById("cartazFilme").value = movie.cartaz || "";
                document.getElementById("statusFilme").value = movie.status || "Em Cartaz";

                if (movie.genero) preencherGeneros(movie.genero);
            }
        }
    }

    // ===== PÁGINA: GERENCIAR FILMES (CRUD) =====
    if (currentPage === "crud_filme.html") {
        console.log("🎭 Configurando Gerenciamento de Filmes");

        const addMovieBtn = document.getElementById('addMovieBtn');
        const backToAdminBtn = document.getElementById('backToAdminBtn');
        const movieTableBody = document.querySelector("#movieTable tbody");
        const movieSearchInput = document.getElementById('searchInput');
        const logoutBtn = document.getElementById("logoutBtn");

        let movies = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.FILMES)) || [];

        // BOTÕES DE NAVEGAÇÃO
        if (backToAdminBtn) {
            backToAdminBtn.addEventListener("click", function () {
                console.log("⬅️ Voltando para painel administrativo");
                window.location.href = "admin_dashboard.html";
            });
        }

        if (logoutBtn) {
            logoutBtn.addEventListener("click", logout);
        }

        /**
         * Renderiza a tabela de filmes com filtro
         */
        function renderMovieTable(filter = "") {
            if (!movieTableBody) return;
            movieTableBody.innerHTML = "";

            // Aplicar filtro
            let filteredMovies = movies.filter(movie => {
                const term = filter.toLowerCase();
                return (
                    (movie.titulo && movie.titulo.toLowerCase().includes(term)) ||
                    (movie.genero && movie.genero.toLowerCase().includes(term)) ||
                    (movie.classificacao && movie.classificacao.toString().includes(term)) ||
                    (movie.dataEstreia && formatDate(movie.dataEstreia).includes(term))
                );
            });

            // Mensagem para lista vazia
            if (filteredMovies.length === 0) {
                const row = movieTableBody.insertRow();
                const cell = row.insertCell(0);
                cell.colSpan = 8;
                cell.textContent = "🎭 Nenhum filme encontrado";
                cell.style.textAlign = "center";
                cell.style.color = "#ccc";
                return;
            }

            // Preencher tabela
            filteredMovies.forEach((movie, index) => {
                const row = movieTableBody.insertRow();
                row.insertCell(0).textContent = index + 1;
                row.insertCell(1).textContent = movie.titulo || "Sem título";
                row.insertCell(2).textContent = movie.genero || "Não informado";
                row.insertCell(3).textContent = movie.duracao || "Não informada";
                row.insertCell(4).textContent = movie.classificacao || "L";
                row.insertCell(5).textContent = movie.sinopse || "Sem sinopse";

                // Data formatada no padrão brasileiro
                const dataEstreiaFormatada = formatDate(movie.dataEstreia);
                row.insertCell(6).textContent = dataEstreiaFormatada || "Não informada";

                const actionsCell = row.insertCell(7);

                // Botão Editar
                const editBtn = document.createElement('button');
                editBtn.textContent = '✏️ Editar';
                editBtn.className = 'editBtn';
                editBtn.addEventListener('click', () => {
                    localStorage.setItem(CONFIG.STORAGE_KEYS.EDIT_INDEX, index);
                    window.location.href = "add_filme.html";
                });
                actionsCell.appendChild(editBtn);

                // Botão Excluir
                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = '🗑️ Excluir';
                deleteBtn.className = 'deleteBtn';
                deleteBtn.addEventListener('click', () => {
                    if (confirm('Deseja realmente excluir este filme?')) {
                        movies.splice(index, 1);
                        localStorage.setItem(CONFIG.STORAGE_KEYS.FILMES, JSON.stringify(movies));
                        renderMovieTable(movieSearchInput.value);
                    }
                });
                actionsCell.appendChild(deleteBtn);
            });
        }

        // EVENT LISTENERS
        if (addMovieBtn) {
            addMovieBtn.addEventListener('click', () => {
                localStorage.removeItem(CONFIG.STORAGE_KEYS.EDIT_INDEX);
                window.location.href = "add_filme.html";
            });
        }

        if (movieSearchInput) {
            movieSearchInput.addEventListener('input', (e) => {
                renderMovieTable(e.target.value);
            });
        }

        // INICIALIZAR TABELA
        renderMovieTable();
    }

    // ===== PÁGINA: GERENCIAR USUÁRIOS (CRUD) =====
    if (currentPage === "crud_usuario.html") {
        console.log("👥 Configurando Gerenciamento de Usuários");

        const addUserBtn = document.getElementById("addUserBtn");
        const backToAdminBtn = document.getElementById("backToAdminBtn");
        const logoutBtn = document.getElementById("logoutBtn");
        const userTableBody = document.querySelector("#userTable tbody");
        const searchInput = document.getElementById("searchInput");

        let users = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.USERS)) || [];

        // BOTÕES DE NAVEGAÇÃO
        if (backToAdminBtn) {
            backToAdminBtn.addEventListener("click", function () {
                console.log("⬅️ Voltando para painel administrativo");
                window.location.href = "admin_dashboard.html";
            });
        }

        if (logoutBtn) {
            logoutBtn.addEventListener("click", logout);
        }

        /**
         * Renderiza tabela de usuários com filtro
         */
        function renderTable(filter = "") {
            if (!userTableBody) return;
            userTableBody.innerHTML = "";

            // Aplicar filtro
            let filteredUsers = users.filter((user) => {
                const term = filter.toLowerCase();
                return (
                    user.name.toLowerCase().includes(term) ||
                    user.email.toLowerCase().includes(term) ||
                    (user.cpf && user.cpf.toLowerCase().includes(term)) ||
                    (user.birthdate && formatDate(user.birthdate).includes(term)) ||
                    user.status.toLowerCase().includes(term) ||
                    user.role.toLowerCase().includes(term)
                );
            });

            // Ordenar por nome
            filteredUsers.sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));

            // Preencher tabela
            filteredUsers.forEach((user, index) => {
                const dataFormatada = formatDate(user.birthdate);
                const cpfFormatado = user.cpf ? formatCPF(user.cpf) : "";

                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${cpfFormatado}</td>
                    <td>${dataFormatada}</td>
                    <td>${user.status}</td>
                    <td>${user.role}</td>
                    <td>
                        <button class="editBtn" data-index="${index}">✏️ Editar</button>
                        <button class="deleteBtn" data-index="${index}">🗑️ Excluir</button>
                    </td>
                `;
                userTableBody.appendChild(tr);
            });

            localStorage.setItem(CONFIG.STORAGE_KEYS.USERS, JSON.stringify(users));
        }

        /**
         * Cria modal de edição de usuário
         */
        function criarModalEdicao(index, user) {
            const modal = document.createElement("div");
            modal.classList.add("modal");
            modal.innerHTML = `
                <div class="modal-content">
                    <h3>✏️ Editar Usuário</h3>
                    <label>Nome:</label>
                    <input type="text" id="editName" value="${user.name}">
                    <label>E-mail:</label>
                    <input type="email" id="editEmail" value="${user.email}">
                    <label>CPF:</label>
                    <input type="text" id="editCPF" value="${user.cpf}">
                    <label>Data de Nascimento:</label>
                    <input type="date" id="editBirth" value="${user.birthdate || ""}">
                    <label>Status:</label>
                    <select id="editStatus">
                        <option value="Ativo" ${user.status === "Ativo" ? "selected" : ""}>Ativo</option>
                        <option value="Inativo" ${user.status === "Inativo" ? "selected" : ""}>Inativo</option>
                    </select>
                    <label>Perfil:</label>
                    <select id="editRole">
                        <option value="Cliente" ${user.role === "Cliente" ? "selected" : ""}>Cliente</option>
                        <option value="Funcionário" ${user.role === "Funcionário" ? "selected" : ""}>Funcionário</option>
                        <option value="Administrador" ${user.role === "Administrador" ? "selected" : ""}>Administrador</option>
                    </select>

                    <div class="modal-buttons">
                        <button id="saveEditBtn">💾 Salvar</button>
                        <button id="cancelEditBtn">❌ Cancelar</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            // Event Listeners do Modal
            document.getElementById("saveEditBtn").addEventListener("click", () => {
                user.name = document.getElementById("editName").value.trim();
                user.email = document.getElementById("editEmail").value.trim();
                user.cpf = document.getElementById("editCPF").value.trim();
                user.birthdate = document.getElementById("editBirth").value;
                user.status = document.getElementById("editStatus").value;
                user.role = document.getElementById("editRole").value;

                users[index] = user;
                localStorage.setItem(CONFIG.STORAGE_KEYS.USERS, JSON.stringify(users));
                document.body.removeChild(modal);
                renderTable(searchInput ? searchInput.value : "");
            });

            document.getElementById("cancelEditBtn").addEventListener("click", () => {
                document.body.removeChild(modal);
            });
        }

        // EVENT LISTENERS
        if (searchInput) {
            searchInput.addEventListener("input", (e) => {
                renderTable(e.target.value);
            });
        }

        if (addUserBtn) {
            addUserBtn.addEventListener("click", () => {
                window.location.href = "add_usuario.html";
            });
        }

        if (userTableBody) {
            userTableBody.addEventListener("click", (e) => {
                const index = e.target.dataset.index;

                if (e.target.classList.contains("deleteBtn")) {
                    if (confirm("Deseja realmente excluir este usuário?")) {
                        users.splice(index, 1);
                        localStorage.setItem(CONFIG.STORAGE_KEYS.USERS, JSON.stringify(users));
                        renderTable(searchInput ? searchInput.value : "");
                    }
                }

                if (e.target.classList.contains("editBtn")) {
                    const user = users[index];
                    criarModalEdicao(index, user);
                }
            });
        }

        // INICIALIZAR TABELA
        renderTable();
    }

    // ===== PÁGINA: ADICIONAR USUÁRIO =====
    if (currentPage === "add_usuario.html") {
        console.log("👤 Configurando Adição de Usuário");

        const addUserForm = document.getElementById("addUserForm");
        const backToAdminBtn = document.getElementById("backToAdminBtn");
        const logoutBtn = document.getElementById("logoutBtn");

        // BOTÕES DE NAVEGAÇÃO
        if (backToAdminBtn) {
            backToAdminBtn.addEventListener("click", function () {
                console.log("⬅️ Voltando para gerenciamento de usuários");
                window.location.href = "crud_usuario.html";
            });
        }

        if (logoutBtn) {
            logoutBtn.addEventListener("click", logout);
        }

        if (addUserForm) {
            addUserForm.addEventListener("submit", (e) => {
                e.preventDefault();

                // Capturar dados do formulário
                const userData = {
                    name: document.getElementById("name").value.trim(),
                    email: document.getElementById("email").value.trim(),
                    password: document.getElementById("password").value.trim(),
                    cpf: document.getElementById("cpf").value.trim(),
                    birthdate: document.getElementById("birthdate").value,
                    role: document.getElementById("role").value,
                    status: document.getElementById("status").value
                };

                const users = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.USERS)) || [];

                // Validações
                if (users.some(user => user.email === userData.email)) {
                    alert("E-mail já cadastrado!");
                    return;
                }

                if (users.some(user => user.cpf === userData.cpf)) {
                    alert("CPF já cadastrado!");
                    return;
                }

                const today = new Date();
                const inputDate = new Date(userData.birthdate);
                if (inputDate > today) {
                    alert("A data de nascimento não pode ser futura!");
                    return;
                }

                // Salvar usuário
                users.push(userData);
                localStorage.setItem(CONFIG.STORAGE_KEYS.USERS, JSON.stringify(users));

                alert("👤 Usuário cadastrado com sucesso!");
                window.location.href = "crud_usuario.html";
            });
        }
    }

    // ===== PÁGINA: CATÁLOGO CLIENTE =====
    // ===== PÁGINA: CATÁLOGO CLIENTE =====
    if (currentPage === "cliente.html") {
        console.log("🎭 Configurando Catálogo para Clientes");

        // Variáveis para controle do modal
        let filmeSelecionado = null;
        let sessaoSelecionada = null;
        let quantidadeIngressos = 1;
        let sessoesDisponiveis = [];

        /**
         * Carrega catálogo de filmes para clientes
         */
        function carregarCatalogoCliente() {
            const movies = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.FILMES)) || [];
            const sessoes = JSON.parse(localStorage.getItem("sessoes")) || [];
            const catalogo = document.getElementById("catalogo");

            if (!catalogo) return;

            catalogo.innerHTML = "";

            if (movies.length === 0) {
                catalogo.innerHTML = `
                <div class="empty-state">
                    <h3>🎭 Nenhum filme disponível</h3>
                    <p>Volte mais tarde para conferir nossa programação!</p>
                </div>
            `;
                return;
            }

            movies.forEach(movie => {
                // Verificar se há sessões disponíveis para este filme
                const sessoesFilme = sessoes.filter(sessao =>
                    sessao.filme === movie.titulo &&
                    sessao.status === 'aguardando'
                );

                const card = document.createElement("div");
                card.className = "filme-card";
                card.innerHTML = `
                <img src="${movie.cartaz || 'placeholder.jpg'}" alt="${movie.titulo}" onerror="this.src='placeholder.jpg'">
                <h3>${movie.titulo || "Sem título"}</h3>
                <p><strong>🏷️ Gênero:</strong> ${movie.genero || "Não informado"}</p>
                <p><strong>⏱️ Duração:</strong> ${movie.duracao || "Não informada"} min</p>
                <p><strong>📊 Classificação:</strong> ${movie.classificacao || "L"}</p>
                <p><strong>📈 Status:</strong> ${movie.status || "Em Breve"}</p>
                <p class="sinopse">${movie.sinopse || "Sinopse não disponível"}</p>
                <div class="sessoes-info">
                    <p><strong>🎭 Sessões disponíveis:</strong> ${sessoesFilme.length}</p>
                </div>
                ${sessoesFilme.length > 0 ?
                    `<button class="btn-comprar" onclick="abrirModalIngresso('${movie.titulo}')">
                         🎫 Comprar Ingresso
                     </button>` :
                    '<p class="sem-sessoes">⏳ Aguardando novas sessões</p>'
                }
            `;
                catalogo.appendChild(card);
            });
        }

        /**
         * Abre modal para compra de ingresso
         */
        window.abrirModalIngresso = function(tituloFilme) {
            const movies = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.FILMES)) || [];
            const sessoes = JSON.parse(localStorage.getItem("sessoes")) || [];

            // Encontrar filme selecionado
            filmeSelecionado = movies.find(movie => movie.titulo === tituloFilme);
            if (!filmeSelecionado) return;

            // Filtrar sessões disponíveis para este filme
            sessoesDisponiveis = sessoes.filter(sessao =>
                sessao.filme === tituloFilme &&
                sessao.status === 'aguardando'
            );

            // Preencher informações do filme no modal
            document.getElementById('modalFilmeTitulo').textContent = filmeSelecionado.titulo;
            document.getElementById('modalFilmeGenero').textContent = `Gênero: ${filmeSelecionado.genero}`;
            document.getElementById('modalFilmeDuracao').textContent = `Duração: ${filmeSelecionado.duracao} min`;
            document.getElementById('modalFilmeClassificacao').textContent = `Classificação: ${filmeSelecionado.classificacao}`;
            document.getElementById('modalCartaz').src = filmeSelecionado.cartaz || 'placeholder.jpg';
            document.getElementById('modalCartaz').alt = filmeSelecionado.titulo;

            // Carregar lista de sessões
            carregarListaSessoes();

            // Resetar quantidade
            quantidadeIngressos = 1;
            atualizarQuantidade();

            // Abrir modal
            document.getElementById('modalIngresso').classList.remove('hidden');
        }

        /**
         * Carrega lista de sessões disponíveis
         */
        function carregarListaSessoes() {
            const listaSessoes = document.getElementById('listaSessoes');
            listaSessoes.innerHTML = '';

            if (sessoesDisponiveis.length === 0) {
                listaSessoes.innerHTML = '<p class="sem-sessoes">Nenhuma sessão disponível</p>';
                return;
            }

            sessoesDisponiveis.forEach((sessao, index) => {
                const sessaoElement = document.createElement('div');
                sessaoElement.className = `sessao-item ${sessaoSelecionada === index ? 'selecionada' : ''}`;
                sessaoElement.innerHTML = `
                <div class="sessao-info">
                    <strong>📍 ${sessao.sala}</strong>
                    <span>📅 ${formatarDataSessao(sessao.data)}</span>
                    <span>🕒 ${sessao.horario}</span>
                    <span>💰 R$ ${sessao.preco.toFixed(2).replace('.', ',')}</span>
                </div>
            `;
                sessaoElement.onclick = () => selecionarSessao(index);
                listaSessoes.appendChild(sessaoElement);
            });
        }

        /**
         * Seleciona uma sessão
         */
        function selecionarSessao(index) {
            sessaoSelecionada = index;
            carregarListaSessoes();
            atualizarResumoCompra();
        }

        /**
         * Formata data da sessão
         */
        function formatarDataSessao(dataString) {
            if (!dataString) return "";
            const [ano, mes, dia] = dataString.split('-');
            return `${dia}/${mes}/${ano}`;
        }

        /**
         * Altera quantidade de ingressos
         */
        window.alterarQuantidade = function(alteracao) {
            const novaQuantidade = quantidadeIngressos + alteracao;
            if (novaQuantidade >= 1 && novaQuantidade <= 10) {
                quantidadeIngressos = novaQuantidade;
                atualizarQuantidade();
                atualizarResumoCompra();
            }
        }

        /**
         * Atualiza display da quantidade
         */
        function atualizarQuantidade() {
            document.getElementById('quantidade').textContent = quantidadeIngressos;
        }

        /**
         * Atualiza resumo da compra
         */
        function atualizarResumoCompra() {
            const resumoCompra = document.getElementById('resumoCompra');
            const precoTotal = document.getElementById('precoTotal');

            if (sessaoSelecionada === null) {
                resumoCompra.innerHTML = '<p>Selecione uma sessão para ver o resumo</p>';
                precoTotal.textContent = 'R$ 0,00';
                return;
            }

            const sessao = sessoesDisponiveis[sessaoSelecionada];
            const total = sessao.preco * quantidadeIngressos;

            resumoCompra.innerHTML = `
            <div class="resumo-item">
                <span>Filme:</span>
                <span>${filmeSelecionado.titulo}</span>
            </div>
            <div class="resumo-item">
                <span>Sessão:</span>
                <span>${formatarDataSessao(sessao.data)} - ${sessao.horario}</span>
            </div>
            <div class="resumo-item">
                <span>Sala:</span>
                <span>${sessao.sala}</span>
            </div>
            <div class="resumo-item">
                <span>Ingressos:</span>
                <span>${quantidadeIngressos} x R$ ${sessao.preco.toFixed(2).replace('.', ',')}</span>
            </div>
        `;

            precoTotal.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
        }

        /**
         * Fecha modal de ingresso
         */
        window.fecharModalIngresso = function() {
            document.getElementById('modalIngresso').classList.add('hidden');
            filmeSelecionado = null;
            sessaoSelecionada = null;
            quantidadeIngressos = 1;
        }

        /**
         * Finaliza a compra do ingresso
         */
        window.finalizarCompra = function() {
            if (sessaoSelecionada === null) {
                alert('Por favor, selecione uma sessão!');
                return;
            }

            const sessao = sessoesDisponiveis[sessaoSelecionada];
            const total = sessao.preco * quantidadeIngressos;

            // Simular processamento da compra
            const compra = {
                id: Date.now(),
                filme: filmeSelecionado.titulo,
                sessao: sessao,
                quantidade: quantidadeIngressos,
                total: total,
                dataCompra: new Date().toISOString(),
                status: 'confirmada'
            };

            // Salvar compra no localStorage (em um sistema real, isso seria enviado para um backend)
            const compras = JSON.parse(localStorage.getItem('compras')) || [];
            compras.push(compra);
            localStorage.setItem('compras', JSON.stringify(compras));

            alert(`🎉 Compra realizada com sucesso!\n\n` +
                `Filme: ${filmeSelecionado.titulo}\n` +
                `Sessão: ${formatarDataSessao(sessao.data)} - ${sessao.horario}\n` +
                `Sala: ${sessao.sala}\n` +
                `Ingressos: ${quantidadeIngressos}\n` +
                `Total: R$ ${total.toFixed(2).replace('.', ',')}`);

            fecharModalIngresso();
        }

        // Carregar catálogo inicial
        carregarCatalogoCliente();
    }
// ===== PÁGINA: RELATÓRIO DE VENDAS =====
    if (currentPage === "relatorio_vendas.html") {
        console.log("💰 Configurando Relatório de Vendas");

        const inicioInput = document.getElementById('inicio');
        const fimInput = document.getElementById('fim');
        const filterPeriodBtn = document.getElementById('filterPeriodBtn');
        const backToAdminBtn = document.getElementById('backToAdminBtn');
        const logoutBtn = document.getElementById('logoutBtn');
        const resumoGeral = document.getElementById('resumoGeral');
        const vendasPorFilme = document.getElementById('vendasPorFilme');
        const detalhesVendas = document.getElementById('detalhesVendas');

        // BOTÕES DE NAVEGAÇÃO
        if (backToAdminBtn) {
            backToAdminBtn.addEventListener("click", function () {
                console.log("⬅️ Voltando para painel administrativo");
                window.location.href = "admin_dashboard.html";
            });
        }

        if (logoutBtn) {
            logoutBtn.addEventListener("click", logout);
        }

        /**
         * Formata data no padrão DD/MM/AAAA
         */
        function formatarDataVendas(dataString) {
            if (!dataString) return "";
            const [ano, mes, dia] = dataString.split('-');
            return `${dia}/${mes}/${ano}`;
        }

        /**
         * Formata valor monetário no padrão brasileiro
         */
        function formatarValor(valor) {
            return `R$ ${valor.toFixed(2).replace('.', ',')}`;
        }

        /**
         * Obtém a data de início do mês atual
         */
        function getInicioMes() {
            const hoje = new Date();
            const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
            return inicioMes.toISOString().split('T')[0];
        }

        /**
         * Obtém a data de hoje
         */
        function getHoje() {
            return new Date().toISOString().split('T')[0];
        }

        /**
         * Calcula métricas gerais das vendas
         */
        function calcularMetricasVendas(comprasFiltradas) {
            const totalVendas = comprasFiltradas.length;
            const totalReceita = comprasFiltradas.reduce((sum, compra) => sum + compra.total, 0);
            const totalIngressos = comprasFiltradas.reduce((sum, compra) => sum + compra.quantidade, 0);
            const ticketMedio = totalVendas > 0 ? totalReceita / totalVendas : 0;

            return {
                totalVendas,
                totalReceita,
                totalIngressos,
                ticketMedio
            };
        }

        /**
         * Agrupa vendas por filme
         */
        function agruparVendasPorFilme(comprasFiltradas) {
            const vendasPorFilme = {};

            comprasFiltradas.forEach(compra => {
                const filme = compra.filme;
                if (!vendasPorFilme[filme]) {
                    vendasPorFilme[filme] = {
                        filme: filme,
                        totalVendas: 0,
                        totalReceita: 0,
                        totalIngressos: 0,
                        compras: []
                    };
                }

                vendasPorFilme[filme].totalVendas++;
                vendasPorFilme[filme].totalReceita += compra.total;
                vendasPorFilme[filme].totalIngressos += compra.quantidade;
                vendasPorFilme[filme].compras.push(compra);
            });

            // Ordenar por receita (maior primeiro)
            return Object.values(vendasPorFilme).sort((a, b) => b.totalReceita - a.totalReceita);
        }

        /**
         * Renderiza o resumo geral
         */
        function renderResumoGeral(metricas, dataInicio, dataFim) {
            resumoGeral.innerHTML = `
            <div class="resumo-header">
                <h3>📈 Resumo Geral</h3>
                <span class="periodo">Período: ${formatarDataVendas(dataInicio)} a ${formatarDataVendas(dataFim)}</span>
            </div>
            <div class="metricas-grid">
                <div class="metrica-card">
                    <div class="metrica-icon">💰</div>
                    <div class="metrica-info">
                        <span class="metrica-valor">${formatarValor(metricas.totalReceita)}</span>
                        <span class="metrica-label">Receita Total</span>
                    </div>
                </div>
                <div class="metrica-card">
                    <div class="metrica-icon">🎟️</div>
                    <div class="metrica-info">
                        <span class="metrica-valor">${metricas.totalVendas}</span>
                        <span class="metrica-label">Total de Vendas</span>
                    </div>
                </div>
                <div class="metrica-card">
                    <div class="metrica-icon">📊</div>
                    <div class="metrica-info">
                        <span class="metrica-valor">${metricas.totalIngressos}</span>
                        <span class="metrica-label">Ingressos Vendidos</span>
                    </div>
                </div>
                <div class="metrica-card">
                    <div class="metrica-icon">📈</div>
                    <div class="metrica-info">
                        <span class="metrica-valor">${formatarValor(metricas.ticketMedio)}</span>
                        <span class="metrica-label">Ticket Médio</span>
                    </div>
                </div>
            </div>
        `;
        }

        /**
         * Renderiza vendas por filme
         */
        function renderVendasPorFilme(vendasAgrupadas) {
            if (vendasAgrupadas.length === 0) {
                vendasPorFilme.innerHTML = `
                <div class="empty-state">
                    <h3>📭 Nenhuma venda encontrada</h3>
                    <p>Não há vendas no período selecionado.</p>
                </div>
            `;
                return;
            }

            vendasPorFilme.innerHTML = `
            <div class="vendas-header">
                <h3>🎬 Vendas por Filme</h3>
                <span class="total-filmes">${vendasAgrupadas.length} filme(s)</span>
            </div>
            <div class="filmes-grid">
                ${vendasAgrupadas.map(filme => `
                    <div class="filme-venda-card">
                        <div class="filme-header">
                            <h4>${filme.filme}</h4>
                            <span class="receita-filme">${formatarValor(filme.totalReceita)}</span>
                        </div>
                        <div class="filme-metricas">
                            <div class="filme-metrica">
                                <span class="label">Vendas:</span>
                                <span class="valor">${filme.totalVendas}</span>
                            </div>
                            <div class="filme-metrica">
                                <span class="label">Ingressos:</span>
                                <span class="valor">${filme.totalIngressos}</span>
                            </div>
                            <div class="filme-metrica">
                                <span class="label">Receita Média:</span>
                                <span class="valor">${formatarValor(filme.totalReceita / filme.totalVendas)}</span>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        }

        /**
         * Renderiza detalhes das vendas
         */
        function renderDetalhesVendas(comprasFiltradas) {
            if (comprasFiltradas.length === 0) {
                detalhesVendas.innerHTML = '';
                return;
            }

            // Ordenar por data (mais recente primeiro)
            comprasFiltradas.sort((a, b) => new Date(b.dataCompra) - new Date(a.dataCompra));

            detalhesVendas.innerHTML = `
            <div class="detalhes-header">
                <h3>📋 Detalhes das Vendas</h3>
                <span class="total-vendas">${comprasFiltradas.length} venda(s)</span>
            </div>
            <div class="vendas-table-container">
                <table class="vendas-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Data</th>
                            <th>Filme</th>
                            <th>Sessão</th>
                            <th>Sala</th>
                            <th>Ingressos</th>
                            <th>Valor</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${comprasFiltradas.map(compra => {
                const dataCompra = new Date(compra.dataCompra);
                const dataFormatada = dataCompra.toLocaleDateString('pt-BR');
                const horaFormatada = dataCompra.toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit'
                });

                return `
                                <tr>
                                    <td>#${compra.id.toString().slice(-6)}</td>
                                    <td>${dataFormatada}<br><small>${horaFormatada}</small></td>
                                    <td>${compra.filme}</td>
                                    <td>${compra.sessao.horario}</td>
                                    <td>${compra.sessao.sala}</td>
                                    <td>${compra.quantidade}</td>
                                    <td class="valor-destaque">${formatarValor(compra.total)}</td>
                                    <td><span class="status-badge ${compra.status}">${compra.status}</span></td>
                                </tr>
                            `;
            }).join('')}
                    </tbody>
                </table>
            </div>
        `;
        }

        /**
         * Renderiza o relatório completo
         */
        function renderRelatorioVendas(dataInicio, dataFim) {
            const compras = JSON.parse(localStorage.getItem('compras')) || [];

            // Filtrar compras pelo período
            const comprasFiltradas = compras.filter(compra => {
                const dataCompra = compra.dataCompra.split('T')[0];
                return dataCompra >= dataInicio && dataCompra <= dataFim;
            });

            // Calcular métricas
            const metricas = calcularMetricasVendas(comprasFiltradas);

            // Agrupar por filme
            const vendasAgrupadas = agruparVendasPorFilme(comprasFiltradas);

            // Renderizar todas as seções
            renderResumoGeral(metricas, dataInicio, dataFim);
            renderVendasPorFilme(vendasAgrupadas);
            renderDetalhesVendas(comprasFiltradas);
        }

        /**
         * Aplica o filtro de período
         */
        function aplicarFiltro() {
            const dataInicio = inicioInput.value;
            const dataFim = fimInput.value;

            if (!dataInicio || !dataFim) {
                alert('Por favor, selecione ambas as datas (início e fim)');
                return;
            }

            if (dataInicio > dataFim) {
                alert('A data inicial não pode ser maior que a data final');
                return;
            }

            renderRelatorioVendas(dataInicio, dataFim);
        }

        // EVENT LISTENERS
        if (filterPeriodBtn) {
            filterPeriodBtn.addEventListener('click', aplicarFiltro);
        }

        // INICIALIZAÇÃO
        function inicializarRelatorioVendas() {
            // Definir datas padrão (mês atual)
            const inicioMes = getInicioMes();
            const hoje = getHoje();

            if (inicioInput) inicioInput.value = inicioMes;
            if (fimInput) fimInput.value = hoje;

            // Renderizar relatório inicial
            renderRelatorioVendas(inicioMes, hoje);

            console.log("✅ Relatório de vendas inicializado com sucesso");
        }

        // INICIALIZAR PÁGINA
        inicializarRelatorioVendas();
    }

    // ===== PÁGINA: LOGIN =====
    if (currentPage === "index.html") {
        console.log("🔐 Configurando Página de Login");
        // Event listeners já configurados via onclick no HTML
    }

    // ===== PÁGINA: GERENCIAR SESSÕES (CRUD) =====
    if (currentPage === "crud_sessao.html") {
        console.log("🎭 Configurando Gerenciamento de Sessões");

        const addSessionBtn = document.getElementById('addSessionBtn');
        const backToAdminBtn = document.getElementById('backToAdminBtn');
        const sessionTableBody = document.querySelector("#sessionTable tbody");
        const sessionSearchInput = document.getElementById('searchInput');
        const logoutBtn = document.getElementById("logoutBtn");
        const sessionModal = document.getElementById("sessionModal");
        const deleteModal = document.getElementById("deleteModal");
        const sessionForm = document.getElementById("sessionForm");
        const cancelBtn = document.getElementById("cancelBtn");
        const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
        const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");

        const STORAGE_KEYS = {
            SESSOES: "sessoes"
        };

        let sessions = JSON.parse(localStorage.getItem(STORAGE_KEYS.SESSOES)) || [];
        let currentSessionId = null;
        let isEditing = false;
        let sessionToDelete = null;

        // Dados de salas disponíveis
        const salas = [
            { id: 1, nome: "Sala 1 - 2D", capacidade: 100, tipo: "2D" },
            { id: 2, nome: "Sala 2 - 3D", capacidade: 80, tipo: "3D" },
            { id: 3, nome: "Sala 3 - IMAX", capacidade: 120, tipo: "IMAX" },
            { id: 4, nome: "Sala 4 - 2D", capacidade: 90, tipo: "2D" },
            { id: 5, nome: "Sala 5 - VIP", capacidade: 50, tipo: "VIP" }
        ];

        // BOTÕES DE NAVEGAÇÃO
        if (backToAdminBtn) {
            backToAdminBtn.addEventListener("click", function () {
                console.log("⬅️ Voltando para painel administrativo");
                window.location.href = "admin_dashboard.html";
            });
        }

        if (logoutBtn) {
            logoutBtn.addEventListener("click", logout);
        }

        /**
         * Carrega filmes no select do formulário
         */
        function carregarFilmesSelect() {
            const select = document.getElementById('filme');
            const movies = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.FILMES)) || [];

            select.innerHTML = '<option value="">Selecione um filme</option>';
            movies.forEach(movie => {
                const option = document.createElement('option');
                option.value = movie.titulo;
                option.textContent = movie.titulo;
                select.appendChild(option);
            });
        }

        /**
         * Carrega salas no select do formulário
         */
        function carregarSalasSelect() {
            const select = document.getElementById('sala');
            select.innerHTML = '<option value="">Selecione uma sala</option>';

            salas.forEach(sala => {
                const option = document.createElement('option');
                option.value = sala.nome;
                option.textContent = sala.nome;
                select.appendChild(option);
            });
        }

        /**
         * Formata data no padrão DD/MM/AAAA
         */
        function formatarDataSessao(dataString) {
            if (!dataString) return "";
            const [ano, mes, dia] = dataString.split('-');
            return `${dia}/${mes}/${ano}`;
        }

        /**
         * Formata preço no padrão brasileiro
         */
        function formatarPrecoSessao(preco) {
            return `R$ ${preco.toFixed(2).replace('.', ',')}`;
        }

        /**
         * Formata status para exibição
         */
        function formatarStatusSessao(status) {
            const statusMap = {
                'aguardando': 'Aguardando',
                'em_andamento': 'Em andamento',
                'cancelada': 'Cancelada'
            };
            return statusMap[status] || status;
        }

        /**
         * Renderiza a tabela de sessões com filtro
         */
        function renderSessionTable(filter = "") {
            if (!sessionTableBody) return;
            sessionTableBody.innerHTML = "";

            // Aplicar filtro
            let filteredSessions = sessions.filter(session => {
                const term = filter.toLowerCase();
                return (
                    (session.filme && session.filme.toLowerCase().includes(term)) ||
                    (session.sala && session.sala.toLowerCase().includes(term)) ||
                    (session.data && formatarDataSessao(session.data).includes(term)) ||
                    (session.horario && session.horario.includes(term)) ||
                    (session.status && formatarStatusSessao(session.status).toLowerCase().includes(term))
                );
            });

            // Mensagem para lista vazia
            if (filteredSessions.length === 0) {
                const row = sessionTableBody.insertRow();
                const cell = row.insertCell(0);
                cell.colSpan = 8;
                cell.textContent = "🎭 Nenhuma sessão encontrada";
                cell.style.textAlign = "center";
                cell.style.color = "#ccc";
                cell.style.padding = "2rem";
                return;
            }

            // Preencher tabela
            filteredSessions.forEach((session, index) => {
                const row = sessionTableBody.insertRow();
                row.insertCell(0).textContent = index + 1;
                row.insertCell(1).textContent = session.filme || "Não informado";
                row.insertCell(2).textContent = session.sala || "Não informada";
                row.insertCell(3).textContent = formatarDataSessao(session.data) || "Não informada";
                row.insertCell(4).textContent = session.horario || "Não informado";
                row.insertCell(5).textContent = session.preco ? formatarPrecoSessao(session.preco) : "Não informado";
                row.insertCell(6).textContent = formatarStatusSessao(session.status) || "Não informado";

                const actionsCell = row.insertCell(7);

                // Botão Editar
                const editBtn = document.createElement('button');
                editBtn.textContent = '✏️ Editar';
                editBtn.className = 'editBtn';
                editBtn.addEventListener('click', () => {
                    editarSessao(index);
                });
                actionsCell.appendChild(editBtn);

                // Botão Excluir
                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = '🗑️ Excluir';
                deleteBtn.className = 'deleteBtn';
                deleteBtn.addEventListener('click', () => {
                    abrirModalExclusao(index);
                });
                actionsCell.appendChild(deleteBtn);
            });
        }

        /**
         * Abre modal para adicionar nova sessão
         */
        function abrirModalAdicionar() {
            isEditing = false;
            currentSessionId = null;
            document.getElementById('modalTitle').textContent = 'Adicionar Nova Sessão';
            sessionForm.reset();
            sessionModal.classList.remove('hidden');
        }

        /**
         * Abre modal para editar sessão existente
         */
        function editarSessao(index) {
            const session = sessions[index];
            if (!session) return;

            isEditing = true;
            currentSessionId = index;
            document.getElementById('modalTitle').textContent = 'Editar Sessão';

            // Preencher formulário com dados da sessão
            document.getElementById('filme').value = session.filme || "";
            document.getElementById('sala').value = session.sala || "";
            document.getElementById('data').value = session.data || "";
            document.getElementById('horario').value = session.horario || "";
            document.getElementById('preco').value = session.preco || "";
            document.getElementById('status').value = session.status || "";

            sessionModal.classList.remove('hidden');
        }

        /**
         * Fecha o modal de sessão
         */
        function fecharModal() {
            sessionModal.classList.add('hidden');
            currentSessionId = null;
            isEditing = false;
        }

        /**
         * Abre modal de confirmação de exclusão
         */
        function abrirModalExclusao(index) {
            sessionToDelete = index;
            deleteModal.classList.remove('hidden');
        }

        /**
         * Fecha modal de exclusão
         */
        function fecharModalExclusao() {
            sessionToDelete = null;
            deleteModal.classList.add('hidden');
        }

        /**
         * Confirma e executa a exclusão
         */
        function confirmarExclusao() {
            if (sessionToDelete !== null) {
                sessions.splice(sessionToDelete, 1);
                localStorage.setItem(STORAGE_KEYS.SESSOES, JSON.stringify(sessions));
                renderSessionTable(sessionSearchInput.value);
                fecharModalExclusao();
                alert('Sessão excluída com sucesso!');
            }
        }

        /**
         * Valida dados da sessão
         */
        function validarSessao(sessaoData) {
            // Verificar conflito de horário
            const conflito = sessions.find((s, index) =>
                index !== currentSessionId &&
                s.sala === sessaoData.sala &&
                s.data === sessaoData.data &&
                s.horario === sessaoData.horario
            );

            if (conflito) {
                alert('Já existe uma sessão agendada para esta sala no mesmo horário e data!');
                return false;
            }

            // Verificar data futura
            const hoje = new Date().toISOString().split('T')[0];
            if (sessaoData.data < hoje) {
                alert('A data da sessão não pode ser no passado!');
                return false;
            }

            return true;
        }

        /**
         * Manipula o envio do formulário de sessão
         */
        function handleSessionFormSubmit(e) {
            e.preventDefault();
            console.log("📤 Processando formulário de sessão...");

            // Captura dados do formulário
            const sessionData = {
                filme: document.getElementById("filme").value,
                sala: document.getElementById("sala").value,
                data: document.getElementById("data").value,
                horario: document.getElementById("horario").value,
                preco: parseFloat(document.getElementById("preco").value),
                status: document.getElementById("status").value
            };

            // Validações básicas
            if (!sessionData.filme) {
                alert("Selecione um filme!");
                return;
            }

            if (!sessionData.sala) {
                alert("Selecione uma sala!");
                return;
            }

            if (!sessionData.data) {
                alert("Selecione uma data!");
                return;
            }

            if (!sessionData.horario) {
                alert("Selecione um horário!");
                return;
            }

            if (!sessionData.preco || sessionData.preco <= 0) {
                alert("Preço deve ser maior que zero!");
                return;
            }

            // Validações específicas
            if (!validarSessao(sessionData)) {
                return;
            }

            // Salva no localStorage
            if (isEditing && currentSessionId !== null) {
                // Editar sessão existente
                sessions[currentSessionId] = sessionData;
                alert("🎉 Sessão atualizada com sucesso!");
            } else {
                // Adicionar nova sessão
                sessions.push(sessionData);
                alert("🎉 Sessão cadastrada com sucesso!");
            }

            localStorage.setItem(STORAGE_KEYS.SESSOES, JSON.stringify(sessions));
            fecharModal();
            renderSessionTable();
        }

        // EVENT LISTENERS
        if (addSessionBtn) {
            addSessionBtn.addEventListener('click', abrirModalAdicionar);
        }

        if (sessionSearchInput) {
            sessionSearchInput.addEventListener('input', (e) => {
                renderSessionTable(e.target.value);
            });
        }

        if (sessionForm) {
            sessionForm.addEventListener('submit', handleSessionFormSubmit);
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', fecharModal);
        }

        if (cancelDeleteBtn) {
            cancelDeleteBtn.addEventListener('click', fecharModalExclusao);
        }

        if (confirmDeleteBtn) {
            confirmDeleteBtn.addEventListener('click', confirmarExclusao);
        }

        // INICIALIZAÇÃO - GARANTIR QUE OS MODAIS ESTEJAM FECHADOS
        function inicializarPagina() {
            // Fechar todos os modais
            if (sessionModal) sessionModal.classList.add('hidden');
            if (deleteModal) deleteModal.classList.add('hidden');

            // Carregar dados
            carregarFilmesSelect();
            carregarSalasSelect();
            renderSessionTable();

            console.log("✅ Página de sessões inicializada com sucesso");
        }

        // INICIALIZAR PÁGINA
        inicializarPagina();
    }

    // ===== PÁGINA: RELATÓRIO DE PROGRAMAÇÃO =====
    if (currentPage === "relatorio_programacao.html") {
        console.log("📊 Configurando Relatório de Programação");

        const weekSchedule = document.getElementById('weekSchedule');
        const inicioInput = document.getElementById('inicio');
        const fimInput = document.getElementById('fim');
        const filterPeriodBtn = document.getElementById('filterPeriodBtn');
        const backToAdminBtn = document.getElementById('backToAdminBtn');
        const logoutBtn = document.getElementById('logoutBtn');

        const STORAGE_KEYS = {
            SESSOES: "sessoes"
        };

        // BOTÕES DE NAVEGAÇÃO
        if (backToAdminBtn) {
            backToAdminBtn.addEventListener("click", function () {
                console.log("⬅️ Voltando para painel administrativo");
                window.location.href = "admin_dashboard.html";
            });
        }

        if (logoutBtn) {
            logoutBtn.addEventListener("click", logout);
        }

        /**
         * Formata data no padrão DD/MM/AAAA
         */
        function formatarDataRelatorio(dataString) {
            if (!dataString) return "";
            const [ano, mes, dia] = dataString.split('-');
            return `${dia}/${mes}/${ano}`;
        }

        /**
         * Formata dia da semana em português
         */
        function formatarDiaSemana(dataString) {
            if (!dataString) return "";
            const data = new Date(dataString + 'T00:00:00');
            const dias = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
            return dias[data.getDay()];
        }

        /**
         * Formata preço no padrão brasileiro
         */
        function formatarPrecoRelatorio(preco) {
            return `R$ ${preco.toFixed(2).replace('.', ',')}`;
        }

        /**
         * Formata status para exibição
         */
        function formatarStatusRelatorio(status) {
            const statusMap = {
                'aguardando': '🟡 Aguardando',
                'em_andamento': '🟢 Em andamento',
                'cancelada': '🔴 Cancelada'
            };
            return statusMap[status] || status;
        }

        /**
         * Obtém a data de início da semana (segunda-feira)
         */
        function getInicioSemana() {
            const hoje = new Date();
            const dia = hoje.getDay();
            const diff = hoje.getDate() - dia + (dia === 0 ? -6 : 1); // Ajusta domingo para última semana
            const inicioSemana = new Date(hoje.setDate(diff));
            return inicioSemana.toISOString().split('T')[0];
        }

        /**
         * Obtém a data de fim da semana (domingo)
         */
        function getFimSemana() {
            const inicioSemana = new Date(getInicioSemana());
            const fimSemana = new Date(inicioSemana);
            fimSemana.setDate(fimSemana.getDate() + 6);
            return fimSemana.toISOString().split('T')[0];
        }

        /**
         * Agrupa sessões por data
         */
        function agruparSessoesPorData(sessoes) {
            const agrupadas = {};

            sessoes.forEach(sessao => {
                if (!agrupadas[sessao.data]) {
                    agrupadas[sessao.data] = [];
                }
                agrupadas[sessao.data].push(sessao);
            });

            // Ordenar sessões por horário dentro de cada dia
            Object.keys(agrupadas).forEach(data => {
                agrupadas[data].sort((a, b) => a.horario.localeCompare(b.horario));
            });

            return agrupadas;
        }

        /**
         * Renderiza o relatório de programação
         */
        function renderRelatorio(dataInicio, dataFim) {
            if (!weekSchedule) return;

            const sessoes = JSON.parse(localStorage.getItem(STORAGE_KEYS.SESSOES)) || [];

            // Filtrar sessões pelo período
            const sessoesFiltradas = sessoes.filter(sessao => {
                return sessao.data >= dataInicio && sessao.data <= dataFim;
            });

            // Ordenar sessões por data
            sessoesFiltradas.sort((a, b) => a.data.localeCompare(b.data));

            // Agrupar por data
            const sessoesAgrupadas = agruparSessoesPorData(sessoesFiltradas);

            // Ordenar datas
            const datasOrdenadas = Object.keys(sessoesAgrupadas).sort();

            weekSchedule.innerHTML = '';

            if (datasOrdenadas.length === 0) {
                weekSchedule.innerHTML = `
                <div class="empty-state">
                    <h3>📭 Nenhuma sessão encontrada</h3>
                    <p>Não há sessões programadas para o período selecionado.</p>
                </div>
            `;
                return;
            }

            // Criar relatório
            datasOrdenadas.forEach(data => {
                const sessoesDoDia = sessoesAgrupadas[data];
                const diaSemana = formatarDiaSemana(data);
                const dataFormatada = formatarDataRelatorio(data);

                const diaSection = document.createElement('div');
                diaSection.className = 'day-schedule';
                diaSection.innerHTML = `
                <div class="day-header">
                    <h3>${diaSemana} - ${dataFormatada}</h3>
                    <span class="session-count">${sessoesDoDia.length} sessão(ões)</span>
                </div>
                <div class="sessions-list">
                    ${sessoesDoDia.map(sessao => `
                        <div class="session-item ${sessao.status}">
                            <div class="session-time">🕒 ${sessao.horario}</div>
                            <div class="session-movie">🎬 ${sessao.filme}</div>
                            <div class="session-room">📍 ${sessao.sala}</div>
                            <div class="session-price">💰 ${formatarPrecoRelatorio(sessao.preco)}</div>
                            <div class="session-status">${formatarStatusRelatorio(sessao.status)}</div>
                        </div>
                    `).join('')}
                </div>
            `;

                weekSchedule.appendChild(diaSection);
            });

            // Adicionar resumo
            const resumoSection = document.createElement('div');
            resumoSection.className = 'summary-section';
            resumoSection.innerHTML = `
            <div class="summary-header">
                <h3>📈 Resumo do Período</h3>
            </div>
            <div class="summary-content">
                <div class="summary-item">
                    <span class="summary-label">Período:</span>
                    <span class="summary-value">${formatarDataRelatorio(dataInicio)} a ${formatarDataRelatorio(dataFim)}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Total de Sessões:</span>
                    <span class="summary-value">${sessoesFiltradas.length}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Dias com Programação:</span>
                    <span class="summary-value">${datasOrdenadas.length}</span>
                </div>
            </div>
        `;

            weekSchedule.appendChild(resumoSection);
        }

        /**
         * Aplica o filtro de período
         */
        function aplicarFiltro() {
            const dataInicio = inicioInput.value;
            const dataFim = fimInput.value;

            if (!dataInicio || !dataFim) {
                alert('Por favor, selecione ambas as datas (início e fim)');
                return;
            }

            if (dataInicio > dataFim) {
                alert('A data inicial não pode ser maior que a data final');
                return;
            }

            renderRelatorio(dataInicio, dataFim);
        }

        // EVENT LISTENERS
        if (filterPeriodBtn) {
            filterPeriodBtn.addEventListener('click', aplicarFiltro);
        }

        // INICIALIZAÇÃO
        function inicializarRelatorio() {
            // Definir datas padrão (esta semana)
            const inicioSemana = getInicioSemana();
            const fimSemana = getFimSemana();

            if (inicioInput) inicioInput.value = inicioSemana;
            if (fimInput) fimInput.value = fimSemana;

            // Renderizar relatório inicial
            renderRelatorio(inicioSemana, fimSemana);

            console.log("✅ Relatório de programação inicializado com sucesso");
        }

        // INICIALIZAR PÁGINA
        inicializarRelatorio();
    }


});

// ===== INICIALIZAÇÃO GLOBAL =====
window.onload = () => {
    console.log("🚀 Sistema de Cinema - Carregado com sucesso!");
    // Funções de inicialização legadas
    carregarUsuarios();
    carregarFilmes();
    carregarCatalogo();
};

// ===== FIM DO SISTEMA =====