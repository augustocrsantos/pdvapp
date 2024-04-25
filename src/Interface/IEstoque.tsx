import React, { useEffect, useState } from 'react'


export default interface IEstoque{  
    key?:number
    id?:number|null,
    descricao?:string,
    quantidade?:number| null,
    quantidadePedido?:number| null
    valorItem?:number
    quantidadeRestante?:number|null;
}