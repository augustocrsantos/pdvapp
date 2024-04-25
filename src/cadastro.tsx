import React, { useEffect, useState } from 'react'
import ClsSQLite from './ClsBancoDados';
import { Box, Button, TextField } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import Ifiltro from './Interface/Ifiltro';
import IPedidoItens from './Interface/IPedidoItens';



const columns: GridColDef[] = [
  {
      field: 'quantidade',
      headerName: 'Quantidade',
      type: 'number',
      maxWidth: 130,
      minWidth:50,
      editable: true,
      align:'left'     
    },

    { field: 'codigoItem', headerName: 'Codigo', maxWidth:80, minWidth:50 },
    {
      field: 'descricao',
      headerName: 'Descrição',
      maxWidth: 600,
      width:600,
      minWidth:130,
      editable: true,
    }
  ];
  
 
  

 let pedidos: IPedidoItens = {
  idItem:1,
  descricao:'teste'
 
 }

 let lista:Array<IPedidoItens> = [pedidos];
 

export default function Cadastro({ clsDB }: { clsDB: ClsSQLite }) {
  const[filtro, setfiltro] = useState<Ifiltro>();
  const[listPedidosItens, setlistPedidosItens] = useState<IPedidoItens[]>([]);

 function onClickPesquisar(){

 }

 function adicionarPedido(){
  console.log("estou no salvar");
  let indice:number = 5
  let objDados:string = "";
    for (var i = 0; i < indice; i++) {
      objDados = '{"nrpedido": "'+i.toString()+'", "nomecliente": "Augusto"}';        
      
      clsDB.incluir('pedidos', objDados).then(() => {         
      });
      clsDB.quantidadeRegistros('pedidos').then(rs=>
        console.log("Quantidade" + rs)
      );
    }
 }

 function adicionarPedidoItens(){
  console.log("estou salvando item");
  let indice:number = 5;
  let objDados:string = "";
  let numeroPedido:number = 1;
    for (var i = 0; i < indice; i++) {
      objDados = '{"nrpedido": "2", "descricao": "refri", "codigoItem": "'+i.toString()+'", "quantidade": 20}';          
      
      clsDB.incluir('pedidoiten', objDados).then(() => {
        //pesquisarItens();
          console.log("salvou item"+i);
      })
    }
 }

 function pesquisarItens(){
  console.log("estou no pesquisar");
 
  clsDB.consultar('pedidoiten').then(rs => {
    setlistPedidosItens(rs);
   console.log(rs);
  })  
 }

 function pesquisarItensPedido(){
  console.log("estou no pesquisar");  
  let numeroPedido:string ="";
  if(filtro?.nrpedido != null && filtro?.nrpedido != undefined){
     numeroPedido = filtro?.nrpedido.toString();
  }
  clsDB.consultarWhere('pedidoiten','nrpedido',numeroPedido).then(rs => {
    setlistPedidosItens(rs);
   console.log(rs);
  })   
  pesquisarPedido(numeroPedido);
 }

 function pesquisarPedido(numeroPedido:string){
  clsDB.consultarWhere('pedidos','nrpedido',numeroPedido).then(rs =>{
    if(rs != null && rs !=undefined && rs.length>0){
      setfiltro({...filtro, nomecliente:rs[0].nomecliente}) 
    }else{
      setfiltro({...filtro, nomecliente:""}); 
    }
    
    console.log("nome cliente"+ rs[0].nrpedido);
  })
 }
function editGrid (iten:IPedidoItens){
//console.log(iten.id);
}

function salvaralteracoes(){
  console.log(listPedidosItens);
}
function salvarItensParaTeste(){
  adicionarPedido();
  adicionarPedidoItens();
}
  useEffect(() => {
   
  });
    return(
     <>
         <Box sx={{mt:'1%', marginLeft:'15%', marginRight:'15%'}}>
                <TextField
                    sx={{width:'70%'}}
                    id="outlined-textarea"
                    label="Número do documento"
                    placeholder="Número do documento" 
                    variant="outlined" 
                    value={filtro?.nrpedido}
                    onChange={ev => setfiltro({...filtro,nrpedido:Number(ev.target.value)})}
                />
               
                 <Button onClick={pesquisarItensPedido} sx={{height:'50px', width:'5%'}}  variant="contained" startIcon={<SearchIcon />}>                    
                </Button>
                
              
             </Box>
         
           <Box sx={{mt:'1%', width:'100%' }}>
                <TextField
                    sx={{width:'70%', marginLeft:'15%'}}                   
                    label=""
                    placeholder=""  
                    variant="outlined"
                    value={filtro?.nomecliente}
                    onChange={ev => setfiltro({...filtro,nomecliente:ev.target.value})}
                />
            </Box>
                         
            <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid sx={{mt:'1%'}}
        rows={listPedidosItens}
        columns={columns}      
      
      />
    </Box>
    <Box   sx={{ width: '100%' }} >
      <Button onClick={salvarItensParaTeste} variant="contained" sx={{mt:'1%', width:'60%', marginLeft:'20%' }} >Salvar Teste</Button>
    </Box>
   
     </>
    )
}
