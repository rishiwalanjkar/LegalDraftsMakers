import { Component, Input, OnInit } from '@angular/core';

interface Menu{
  name      :string;
  url?       :string;
  subMenu?  :Menu[];
}

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit {
  @Input() drawer:any;
  @Input() isHandset:any;

  menus:Menu[] = [
      {
          name:'Create Draft',
          subMenu : [{ name : 'Blank Draft', url:'blank-draft'}, { name : 'Ready Draft', url:'ready-draft' }]
      },
      {
          name:'Maintain & View Statistics',
          subMenu : [{ name : 'Log Income', url:'log-income'}, { name : 'View Income', url:'view-income' }, { name : 'Create Customer Profile', url:'create-customer-profile' }, { name : 'View Customers', url:'/view-customers' }]
      },
      {
          name:'Extract Documents',
          subMenu : [{ name : 'Email', url:'extract-email-documents'}, { name : 'Whatsapp', url:'extract-whatsapp-documents' }]
      },
      {
          name:'External Links',
          subMenu : [{ name : 'PDE to Register Deed'}, { name : 'EChallan to Register Deed' }, { name : 'ESearch of Document' }, { name : 'DHC of Document' },{ name : '7/12 for View'}, { name : 'Digitally Signed 7/12' }, { name : 'MSEB New Electric Connection' }, { name : 'View MSEB Electricity Bill' }]
      },
      {
          name:'Settings',
          subMenu : [{ name : 'Upload Fonts', url:'upload-fonts'}, { name : 'Create Draft Template', url:'create-draft-template' }]
      }
  ];


  constructor() { }

  ngOnInit(): void {
  }

  hasSubMenu(menu:Menu) : boolean {
    return !!menu.subMenu && menu.subMenu.length > 0;
  }
}
