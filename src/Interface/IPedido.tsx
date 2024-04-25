import React, { useEffect, useState } from 'react'


export default interface IPedido{
    id?:number | null
    data?:string | null
    vlTotal?:number
    vlGojeta?:number
    formaPagamento?:string   
   
  
}