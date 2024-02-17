// Novos uniformes iniciais considerando tamanhos e gêneros
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

// Gerar uniformes iniciais com tamanhos e gêneros
const tamanhos = ['P', 'M', 'G', 'GG', 'GGG'];
const generos = ['masculino', 'feminino'];
const uniformesIniciais = [];

uniformes.forEach((nomeUniforme) => {
  if (
    nomeUniforme === 'Bermuda' ||
    nomeUniforme === 'Legging' ||
    nomeUniforme === 'Black fitness bermuda'
  ) {
    tamanhos.forEach((tamanho) => {
      uniformesIniciais.push({
        nomeUniforme,
        tamanho,
        quantidade: 0, // Não distingue por gênero
      });
    });
  } else {
    tamanhos.forEach((tamanho) => {
      generos.forEach((sexo) => {
        uniformesIniciais.push({
          nomeUniforme,
          sexo,
          tamanho,
          quantidade: 0,
        });
      });
    });
  }
});

const openDatabase = () => {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject('IndexedDB não é suportado por este navegador.');
      return;
    }

    // Incrementar a versão do banco de dados para acionar o onupgradeneeded
    const request = window.indexedDB.open('EstoqueDB', 2); // Atenção ao incremento da versão

    request.onerror = (event) => {
      reject('Erro ao abrir o banco de dados: ' + event.target.errorCode);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      let objectStore;

      if (!db.objectStoreNames.contains('estoque')) {
        objectStore = db.createObjectStore('estoque', {
          keyPath: 'id',
          autoIncrement: true,
        });
        objectStore.createIndex('nomeUniforme', 'nomeUniforme', {
          unique: false,
        });
        objectStore.createIndex('sexo', 'sexo', { unique: false });
        objectStore.createIndex('tamanho', 'tamanho', { unique: false });
        objectStore.createIndex('quantidade', 'quantidade', { unique: false });
      } else {
        objectStore = event.currentTarget.transaction.objectStore('estoque');
      }

      // Adiciona os uniformes iniciais ao object store
      uniformesIniciais.forEach((uniforme) => objectStore.add(uniforme));
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
  const transaction = db.transaction(['estoque'], 'readwrite');
  const objectStore = transaction.objectStore('estoque');

  return new Promise((resolve, reject) => {
    const index = objectStore.index('nomeUniforme');
    index.openCursor().onsuccess = async (event) => {
      const cursor = event.target.result;
      if (cursor) {
        // Converte os nomes dos uniformes para minúsculas antes de comparar
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
          requestUpdate.onsuccess = () => resolve();
          requestUpdate.onerror = (error) =>
            reject('Erro ao atualizar o estoque:', error);
          return;
        }
        cursor.continue();
      } else {
        if (operacao === 'adicionar') {
          const novoUniforme = {
            nomeUniforme: nomeUniforme, // Aqui você poderia também optar por armazenar sempre em minúsculas ou maiúsculas se desejar uniformidade
            sexo,
            tamanho,
            quantidade: quantidade >= 0 ? quantidade : 0,
          };
          objectStore.add(novoUniforme);
          resolve();
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

export { atualizarEstoque, getQuantidadesEstoque, getTodosUniformes };
