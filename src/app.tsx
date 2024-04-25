import React, { useEffect, useState } from 'react'

import { Button, TextField } from '@mui/material'
import ClsSQLite from './ClsBancoDados'

export default function App({ clsDB }: { clsDB: ClsSQLite }) {

    const [dados, setDados] = useState('{"nome": "Zanatta", "telefone": "Augusto"}')
    const [listagem, setListagem] = useState<any>([])

    const objDados = '{"nome": "teste", "telefone": "Augusto"}';

    const listarClientes = () => {
        clsDB.consultar('clientes').then(rs => {
            setListagem(rs)
        })
    }
  

    const incluirClientes = () => {
        clsDB.incluir('clientes', dados).then(() => {
            listarClientes()
        })
    }
    const incluirVariosDados =() =>{
        let objDados2:string = '{"nome": "teste", "telefone": "Augusto"}';
        var numbers:number = 10;
            for (var i = 0; i < numbers; i++) {
              
                objDados2 = '{"nome": "teste'+i+'", "telefone": "Augusto'+i+'"}';
                clsDB.incluir('clientes', objDados2).then(() => {
                    listarClientes()
                })
                
           }
          // listarClientesWhere();
        
    }

    return (
        <>
            <TextField
                id="outlined-textarea"
                label="Clientes"
                placeholder="Clientes"
                
                value={dados}
                onChange={(oque) => setDados(oque.target.value)}
            />
            <Button onClick={() => incluirClientes()}>Incluir Clientes</Button>
            {listagem.map((v: any, indice: number) => <div key={indice}>{v.nome}</div>)}
        </>
    )
}