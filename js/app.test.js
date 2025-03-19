/**
 * @jest-environment jsdom
 */

const {
    limparCampo,
    obterListaDeNomes,
    verificarNomeDuplicado,
    embaralharArray,
    criarParesSorteio,
    adicionar,
    sortear,
    reiniciar
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

    describe('limparCampo', () => {
        test('deve limpar o valor do campo', () => {
            document.getElementById('nome-amigo').value = 'Teste';
            limparCampo('nome-amigo');
            expect(document.getElementById('nome-amigo').value).toBe('');
        });

        test('deve lançar erro para ID inexistente', () => {
            expect(() => limparCampo('campo-inexistente')).toThrow();
        });
    });

    describe('sortear', () => {
        test('deve alertar quando houver menos de 3 participantes', () => {
            const mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});
            document.getElementById('lista-amigos').textContent = 'João, Maria';
            sortear();
            expect(mockAlert).toHaveBeenCalledWith('Adicione pelo menos 3 pessoas para o sorteio!');
            mockAlert.mockRestore();
        });

        test('deve criar sorteio válido com 3 ou mais participantes', () => {
            document.getElementById('lista-amigos').textContent = 'João, Maria, Pedro';
            sortear();
            const resultado = document.getElementById('lista-sorteio').innerHTML;
            
            // Verifica a estrutura do sorteio
            expect(resultado).toContain('-&gt;'); // Verifica a seta codificada em HTML
            expect(resultado.split('<br>').length).toBe(3);
            
            // Verifica se todos os nomes estão presentes
            ['João', 'Maria', 'Pedro'].forEach(nome => {
                expect(resultado).toContain(nome);
            });
        });
    });

    describe('reiniciar', () => {
        test('deve limpar todas as listas', () => {
            document.getElementById('lista-amigos').textContent = 'João, Maria';
            document.getElementById('lista-sorteio').innerHTML = 'Sorteio anterior';
            
            reiniciar();
            
            expect(document.getElementById('lista-amigos').textContent).toBe('');
            expect(document.getElementById('lista-sorteio').textContent).toBe('');
        });
    });

    describe('verificações de erro', () => {
        test('criarParesSorteio deve lançar erro com listas de tamanhos diferentes', () => {
            expect(() => {
                criarParesSorteio(['A', 'B'], ['C']);
            }).toThrow('As listas precisam ter o mesmo tamanho');
        });
    });
});