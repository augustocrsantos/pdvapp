import { Box, Button, Card, CardActions, CardContent, Fab, TextField, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import Condicional from '../Componentes/Condicional';
import MenuPadrao from '../Componentes/MenuPadrao';
import IEstoque from '../../Interface/IEstoque';
import ClsBancoDados from '../../ClsBancoDados';
import Mensagem from '../Componentes/Mensagem';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from "react-router-dom";

export default function CadastroProduto({ clsDB }: { clsDB: ClsBancoDados }) {
    //True: Pesquisando ; // False: Editando/Incluido
    const [statusFormulario, setstatusFormulario] = React.useState<boolean>(true);
    const [estoque, setEstoque] = React.useState<IEstoque>();
    const [listaEstoque, setListaEstoque] = React.useState<Array<IEstoque>>([]);
    //Tipo Chamada: 1= Cadastro; 2= Alteração de estoque
    const [tipoChamada, setTipoChamada] = React.useState<number>(1);
    const [exibirMensagem, setExibirMensagem] = React.useState<boolean>(false);
    const [mensagemErro, setMensagemErro] = React.useState<string>("");
    const navigate = useNavigate();
    let mesagemSucesso: string = "Dados incluido/atualizados com sucesso"

    function chamaMenuRelatorio() {    
        navigate("/relatorio");
      }

    function acaoBotaoCadastrarItem() {
        setTipoChamada(1);
        setstatusFormulario(false);
    }
    function acaoChamaVendas(): void {
        navigate("/relatorio");
    }

    function alterarQuantidade(item: IEstoque) {
        setstatusFormulario(false);
        setTipoChamada(2);
        if (item.id != null) {
            clsDB.consultarId('tblestoque', 'id', item.id).then(
                rs => {
                    setEstoque(rs);
                }).catch((e: any) => {
                    setMensagemErro("Erro ao carregar dados")
                    console.log("erro pesquisar com whare");
                })
        }
    }
    //Função usada para o cancelar da caixa de exibição da mensagem e botão Fechar
    function acaoBotaoCancelar() {
        setstatusFormulario(true);
        pesquisar();
        setExibirMensagem(false);
        setMensagemErro("");
        limparCampos();
    }

    function atualizar() {
        if (estoque?.id != null && estoque.id != undefined) {
            clsDB.alterar('tblestoque', estoque, estoque?.id).then(() => {
            }).catch((e: any) => {
                setMensagemErro("Erro ao atuaizar dados");
                console.log("erro no atualizar  " + e);
            })
        }
    }

    function salvar() {
        setEstoque({ ...estoque, id: null })
        clsDB.incluir('tblestoque', estoque).then(() => {
        }).catch((e: any) => {
            setMensagemErro("Erro ao salvar")
            console.log("erro no incluir  " + e);
        })
    }

    function acaoBotaoSalvar() {
        if (tipoChamada == 1) {
            salvar();
        } else {
            atualizar();
        }
        setExibirMensagem(true);
        pesquisar();
        limparCampos();
    }
    function limparCampos() {
        setEstoque({ ...estoque, descricao: "", id: null, quantidade: null })
    }

    function pesquisar() {
        clsDB.consultar('tblestoque').then(rs => {
            if (rs.length > 0 && rs != undefined && rs != null) {
                setListaEstoque(rs);
            }

            console.log(rs);
        })
    }
   

    useEffect(() => {
        setTipoChamada(1);
        pesquisar();
    }, []);

   

    return (
        <>
            <div >
                <MenuPadrao opcaoMenu='Cadastro Produto' TipoOpcaoMenu={2}
                    onClickChamaCadastroEstoque={acaoBotaoCadastrarItem}
                    onClickChamaVendas={acaoChamaVendas}
                    onClickChamaRelatorio={chamaMenuRelatorio}
                    ></MenuPadrao>

                <Condicional condicao={statusFormulario}>
                    {listaEstoque.map((item) =>
                        <Card sx={{ marginTop: "1%", maxWidth: 600 }}>
                            <CardContent>
                                <Typography component="div">
                                    <Box sx={{ fontWeight: 'bold', display: 'inline-block' }}>Descrição:  </Box>
                                    <Box sx={{ fontWeight: 'regular', display: 'inline-block' }}>{item.descricao}</Box>
                                    <br></br>
                                    <Box sx={{ fontWeight: 'bold', display: 'inline-block' }}>Quantidade: </Box>
                                    <Box sx={{ fontWeight: 'regular', display: 'inline-block' }}> {item.quantidade}</Box>
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button
                                    size="small"
                                    onClick={(e) => alterarQuantidade(item)}>Alterar Quantidade</Button>
                            </CardActions>
                        </Card>
                    )}

                </Condicional>

                <Condicional condicao={!statusFormulario}>
                    <Box>
                        <div>
                            <TextField
                                id="filled-disabled"
                                label="Codigo"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                type="number"
                                disabled={true}
                                sx={{ marginTop: "20px" }}
                                value={estoque?.id}
                                onChange={(e) => setEstoque({ ...estoque, id: Number(e.target.value) })}
                            />
                        </div>

                        <div>
                            <TextField
                                id="outlined-basic"
                                label="Descrição"
                                sx={{ marginTop: "20px" }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                type="text"
                                disabled={tipoChamada == 1 ? false : true}
                                value={estoque?.descricao}
                                onChange={(e) => setEstoque({ ...estoque, descricao: e.target.value })} />
                        </div>
                        <div>
                            <TextField
                                id="outlined-basic"
                                label="Quantidade em Estoque"
                                type="number"
                                sx={{ marginTop: "20px" }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                value={estoque?.quantidade}
                                onChange={(e) => setEstoque({ ...estoque, quantidade: Number(e.target.value) })}
                            />
                        </div>
                        <div>
                            <TextField
                                id="outlined-basic"
                                label="Valor unitario"
                                type="number"
                                sx={{ marginTop: "20px" }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                value={estoque?.valorItem}
                                onChange={(e) => setEstoque({ ...estoque, valorItem: Number(e.target.value) })}
                            />
                        </div>
                        <Box>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ width: "40%", mt: 3, marginLeft: "5%",  display:'inline-block' }}
                                onClick={acaoBotaoSalvar}
                            >
                                Salvar
                            </Button>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ width: "40%", mt: 3, marginRight: "5%", marginLeft: "5%", display:'inline-block'}}
                                onClick={acaoBotaoCancelar}
                            >
                                Cancelar
                            </Button>
                        </Box>
                        <Mensagem
                            corpoMensagem={mensagemErro == "" ? mesagemSucesso : mensagemErro}
                            titulo={mensagemErro == "" ? "Sucesso" : "Erro"}
                            exibir={exibirMensagem}
                            onClickFechar={acaoBotaoCancelar}
                        ></Mensagem>
                    </Box>
                </Condicional>


            </div>
        </>
    );

}