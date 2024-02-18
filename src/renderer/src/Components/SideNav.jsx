import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styles from './SideNav.module.css';

const SideNav = () => {
  return (
    <nav className={styles.sideNav}>
      <NavLink className={styles.link} to='/estoque'>
        Estoque
      </NavLink>
      <NavLink className={styles.link} to='/entregaUniforme'>
        Entregar uniforme
      </NavLink>
      <NavLink className={styles.link} to='/adicionaEstoque'>
        Adicionar ao estoque
      </NavLink>
      <NavLink className={styles.link} to='/movimentacoes'>
        Movimentações
      </NavLink>
      <NavLink className={styles.link} to='/'>
        Estoque Crítico
      </NavLink>
    </nav>
  );
};

export default SideNav;
