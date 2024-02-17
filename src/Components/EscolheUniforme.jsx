import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styles from './EscolheUniforme.module.css';

const EscolheUniforme = () => {
  const location = useLocation();
  const basePath = location.pathname.includes('adicionaEstoque')
    ? 'adicionaEstoque'
    : 'entregaUniforme';

  let titulo = 'titulo';

  if (location.pathname === '/adicionaEstoque') {
    titulo = 'Adicionar uniforme ao estoque';
  } else if (location.pathname === '/entregaUniforme') {
    titulo = 'Entregar uniforme';
  }
  // Lista de uniformes disponíveis
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

  return (
    <div className={styles.containerEU}>
      <div className={styles.box}>
        <h1>{titulo}</h1>
        <div className={styles.uniformes}>
          {uniformes.map((uniforme, index) => (
            <NavLink
              to={`/uniforme/${uniforme
                .replace(/\s+/g, '-')
                .toLowerCase()}?origem=${basePath}`}
              key={index}
              className={styles.uniformeLink}
            >
              {uniforme}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EscolheUniforme;
