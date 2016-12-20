import { Injectable } from '@angular/core';
import { DataService } from '../../../_service/dataconnect';
import { Router } from '@angular/router';

@Injectable()
export class bankBookDetailsService {
    constructor(private _dataserver: DataService, private _router: Router) {

    }
    getBankBookDetails(req:any)
    {
        return this._dataserver.post("GetBankBookDetails",req);
    }
}