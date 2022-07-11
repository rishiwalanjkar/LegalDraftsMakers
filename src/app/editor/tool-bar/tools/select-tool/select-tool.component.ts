import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-select-tool',
  templateUrl: './select-tool.component.html',
  styleUrls: ['./select-tool.component.scss']
})
export class SelectToolComponent implements OnInit {
  @Input() selectTool :any;
  @Input() color!:string;
  
  constructor() { }

  ngOnInit(): void {
  }

}
