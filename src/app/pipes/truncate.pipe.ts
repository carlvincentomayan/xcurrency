import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe {
  transform(value: string, args: string) : string {
    let limit = args ? parseInt(args, 10) : 10;
    return value.length > limit ? value.substring(0, limit): value;
  }
}