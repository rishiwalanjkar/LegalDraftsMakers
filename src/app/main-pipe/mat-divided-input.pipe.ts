import { Pipe, PipeTransform } from '@angular/core';
import { MatDividedInput } from '../custom-mat-form-fields/mat-divided-input/mat-divided-input.component';

@Pipe({
  name: 'matDividedInput'
})
export class MatDividedInputPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): MatDividedInput {
    let objParsedMatDividedInput = JSON.parse(value);

    return new MatDividedInput(objParsedMatDividedInput.inputs, objParsedMatDividedInput.separator);
  }

}
