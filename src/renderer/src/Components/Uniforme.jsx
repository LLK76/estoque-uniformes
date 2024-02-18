import React, { useState } from 'react';
import { useParams, useLocation, NavLink, useNavigate } from 'react-router-dom';
import styles from './Uniforme.module.css';
import { atualizarEstoque } from '../DataBase/estoqueDB';

const Uniforme = () => {
  const { nomeUniforme: nomeRota } = useParams();
  const nomeUniforme = nomeRota.replace(/-/g, ' ');
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const origem = queryParams.get('origem');
  const navigate = useNavigate();

  const voltarPath =
    origem === 'adicionaEstoque'
      ? '/adicionaEstoque'
      : origem === 'entregaUniforme'
      ? '/entregaUniforme'
      : '/';

  const isUnissex = ['bermuda', 'legging', 'black fitness bermuda'].includes(
    nomeUniforme.toLowerCase()
  );

  const [quantidades, setQuantidades] = useState({
    feminino: { P: '', M: '', G: '', GG: '', GGG: '' },
    masculino: { P: '', M: '', G: '', GG: '', GGG: '' },
    ...(isUnissex && { unissex: { P: '', M: '', G: '', GG: '', GGG: '' } }),
  });

  const handleChange = (sexo, tamanho, valor) => {
    if (isUnissex) {
      setQuantidades((prevState) => ({
        ...prevState,
        unissex: {
          ...prevState.unissex,
          [tamanho]: valor,
        },
      }));
    } else {
      setQuantidades((prevState) => ({
        ...prevState,
        [sexo]: {
          ...prevState[sexo],
          [tamanho]: valor,
        },
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isUnissex) {
        for (const tamanho of Object.keys(quantidades.unissex)) {
          const valor = quantidades.unissex[tamanho];
          const quantidade = parseInt(valor, 10);
          if (!isNaN(quantidade) && quantidade > 0) {
            await atualizarEstoque(
              nomeUniforme,
              'unissex',
              tamanho,
              quantidade,
              origem === 'adicionaEstoque' ? 'adicionar' : 'retirar'
            );
          }
        }
      } else {
        for (const sexo of ['feminino', 'masculino']) {
          for (const tamanho of Object.keys(quantidades[sexo])) {
            const valor = quantidades[sexo][tamanho];
            const quantidade = parseInt(valor, 10);
            if (!isNaN(quantidade) && quantidade > 0) {
              await atualizarEstoque(
                nomeUniforme,
                sexo,
                tamanho,
                quantidade,
                origem === 'adicionaEstoque' ? 'adicionar' : 'retirar'
              );
            }
          }
        }
      }
      alert('Operação realizada com sucesso!');
      navigate('/Estoque');
    } catch (error) {
      alert(`Erro: ${error.message || error}`);
    }
  };

  return (
    <div className={styles.containerUniforme}>
      <div className={styles.boxUniforme}>
        <h1>Uniforme: {nomeUniforme}</h1>
        <form onSubmit={handleSubmit}>
          {isUnissex ? (
            <div>
              {['P', 'M', 'G', 'GG', 'GGG'].map((tamanho) => (
                <div key={tamanho}>
                  <label>{tamanho}: </label>
                  <input
                    type='number'
                    value={quantidades.unissex[tamanho]}
                    onChange={(e) =>
                      handleChange('unissex', tamanho, e.target.value)
                    }
                    min='0'
                  />
                </div>
              ))}
            </div>
          ) : (
            ['feminino', 'masculino'].map((sexo) => (
              <div key={sexo}>
                <h2>{sexo.charAt(0).toUpperCase() + sexo.slice(1)}</h2>
                {['P', 'M', 'G', 'GG', 'GGG'].map((tamanho) => (
                  <div key={tamanho}>
                    <label>{tamanho}: </label>
                    <input
                      type='number'
                      value={quantidades[sexo][tamanho]}
                      onChange={(e) =>
                        handleChange(sexo, tamanho, e.target.value)
                      }
                      min='0'
                    />
                  </div>
                ))}
              </div>
            ))
          )}
          <div className={styles.buttons}>
            <button type='submit'>
              {origem === 'adicionaEstoque'
                ? 'Adicionar ao estoque'
                : 'Entregar uniforme'}
            </button>
            <NavLink to={voltarPath}>Voltar</NavLink>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Uniforme;
