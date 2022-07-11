import { Component, Input, OnInit } from '@angular/core';
import { ButtonTool, SoloButtonTool, Tool } from '../tool-bar';

@Component({
  selector: 'app-button-tool',
  templateUrl: './button-tool.component.html',
  styleUrls: ['./button-tool.component.scss']
})
export class ButtonToolComponent implements OnInit {
  @Input() button : any;
  @Input() color!:string

  constructor() { }

  ngOnInit(): void {
  }
}
