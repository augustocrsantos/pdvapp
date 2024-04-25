import React, { useEffect, useState } from 'react'


export default interface IPedidoItens{
    id?:number|null   
    idItem?:number|null
    descricao?:string    
    nrpedido?:number
    vlunitario?:number
}