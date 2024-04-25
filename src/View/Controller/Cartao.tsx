import * as React from 'react';
import { Card, Typography, styled } from '@mui/material';
import Button from '@mui/material/Button';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';
import ICard from '../../Interface/ICard';
import IEstoque from '../../Interface/IEstoque';
import ClsBancoDados from '../../ClsBancoDados';
import Mensagem from '../Componentes/Mensagem';
import IMensagem from '../../Interface/IMensagem';

const StyledCard = styled(Card)`
  width: 300px;
  margin: 10px;
`;
interface props{    
  clsDB: ClsBancoDados,  
  acaoBotaoAvancar:any
}

export default function Cartao({clsDB,acaoBotaoAvancar}:props) {
 
  const [listaEstoque, setListaEstoque] = React.useState<Array<IEstoque>>([]);
  const [mensagem, setMensagem] = React.useState<IMensagem>();
  let listaValorZerado: Array<any> = [];

  async function pesquisar() {
    setListaEstoque([]);
    await clsDB.consultar('tblestoque').then(rs => {
      if (rs.length > 0 && rs != undefined && rs != null) {      
        setListaEstoque(rs);
      }
       console.log(rs);
    })   
  }
  

  function avancar(){
  
   acaoBotaoAvancar(listaEstoque);   
  }
 
      const acaoAlteraQuantidade = (index: number, newQuantidade: number) => {           
        setListaEstoque((prevProducts) => {
          const updatedProducts = [...prevProducts];
          updatedProducts[index].quantidadePedido = newQuantidade;
          return updatedProducts;
        });        
        
        console.log(listaEstoque);
      };
      async function acaoPesquisar(){
        await pesquisar();
      }

      useEffect(() => {
        acaoPesquisar();
      }, []);

      return (
        <>       
        <div>
          {listaEstoque.map((product, index) => (
            <StyledCard>
            <CardContent>        
              <Typography variant="h6">{product.descricao}</Typography>
              <TextField
                sx={{marginTop:"7px"}}
                label="Quantidade"
                variant="outlined"
                type="number"
                value={product.quantidadePedido}
                onChange={(e)=>acaoAlteraQuantidade(index, Number(e.target.value))}
              />
            </CardContent>
          </StyledCard>
          ))}
        </div>
        <Button sx={{ width: '80%', marginLeft: '10%', marginTop: '2%' }} variant="contained"
         onClick={avancar}>Avançar</Button>
       
        </>
      );
}