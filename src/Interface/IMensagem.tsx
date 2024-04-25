import React, { useEffect, useState } from 'react'


export default interface IMensagem{    
    onClickFechar?: () => void,
    exibir?: boolean,
    titulo?: string,
    corpoMensagem?: string,
}