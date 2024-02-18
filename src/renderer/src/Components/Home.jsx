import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getQuantidadesEstoque } from '../DataBase/estoqueDB';
import styles from './Home.module.css';

const Home = () => {
  const [detalhesUniformesCriticos, setDetalhesUniformesCriticos] = useState(
    []
  );

  useEffect(() => {
    const carregarDetalhesUniformesCriticos = async () => {
      const todosUniformes = await getQuantidadesEstoque();
      const uniformesCriticos = todosUniformes.filter(
        (uniforme) => uniforme.quantidade < 5
      );
      const groupedUniformesCriticos = uniformesCriticos.reduce((acc, item) => {
        const chave = `${item.nomeUniforme}-${item.sexo}`;
        if (!acc[chave]) {
          acc[chave] = { items: [], expanded: false };
        }
        acc[chave].items.push(item);
        return acc;
      }, {});

      setDetalhesUniformesCriticos(groupedUniformesCriticos);
    };

    carregarDetalhesUniformesCriticos();
  }, []);

  const toggleExpand = (chave) => {
    setDetalhesUniformesCriticos((prevState) => ({
      ...prevState,
      [chave]: {
        ...prevState[chave],
        expanded: !prevState[chave].expanded,
      },
    }));
  };

  return (
    <section className={styles.section}>
      <div className={styles.dashboard}>
        <h1>Estoque crítico</h1>
        <h2>Uniformes (menos de 5 unidades):</h2>
        {Object.keys(detalhesUniformesCriticos).length > 0 ? (
          Object.entries(detalhesUniformesCriticos).map(
            ([key, { items, expanded }]) => {
              const [nomeUniforme, sexo] = key.split('-');
              return (
                <div key={key}>
                  <h3
                    onClick={() => toggleExpand(key)}
                    className={styles.tituloExpandivel}
                    style={{ cursor: 'pointer' }}
                  >{`${nomeUniforme} (${sexo})`}</h3>
                  {expanded && (
                    <table className={styles.tabelaUniformes}>
                      <thead>
                        <tr>
                          <th>Tamanho</th>
                          <th>Quantidade</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((uniforme, index) => (
                          <tr key={index}>
                            <td>{uniforme.tamanho}</td>
                            <td>{uniforme.quantidade}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              );
            }
          )
        ) : (
          <p>Nenhum uniforme com estoque crítico.</p>
        )}
      </div>
    </section>
  );
};

export default Home;
