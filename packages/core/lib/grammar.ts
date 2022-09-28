export class Grammar {
  wrap(value:string) {
    return this.wrapSegments(value.split('.'))
  }

  protected wrapSegments(segments: string[]):string {
    return segments.map((segment, index) => {
      return index == 0 && segments.length > 1
        ? this.wrapTable(segment)
        : this.wrapValue(segment);
    }).join('.');
  }


  public wrapTable(table:string) {
    return this.wrap(table);
  }
  protected wrapValue(value: string) {
    if (value !== '*') {
      return `"${value.replaceAll('"', '""')}"`
    }
    return value;
  }
}