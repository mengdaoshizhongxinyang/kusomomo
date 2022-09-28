import { isNull, upperFirst } from 'lodash-es';
import { Connection } from '../connection';
import { ColumnDefinition } from './columnDefinition';
import { Grammar } from "./grammar";
import { has } from '../utils/objectHelper';
export namespace Blueprint {
  export type Commands = {
    name: string
  } & {
      [key in string]: any
    }
}
export class Blueprint {
  protected columns: ColumnDefinition[] = []
  protected commands: Blueprint.Commands[] = []

  after?: string

  temporary = false;

  constructor(protected table: string, callback: ((blueprint: Blueprint) => void) | null = null) {
    if (!isNull(callback)) {
      callback(this)
    }
  }

  getTable() {
    return this.table;
  }

  build(connection: Connection, grammar: Grammar) {
    this.toSql(connection,grammar).map((sql)=>{
      connection.run(sql)
    })
  }

  toSql(connection: Connection, grammar: Grammar) {
    this.addImpliedCommands()
    const statements = []
    for (const command of this.commands) {
      const method = `compile${upperFirst(command.name)}`
      if (has(grammar, method)) {
        const sql = grammar[method](this, command, connection)
        if (!isNull(sql)) {
          statements.push(sql)
        }
      }
    }
    return statements
  }
  increments<C extends string>(column: C) {
    return this.unsignedInteger(column, true)
  }
  unsignedInteger<C extends string>(column: C, autoIncrement = false) {
    return this.integer(column, autoIncrement, true)
  }
  addColumn(type: string, name: string, parameters: Record<string, any> = {}) {
    return this.addColumnDefinition(new ColumnDefinition({
      type,
      name,
      ...parameters
    }))
  }

  protected addColumnDefinition(definition: ColumnDefinition) {
    this.columns.push(definition)
    if (this.after) {
      definition.after(this.after)
      this.after = definition.name
    }
    return definition
  }
  integer<C extends string>(column: C, autoIncrement = false, unsigned = false) {
    return this.addColumn('integer', column, {
      autoIncrement,
      unsigned
    })
  }

  create() {
    return this.addCommand('create')
  }

  getAddedColumns() {
    return this.columns.filter(column => {
      return !column.ast.change
    })
  }

  getChangedColumns() {
    return this.columns.filter(column => {
      return column.ast.change
    })
  }

  protected addImpliedCommands() {
    if (this.getAddedColumns().length > 0 && !this.creating()) {
      this.commands.unshift(this.createCommand('add'))
    }
    if (this.getChangedColumns().length > 0 && !this.creating()) {
      this.commands.unshift(this.createCommand('change'))
    }
  }

  creating() {
    return this.commands.filter(command => {
      return command.name === 'create'
    }).length > 0
  }

  protected addCommand(name: string, parameters: Record<PropertyKey, unknown> = {}) {
    const command = this.createCommand(name, parameters)
    this.commands.push(command)
    return command
  }

  protected createCommand(name: string, parameters: Record<PropertyKey, unknown> = {}) {
    return {
      name,
      ...parameters
    }
  }
}
