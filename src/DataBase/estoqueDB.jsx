// EstoqueDB.js

const tamanhos = ['P', 'M', 'G', 'GG', 'GGG'];
const generos = ['masculino', 'feminino', 'unissex'];
const uniformes = [
  'Musculação',
  'Professor de natação (regata)',
  'Professor de ginástica (regata)',
  'Apoio',
  'Recepção',
  'Bermuda',
  'Legging',
  'Coordenação Comercial',
  'Black fitness consultor',
  'Black fitness estagiário',
  'Black fitness professor musculação',
  'Black fitness apoio',
  'Black fitness bermuda',
];

const uniformesUnissex = ['Bermuda', 'Legging', 'Black fitness bermuda'];

const openDatabase = () => {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject('IndexedDB não é suportado por este navegador.');
      return;
    }

    const request = window.indexedDB.open('EstoqueDB', 5); // Incremento da versão para forçar onupgradeneeded

    request.onerror = (event) => {
      reject('Erro ao abrir o banco de dados: ' + event.target.errorCode);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      let estoqueStore;

      if (!db.objectStoreNames.contains('estoque')) {
        estoqueStore = db.createObjectStore('estoque', {
          keyPath: 'id',
          autoIncrement: true,
        });
        estoqueStore.createIndex('nomeUniforme', 'nomeUniforme', {
          unique: false,
        });
        estoqueStore.createIndex('sexo', 'sexo', { unique: false });
        estoqueStore.createIndex('tamanho', 'tamanho', { unique: false });
        estoqueStore.createIndex('quantidade', 'quantidade', { unique: false });
      }

      if (!db.objectStoreNames.contains('movimentacoes')) {
        const movimentacoesStore = db.createObjectStore('movimentacoes', {
          keyPath: 'id',
          autoIncrement: true,
        });
        movimentacoesStore.createIndex('nomeUniforme', 'nomeUniforme', {
          unique: false,
        });
        movimentacoesStore.createIndex('sexo', 'sexo', { unique: false });
        movimentacoesStore.createIndex('tamanho', 'tamanho', { unique: false });
        movimentacoesStore.createIndex('quantidade', 'quantidade', {
          unique: false,
        });
        movimentacoesStore.createIndex('dataHora', 'dataHora', {
          unique: false,
        });
        movimentacoesStore.createIndex('operacao', 'operacao', {
          unique: false,
        });
      }

      // Pre-fill estoque with initial data
      if (estoqueStore) {
        uniformes.forEach((nomeUniforme) => {
          tamanhos.forEach((tamanho) => {
            const isUnissex = uniformesUnissex.includes(nomeUniforme);
            if (isUnissex) {
              estoqueStore.add({
                nomeUniforme,
                sexo: 'unissex',
                tamanho,
                quantidade: 0,
              });
            } else {
              generos.slice(0, -1).forEach((sexo) => {
                estoqueStore.add({
                  nomeUniforme,
                  sexo,
                  tamanho,
                  quantidade: 0,
                });
              });
            }
          });
        });
      }
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };
  });
};

const atualizarEstoque = async (
  nomeUniforme,
  sexo,
  tamanho,
  quantidade,
  operacao
) => {
  const db = await openDatabase();
  const transaction = db.transaction(['estoque', 'movimentacoes'], 'readwrite');
  const estoqueStore = transaction.objectStore('estoque');
  const movimentacoesStore = transaction.objectStore('movimentacoes');

  const dataHora = new Date().toISOString();

  return new Promise((resolve, reject) => {
    const index = estoqueStore.index('nomeUniforme');
    index.openCursor().onsuccess = async (event) => {
      const cursor = event.target.result;
      if (cursor) {
        if (
          cursor.value.nomeUniforme.toLowerCase() ===
            nomeUniforme.toLowerCase() &&
          cursor.value.sexo === sexo &&
          cursor.value.tamanho === tamanho
        ) {
          const updateData = cursor.value;
          updateData.quantidade =
            operacao === 'adicionar'
              ? updateData.quantidade + quantidade
              : Math.max(0, updateData.quantidade - quantidade);

          const requestUpdate = cursor.update(updateData);
          requestUpdate.onsuccess = () => {
            const movimentacao = {
              nomeUniforme,
              sexo,
              tamanho,
              quantidade,
              operacao,
              dataHora,
            };
            movimentacoesStore.add(movimentacao);
            resolve();
          };
          requestUpdate.onerror = (error) =>
            reject('Erro ao atualizar o estoque:', error);
          return;
        }
        cursor.continue();
      } else {
        if (operacao === 'adicionar') {
          const novoUniforme = {
            nomeUniforme,
            sexo,
            tamanho,
            quantidade: quantidade >= 0 ? quantidade : 0,
          };
          estoqueStore.add(novoUniforme).onsuccess = () => {
            const movimentacao = {
              nomeUniforme,
              sexo,
              tamanho,
              quantidade,
              operacao,
              dataHora,
            };
            movimentacoesStore.add(movimentacao);
            resolve();
          };
        } else {
          reject('Não é possível retirar do estoque. Item não encontrado.');
        }
      }
    };
  });
};

const getQuantidadesEstoque = async () => {
  const db = await openDatabase();
  const transaction = db.transaction(['estoque'], 'readonly');
  const objectStore = transaction.objectStore('estoque');

  return new Promise((resolve) => {
    const resultados = [];

    objectStore.openCursor().onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        const item = cursor.value;
        if (item.quantidade < 5) {
          resultados.push({
            nomeUniforme: item.nomeUniforme,
            sexo: item.sexo,
            tamanho: item.tamanho,
            quantidade: item.quantidade,
          });
        }
        cursor.continue();
      } else {
        resolve(resultados);
      }
    };
  });
};

const getTodosUniformes = async () => {
  const db = await openDatabase();
  const transaction = db.transaction(['estoque'], 'readonly');
  const objectStore = transaction.objectStore('estoque');

  return new Promise((resolve) => {
    const resultados = [];

    objectStore.openCursor().onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        resultados.push(cursor.value);
        cursor.continue();
      } else {
        resolve(resultados);
      }
    };
  });
};

const buscarMovimentacoes = async () => {
  const db = await openDatabase();
  const transaction = db.transaction(['movimentacoes'], 'readonly');
  const movimentacoesStore = transaction.objectStore('movimentacoes');
  const index = movimentacoesStore.index('dataHora'); // Presumindo que você queira ordenar por dataHora

  return new Promise((resolve) => {
    const resultados = [];
    index.openCursor(null, 'prev').onsuccess = (event) => {
      // 'prev' para mais recentes primeiro
      const cursor = event.target.result;
      if (cursor) {
        resultados.push(cursor.value);
        cursor.continue();
      } else {
        resolve(resultados);
      }
    };
  });
};

export {
  atualizarEstoque,
  getQuantidadesEstoque,
  getTodosUniformes,
  buscarMovimentacoes,
};
