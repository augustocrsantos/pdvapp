import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState } from 'react';
import ILogin from '../../Interface/ILogin';
import { Alert } from '@mui/material';
import Condicional from '../Componentes/Condicional';
import { useNavigate } from 'react-router-dom';
import MenuPadrao from '../Componentes/MenuPadrao';

function Copyright(props: any) { 
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function Login() {
  const navigate = useNavigate();
    const [loginState, setloginState] = useState<ILogin>();
    const [exibeMensagemState, setExibeMensagemState] = useState<boolean>(false);
   

  const logar = () => {   
    console.log("Teste ")
    if(loginState?.senha !== "123" || loginState.usuario !== "master"){
      setExibeMensagemState(true);
    }else{
      navigate("/vendasitens")
    }
  }

  return (
    <>
    
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          <Box sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth             
              label="Usuario"
              name="usuario"
              value={loginState?.usuario}
              autoComplete="usuario"              
              autoFocus
              onChange={(e) => setloginState({...loginState, usuario:e.target.value})}
            />
            <TextField
              margin="normal"
              required
              fullWidth             
              label="Senha"
              name="senha"
              value={loginState?.senha}
              type="password"        
              autoComplete="current-password"
              onChange={(e) => setloginState({...loginState, senha:e.target.value})}
            />
            <Condicional condicao={exibeMensagemState} >
               <Alert severity="error">Usuario ou Senha invalidos, verifique!.</Alert>
            </Condicional> 
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={(e) => logar()}
            >
              Entrar
            </Button> 
                    
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
    </>
  );
        }