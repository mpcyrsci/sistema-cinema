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
function login() {
    const email = document.getElementById("loginEmail").value;
    const senha = document.getElementById("loginSenha").value;

    // Login como administrador
    if (email === CONFIG.ADMIN_EMAIL && senha === CONFIG.ADMIN_PASSWORD) {
        window.location.href = "admin_dashboard.html";
        return;
    }

    // Login como usuário comum
    const usuarios = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.USUARIOS)) || [];
    const usuario = usuarios.find(u => u.email === email && u.senha === senha);

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

document.addEventListener("DOMContentLoaded", function() {
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

                botao.addEventListener('click', function() {
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
                alert("🎉 Filme atualizado com sucesso!");
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
            form.addEventListener("submit", function(e) {
                e.preventDefault();
                handleFormSubmit();
            });
        }

        if (backToAdminBtn) {
            backToAdminBtn.addEventListener("click", function() {
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
            backToAdminBtn.addEventListener("click", function() {
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
            backToAdminBtn.addEventListener("click", function() {
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
            backToAdminBtn.addEventListener("click", function() {
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
    if (currentPage === "cliente.html") {
        console.log("🎭 Configurando Catálogo para Clientes");

        /**
         * Carrega catálogo de filmes para clientes
         */
        function carregarCatalogoCliente() {
            const movies = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.FILMES)) || [];
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
                `;
                catalogo.appendChild(card);
            });
        }

        carregarCatalogoCliente();
    }

    // ===== PÁGINA: LOGIN =====
    if (currentPage === "index.html") {
        console.log("🔐 Configurando Página de Login");
        // Event listeners já configurados via onclick no HTML
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