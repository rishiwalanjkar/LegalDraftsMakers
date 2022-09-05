import { Component, ElementRef, HostBinding, HostListener, Input, OnInit, Optional, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Subject } from 'rxjs';
import { Conversion } from 'src/app/editor/tool-bar/tools/tool-bar';

export enum ImageControl{
  MOVE_TOP,
  MOVE_RIGHT,
  MOVE_BOTTOM,
  MOVE_LEFT,
  MOVE_FACTOR = 1,
  ZOOM_IN,
  ZOOM_OUT
}

export enum ImageType{
  PASSPORT_PHOTO  = "Passport Photo",
  ADHAR_CARD      = "Adhar Card",
  FOUR_BY_SIX     = "4*6",
  FIVE_BY_SEVEN   = "5*7",
  BACKGROUND      = "Background",
}

type ImageSize = {
  [key in ImageType]: number[];
};

export const IMAGE_SIZE:ImageSize = {
                                  [ImageType.PASSPORT_PHOTO]  : [51, 51],
                                  [ImageType.ADHAR_CARD]      : [85, 55],
                                  [ImageType.FOUR_BY_SIX]     : [101.6, 152.4],
                                  [ImageType.FIVE_BY_SEVEN]   : [127, 177.8],
                                  [ImageType.BACKGROUND]      : [100, 150]
                                };

export class MatImageUploadField{
  public static imageHeightToWidthRatio:number;
  imageHTML!:HTMLDivElement;

  constructor(public imageType:ImageType){}

  get width():string{
    return IMAGE_SIZE[this.imageType][0] + "mm";
  }

  get height():string{
    return IMAGE_SIZE[this.imageType][1] + "mm";
  }

  setImage(imageHTML:HTMLDivElement):void{
    this.imageHTML = imageHTML;
  }

  isPassportPhoto():boolean{
    return ImageType.PASSPORT_PHOTO == this.imageType;
  }             

  isEmpty():boolean{
    return !this.imageHTML;
  }

  toString():string{
    return !!this.imageHTML ? this.imageHTML.outerHTML : "";
  }
}

@Component({
  selector: 'custom-mat-image-upload-field',
  templateUrl: './mat-image-upload-field.component.html',
  styleUrls: ['./mat-image-upload-field.component.scss'],
  providers:[{provide:MatFormFieldControl, useExisting:MatImageUploadFieldComponent}],
  host: {
    '[class.example-floating]': 'shouldLabelFloat',
    '[id]': 'id',
  }
})
export class MatImageUploadFieldComponent implements MatFormFieldControl<MatImageUploadField>, ControlValueAccessor {
  private static instanceCounter                  = 0;
  private imageHeightToWidthRatio!:number;
  _value!: MatImageUploadField;
  stateChanges                                    = new Subject<void>();
  @HostBinding() id: string                       = `custom-mat-image-upload-field-${MatImageUploadFieldComponent.instanceCounter++}`;
  placeholder: string                             = "";
  focused: boolean                                = false;
  touched: boolean                                = false;
  required: boolean                               = false;
  disabled: boolean                               = false;
  onChange                                        = (param:any)=>{};
  onTouched                                       = ()=>{};
  imageControl                                    = ImageControl;

  constructor(private _elementRef:ElementRef,
    @Optional() @Self() public ngControl:NgControl) { 

      if(this.ngControl != null)
        this.ngControl.valueAccessor = this;
  }

  @Input()
  get value():MatImageUploadField{
    return this._value;
  }

  set value(value:MatImageUploadField){
    this._value = value;
    this.stateChanges.next();
  }

  get empty():boolean{
    return this.value.isEmpty();
  }

  get shouldLabelFloat():boolean{
    return this.focused || !this.empty;
  }

  get errorState():boolean{
    return this.touched && this.value.isEmpty();
  }

  setDescribedByIds(ids: string[]): void {

  }

  onContainerClick(event: MouseEvent): void {

  }

