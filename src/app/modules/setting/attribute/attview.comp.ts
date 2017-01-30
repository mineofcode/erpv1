import { Component, OnInit, OnDestroy } from '@angular/core';
import { SharedVariableService } from "../../../_service/sharedvariable-service";
import { ActionBtnProp } from '../../../../app/_model/action_buttons'
import { Subscription } from 'rxjs/Subscription';
import { CommonService } from '../../../_service/common/common-service'
import { attributeService } from "../../../_service/attribute/attr-service";
import { MessageService, messageType } from '../../../_service/messages/message-service';
import { UserService } from '../../../_service/user/user-service';
import { LoginUserModel } from '../../../_model/user_model';


declare var $: any;
@Component({
    templateUrl: 'attview.comp.html',
    providers: [attributeService, CommonService]
    //,AutoService
}) export class attrview implements OnInit, OnDestroy {
    actionButton: ActionBtnProp[] = [];
    subscr_actionbarevt: Subscription;

    addNewAttr: any = [];
    attName: any = "";
    counter: any = 0;
    attid: any = 0;
    attributegrouplist: any = [];
    val: any;
    attrgrp: any = 0;
    key: any = "";
    //user details
    loginUser: LoginUserModel;
    loginUserName: string;

    constructor(private setActionButtons: SharedVariableService, private attributeServies: attributeService,
        private _autoservice: CommonService, private _commonservice: CommonService, private _msg: MessageService,
        private _userService: UserService) {
        this.counter = 0;
        this.loginUser = this._userService.getUser();
    }
    //Add Save Edit Delete Button
    ngOnInit() {
        this.actionButton.push(new ActionBtnProp("save", "Save", "save", true, true));
        this.actionButton.push(new ActionBtnProp("edit", "Edit", "edit", true, false));
        this.actionButton.push(new ActionBtnProp("delete", "Delete", "trash", true, false));
        this.setActionButtons.setActionButtons(this.actionButton);
        this.subscr_actionbarevt = this.setActionButtons.setActionButtonsEvent$.subscribe(evt => this.actionBarEvt(evt));
        this.getAttribute();
        this.getattributegroup();
        $("#attnam").focus();
    }

    getattributegroup() {
        var that = this;
        this._commonservice.getMOM({ "group": "attrgrp" }).subscribe(data => {
            that.attributegrouplist = data.data;
        }, err => {
            console.log("Error");
        }, () => {
            console.log("Complete");
        })
    }

    //Add Top Buttons Add Edit And Save
    actionBarEvt(evt) {
        if (evt === "save") {
            //Save CLick Event
            this.actionButton.find(a => a.id === "save").hide = false;
        } else if (evt === "edit") {
            // alert("edit called");
            this.actionButton.find(a => a.id === "save").hide = false;
        } else if (evt === "delete") {
            alert("delete called");
        }
    }

    jsonparam() {
        var Param = {
            "flag": "at",
            "cmpid": this.loginUser.cmpid,
            "fy": this.loginUser.fyid,
            "typ": "at",
            "parent": 0,
            "attid": this.attid,
            "attname": this.attName,
            "attgroup": this.attrgrp.split(':')[0],
            "attkey": this.attrgrp.split(':')[1],
            "createdby": this.loginUser.login,
            "remark1": "",
            "remark2": "",
            "remark3": ""
        }
        return Param;
    }

    getAttribute() {
        this.attributeServies.attget({
            "cmpid": this.loginUser.cmpid,
            "createdby": this.loginUser.login,
            "fy": this.loginUser.login
        }).subscribe(result => {
            this.addNewAttr = result.data;

        })
    }

    private NewRowAdd() {
        if ($("#attnam").val() == "") {
            this._msg.Show(messageType.info, "info", "Please enter attribute name");
            $("#attnam").focus();
            return;
        }
        this.attributeServies.attsave(
            this.jsonparam()
        ).subscribe(result => {
            var dataset = result.data;
            if (dataset[0].funsave_attribute.maxid == "-1") {
                this._msg.Show(messageType.info, "info", "Duplicate attribute");
                $("#attnam").focus();
                return;
            }
            if (dataset[0].funsave_attribute.maxid > 0) {
                this._msg.Show(messageType.success, "success", "Data Save Successfully");
                this.addNewAttr.push({
                    'atname': this.attName,
                    'isact': true,
                    'counter': this.counter
                });
                this.counter++;
                this.attName = "";
                this.attrgrp = "";
                $("#attnam").focus();
                this.getAttribute();
            }
            else {
                console.log("Error");
                $("#attnam").focus();
                return;
            }
        }, err => {
            console.log("Error");
        }, () => {
            // console.log("Complete");
        })
    }

    editrow(row) {
        if (row.val) {
            this.attid = row.autoid;
            this.attName = row.atname;
            this.attrgrp = row.key;
            $("#attnam").focus();
        }
    }

    DeleteRow(row) {
        this.attributeServies.attsave({
            "cmpid": this.loginUser.cmpid,
            "fy": this.loginUser.fyid,
            "flag": "del",
            "createdby": this.loginUser.login,
            "isact": row.val,
            "attid": row.autoid
        }).subscribe(result => {
            var dataset = result.data;
        })
    }

    ngOnDestroy() {
        this.actionButton = [];
        this.subscr_actionbarevt.unsubscribe();
    }
}