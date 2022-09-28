import { cloneDeep } from "lodash"

type ColumnAttr={
  name:string
  type:string
  after?:string
  unique?:boolean
  change?:boolean
}&{
  [key in string]:unknown
}

export class ColumnDefinition{
  protected attributes={} as ColumnAttr

  constructor(attr:ColumnAttr){
    this.attributes=cloneDeep(attr)
  }
  unique(){ 
    
  }

  after(column:string){
    this.attributes.after=column
  }

  get ast(){
    return this.attributes
  }

  get name(){
    return this.attributes['name']
  }

  set name(name:string){
    this.attributes.name=name
  }

  get type(){
    return this.attributes['type']
  }
  set type(type:string){
    this.attributes.type=type
  }

  
}
