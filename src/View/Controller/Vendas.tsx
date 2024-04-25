import { Autocomplete, Box, Button, FormControl, FormControlLabel, FormLabel, IconButton, List, ListItem, Radio, RadioGroup, TextField, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRowId, GridValueGetterParams } from '@mui/x-data-grid';
import * as React from 'react';
import MenuPadrao from '../Componentes/MenuPadrao';
import IEstoque from '../../Interface/IEstoque';
import ClsBancoDados from '../../ClsBancoDados';
import { from } from "linq-to-typescript"
import Mensagem from '../Componentes/Mensagem';
import Condicional from '../Componentes/Condicional';
import IPedido from '../../Interface/IPedido';
import IPedidoItens from '../../Interface/IPedidoItens';
import IMensagem from '../../Interface/IMensagem';
import { useNavigate } from "react-router-dom";
import { format } from 'date-fns';
import Cartao from './Cartao';


export default function Vendas({ clsDB }: { clsDB: ClsBancoDados }) {
  const [listaEstoque, setListaEstoque] = React.useState<Array<IEstoque>>([]);
  const [estoque, setEstoque] = React.useState<IEstoque>({});
  //True: quantidade item ; // False: finalizando Pedido
  const [statusFormulario, setstatusFormulario] = React.useState<boolean>(false);
  const [pedido, setPedido] = React.useState<IPedido>(); 
  const [mensagem, setMensagem] = React.useState<IMensagem>();
  const navigate = useNavigate();
  let listaValorZerado: Array<any> = []; 
  const dataAtual = format(new Date(), 'dd-MM-yyyy')//new Date().toISOString().split('T')[0];


  const OpcoesPagamento = {
    DINHEIRO: 'Dinheiro',
    DEBITO: 'Débito',
    CREDITO: 'Crédito',
    PIX: 'PIX'
  };
  const opcoesComboPagamento = Object.values(OpcoesPagamento);

  function limparStates() {
    setPedido({});
    setMensagem({});
  }

  function validarGravacao(): boolean {
    let result: boolean = true;
    setMensagem({});
    if (!IsNullorUndefined(pedido?.formaPagamento))
      result = false;
    if (!IsNullorUndefined(pedido?.vlTotal))
      result = false;
    if (!result) {
      setMensagem({
        ...mensagem, corpoMensagem: "Campo(s) de Valor Total e/ou Tipo Pagamento não forma preenchidos, Verifique!",
        exibir: true, titulo: "Atenção"
      });
      return false;
    }
    return true;
  }
  function IsNullorUndefined(campo: any): boolean {
    if (campo == null || campo == undefined)
      return false;
    else
      return true;
  }

  async function salvarPedido() {
    if (validarGravacao()) {       
      setPedido({ ...pedido, id: null});      
      //console.log(pedido);
      try {
        await clsDB.incluir('tblpedido', pedido).then(() => {
        }).catch(() => {
          setMensagem({
            ...mensagem, corpoMensagem: "Erro ao salvar Pedido",
            exibir: true, titulo: "Erro"
          });
        })
        await salvarItens();
        setMensagem({
          ...mensagem, corpoMensagem: "Pedido Salvo com sucesso",
          exibir: true, titulo: "Sucesso", onClickFechar: finalisarCancelar
        });
      } catch (e) {
        setMensagem({
          ...mensagem, corpoMensagem: "Erro ao salvar Pedido",
          exibir: true, titulo: "Erro"
        });
      }
    }
  }

  async function salvarItens() {
    let pediItemNovo: IPedidoItens = ({});
    let ultimoPedido: number = await buscaUltimoPedido();
    try {
      console.log(listaEstoque);
      listaEstoque.forEach((item) => {
        pediItemNovo.idItem = item.id;
        pediItemNovo.descricao = item.descricao;
        pediItemNovo.nrpedido = ultimoPedido;
        pediItemNovo.vlunitario = item.valorItem;
        clsDB.incluir('tblpedidoiten', pediItemNovo).then(rs => {
          console.log('deu boa incluir');
          baixaEstoque(Number(item.id), Number(item.quantidadePedido));
        }).catch((e) => {
          console.log('Erro ao Salva Iten(s) do pedido');
          throw new Error(e);
        });
      });
    } catch (e) {
      throw new Error('erro ao Salvar Item');
    }
  }
  async function buscaUltimoPedido(): Promise<number> {
    console.log("estou na pesquisa do Id");
    await clsDB.ultimoRegisto('tblpedido').then(rs => {
      console.log("codigo " + rs.id)
      return Number(rs.id)

    });
    return 0;
  }
  function baixaEstoque(idEstoque: number, quantidadeVendida: number) {
    let quantidadeRestante = 0;
    console.log("estou no baixar estoque")
    clsDB.consultarId('tblestoque', 'id', idEstoque).then(rs => {
      quantidadeRestante = rs.quantidade - quantidadeVendida;
      rs.quantidade = quantidadeRestante > 0 ? quantidadeRestante : 0;
      atualizaEstoque(rs);
    }).catch((e) => {
      console.log('Erro ao baixar Estoque');
      throw new Error(e);
    });
  }
  function finalisarCancelar() {
    pesquisar();
    setstatusFormulario(false);
    limparStates();
  }

  function atualizaEstoque(estoque: IEstoque) {
    console.log("estou no atualizar estoque " + estoque.quantidade + "id:" + estoque.id);
    if (estoque?.id != null && estoque.id != undefined) {

      clsDB.alterar('tblestoque', estoque, estoque?.id).then(() => {
      }).catch((e) => {
        console.log('Erro ao baixar Estoque');
        throw new Error(e);
      });
    }
  }

  function pesquisar() {
    clsDB.consultar('tblestoque').then(rs => {
      if (rs.length > 0 && rs != undefined && rs != null) {
        for (var i = 0; i < rs.length; i++) {
          rs[i].quantidadePedido = 0;
          listaValorZerado.push(rs[i]);
        }
        setListaEstoque(listaValorZerado);
      }     
    })
    setMensagem({});
  }

  function acaoBotaoCancelar() {
    setMensagem({ ...mensagem, exibir: false });
  }
  
  const acaoAlteraFormaPagamento = (event: any, newValue: any) => {
    setPedido({ ...pedido, formaPagamento: newValue })
  };
  function chamaMenuEstoque() {    
    navigate("/cadastroproduto");
  }

  function chamaMenuRelatorio() {    
    navigate("/relatorio");
  }

  const acaoBotaoAvancar = (listaEstoqueAtualizada:Array<IEstoque>) => {
    console.log("avancar");
    let listaFiltrada: Array<IEstoque> = from(listaEstoqueAtualizada).where((x) => x.quantidadePedido != null && x.quantidadePedido != undefined &&
      x.quantidadePedido > 0).toArray();
    if (listaFiltrada.length == 0) {
      setMensagem({
        ...mensagem, corpoMensagem: "Nenhum item informado, Verique!",
        exibir: true, titulo: "Informação"
      })

    } else {
      setListaEstoque(listaFiltrada);
      let valorTotalPedido: number = 0;
      listaFiltrada.forEach((item) => {
        valorTotalPedido = valorTotalPedido + (Number(item.quantidadePedido) * Number(item.valorItem));
      });
      setPedido({ ...pedido, vlTotal: valorTotalPedido, data:dataAtual.trim(), vlGojeta:0});
      setstatusFormulario(true);
    }
  };

  React.useEffect(() => {
    //pesquisar();
  }, []);

  return (
    <>
      <MenuPadrao opcaoMenu='Vendas'
       TipoOpcaoMenu={2}
       onClickChamaCadastroEstoque={chamaMenuEstoque}
       onClickChamaRelatorio={chamaMenuRelatorio}></MenuPadrao>

      <Condicional condicao={!statusFormulario} >       
       <Cartao      
       clsDB={clsDB}      
       acaoBotaoAvancar={acaoBotaoAvancar}       
       />              
      </Condicional>


      <Condicional condicao={statusFormulario}>
        <Box>
          <TextField
            sx={{ marginTop: "20px" }}
            id="outlined-basic"
            label="Valor Total"
            variant="outlined"
            type="number"
            value={pedido?.vlTotal}
            onChange={(e) => setPedido({ ...pedido, vlTotal: Number(e.target.value) })}
          />

          <div>
            <TextField
              sx={{ marginTop: "20px" }}
              id="outlined-basic"
              label="Valor Gorjeta"
              variant="outlined"
              type="number"
              value={pedido?.vlGojeta}
              onChange={(e) => setPedido({ ...pedido, vlGojeta: Number(e.target.value) })} />
          </div>
          <div>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              value={pedido?.formaPagamento}
              onChange={acaoAlteraFormaPagamento}
              options={opcoesComboPagamento}
              sx={{ width: 300, marginTop: "20px" }}
              renderInput={(params) => <TextField {...params} label="Tipo Pagamento" />}
            />

          </div>
          <Box >
            <Box sx={{ width: "90%" }}>
              <Typography color={"blue"}> Produtos </Typography>
              <hr></hr>
            </Box>
            {listaEstoque.map((e) =>
              // <ListItem  key={e.id}>
              //  <ListItemText primary={e.nome + "  Qt:"+e.valor} />
              //</ListItem>
              <Box sx={{ width: "90%" }}>
                <Typography>{e.descricao}</Typography>
                <Typography>{"Quantidade: " + e.quantidadePedido}</Typography>
                <hr></hr>
              </Box>
            )}
          </Box>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, display: 'inline-block', width: '40%', marginRight: '5%', marginLeft: '5%' }}
            onClick={salvarPedido}
          >
            Salvar
          </Button>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, display: 'inline-block', width: '40%', marginRight: '5%', marginLeft: '5%' }}
            onClick={finalisarCancelar}
          >
            Cancelar
          </Button>
        </Box>

      </Condicional>

      <Mensagem
        corpoMensagem={mensagem?.corpoMensagem}
        titulo={mensagem?.titulo}
        exibir={mensagem?.exibir}
        onClickFechar={finalisarCancelar}
      ></Mensagem>
    </>
  );
}