import { Injectable } from '@angular/core';
import { Account } from '../dashboard/dashboard.component';

export enum Language{
  ENGLISH,
  MARATHI,
  HINDI
}

type KeyWord = {
  [key in Language]:{[key:number]:string}
}

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private _keyWords!:KeyWord;

  constructor() {}

  get keyWords():KeyWord{
    this._keyWords = {
      [Language.ENGLISH] : {1 : "Service",
                            2 : "Farmer",
                            3 : "Bussiness",
                            4 : "Housewife",
                            5 : "Retired",
                            6 : "Pensioner",
                            7 : "None",
                            8 : "Occupation",
                            9 : "Select Occupation",
                            10 : "Age",
                            11 : "Maharashtra",
                            12 : "Pune",
                            13 : "Bhor",
                            14 : "Bholavade",
                            15 : "Kiwat",
                            16 : "State",
                            17 : "District",
                            18 : "Sub District",
                            19 : "Village",
                            20 : "House No/Survey No & Building name",
                            21 : "Landmark",
                            22 : "Pin Code",
                            23 : "Name",
                            24 : "Father/Husband Name",
                            25 : "Pin",
                            26 : "Code",
                            27 : "Current Address",
                            28 : "Parmanent Address",
                            29 : "Mr",
                            30 : "Mrs",
                            31 : "Miss",
                            32 : "Smt",
                            33 : "Late",
                            34 : "Signature Table", 
                            35 : "Current and permanent address are same",
                            36 : "Inline",
                            37 : "Mobile Number",
                            38 : "Adhar Number",
                            39 : "Pan Number",
                            40 : "4 Digits - 4 Digits - 4 Digits",
                            41 : "5 Letters - 4 Digits - 1 Letter",
                            42 : "First Name",
                            43 : "Middle Name",
                            44 : "Last Name",
                            45 : "4 Digits",
                            46 : "5 Letters",
                            47 : "1 Letter",
                            48 : "Father",
                            49 : "Husband",
                            50 : "Passport Photo",
                            51 : "Tal : ",
                            52 : "Dist : ",
                            53 : "Address",
                            54 : "S/O ",
                            55 : "D/O ",
                            56 : "W/O ",
                            57 : "",
                            58 : "",
                            59 : "",
                            60 : "Sr.No.",
                            61 : "Name",
                            62 : "Address",
                            63 : "Photo",
                            64 : "Signature/Thumb",
                          },
      [Language.MARATHI] : {1 :"नोकरी",
                            2 : "शेती",
                            3 : "व्यवसाय",
                            4 : "गृहिणी",
                            5 : "निवृत्त",
                            6 : "पेन्शनधारक",
                            7 : "काहीही नाही",
                            8 : "धंदा",
                            9 : "धंदा निवडा",
                            10 : "वय",
                            11 : "महाराष्ट्र",
                            12 : "पुणे",
                            13 : "भोर",
                            14 : "भोलावडे",
                            15 : "किवत",
                            16 : "राज्य",
                            17 : "जिल्हा",
                            18 : "तालुका",
                            19 : "गाव",
                            20 : "घर नं/सर्वे नं व इमारतीचे नाव",
                            21 : "जवळची खूण",
                            22 : "पिन कोड",
                            23 : "नाव",
                            24 : "वडीलांचे/पतीचे नाव",
                            25 : "पिन",
                            26 : "कोड",
                            27 : "हल्लीचा पत्ता",
                            28 : "मूळ कायमचा पत्ता",
                            29 : "श्री",
                            30 : "सौ",
                            31 : "कु",
                            32 : "श्रीमती",
                            33 : "कै",
                            34 : "सहीचा टेबल", 
                            35 : "हल्लीचा व कायमचा पत्ता एकच आहे",
                            36 : "एका रेषेत",
                            37 : "दूरध्वनी क्रमांक",
                            38 : "आधार क्रमांक",
                            39 : "पॅन क्रमांक",
                            40 : "4 अंक - 4 अंक - 4 अंक",
                            41 : "5 अक्षरे - 4 अंक - 1 अक्षर",
                            42 : "नाव",
                            43 : "वडिलांचे नाव",
                            44 : "आडनाव",
                            45 : "4 अंक",
                            46 : "5 अक्षरे",
                            47 : "1 अक्षर",
                            48 : "वडिल",
                            49 : "पति",
                            50 : "पासपोर्ट फोटो",
                            51 : "ता.",
                            52 : "जि.",
                            53 : "पत्ता",
                            54 : ", ",
                            55 : ", ",
                            56 : ", ",
                            57 : " यांचा मुलगा",
                            58 : " यांची मुलगी",
                            59 : " यांची पत्नी ",
                            60 : "अ.नं.",
                            61 : "नाव",
                            62 : "पत्ता",
                            63 : "फोटो",
                            64 : "सही/अंगठा",
                          },
      [Language.HINDI]    : {1 :"नोकरी",
                              2 : "शेती",
                              3 : "व्यवसाय",
                              4 : "गृहिणी",
                              5 : "निवृत्त",
                              6 : "पेन्शनधारक",
                              7 : "काहीही नाही",
                              8 : "धंदा",
                              9 : "धंदा निवडा",
                              10 : "वय",
                              11 : "महाराष्ट्र",
                              12 : "पुणे",
                              13 : "भोर",
                              14 : "भोलावडे",
                              15 : "किवत",
                              16 : "राज्य",
                              17 : "जिल्हा",
                              18 : "तालुका",
                              19 : "गाव",
                              20 : "घर नं/सर्वे नं व इमारत का नाम",
                              21 : "नजदीक कि निशाणी",
                              22 : "पिन कोड",
                              23 : "नाम",
                              24 : "पिता/पति का नाम",
                              25 : "पिन",
                              26 : "कोड",
                              27 : "वर्तमान पता",
                              28 : "मूल स्थायी पता",
                              29 : "श्री",
                              30 : "सौ",
                              31 : "कु",
                              32 : "श्रीमती",
                              33 : "कै",
                              34 : "सहीका  टेबल", 
                              35 : "वर्तमान एवं मूल स्थायी पता एकही है",
                              36 : "एक रेषा में",
                              37 : "दूरध्वनी क्रमांक",
                              38 : "आधार क्रमांक",
                              39 : "पॅन क्रमांक",
                              40 : "4 अंक - 4 अंक - 4 अंक",
                              41 : "5 अक्षर - 4 अंक - 1 अक्षर",
                              42 : "नाम",
                              43 : "पिता का नाम",
                              44 : "उपनाम",
                              45 : "4 अंक",
                              46 : "5 अक्षर",
                              47 : "1 अक्षर",
                              48 : "पिता",
                              49 : "पति",
                              50 : "पासपोर्ट फोटो",
                              51 : "ता.",
                              52 : "जि.",
                              53 : "पता",
                              54 : ", ",
                              55 : ", ",
                              56 : ", ",
                              57 : " का बेटा",
                              58 : " की बेटी",
                              59 : " की पत्नी",
                              60 : "क्र.",
                              61 : "नाम",
                              62 : "पता",
                              63 : "फोटो",
                              64 : "हस्ताक्षर/अँगूठा",
                            }
    }

    return this._keyWords;
  }

  fetchKeyWord(keyWordId:number, language?:Language):string {
    if("undefined" == typeof language)
      language = Account.instance.language;

    return this.keyWords[language][keyWordId];
  }
}
