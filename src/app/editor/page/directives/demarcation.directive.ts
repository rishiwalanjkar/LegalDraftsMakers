import { AfterViewChecked, AfterViewInit, Directive, ElementRef, HostListener } from '@angular/core';
import { FormControlName } from '@angular/forms';
import { EditorService } from '../../editor.service';
import { ToolCommand } from '../../tool-bar/tools/tool-bar';

@Directive({
  selector: '[pageDemarcation]'
})
export class DemarcationDirective implements AfterViewChecked{
  constructor(private pageControl:FormControlName, private _elementRef:ElementRef, private _editorService:EditorService) { }

  ngAfterViewChecked(): void {
    this.demarcate();
  }

  

  @HostListener("mouseover", ["$event.target"]) onMouseOver(target:any){
    let borderColor = window.getComputedStyle(this._elementRef.nativeElement.parentElement.parentElement.nextSibling.firstChild, null).getPropertyValue("background-color"),
        parentPageElement;

    switch(true) {
      case target.classList.contains("left"):
      case target.classList.contains("right"):
        parentPageElement = target.parentElement;
        break;

      case target.classList.contains("header"):
      case target.classList.contains("footer"):
        parentPageElement = target.parentElement.parentElement;
        break;
    }

    if( ["left", "right", "header", "footer"].some((cssClass)=> target.classList.contains(cssClass) ) ) {
      for(let element of parentPageElement.children){
        element.classList.add('border-on-hover');
        element.style.borderColor = borderColor;
      }

      parentPageElement.children[1].children[0].classList.add('border-on-hover');
      parentPageElement.children[1].children[0].style.borderColor = borderColor;

      parentPageElement.children[1].children[2].classList.add('border-on-hover');
      parentPageElement.children[1].children[2].style.borderColor = borderColor;
    }
  }

  @HostListener("mouseout", ["$event.target"]) onMouseOut(target:any){
    let parentPageElement;

    switch(true) {
      case target.classList.contains("left"):
      case target.classList.contains("right"):
        parentPageElement = target.parentElement;
        break;

      case target.classList.contains("header"):
      case target.classList.contains("footer"):
        parentPageElement = target.parentElement.parentElement;
        break;
    }

    if( ["left", "right", "header", "footer"].some((cssClass)=> target.classList.contains(cssClass) ) ) {
      for(let element of parentPageElement.children){
        element.classList.remove('border-on-hover');
      }

      parentPageElement.children[1].children[0].classList.remove('border-on-hover');
      parentPageElement.children[1].children[2].classList.remove('border-on-hover');
    }
  }

  @HostListener("mousedown", ["$event.target"]) onMouseDown(target:any){
    let parentPageElement:HTMLElement = document.createElement("div");

    switch(true) {
      case target.classList.contains("left"):
      case target.classList.contains("right"):
        parentPageElement = target.parentElement;
        break;

      case target.classList.contains("header"):
      case target.classList.contains("footer"):
        parentPageElement = target.parentElement.parentElement;
        break;
    }

    if( ["left", "right", "header", "footer"].some((cssClass)=> target.classList.contains(cssClass) ) ) {
      parentPageElement.children[0].classList.add('border-on-active');

      parentPageElement.children[1].classList.add('border-on-active');
      parentPageElement.children[1].children[0].classList.add('border-on-active');
      parentPageElement.children[1].children[2].classList.add('border-on-active');

      parentPageElement.children[2].classList.add('border-on-active');


      setTimeout(()=>{
        this._editorService.triggerTool(ToolCommand.PAGE_MARGINS);

        parentPageElement.children[0].classList.remove('border-on-active');

        parentPageElement.children[1].classList.remove('border-on-active');
        parentPageElement.children[1].children[0].classList.remove('border-on-active');
        parentPageElement.children[1].children[2].classList.remove('border-on-active');

        parentPageElement.children[2].classList.remove('border-on-active');
      }, 100);
    }
  }

  demarcate = ()=>{
    this._elementRef.nativeElement.children[0].style.height                         = this.pageControl.value.height + "mm";

    this._elementRef.nativeElement.children[1].style.height                         = this.pageControl.value.height + "mm";
    this._elementRef.nativeElement.children[1].style.width                          = this.pageControl.value.contentWidth + "mm";
    this._elementRef.nativeElement.children[1].children[0].style.height             = this.pageControl.value.headerHeight + "mm";
    this._elementRef.nativeElement.children[1].children[1].style.height             = this.pageControl.value.bodyHeight + "mm";
    this._elementRef.nativeElement.children[1].children[2].style.height             = this.pageControl.value.footerHeight + "mm";

    this._elementRef.nativeElement.children[2].style.height                         = this.pageControl.value.height + "mm";

    (this._elementRef.nativeElement.parentNode as HTMLElement).style.width = 'auto';
    (this._elementRef.nativeElement as HTMLElement).style.width = this.pageControl.value.width + "mm";
    (this._elementRef.nativeElement as HTMLElement).style.gridTemplateColumns = this.pageControl.value.leftPadding + "mm auto " + this.pageControl.value.rightPadding + "mm";
  }

}
