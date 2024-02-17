import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Components/Home';
import AdicionaEstoque from './Components/AdicionaEstoque';
import EntregaUniforme from './Components/EntregaUniforme';
import Uniforme from './Components/Uniforme';
import Estoque from './Components/Estoque';
import SideNav from './Components/SideNav';
import './App.css'; // Certifique-se de que este import está correto

function App() {
  return (
    <BrowserRouter>
      <div className='app-container'>
        <SideNav />
        <div className='routes-container'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='adicionaEstoque/' element={<AdicionaEstoque />} />
            <Route path='uniforme/:nomeUniforme' element={<Uniforme />} />
            <Route path='entregaUniforme/*' element={<EntregaUniforme />} />
            <Route path='estoque' element={<Estoque />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
