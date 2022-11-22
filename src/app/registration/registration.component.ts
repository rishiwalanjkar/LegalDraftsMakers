import { Component, OnInit } from '@angular/core';
import { Opaque } from '../app.component';
import { Language, LanguageService } from '../language/language.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  readonly Language         = Language;
  selectedLanguages         = {};
  opaque:Opaque             = Opaque.OpaqueLevel4;

  constructor(public languageService:LanguageService) {
    for(const language of Object.values(Language)) 
      this.selectedLanguages = {...this.selectedLanguages, ...{[language]:Language.ENGLISH == language}};
  }

  get languages():Language[]{
    return Object.values(Language);
  }

  isEnglishLanguage(language:Language):boolean{
    return Language.ENGLISH == language;
  }

  ngOnInit(): void {
  }

}
