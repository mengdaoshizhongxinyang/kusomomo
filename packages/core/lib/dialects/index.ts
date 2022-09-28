import { DRIVER_NAMES } from '../constants';
import { SqliteConnection } from "./sqlite3/connection";

const dbMap = Object.freeze({
  sqlite3: SqliteConnection,
})

export function getDialectByName(name: typeof DRIVER_NAMES[keyof typeof DRIVER_NAMES]) {
  if (!dbMap[name]) {
    throw new Error(`Invalid clientName given: ${name}`)
  }
  return dbMap[name]
}
