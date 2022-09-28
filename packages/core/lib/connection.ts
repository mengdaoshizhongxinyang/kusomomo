import { ConnectionFactory } from './connector/connectionFactory';
import { Builder as SchemaBuilder } from "./schema/builder";
import { Grammar as SchemaGrammar } from "./schema/grammar";
import { has } from './utils/objectHelper';
import { DRIVER_TYPE } from "./constants";
import { isNull,cloneDeep } from 'lodash-es';
import { Pool } from "tarn";
type DB=InstanceType<DRIVER_TYPE['Database']>
export abstract class Connection{
  version:string=""
  driver!:DRIVER_TYPE
  driverName=""

  pool:undefined|Pool<DB>=undefined
  schemaGrammar:SchemaGrammar|null=null
  config :Omit<ConnectionFactory.Config,'driver'>
  constructor(config:Omit<ConnectionFactory.Config,'driver'>){
    this.config=cloneDeep(config)
    if(has(config,'version')){
      this.version=config.version
    }
    this.initializeDriver()
    this.initializePool(config)
  }
  getSchemaGrammar(){
    return this.schemaGrammar!;
  }
  setSchemaBuilder(grammar:SchemaGrammar){
    
    this.schemaGrammar=grammar
    return this
  }

  useDefaultSchemaGrammar(){
    this.schemaGrammar=this.getDefaultSchemaGrammar()
  }

  abstract getDefaultSchemaGrammar():SchemaGrammar
  getSchemaBuilder(){
    if(isNull(this.schemaGrammar)){
      this.useDefaultSchemaGrammar();
    }
    return new SchemaBuilder(this)
  }

  statement(query:string,bindings:any[]=[]){
    return this.run(query,bindings)
  }

  protected get poolDefaults() {
    return { min: 2, max: 10, propagateCreateError: true };
  }
  protected getPoolSetting(poolConfig:Record<string,any>){
    const poolConfigs=Object.assign({},this.poolDefaults,poolConfig)
    return Object.assign(poolConfigs,{
      create:async ()=>{
        const db=await this.acquireRawConnection()
        return db
      },
      destroy:(db:DB)=>{
        this.destroyRawConnection(db)
      },
      validate:(db:DB)=>{
        return this.validateConnection(db)
      },
    })
  }
  async run<T=any>(query:string,bindings:any[]=[]):Promise<void>{
    return new Promise(async (reslove,reject)=>{
      (await this.pool!.acquire().promise).run(query,bindings,(err)=>{
        if(err==null){
          return 
        }
        reject(err)
      })
    })
  }

  initializeDriver() {
    try {
      this.driver = this._driver();
    } catch (e) {
      if(e instanceof Error){
        throw new Error(e.message);
      }else{
        throw new Error('unknown')
      }
    }
  }

  initializePool(config = this.config) {
    if (this.pool) {
      console.warn('The pool has already been initialized');
      return;
    }

    const tarnPoolConfig = {
      ...this.getPoolSetting(config.pool),
    };

    this.pool = new Pool(tarnPoolConfig);
  }

  abstract acquireRawConnection():Promise<DB>

  abstract destroyRawConnection(connection:DB):void
  
  validateConnection(connection:DB){
    return true;
  }

  abstract _driver():DRIVER_TYPE
}


type UnionToIntersection<U> = 
  (U extends any ? (k: U)=>void : never) extends ((k: infer I)=>void) ? I : never
