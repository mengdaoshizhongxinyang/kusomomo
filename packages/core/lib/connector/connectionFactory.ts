import { DRIVER_NAMES,SUPPORTED_CONNECTION } from "../constants";
import { getDialectByName } from "../dialects";
export namespace ConnectionFactory{
  type DriverNames=typeof DRIVER_NAMES

  type MergeConfig<T extends Record<PropertyKey,unknown>>=T &Record<string,any>

  export type Config=SqliteConfig

  export type SqliteConfig=MergeConfig<{
    driver:DriverNames['SQLite']
    connection:{
      database:string
    }
  }>
}

export class ConnectionFactory{
  static createConnector(config:ConnectionFactory.Config){
    const {driver,...parsedConfig}=config
    if(!SUPPORTED_CONNECTION.includes(config.driver)){
      throw new Error
    }
    const Connection=getDialectByName(config.driver)
    return {Connection,parsedConfig}
  }
}