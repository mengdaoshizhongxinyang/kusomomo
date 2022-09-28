import { ColumnDefinition } from './../../../schema/columnDefinition';
import { Blueprint } from "../../../schema/blueprint";
import { Grammar } from "../../../schema/grammar";
import { sprintf } from "sprintf-js";
import { upperFirst } from 'lodash-es';
export class SqliteGrammar extends Grammar {
  protected modifiers = ['VirtualAs', 'StoredAs', 'Nullable', 'Default', 'Increment']

  protected serials = ['bigInteger', 'integer', 'mediumInteger', 'smallInteger', 'tinyInteger'];
  compileCreate(blueprint: Blueprint) {
    console.log(blueprint)
    return sprintf('%s table %s (%s%s%s)',
      blueprint.temporary ? 'create temporary' : 'create',
      blueprint.getTable(),
      this.getColumns(blueprint).join(','),
      "",
      ""
    )
  }

  protected typeInteger() {
    return 'integer';
  }

  protected modifyIncrement(blueprint: Blueprint, column: ColumnDefinition) {
    if (this.serials.indexOf(column.type) > -1 && column.ast.autoIncrement) {
      return 'primary key autoincrement';
    }
  }



}
