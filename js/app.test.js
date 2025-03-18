/**
 * @jest-environment jsdom
 */

const {
    limparCampo,
    obterListaDeNomes,
    verificarNomeDuplicado,
    embaralharArray,
    criarParesSorteio,
    adicionar
} = require('./app.js');

describe('Sistema de Amigo Secreto', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <input id="nome-amigo" type="text">
            <p id="lista-amigos"></p>
            <p id="lista-sorteio"></p>
        `;
    });

    describe('verificarNomeDuplicado', () => {
        test('deve retornar true para nome duplicado', () => {
            const lista = ['João', 'Maria'];
            expect(verificarNomeDuplicado('joão', lista)).toBe(true);
        });

        test('deve retornar false para nome não duplicado', () => {
            const lista = ['João', 'Maria'];
            expect(verificarNomeDuplicado('Pedro', lista)).toBe(false);
        });
    });

    describe('embaralharArray', () => {
        test('deve manter mesmo tamanho do array', () => {
            const array = ['A', 'B', 'C', 'D'];
            const resultado = embaralharArray(array);
            expect(resultado.length).toBe(array.length);
        });

        test('deve conter os mesmos elementos', () => {
            const array = ['A', 'B', 'C'];
            const resultado = embaralharArray(array);
            expect(new Set(resultado)).toEqual(new Set(array));
        });
    });

    describe('criarParesSorteio', () => {
        test('deve criar pares corretos', () => {
            const nomes = ['A', 'B', 'C'];
            const embaralhados = ['C', 'A', 'B'];
            const pares = criarParesSorteio(nomes, embaralhados);
            expect(pares).toEqual(['A -> B', 'B -> C', 'C -> A']);
        });

        test('não deve ter autosorteio', () => {
            const nomes = ['A', 'B', 'C', 'D'];
            const embaralhados = embaralharArray(nomes);
            const pares = criarParesSorteio(nomes, embaralhados);
            pares.forEach(par => {
                const [pessoa, sorteado] = par.split(' -> ');
                expect(pessoa).not.toBe(sorteado);
            });
        });
    });

    describe('obterListaDeNomes', () => {
        test('deve retornar array vazio quando lista está vazia', () => {
            expect(obterListaDeNomes()).toEqual([]);
        });

        test('deve retornar array com nomes da lista', () => {
            document.getElementById('lista-amigos').textContent = 'João, Maria, Pedro';
            expect(obterListaDeNomes()).toEqual(['João', 'Maria', 'Pedro']);
        });
    });

    describe('adicionar', () => {
        test('deve adicionar nome válido à lista', () => {
            document.getElementById('nome-amigo').value = 'João';
            adicionar();
            expect(document.getElementById('lista-amigos').textContent).toBe('João');
        });

        test('não deve adicionar nome vazio', () => {
            const mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});
            document.getElementById('nome-amigo').value = '   ';
            adicionar();
            expect(document.getElementById('lista-amigos').textContent).toBe('');
            expect(mockAlert).toHaveBeenCalled();
            mockAlert.mockRestore();
        });
    });
});