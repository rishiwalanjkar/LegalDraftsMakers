import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-tool',
  templateUrl: './dialog-tool.component.html',
  styleUrls: ['./dialog-tool.component.scss'],
  host:{'[id]':'dialog.id'}
})
export class DialogToolComponent implements OnInit {
  @Input() dialog:any;
  @Input() color!:string;
  
  
  @ViewChild('dialogTmp')
  dialogTmp!: TemplateRef<any>;

  matDialogRef?:MatDialogRef<any,any>;
  
  constructor(public matDialog:MatDialog) { }

  ngOnInit(): void {
  }

  openDialog():void{
    let settings:any = {
                      width: this.dialog.width + "px", 
                      data : this.dialog 
                  };
            
    if(!!this.dialog.height)
        settings.height = this.dialog.height + "px"

    this.matDialogRef = this.matDialog.open(this.dialogTmp, settings);
  }

  dialogSuccess(){
    this.matDialogRef?.close();
    this.dialog.click();
  }

}