  writeValue(newVal: MatImageUploadField): void {
    this.value = newVal;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  @HostListener("focusout", ["$event"])
  onFocusOut(event: FocusEvent) {
    if (!this._elementRef.nativeElement.contains(event.relatedTarget as Element)) {
      this.focused = false;
      this.stateChanges.next();
    }
  }

  @HostListener("focusin")
  onFocusIn() {
    this.touched = true;
    this.onTouched();
    this.focused = true;
    this.stateChanges.next();
  }

  getPassPortPhotoMask():string{
    return "<path d='M" + IMAGE_SIZE[ImageType.PASSPORT_PHOTO][0] * Conversion.MM_TO_PIXEL_FACTOR * 0.5 +" 1 " +
            "L1 1 "+
            "1 " + IMAGE_SIZE[ImageType.PASSPORT_PHOTO][1] * Conversion.MM_TO_PIXEL_FACTOR * 0.7 + 
            " " + IMAGE_SIZE[ImageType.PASSPORT_PHOTO][0] * Conversion.MM_TO_PIXEL_FACTOR * 0.4 + " " + IMAGE_SIZE[ImageType.PASSPORT_PHOTO][1] * Conversion.MM_TO_PIXEL_FACTOR * 0.6 + 
            " " + IMAGE_SIZE[ImageType.PASSPORT_PHOTO][0] * Conversion.MM_TO_PIXEL_FACTOR * 0.4 + " " + IMAGE_SIZE[ImageType.PASSPORT_PHOTO][1] * Conversion.MM_TO_PIXEL_FACTOR * 0.5 + 
            " C" + IMAGE_SIZE[ImageType.PASSPORT_PHOTO][0] * Conversion.MM_TO_PIXEL_FACTOR * 0.34 + " " + IMAGE_SIZE[ImageType.PASSPORT_PHOTO][1] * Conversion.MM_TO_PIXEL_FACTOR * 0.53 + 
            " " + IMAGE_SIZE[ImageType.PASSPORT_PHOTO][0] * Conversion.MM_TO_PIXEL_FACTOR * 0.1 + " " + IMAGE_SIZE[ImageType.PASSPORT_PHOTO][1] * Conversion.MM_TO_PIXEL_FACTOR * 0.04 + 
            " " + IMAGE_SIZE[ImageType.PASSPORT_PHOTO][0] * Conversion.MM_TO_PIXEL_FACTOR * 0.5 + " " + IMAGE_SIZE[ImageType.PASSPORT_PHOTO][1] * Conversion.MM_TO_PIXEL_FACTOR * 0.05 + 
            " " + IMAGE_SIZE[ImageType.PASSPORT_PHOTO][0] * Conversion.MM_TO_PIXEL_FACTOR * 0.9 + " " + IMAGE_SIZE[ImageType.PASSPORT_PHOTO][1] * Conversion.MM_TO_PIXEL_FACTOR * 0.04 + 
            " " + IMAGE_SIZE[ImageType.PASSPORT_PHOTO][0] * Conversion.MM_TO_PIXEL_FACTOR * 0.67 + " " + IMAGE_SIZE[ImageType.PASSPORT_PHOTO][1] * Conversion.MM_TO_PIXEL_FACTOR * 0.53 + 
            " " + IMAGE_SIZE[ImageType.PASSPORT_PHOTO][0] * Conversion.MM_TO_PIXEL_FACTOR * 0.6 + " " + IMAGE_SIZE[ImageType.PASSPORT_PHOTO][1] * Conversion.MM_TO_PIXEL_FACTOR * 0.5 + 
            " L" + IMAGE_SIZE[ImageType.PASSPORT_PHOTO][0] * Conversion.MM_TO_PIXEL_FACTOR * 0.6 + " " + IMAGE_SIZE[ImageType.PASSPORT_PHOTO][1] * Conversion.MM_TO_PIXEL_FACTOR * 0.6 + 
            " " + (IMAGE_SIZE[ImageType.PASSPORT_PHOTO][0] * Conversion.MM_TO_PIXEL_FACTOR - 1) + " " + IMAGE_SIZE[ImageType.PASSPORT_PHOTO][1] * Conversion.MM_TO_PIXEL_FACTOR * 0.7 + 
            " " + (IMAGE_SIZE[ImageType.PASSPORT_PHOTO][0] * Conversion.MM_TO_PIXEL_FACTOR - 1) +  " 1" +
            " " + IMAGE_SIZE[ImageType.PASSPORT_PHOTO][0] * Conversion.MM_TO_PIXEL_FACTOR * 0.6 +" 1 " +
            " Z'/>";
  } 

  zoom(previewImageElement:any, imageControl:ImageControl) {
      let size:string[]           = previewImageElement.style.backgroundSize.split(" "),
          width:number            = parseInt(size[0]),
          height:number           = parseInt(size[1]),
          zoomWidthFactor:number  = 10,
          zoomHeightFactor:number = this.imageHeightToWidthRatio * 10;

      switch(imageControl){
          case ImageControl.ZOOM_IN:
              zoomWidthFactor     = zoomWidthFactor;
              zoomHeightFactor    = zoomHeightFactor;
              break;
              
          case ImageControl.ZOOM_OUT:
              if(100 >= width || 100 >= height) return;

              zoomWidthFactor     = -zoomWidthFactor;
              zoomHeightFactor    = -zoomHeightFactor;
      }

      previewImageElement.style.backgroundSize = (width + zoomWidthFactor) + "% " + (height + zoomHeightFactor) + "% ";
      this.setImage(previewImageElement.cloneNode())
  }

  upload(event:any, previewImageElement:any) {
      if(event.target.files && event.target.files[0]){
          const file = event.target.files[0];

          let fileReader = new FileReader(),
              component = this;

          fileReader.onload = (e) => {
              previewImageElement.style.backgroundImage = "url(" + fileReader.result + ")";
              this.setImage(previewImageElement.cloneNode());

              let img:any = new Image();      
              img.src = e?.target?.result;

              img.onload = function () {
                component.imageHeightToWidthRatio = this.height/this.width;
              }
          }

          fileReader.readAsDataURL(file);
      }
  }
  
  move(previewImageElement:any, imageControl:ImageControl) {
      let backgroundPosition:string[] = previewImageElement.style.backgroundPosition.split(" "),
          backgroundPositionX:number  = parseInt(backgroundPosition[0]),
          backgroundPositionY:number  = parseInt(backgroundPosition[1]),
          moveFactorX                 = 0,
          moveFactorY                 = 0;

      switch(imageControl){
          case ImageControl.MOVE_TOP :
              if( 0 >= backgroundPositionY ) return;
              
              moveFactorY = - ImageControl.MOVE_FACTOR;
              break;

          case ImageControl.MOVE_RIGHT :
              if( 100 <= backgroundPositionX ) return;
              
              moveFactorX = ImageControl.MOVE_FACTOR
              break;

          case ImageControl.MOVE_BOTTOM :
              if( 100 <= backgroundPositionY ) return;
              
              moveFactorY = ImageControl.MOVE_FACTOR;
              break;

          case ImageControl.MOVE_LEFT :
              if( 0 >= backgroundPositionX ) return;
              
              moveFactorX = - ImageControl.MOVE_FACTOR
      }

      previewImageElement.style.backgroundPosition = (backgroundPositionX + moveFactorX) + "% " + (backgroundPositionY + moveFactorY) + "%";
      this.setImage(previewImageElement.cloneNode());
  }

  setImage(imageHTML:HTMLDivElement):void{
    this.value.imageHTML = imageHTML;
    this.onChange(this._value);
  }
}