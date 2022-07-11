import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-button-with-select-tool',
  templateUrl: './button-with-select-tool.component.html',
  styleUrls: ['./button-with-select-tool.component.scss']
})
export class ButtonWithSelectToolComponent implements OnInit {
  @Input() button:any;
  @Input() color!:string;

  constructor() { }

  ngOnInit(): void {
  }

}
