import { Injectable } from '@angular/core';

export interface Occupation{
  id:number,
  keyWordId:number
}

@Injectable({
  providedIn: 'root'
})
export class OccupationService {
  private _occupationList!:Occupation[];

  fetchOccupationList():Occupation[]{
    if(!this._occupationList)
      this._occupationList = [
                              {id : 1, keyWordId: 1},
                              {id : 2, keyWordId: 2},
                              {id : 3, keyWordId: 3},
                              {id : 4, keyWordId: 4},
                              {id : 5, keyWordId: 5},
                              {id : 6, keyWordId: 6},
                              {id : 7, keyWordId: 7}
                            ]

    return this._occupationList
  }

  constructor() { }
}
