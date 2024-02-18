import React, { useEffect, useState } from 'react';
import { getTodosUniformes } from '../DataBase/estoqueDB';
import styles from './Estoque.module.css';

const Estoque = () => {
  const [detalhesUniformes, setDetalhesUniformes] = useState([]);

  useEffect(() => {
    const carregarEstoque = async () => {
      const todosUniformes = await getTodosUniformes();
      const groupedUniformes = todosUniformes.reduce((acc, item) => {
        acc[item.nomeUniforme] = [...(acc[item.nomeUniforme] || []), item];
        return acc;
      }, {});
      setDetalhesUniformes(groupedUniformes);
    };

    carregarEstoque();
  }, []);

  const getBackgroundColor = (nomeUniforme) => {
    const colors = {
      Musculação: '#f6d8ae', // Bege claro
      'Professor de natação (regata)': '#aed6f1', // Azul claro
      'Professor de ginástica (regata)': '#a2d9ce', // Verde-água
      Apoio: '#fad7a0', // Laranja claro
      Recepção: '#d7bde2', // Lilás
      Bermuda: '#d5dbdb', // Cinza claro
      Legging: '#aab7b8', // Cinza azulado claro
      'Coordenação Comercial': '#f5b7b1', // Rosa claro
      'Black fitness consultor': '#a9cce3', // Ciano claro
      'Black fitness estagiário': '#f9e79f', // Amarelo claro
      'Black fitness professor musculação': '#abebc6', // Verde menta
      'Black fitness apoio': '#f5cba7', // Pêssego
      'Black fitness bermuda': '#ccd1d1', // Prata claro
    };
    return colors[nomeUniforme] || 'white'; // Retorna branco caso não encontre uma cor definida
  };

  return (
    <section>
      <div className={styles.container}>
        <h1>Estoque de Uniformes</h1>
        {Object.keys(detalhesUniformes).length > 0 ? (
          <div className={styles.estoque}>
            {Object.entries(detalhesUniformes).map(
              ([nomeUniforme, uniformes]) => (
                <div
                  key={nomeUniforme}
                  style={{
                    backgroundColor: getBackgroundColor(nomeUniforme),
                    padding: '10px',
                    margin: '10px 0',
                  }}
                >
                  <h2>{nomeUniforme}</h2>
                  <table>
                    <thead>
                      <tr>
                        <th>Gênero</th>
                        <th>Tamanho</th>
                        <th>Quantidade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {uniformes.map((detail, index) => (
                        <tr key={index}>
                          <td>
                            {detail.sexo
                              ? detail.sexo.charAt(0).toUpperCase() +
                                detail.sexo.slice(1)
                              : 'N/A'}
                          </td>
                          <td>{detail.tamanho}</td>
                          <td>{detail.quantidade}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            )}
          </div>
        ) : (
          <p>Nenhum uniforme cadastrado no estoque.</p>
        )}
      </div>
    </section>
  );
};

export default Estoque;
