
import { Connection } from "../../connection";
import { ConnectionFactory } from "../../connector/connectionFactory";
import { Grammar } from "../../schema/grammar";
import * as sqlite from "sqlite3";
import { SqliteGrammar } from "./schema/grammar";
export interface SqliteConnection{
  config:Omit<ConnectionFactory.SqliteConfig,'driver'>
}
export class SqliteConnection extends Connection{
  _driver() {
    return sqlite
  }
  getDefaultSchemaGrammar(): Grammar {
    return new SqliteGrammar()
  }

  acquireRawConnection():Promise<sqlite.Database> {
    return new Promise((resolve,reject)=>{
      const db=new this.driver.Database(this.config.connection.database,(err)=>{
        if(err){
          return reject(err)
        }
        resolve(db)
      })
    })
  }
  destroyRawConnection(connection:sqlite.Database){
    connection.close()
  }
}