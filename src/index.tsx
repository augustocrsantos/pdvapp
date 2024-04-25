import React from 'react';
import ReactDOM from 'react-dom/client';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import App from './app';
import ClsSQLite from './ClsBancoDados';
import Cadastro from './cadastro';
import Login from './View/Controller/Login';
import ListaProdutos from './View/Controller/Vendas';

import MenuPadrao from './View/Componentes/MenuPadrao';
import CadastroProduto from './View/CRUD/CadastroProduto';
import Relatorio from './View/Controller/Relatorio';
import Rotas from './Rotas/Rotas';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import ClsBancoDados from './ClsBancoDados';
import Cartao from './View/Controller/Cartao';
import Vendas from './View/Controller/Vendas';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const clsDB: ClsBancoDados = new ClsBancoDados()

const router = createBrowserRouter([
  {
    path:"/",
    element:<Login></Login>
  },
  
  {
    path:"cadastroproduto",
    element:<CadastroProduto clsDB={clsDB}></CadastroProduto>
  },
  {
    path:"vendasitens",
    element:<Vendas clsDB={clsDB}></Vendas>
  },
  {
    path:"relatorio",
    element:<Relatorio clsDB={clsDB}></Relatorio>
  },
 
])

root.render(
  <React.StrictMode>    
    
   <RouterProvider router={router}/>
  </React.StrictMode>
);
/*
root.render(
  <React.StrictMode>
    <App clsDB={clsDB} />
  </React.StrictMode>
);
*/
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then((registration) => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch((error) => {
        console.log('Service Worker registration failed:', error);
      });
  });
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
