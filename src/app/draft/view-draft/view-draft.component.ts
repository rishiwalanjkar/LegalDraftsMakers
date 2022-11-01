import { Component, Input, OnInit } from '@angular/core';
import { Draft } from '../draft.service';

@Component({
  selector: 'app-view-draft',
  templateUrl: './view-draft.component.html',
  styleUrls: ['./view-draft.component.scss']
})
export class ViewDraftComponent implements OnInit {

  @Input() draft!:Draft;

  constructor() { }

  ngOnInit(): void {
  }

}
