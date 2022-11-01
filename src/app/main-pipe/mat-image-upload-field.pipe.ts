import { Pipe, PipeTransform } from '@angular/core';
import { QuickEditFieldFormat } from '../create-draft-template/create-draft-template.component';
import { ImageType, MatImageUploadField } from '../custom-mat-form-fields/mat-image-upload-field/mat-image-upload-field.component';

@Pipe({
  name: 'matImageUploadField'
})
export class MatImageUploadFieldPipe implements PipeTransform {

  transform(quickEditFieldFormat:QuickEditFieldFormat, ...args: unknown[]): MatImageUploadField {
    let imageType = ImageType.PASSPORT_PHOTO;

    switch(true){
      case QuickEditFieldFormat.ADHAR_CARD_PHOTO_FIELD == quickEditFieldFormat:
        imageType = ImageType.ADHAR_CARD;
        break;

      case QuickEditFieldFormat.FOUR_BY_SIX_PHOTO_FIELD == quickEditFieldFormat:
        imageType = ImageType.FOUR_BY_SIX;
        break;

      case QuickEditFieldFormat.FIVE_BY_SEVEN_PHOTO_FIELD == quickEditFieldFormat:
        imageType = ImageType.FIVE_BY_SEVEN;
        break;
    }

    return new MatImageUploadField(imageType);;
  }

}
