/**
 * @fileoverview Sistema de sorteio de amigo secreto
 * @version 1.0.0
 * @author Cleverson
 * @description Sistema para gerenciar sorteio de amigo secreto com validações e interface amigável
 */

/**
 * Limpa o valor de um campo do formulário
 * @param {string} id - ID do elemento HTML a ser limpo
 * @throws {Error} Se o elemento não for encontrado
 */
function limparCampo(id) {
    document.getElementById(id).value = '';
}

/**
 * Obtém a lista de nomes dos amigos do elemento HTML
 * @returns {string[]} Array com os nomes dos amigos, trimmed e sem valores vazios
 * @example
 * // Retorna: ['João', 'Maria', 'Pedro']
 * obterListaDeNomes();
 */
function obterListaDeNomes() {
    let listaAmigos = document.getElementById('lista-amigos');
    return listaAmigos.textContent ? listaAmigos.textContent.split(',').map(nome => nome.trim()) : [];
}

/**
 * Verifica se um nome já existe na lista (ignorando maiúsculas/minúsculas)
 * @param {string} nome - Nome a ser verificado
 * @param {string[]} lista - Lista de nomes existentes
 * @returns {boolean} Verdadeiro se o nome já existe
 * @example
 * // Retorna: true
 * verificarNomeDuplicado('João', ['joão', 'Maria']);
 */
function verificarNomeDuplicado(nome, lista) {
    return lista.some(itemLista => itemLista.toLowerCase() === nome.toLowerCase());
}

/**
 * Embaralha um array usando o algoritmo Fisher-Yates
 * @param {Array} array - Array a ser embaralhado
 * @returns {Array} Novo array embaralhado, mantendo o original inalterado
 * @example
 * // Possível retorno: ['C', 'A', 'B']
 * embaralharArray(['A', 'B', 'C']);
 */
function embaralharArray(array) {
    let arrayEmbaralhado = [...array];
    for (let i = arrayEmbaralhado.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arrayEmbaralhado[i], arrayEmbaralhado[j]] = [arrayEmbaralhado[j], arrayEmbaralhado[i]];
    }
    return arrayEmbaralhado;
}

/**
 * Cria pares para o amigo secreto garantindo que ninguém tire a si mesmo
 * @param {string[]} nomes - Lista de nomes original
 * @param {string[]} embaralhados - Lista de nomes embaralhada
 * @returns {string[]} Array com os pares de amigo secreto no formato "A -> B"
 * @throws {Error} Se as listas tiverem tamanhos diferentes
 * @example
 * // Retorna: ['A -> B', 'B -> C', 'C -> A']
 * criarParesSorteio(['A', 'B', 'C'], ['C', 'A', 'B']);
 */
function criarParesSorteio(nomes, embaralhados) {
    // Verifica se as listas têm o mesmo tamanho
    if (nomes.length !== embaralhados.length) {
        throw new Error('As listas precisam ter o mesmo tamanho');
    }

    // Cria os pares usando a lista embaralhada como referência
    return nomes.map((nome, index) => {
        const indiceSorteado = embaralhados.indexOf(nome);
        const proximoIndice = (indiceSorteado + 1) % embaralhados.length;
        return `${nome} -> ${embaralhados[proximoIndice]}`;
    });
}

/**
 * Adiciona um novo amigo à lista com validações
 * @throws {Error} Se o nome estiver vazio ou duplicado
 * @requires Element#nome-amigo - Campo de input com o nome
 * @requires Element#lista-amigos - Elemento para exibir a lista
 */
function adicionar() {
    let nomeAmigo = document.getElementById('nome-amigo').value.trim();
    if (nomeAmigo === '') {
        alert('Digite um nome válido!');
        return;
    }

    let nomesAtuais = obterListaDeNomes();
    if (verificarNomeDuplicado(nomeAmigo, nomesAtuais)) {
        alert('Esse nome já foi adicionado!');
        limparCampo('nome-amigo');
        return;
    }

    let listaAmigos = document.getElementById('lista-amigos');
    if (listaAmigos.textContent !== '') {
        listaAmigos.textContent += ', ';
    }
    listaAmigos.textContent += nomeAmigo;
    
    limparCampo('nome-amigo');
}

/**
 * Realiza o sorteio do amigo secreto
 * @requires Mínimo de 3 participantes
 * @requires Element#lista-amigos - Lista de participantes
 * @requires Element#lista-sorteio - Elemento para exibir o resultado
 * @throws {Error} Se houver menos de 3 participantes
 */
function sortear() {
    let nomes = obterListaDeNomes();

    if (nomes.length < 3) {
        alert('Adicione pelo menos 3 pessoas para o sorteio!');
        return;
    }

    let embaralhados = embaralharArray(nomes);
    let resultados = criarParesSorteio(nomes, embaralhados);

    let listaSorteio = document.getElementById('lista-sorteio');
    listaSorteio.innerHTML = resultados.join('<br>');
}

/**
 * Reinicia o sistema, limpando todas as listas
 * @requires Element#lista-amigos - Lista de participantes
 * @requires Element#lista-sorteio - Lista do sorteio
 */
function reiniciar() {   
    document.getElementById('lista-amigos').textContent = '';
    document.getElementById('lista-sorteio').textContent = '';
}

// Exporta as funções para teste
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        limparCampo,
        obterListaDeNomes,
        verificarNomeDuplicado,
        embaralharArray,
        criarParesSorteio,
        adicionar
    };
}