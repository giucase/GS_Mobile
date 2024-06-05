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
    const destinoInput = document.getElementById('destino');
    const destinoError = document.getElementById('destinoError');
    const dataInput = document.getElementById('data');
    const dataRetornoInput = document.getElementById('dataRetorno');

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

    dataInput.addEventListener('change', () => {
        const data = new Date(dataInput.value);
        const dataRetorno = new Date(data);
        dataRetorno.setDate(dataRetorno.getDate() + 5);
        dataRetornoInput.value = formatDate(dataRetorno);
    });

    cadastroForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const destino = destinoInput.value;
        const data = dataInput.value;
        const dataRetorno = dataRetornoInput.value;
        const embarcacoes = document.getElementById('embarcacoes').value;
        const descricao = document.getElementById('descricao').value;

        if (!isValidDestino(destino)) {
            destinoError.textContent = 'Não é permitido caracteres numéricos e especiais no campo destino.';
            return;
        }

        const viagem = { destino, data, dataRetorno, embarcacoes, descricao };
        saveViagem(viagem);
        cadastroForm.reset();
        dataRetornoInput.value = '';
    });

    destinoInput.addEventListener('input', () => {
        const destino = destinoInput.value;
        if (!isValidDestino(destino)) {
            destinoError.textContent = 'Não é permitido caracteres numéricos e especiais no campo destino.';
        } else {
            destinoError.textContent = '';
        }
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
            li.textContent = `${viagem.destino} - ${formatDate(new Date(viagem.data))} - ${viagem.embarcacoes} embarcações - Retorno: ${formatDate(new Date(viagem.dataRetorno))}`;
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
        const totalEmbarcacoes = viagens.reduce((total, viagem) => total + 1, 0);
        relatorioContent.innerHTML = `
            <p>Total de Viagens: ${viagens.length}</p>
            <p>Total de Embarcações: ${totalEmbarcacoes}</p>
        `;
    }

    function isValidDestino(destino) {
        const regex = /^[a-zA-Z\s]*$/;
        return regex.test(destino);
    }

    function formatDate(date) {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    }

    showSection('cadastro');
});

