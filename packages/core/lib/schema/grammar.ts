import { Blueprint } from "./blueprint";
import { Grammar as BaseGrammar } from "../grammar";
import { ColumnDefinition } from "./columnDefinition";
import { upperFirst } from "lodash-es";
import { callIfIsExist } from "../utils/objectHelper";

export interface Grammar {

}
export class Grammar extends BaseGrammar {
  // protected getColumns(blueprint: Blueprint) {
  //   return blueprint.getAddedColumns().map(column=>{
  //     return super.test
  //   })
  //   foreach($blueprint -> getAddedColumns() as $column) {
  //     // Each of the column types has their own compiler functions, which are tasked
  //     // with turning the column definition into its SQL format for this platform
  //     // used by the connection. The column's modifiers are compiled and added.
  //     $sql = $this -> wrap($column).' '.$this -> getType($column);

  //     $columns[] = $this -> addModifiers($sql, $blueprint, $column);
  //   }

  //   return $columns;
  // }
  protected modifiers:string[] = [];
  getColumns(blueprint: Blueprint) {
    return blueprint.getAddedColumns().map(column => {
      return `${super.wrap(column.name)} ${this.getType(column)} ${this.addModifiers(blueprint,column)}`
    })
  }

  protected getType(column: ColumnDefinition): string {
    return callIfIsExist(this, `type${upperFirst(column.type)}`, [column])
  }

  protected addModifiers(blueprint:Blueprint, column:ColumnDefinition) {
    return this.modifiers.map(modifier=>{
      return callIfIsExist(this,`modify${modifier}`,[blueprint,column])
    }).join(' ')
  }
}
