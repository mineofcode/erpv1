import { Component, OnInit, OnDestroy } from '@angular/core';
import { SharedVariableService } from "../../../../_service/sharedvariable-service";
import { ActionBtnProp } from '../../../../../app/_model/action_buttons'
import { Subscription } from 'rxjs/Subscription';
import { CommonService } from '../../../../_service/common/common-service'; /* add reference for view employee */
import { dcviewService } from "../../../../_service/dcmaster/view/dcview-service";
import { UserService } from '../../../../_service/user/user-service';
import { LoginUserModel } from '../../../../_model/user_model';

import { Router } from '@angular/router';

declare var $: any;
@Component({
    templateUrl: 'adedview.comp.html',
    providers: [dcviewService, CommonService]                         //Provides Add Service dcmaster-service.ts
    //,AutoService
})

export class dcview implements OnInit, OnDestroy {
    actionButton: ActionBtnProp[] = [];
    subscr_actionbarevt: Subscription;

    //Declare Veriable Local
    CustName: any = '';
    CustID: any = '';
    DcDetails: any[];
    FromData: any;
    ToData: any;
    tableLength: any;
    //user details
    loginUser: LoginUserModel;
    loginUserName: string;


    constructor(private _router: Router, private setActionButtons: SharedVariableService,
        private dcviewServies: dcviewService, private _autoservice: CommonService,
        private _userService: UserService) {
        this.loginUser = this._userService.getUser();
    }
    //Add Save Edit Delete Button
    ngOnInit() {
        this.actionButton.push(new ActionBtnProp("add", "Add", "plus", true, false));
        this.actionButton.push(new ActionBtnProp("edit", "Edit", "edit", true, true));
        this.actionButton.push(new ActionBtnProp("delete", "Delete", "trash", true, false));
        this.setActionButtons.setActionButtons(this.actionButton);
        this.subscr_actionbarevt = this.setActionButtons.setActionButtonsEvent$.subscribe(evt => this.actionBarEvt(evt));
        this.tableLength = true;
        setTimeout(function () {
            $(".Custcode").focus();
            var date = new Date();
            var FromDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1);
            var ToDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            $("#FromDate").datepicker({
                dateFormat: "dd/mm/yy",
                //startDate: new Date(),        //Disable Past Date
                autoclose: true,
                setDate: new Date()
            });
            $("#FromDate").datepicker('setDate', FromDate);

            $("#ToDate").datepicker({
                dateFormat: "dd/mm/yy",
                minDate: 0,
                autoclose: true,
                setDate: new Date()
            });
            $("#ToDate").datepicker('setDate', ToDate);
        }, 0);
    }

    //Add Top Buttons
    actionBarEvt(evt) {
        if (evt === "add") {
            this._router.navigate(['/transaction/dcmaster/add']);
            //this.actionButton.find(a => a.id === "save").hide = false;
        } else if (evt === "edit") {
            // alert("edit called");
            this.actionButton.find(a => a.id === "save").hide = false;
        } else if (evt === "delete") {
            alert("delete called");
        }
    }

    //Get Button Click Event 
    private GetData() {
        this.FromData = $('#FromDate').datepicker('getDate');
        this.ToData = $('#ToDate').datepicker('getDate');
        this.dcviewServies.getDcmasterView({                     //User getdcdropdown
            "cmpid": this.loginUser.cmpid,
            "fy": this.loginUser.fy,
            "createdby": "Admin",
            "acid": this.CustID,
            "FromDoc": 0,
            "flag": "",
            "DCNo": 0,
            "ToDoc": 0,
            "FromDate": this.FromData,
            "ToDate": this.ToData
        }).subscribe(result => {
            var dataset = result.data;
            if (dataset[0].length > 0) {
                this.DcDetails = dataset[0];
                this.tableLength = false;
            }
            else {
                alert("Record Not Found");
                this.tableLength = true;
                $(".Custcode").focus();
            }
        }, err => {
            console.log('Error');
        }, () => {
            this.CustID = "";
        });

    }

    OpenEdit(row) {
        if (!row.IsLocked) {
            this._router.navigate(['/transaction/dcmaster/edit', row.dcno]);
        }
    }

    expandDetails(row) {
        row.Details = [];
        if (row.issh == 0) {
            row.issh = 1;
            if (row.Details.length === 0) {
                this.dcviewServies.getDcmasterView({
                    "flag": "Details",
                    "doc": row.dcno,
                    "cmpid": this.loginUser.cmpid,
                    "fy": this.loginUser.fy,
                    "createdby": this.loginUser.login
                }).subscribe(data => {
                    row.Details = data.data[0];
                }, err => {
                    console.log("Error");
                }, () => {
                    // console.log("Complete");
                })
            }
        } else {
            row.issh = 0;
        }
    }

    //Auto Completed Customer Name
    getAutoComplete(me: any) {
        var _me = this;
        this._autoservice.getAutoData({ "type": "customer", "search": this.CustName }).subscribe(data => {
            $(".Custcode").autocomplete({
                source: data.data,
                width: 300,
                max: 20,
                delay: 100,
                minLength: 0,
                autoFocus: true,
                cacheLength: 1,
                scroll: true,
                highlight: false,
                select: function (event, ui) {
                    me.CustID = ui.item.value;
                    me.CustName = ui.item.label;
                }
            });
        }, err => {
            console.log("Error");
        }, () => {
            // console.log("Complete");
        })
    }

    ngOnDestroy() {
        this.actionButton = [];
        this.subscr_actionbarevt.unsubscribe();
    }

}