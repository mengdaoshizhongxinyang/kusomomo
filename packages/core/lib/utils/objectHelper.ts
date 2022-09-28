import { isFunction } from "lodash-es"

export function has<T extends Record<string, any>, K extends string>(val: T, key: K): val is T & Record<K, any> {
  if (val[key]) {
    return true
  }
  return false
}

export function callIfIsExist<T extends Record<PropertyKey,any>,K extends string>(obj:T,key:K,params:any[]=[]){
  if(has(obj,key) && isFunction(obj[key])){
    return obj[key](...params)
  }
}