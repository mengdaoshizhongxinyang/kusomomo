import { ConnectionFactory } from '../connector/connectionFactory';
import { Connection } from '../connection';
import { Builder } from '../schema/builder';
import { isNotUndefined } from '../utils/is';
console.log(Connection)

export class Capsule{
  private connection?:Connection
  constructor(){
    
  }
  addConnection(config:ConnectionFactory.Config){
    const {Connection,parsedConfig}=ConnectionFactory.createConnector(config)
    this.connection=new Connection(parsedConfig)
    return this
  }
  setAsGlobal(){
    Capsule.connection=this.connection
  }

  static connection?:Connection

  static schema(connection?:Connection):Builder{
    if(isNotUndefined(connection)){
      return connection.getSchemaBuilder()
    }
    else if(isNotUndefined(Capsule.connection)){
      return Capsule.connection.getSchemaBuilder()
    }else{
      throw new Error("")
    }
  }
}
