import React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Box, Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Typography } from '@mui/material';
import ClsBancoDados from '../../ClsBancoDados';
import MenuPadrao from '../Componentes/MenuPadrao';
import { format, subDays } from 'date-fns';
import IPedido from '../../Interface/IPedido';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import IPagamentos from '../../Interface/IPagamentos';
import { from } from 'linq-to-typescript';
import { Dayjs } from 'dayjs';
import Condicional from '../Componentes/Condicional';
import { useNavigate } from 'react-router-dom';



export default function Relatorio({ clsDB }: { clsDB: ClsBancoDados }){  
  const navigate = useNavigate();
  const [datastate, setData] = React.useState<Date>();
  const [listaPedidos, setListaPedidos] = React.useState<Array<IPedido>>([]);
  const [pagamento, setPagamento] = React.useState<IPagamentos>();  
  //pesquisando - false    //exibindo -true
  const [statusFormulario , setStatusFormulario] = React.useState<boolean>(false);
  
  //true data atual, false dia Anterior
  const [dataPesquisa, setDataPesquisa] = React.useState<boolean>();

  const OpcoesPagamento = {
    DINHEIRO: 'Dinheiro',
    DEBITO: 'Débito',
    CREDITO: 'Crédito',
    PIX: 'PIX'
  };
  
  function acaoChamaMenuEstoque() {    
    navigate("/cadastroproduto");
  }

 function acaoChamaMenuVendas() {
        navigate("/vendasitens");
    }

   function selecionaData (){
    console.log(dataPesquisa)
    if(dataPesquisa){
      diaAtual();
    }else{
      diaAnterior();
    }
      
   }
  async function totalizaPedidos(data: string){
    console.log("data"+data);
    await pesquisaPedidos(data);
    //await preencheTotalPagamento();
  }
  function diaAnterior(){
    let dataAnterior = subDays(new Date(),1);
    let dataAnteriorFormatada = format(dataAnterior, 'dd-MM-yyyy');
    totalizaPedidos(dataAnteriorFormatada.trim());
  }
  function diaAtual(){
    let dataAtual = new Date();
    let dataFormatada = format(dataAtual, 'dd-MM-yyyy');
    totalizaPedidos(dataFormatada.trim());
  }

  async function pesquisaPedidos(data: string){
    console.log("to no pesquisar");    
   await clsDB.consultarWhere('tblpedido','data',data.trim()).then((rs)=>{
    preencheTotalPagamento(rs);
     // setListaPedidos(rs);      
      console.log(rs);
      console.log("acabei o pesquisar");
    }).catch((e=>{
      console.log("erro ao pesquisar" + e);
    }))
    
  }  
  function preencheTotalPagamento(lista :Array<IPedido>){
    try{
      console.log("to no pagamentos")
      console.log(lista);
      let beanPagamento:IPagamentos = {};
      beanPagamento.credito = from(lista).where(e=>e.formaPagamento == OpcoesPagamento.CREDITO).sum(e=>Number(e.vlTotal));
      beanPagamento.debito =from(lista).where(e=>e.formaPagamento == OpcoesPagamento.DEBITO).sum(e=>Number(e.vlTotal));
      beanPagamento.dinheiro = from(lista).where(e=>e.formaPagamento == OpcoesPagamento.DINHEIRO).sum(e=>Number(e.vlTotal));
      beanPagamento.pix = from(lista).where(e=>e.formaPagamento == OpcoesPagamento.PIX).sum(e=>Number(e.vlTotal));      
      console.log(beanPagamento);
      setPagamento(beanPagamento);
      setStatusFormulario(true);
    }catch(e){
      console.log("erro ao setar dados");
    }
  } 
 return(
    <>
    <MenuPadrao opcaoMenu='Cadastro Produto'
     TipoOpcaoMenu={1}
     onClickChamaVendas={acaoChamaMenuVendas}
     onClickAdicionarEstoque={acaoChamaMenuEstoque}></MenuPadrao>
   
<Box>
<FormControl sx={{marginTop:'5px'}}>
  <FormLabel id="demo-radio-buttons-group-label">Data de fechamento</FormLabel>
  <RadioGroup
    aria-labelledby="demo-radio-buttons-group-label"
    defaultValue="female"
    name="radio-buttons-group"
  >
    <FormControlLabel value="atual" control={<Radio onClick={() =>setDataPesquisa(true)}/>} label="Dia atual" />
    <FormControlLabel value="anterior" control={<Radio onClick={() => setDataPesquisa(false)} />} label="Dia anterior" />  
  </RadioGroup>
</FormControl>
</Box>

   <Box>
     <Button  sx={{marginTop:'5px'}}
      variant="contained" 
       onClick={selecionaData}
        >Pesquisar
     </Button>
   </Box>
 <Condicional condicao ={statusFormulario}>
  <Box sx={{marginTop:'10px'}}>
    <Typography fontWeight="bold">Total de pagamentos</Typography>
    <Typography fontWeight="bold">PIX:</Typography>
    <Typography>{pagamento?.pix}</Typography>
    <hr></hr>
    <Typography fontWeight="bold">Credito</Typography>
    <Typography>{pagamento?.credito}</Typography>
    <hr></hr>
    <Typography fontWeight="bold">Debito</Typography>
    <Typography>{pagamento?.debito}</Typography>
    <hr></hr>
    <Typography fontWeight="bold">Dinheiro</Typography>
    <Typography>{pagamento?.dinheiro}</Typography>
    <hr></hr>
  </Box>
 </Condicional>
   
    

    
    </>
 );
}