import React from 'react';
import { BrowserRouter as Router, Route, Link, BrowserRouter } from 'react-router-dom';
import Login from '../View/Controller/Login';
import ListaProdutos from '../View/Controller/Vendas';

import CadastroProduto from '../View/CRUD/CadastroProduto';
import Relatorio from '../View/Controller/Relatorio';


export default function Rotas(){
    return(
        <Router>
        <div>
          <Link to="/login" className="btn">Cadastre-se</Link>  
          <Route path="/"  Component={Login} />
          <Route path=""  Component={Login} />        
        </div>
      </Router>
    );    
    
}