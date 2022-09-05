import { Injectable } from '@angular/core';

export interface Village{
  villageId:number;
  keyWordId:number;
}

export interface SubDistrict{
  subDistrictId:number;
  keyWordId:number;
  villages:Village[];
}

export interface District{
  districtId:number;
  keyWordId:number;
  subDistricts:SubDistrict[];
}

export interface State{
  stateId:number;
  keyWordId:number;
  districts:District[];
}

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  private _villageList!:State[];

  constructor() { }

  fetchVillageList():State[]{
    if(!this._villageList) 
      this._villageList = [
                      { stateId   : 1, 
                        keyWordId : 11,
                        districts : [
                                      {
                                        districtId    : 1,
                                        keyWordId     : 12,
                                        subDistricts  : [
                                                          {
                                                            subDistrictId : 1,
                                                            keyWordId     : 13,
                                                            villages      : [
                                                                              {
                                                                                villageId   : 1,
                                                                                keyWordId   : 14,
                                                                              },
                                                                              {
                                                                                villageId   : 1,
                                                                                keyWordId   : 15
                                                                              },
                                                                          ]
                                                          }
                                                      ]
                                      } 
                                  ]
                      }
                    ];

    return this._villageList;
  }
}
