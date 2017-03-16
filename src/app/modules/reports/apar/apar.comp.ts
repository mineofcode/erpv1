import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { SharedVariableService } from "../../../_service/sharedvariable-service";
import { ActionBtnProp } from '../../../_model/action_buttons';
import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';
import { UserService } from '../../../_service/user/user-service';
import { LoginUserModel } from '../../../_model/user_model';
import { ReportsService } from '../../../_service/reports/rpt-service' /* add reference for emp */
import { SelectItem } from 'primeng/primeng';

@Component({
    templateUrl: 'apar.comp.html',
    providers: [ReportsService]
})

export class APARReports implements OnInit, OnDestroy {
    actionButton: ActionBtnProp[] = [];
    subscr_actionbarevt: Subscription;
    loginUser: LoginUserModel;
    viewaparDT: any = [];
    fliterBankDT: any = [];
    fliterBankTypeDT: any = [];
    fliterAPARDT: any = [];

    events: any[];
    header: any;
    event: MyEvent;
    dialogVisible: boolean = false;
    idGen: number = 100;

    monthwiseapar: string = "";
    defaultDate: any = "";

    rowheader: string = "";
    rowname: string = "";
    rowdate: string = "";

    isdebug: boolean = false;

    selectedAll: boolean = true;
    selectedAPARType: string[] = [];
    selectedBankType: string[] = [];
    selectedBank: string[] = [];

    constructor(private _router: Router, private _rptservice: ReportsService, private setActionButtons: SharedVariableService, private _userservice: UserService) {
        this.loginUser = this._userservice.getUser();
        this.getDefaultDate();
        this.getAPARDropDown();
        //this.getMonthWiseAPAR();
    }

    debug(log: any): any {
        if (this.isdebug)
            console.log(log);
    }

    selectAllCheckboxes() {
        var that = this;

        if (that.selectedAll === true) {
            that.selectedAPARType = Object.keys(that.fliterAPARDT).map(function (k) { return that.fliterAPARDT[k].key });
            that.selectedBankType = Object.keys(that.fliterBankTypeDT).map(function (k) { return that.fliterBankTypeDT[k].key });
            that.selectedBank = Object.keys(that.fliterBankDT).map(function (k) { return that.fliterBankDT[k].key });
        }
        else {
            that.selectedAPARType = [];
            that.selectedBankType = [];
            that.selectedBank = [];
        }
    }

    ngOnInit() {
        var that = this;

        that.setActionButtons.setTitle("Bank View");

        that.header = {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,filterevt'
        };
    }

    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }

    getDefaultDate() {
        var date = new Date();
        var today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        this.defaultDate = this.formatDate(today);
    }

    getAPARReports() {
        var that = this;

        var _apartype: string = "";
        var _banktype: string = "";
        var _bankid: string = "";

        for (let apar of that.selectedAPARType) {
            _apartype += apar + ",";
        }

        for (let bt of that.selectedBankType) {
            _banktype += bt + ",";
        }

        for (let bank of that.selectedBank) {
            _bankid += bank + ",";
        }

        that._rptservice.getAPARReports({
            "flag": "calendar", "cmpid": that.loginUser.cmpid, "fy": that.loginUser.fy,
            "month": "0", "year": "2017", "apartype": _apartype, "banktype": _banktype, "bankid": _bankid
        }).subscribe(data => {
            that.events = data.data;
        }, err => {
            console.log("Error");
        }, () => {
            // console.log("Complete");
        })
    }

    getAPARDropDown() {
        var that = this;

        that._rptservice.getAPARReports({
            "flag": "dropdown", "cmpid": that.loginUser.cmpid, "fy": that.loginUser.fy, "monthname": "March 2017"
        }).subscribe(data => {
            that.fliterAPARDT = data.data[0]._apartype;
            that.fliterBankTypeDT = data.data[0]._banktype;
            that.fliterBankDT = data.data[0]._bank;

            that.selectedAPARType = Object.keys(that.fliterAPARDT).map(function (k) { return that.fliterAPARDT[k].key });
            that.selectedBankType = Object.keys(that.fliterBankTypeDT).map(function (k) { return that.fliterBankTypeDT[k].key });
            that.selectedBank = Object.keys(that.fliterBankDT).map(function (k) { return that.fliterBankDT[k].key });

            that.getAPARReports();
        }, err => {
            console.log("Error");
        }, () => {
            // console.log("Complete");
        })
    }

    getMonthWiseAPAR(row) {
        var that = this;

        console.log(row.view);

        that._rptservice.getAPARReports({
            "flag": "monthwise", "cmpid": that.loginUser.cmpid, "fy": that.loginUser.fy, "monthname": row.view.title
        }).subscribe(data => {
            that.monthwiseapar = data.data;
        }, err => {
            console.log("Error");
        }, () => {
            // console.log("Complete");
        })
    }

    getDefaultData(row) {
        var that = this;
        that.getAPARDropDown(row);
        that.getMonthWiseAPAR(row);
    }

    getAPARByType(row) {
        var that = this;

        if (row.calEvent !== undefined) {
            that._rptservice.getAPARReports({
                "flag": "apartype", "apartype": row.calEvent.apartype, "docdate": row.calEvent.start,
                "cmpid": that.loginUser.cmpid, "fy": that.loginUser.fy, "month": "0", "year": "2017"
            }).subscribe(data => {
                that.viewaparDT = data.data;
                that.rowheader = data.data[0].aparhead;
                that.rowname = data.data[0].aparname;
                that.rowdate = data.data[0].docdate;
            }, err => {
                console.log("Error");
            }, () => {
                // console.log("Complete");
            })
        }
    }

    TotalAPARAmt() {
        var APARAmtTotal = 0;

        for (var i = 0; i < this.viewaparDT.length; i++) {
            var items = this.viewaparDT[i];
            APARAmtTotal += parseInt(items.amount);
        }

        return APARAmtTotal;
    }

    openDetailsForm(row) {
        if (row.apartype === "ap") {
            this._router.navigate(['/accounts/bankpayment/details/', row.autoid]);
        }
        else {
            this._router.navigate(['/accounts/bankreceipt/details/', row.autoid]);
        }
    }

    ngOnDestroy() {
        //this.subscr_actionbarevt.unsubscribe();
        this.setActionButtons.setTitle("");
    }
}

export class MyEvent {
    id: number;
    apartype: string;
    monthname: string;
    title: string;
    start: string;
}