document.addEventListener('DOMContentLoaded', () => {
    const linkCadastro = document.getElementById('linkCadastro');
    const linkConsulta = document.getElementById('linkConsulta');
    const linkRelatorio = document.getElementById('linkRelatorio');
    const cadastroSection = document.getElementById('cadastro');
    const consultaSection = document.getElementById('consulta');
    const relatorioSection = document.getElementById('relatorio');
    const cadastroForm = document.getElementById('cadastroForm');
    const listaViagens = document.getElementById('listaViagens');
    const searchInput = document.getElementById('search');
    const relatorioContent = document.getElementById('relatorioContent');

    linkCadastro.addEventListener('click', () => {
        showSection('cadastro');
    });

    linkConsulta.addEventListener('click', () => {
        showSection('consulta');
        renderViagens();
    });

    linkRelatorio.addEventListener('click', () => {
        showSection('relatorio');
        generateRelatorio();
    });

    cadastroForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const destino = document.getElementById('destino').value;
        const data = document.getElementById('data').value;
        const embarcacoes = document.getElementById('embarcacoes').value;
        const descricao = document.getElementById('descricao').value;

        const viagem = { destino, data, embarcacoes, descricao };
        saveViagem(viagem);
        cadastroForm.reset();
    });

    searchInput.addEventListener('input', renderViagens);

    function showSection(sectionId) {
        cadastroSection.classList.add('hidden');
        consultaSection.classList.add('hidden');
        relatorioSection.classList.add('hidden');

        document.getElementById(sectionId).classList.remove('hidden');
    }

    function saveViagem(viagem) {
        let viagens = JSON.parse(localStorage.getItem('viagens')) || [];
        viagens.push(viagem);
        localStorage.setItem('viagens', JSON.stringify(viagens));
    }

    function renderViagens() {
        const viagens = JSON.parse(localStorage.getItem('viagens')) || [];
        const searchTerm = searchInput.value.toLowerCase();
        listaViagens.innerHTML = '';

        viagens.filter(viagem => viagem.destino.toLowerCase().includes(searchTerm)).forEach((viagem, index) => {
            const li = document.createElement('li');
            li.textContent = `${viagem.destino} - ${viagem.data} - ${viagem.embarcacoes} embarcações`;
            const button = document.createElement('button');
            button.textContent = 'Excluir';
            button.addEventListener('click', () => {
                deleteViagem(index);
            });
            li.appendChild(button);
            listaViagens.appendChild(li);
        });
    }

    function deleteViagem(index) {
        let viagens = JSON.parse(localStorage.getItem('viagens')) || [];
        viagens.splice(index, 1);
        localStorage.setItem('viagens', JSON.stringify(viagens));
        renderViagens();
    }

    function generateRelatorio() {
        const viagens = JSON.parse(localStorage.getItem('viagens')) || [];
        const totalEmbarcacoes = viagens.reduce((total, viagem) => total + parseInt(viagem.embarcacoes), 0);
        relatorioContent.innerHTML = `
            <p>Total de Viagens: ${viagens.length}</p>
            <p>Total de Embarcações: ${totalEmbarcacoes}</p>
        `;
    }
    
    showSection('cadastro');  // Show cadastro section by default
});