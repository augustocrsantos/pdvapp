import Dexie from 'dexie';

const NOME_DATABASE: string = 'novoestessepe'

export default class ClsBancoDados {

    private db: Dexie = new Dexie(NOME_DATABASE)

    public constructor() {
        this.db.version(2).stores({
            tblestoque: '++id',
            tblpedidoiten: '++id',
            tblpedido:'++id, data'
            //clientes:'++id',
        })
    }

    public incluir(tabela: string, objeto: any): Promise<boolean> {
        return new Promise((resolve, _reject) => {
            if (this.db) {

                this.db.transaction('rw', tabela, () => {
                    this.db.table(tabela).add(objeto)
                }).then(() => {
                    console.log("Incluido com sucesso");
                    resolve(true)
                }).catch((e: any) => {
                    console.log("Erro no incluir  "+e);
                    resolve(false)
                })
            } else {
                console.log('Banco não encotrando', this.db)
            }

        })
    }
    public propriedadeBanco (){
        return this.db
    }

    public alterar(tabela: string, objeto: any, id:number): Promise<boolean> {
        return new Promise((resolve, _reject) => {
            if (this.db) {

                this.db.transaction('rw', tabela, () => {
                    this.db.table(tabela).update(id, objeto)
                }).then(() => {
                    console.log("Atualizado com sucesso");
                    resolve(true)
                }).catch((e: any) => {
                    console.log("erro no atualizar  "+e);
                    resolve(false)
                })
            } else {
                console.log('Banco não encontrado', this.db)
            }

        })
    }

    

    public consultar(tabela: string): Promise<Array<any>> {

        return this.db.table(tabela).toArray()

    }
    public consultarWhere(tabela: string, campo:string, valor:string): Promise<Array<any>> {

        return this.db.table(tabela).where(campo).equals(valor).toArray()

    }
    public consultarId(tabela: string, chavePrimaria:string, valor:number): Promise<any> {
             
        return this.db.table(tabela).where(chavePrimaria).equals(valor).first();

    }
    public quantidadeRegistros(tabela: string):Promise<any>{
        return this.db.table(tabela).count();
    }

    public fechar() {
        if (this.db) this.db.close()
    }
    public ultimoRegisto(tabela:string): Promise<any>{
        return this.db.table(tabela).orderBy('id').last();
    }

}