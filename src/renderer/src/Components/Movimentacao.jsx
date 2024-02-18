import React, { useState, useEffect } from 'react';
import { buscarMovimentacoes } from '../DataBase/estoqueDB';
import styles from './Movimentacao.module.css';

const Movimentacao = () => {
  const [movimentacoes, setMovimentacoes] = useState([]);

  useEffect(() => {
    const carregarMovimentacoes = async () => {
      const dados = await buscarMovimentacoes();
      setMovimentacoes(dados);
    };

    carregarMovimentacoes();
  }, []);

  return (
    <div className={styles.container}>
      <h1>Movimentações do Estoque</h1>
      <table className={styles.tabela}>
        <thead>
          <tr>
            <th>Operação</th>
            <th>Uniforme</th>
            <th>Gênero</th>
            <th>Tamanho</th>
            <th>Quantidade</th>
            <th>Data/Hora</th>
          </tr>
        </thead>
        <tbody>
          {movimentacoes.map((mov, index) => (
            <tr key={index}>
              <td>{mov.operacao}</td>
              <td>{mov.nomeUniforme}</td>
              <td>{mov.sexo}</td>
              <td>{mov.tamanho}</td>
              <td>{mov.quantidade}</td>
              <td>
                {new Date(mov.dataHora)
                  .toLocaleString('pt-BR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                  })
                  .replace(',', ' |')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Movimentacao;
