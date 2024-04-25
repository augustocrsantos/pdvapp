import { AppBar, IconButton, MenuItem, Toolbar, Typography } from '@mui/material';
import React from 'react';
import Menu from '@mui/material/Menu';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Condicional from './Condicional';

interface props{
  //1 -Cadastro Estoque // 2 - Vendas // 3- Login
  TipoOpcaoMenu?: number
  opcaoMenu? : string
  onClickAdicionarEstoque?: () => void,
  onClickChamaCadastroEstoque?: () => void,
  onClickChamaVendas?: () => void,
  onClickChamaRelatorio?: () => void,
}

export default function MenuPadrao( {opcaoMenu,onClickAdicionarEstoque,TipoOpcaoMenu, onClickChamaCadastroEstoque,
                                      onClickChamaVendas, onClickChamaRelatorio}:props) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const expandirMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const selecionarMenuEstoque = () => {
    if(onClickAdicionarEstoque !=null && onClickAdicionarEstoque !=undefined){
      onClickAdicionarEstoque();
    }
    fecharMenu();
  };
  const selecionaRelatorio = () =>{
    if(onClickChamaRelatorio != null && onClickChamaRelatorio!= undefined){
      onClickChamaRelatorio();
    }
    fecharMenu();
  }
  const selecionarChamaCadastroEstoque = () => {
    if(onClickChamaCadastroEstoque !=null && onClickChamaCadastroEstoque !=undefined){
      onClickChamaCadastroEstoque();
    }
    fecharMenu();
  };
  const selecionarChamaVendas = () => {
    if(onClickChamaVendas !=null && onClickChamaVendas !=undefined){
      onClickChamaVendas();
    }
    fecharMenu();
  };
  const fecharMenu=() =>{
    setAnchorEl(null);
  }
  return (
    <>
      <AppBar position="static">
        <Toolbar variant="dense">

          <IconButton
            onClick={expandirMenu}
            aria-label="more"
            id="long-button"
            aria-controls={open ? 'long-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-haspopup="true"
          >
            <MoreVertIcon sx={{ color: '#FFFFFF' }} />
          </IconButton>


          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={fecharMenu}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <MenuItem onClick={selecionaRelatorio}>Relatório Fechamento de caixa</MenuItem>
            <MenuItem onClick={selecionarChamaVendas}>Vendas</MenuItem>
            <Condicional condicao={TipoOpcaoMenu ==1} >
             <MenuItem onClick={selecionarMenuEstoque}>Estoque</MenuItem>
            </Condicional>
            <Condicional condicao={TipoOpcaoMenu ==2} >
             <MenuItem onClick={selecionarChamaCadastroEstoque}>Cadastrar Item</MenuItem>
             
            </Condicional>
           
          </Menu>

          <Typography variant="h6" color="inherit" component="div">
          {opcaoMenu}
          </Typography>
        </Toolbar>
      </AppBar>
    </>
  );

}