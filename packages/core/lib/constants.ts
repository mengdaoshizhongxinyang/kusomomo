
export const DRIVER_NAMES = Object.freeze({
  SQLite: 'sqlite3'
});

export const SUPPORTED_CONNECTION=Object.freeze([
  DRIVER_NAMES.SQLite
])

export type DRIVER_TYPES={
  SQLite:Awaited<typeof import("sqlite3")>
}
export type DRIVER_TYPE=DRIVER_TYPES[keyof DRIVER_TYPES]
