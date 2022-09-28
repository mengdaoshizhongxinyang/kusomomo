export function isNotUndefined<T>(val:T):val is Exclude<T,undefined>{
  if(val===undefined){
    return false
  }
  return true
}