import { Grammar } from './grammar';
import { Connection } from "../connection";
import { tap } from "lodash-es";
import { Blueprint } from "./blueprint";

export class Builder {
  protected grammar:Grammar
  constructor(protected connection: Connection) {
    this.grammar=connection.getSchemaGrammar()
  }
  protected createBlueprint(table: string, callback: (() => void) | null = null) {
    return new Blueprint(table)
  }
  build(blueprint:Blueprint){
    blueprint.build(this.connection,this.grammar)
  }
  
  create(table: string, callback: (blueprint: Blueprint) => void) {
    this.build(tap(this.createBlueprint(table), (blueprint) => {
      blueprint.create()
      callback(blueprint)
    }))
  }
}
