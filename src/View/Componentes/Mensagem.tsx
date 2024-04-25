import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import React, { useEffect } from 'react';
import IMensagem from '../../Interface/IMensagem';


export default function Mensagem({onClickFechar, exibir,titulo,corpoMensagem}:IMensagem){
    const [open, setOpen] = React.useState<boolean | undefined>(false);

    useEffect(() => {
        setOpen(exibir);
    }, [exibir])  

     
    const handleClose = () => {
      if(onClickFechar != undefined)
         onClickFechar();
      setOpen(false);
    };
    return(
        <Dialog
        open={open != undefined?open:false}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {titulo}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
             {corpoMensagem}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Fechar</Button>
        </DialogActions>
      </Dialog>

    );
}