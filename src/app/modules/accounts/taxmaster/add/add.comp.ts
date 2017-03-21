import { Component, OnInit, OnDestroy,ViewChild } from '@angular/core';
import { SharedVariableService } from "../../../../_service/sharedvariable-service";
import { ActionBtnProp } from '../../../../../app/_model/action_buttons'
import { Subscription } from 'rxjs/Subscription';
import { CommonService } from '../../../../_service/common/common-service'
import { taxMasterService } from "../../../../_service/taxmaster/taxmaster-service";
import { UserService } from '../../../../_service/user/user-service';
import { LoginUserModel } from '../../../../_model/user_model';
import { MessageService, messageType } from '../../../../_service/messages/message-service';
import { LazyLoadEvent, DataTable, AutoCompleteModule } from 'primeng/primeng';
import { AttributeComp } from "../../../usercontrol/attribute/attr.comp";

import { Router, ActivatedRoute } from '@angular/router';

declare var $: any;
declare var commonfun: any;
@Component({
    templateUrl: 'add.comp.html',
    providers: [taxMasterService, CommonService]

}) export class taxadd implements OnInit, OnDestroy {
    actionButton: ActionBtnProp[] = [];
    subscr_actionbarevt: Subscription;

    // local veriable 
    invoicetypelist: any = [];
    fiexchageslist: any = [];
    taxmasterlist: any = [];
    autoid: number = 0;
    invtype: number = 0;
    taxname: any = "";
    chartofac: any = "";
    chartofacid: number = 0;
    Newchartofac: any = "";
    Newchartofacid: number = 0;
    taxval: any = 0;
    charegname: any = "";
    onmodel: number = 0;
    oncharemodel: number = 0;
    Onlist: any = [];
    Oncharelist: any = [];
    amount: any = 0;
    seq: number = 0;
    taxcounter: number = 0;
    chargcounter: number = 0;
    private subscribeParameters: any;

    //New Module
    COAAutodata: any = [];
    coaid: number = 0;
    coanam: any = "";
    //user details
    loginUser: LoginUserModel;
    loginUserName: string;

    @ViewChild('attribute')
    attribute: AttributeComp;

    constructor(private _router: Router, private setActionButtons: SharedVariableService,
        private taxMasterServies: taxMasterService,
        private _autoservice: CommonService, private _routeParams: ActivatedRoute, private _userService: UserService,
        private _msg: MessageService) {
        this.loginUser = this._userService.getUser();
    }
    //Add Save Edit Delete Button
    ngOnInit() {
        this.actionButton.push(new ActionBtnProp("back", "Back to view", "long-arrow-left", true, false));
        this.actionButton.push(new ActionBtnProp("save", "Save", "save", true, false));
        this.actionButton.push(new ActionBtnProp("edit", "Edit", "edit", true, true));
        this.actionButton.push(new ActionBtnProp("delete", "Delete", "trash", true, true));
        this.actionButton.push(new ActionBtnProp("clear", "Refresh", "refresh", true, false));
        this.setActionButtons.setActionButtons(this.actionButton);
        this.setActionButtons.setTitle("Tax Master");
        this.subscr_actionbarevt = this.setActionButtons.setActionButtonsEvent$.subscribe(evt => this.actionBarEvt(evt));

        setTimeout(function () {
            commonfun.addrequire();
        }, 0);

        this.subscribeParameters = this._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                this.actionButton.find(a => a.id === "save").hide = true;
                this.actionButton.find(a => a.id === "edit").hide = false;

                //this.groupid = params['id'];
                //this.Editgroup(this.groupid);

                $('input').attr('disabled', 'disabled');
                $('select').attr('disabled', 'disabled');
                $('textarea').attr('disabled', 'disabled');

            }
            else {
                this.actionButton.find(a => a.id === "save").hide = false;
                this.actionButton.find(a => a.id === "edit").hide = true;
            }
        });

        $(".taxname").focus();
        this.InvoiceType();
        this.attribute.labelname="Customer Attribute";
         this.attribute.attrparam = ["custinfo_attr"];
    }

    loadRBIGrid(event: LazyLoadEvent) {

    }

    //Page Load All Dropdown Bind
    InvoiceType() {
        this._autoservice.getMOM({
            "group": "taxmaster,taxpos",
            "flag": "multi",
            "cmpid": this.loginUser.cmpid
        }).subscribe(data => {
            this.invoicetypelist = data.data.filter(item => item.group === 'taxmaster');
            // this.Onlist = data.data.filter(item => item.group === 'taxpos');
            // this.Oncharelist = data.data.filter(item => item.group === 'taxpos');
        }, err => {
            console.log("Error");
        }, () => {
            console.log("Complete");
        })
    }

    COAAuto(event) {
        let query = event.query;
        this._autoservice.getAutoDataGET({
            "type": "customer",
            "typ":"ac",
            "cmpid": this.loginUser.cmpid,
            "fy": this.loginUser.fy,
            "createdby": this.loginUser.login,
            "search": query
        }).then(data => {
            this.COAAutodata = data;
        });
    }

    //Parent Code Selected
    COASelect(event) {
        this.coaid = event.value;
        this.coanam = event.label;
    }

    //Autocompleted Chart of ac
    CharOfAccount(me: any, arg: number) {
        var _me = this;
        try {
            var duplicateitem = true;
            this._autoservice.getAutoData({
                "type": "nature",
                "search": arg == 0 ? me.Newchartofac : me.chartofac,
                "cmpid": _me.loginUser.cmpid,
                "fy": _me.loginUser.fy,
                "createdby": _me.loginUser.login
            }).subscribe(data => {
                $(".chartofac").autocomplete({
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
                        me.chartofac = ui.item.label;
                        if (_me.taxmasterlist.length > 0) {
                            if (me.chartofac != "") {
                                for (let item of _me.taxmasterlist) {
                                    if (item.chartofac == me.chartofac) {
                                        duplicateitem = false;
                                        break;
                                    }
                                }
                            }
                            else {
                                for (let item of _me.taxmasterlist) {
                                    if (item.Newchartofac == me.Newchartofac) {
                                        duplicateitem = false;
                                        break;
                                    }
                                }
                            }
                        }
                        if (duplicateitem === true) {
                            if (arg === 1) {
                                me.Newchartofac = ui.item.label;
                                me.Newchartofacid = ui.item.value;
                            } else {
                                me.chartofac = ui.item.label;
                                me.chartofacid = ui.item.value;
                            }
                        }
                        else {
                            _me._msg.Show(messageType.info, "info", "Duplicate Account");
                            return;
                        }

                    }
                });
            }, err => {
                console.log("Error");
            }, () => {
            })
        } catch (e) {
            this._msg.Show(messageType.error, "error", e.message);
            return;
        }
    }

    //Add Tax Master New Row
    AddNewTax() {
        var that = this;
        that.taxmasterlist.push({
            "autoid": that.autoid,
            "taxname": that.taxname,
            "chartofac": that.charegname === "" ? that.Newchartofac : that.charegname,
            "chartofacid": that.chartofacid === 0 ? that.Newchartofacid : that.chartofacid,
            "onlist": that.Onlist,
            "id": that.onmodel,
            "taxval": that.taxval,
            "seq": that.seq,
            "taxcounter": that.taxcounter
        })
        that.taxcounter++;
        that.taxname = "";
        that.onmodel = 0;
        that.charegname = "";
        that.chartofacid = 0;
        that.Newchartofac = "";
        that.Newchartofacid = 0;
        that.taxval = "";
        that.seq = 0;
        $(".taxname").focus();

    }

    //Add Chares New Row 
    AddNewCharges() {
        var that = this;
        that.fiexchageslist.push({
            "autoid": that.autoid,
            "chares": that.charegname,
            "amount": that.amount,
            "Oncharelist": that.Oncharelist,
            "id": that.oncharemodel,
            "charcounter": that.chargcounter
        })
        that.chargcounter++;
        that.charegname = "";
        that.amount = "";
        that.oncharemodel = 0;
        $(".taxname").focus();

    }

    //Tax Master Table Delete Row
    TaxDeleteRow(counter: number = 0) {
        var index = -1;
        for (var i = 0; i < this.taxmasterlist.length; i++) {
            if (this.taxmasterlist[i].taxcounter === counter) {
                index = i;
                break;
            }
        }
        if (index === -1) {
            console.log("Wrong Delete Entry");
        }
        this.taxmasterlist.splice(index, 1);
        $(".taxname").focus();
    }

    //Chares Table Delete Row
    CharesDeleteRow(counter: number = 0) {
        var index = -1;
        for (var i = 0; i < this.taxmasterlist.length; i++) {
            if (this.taxmasterlist[i].charcounter === counter) {
                index = i;
                break;
            }
        }
        if (index === -1) {
            console.log("Wrong Delete Entry");
        }
        this.taxmasterlist.splice(index, 1);
        $(".charegname").focus();
    }

    //Paramter Json 
    paramjson() {
        var params = [];
        for (let item of this.taxmasterlist) {
            for (let chritem of this.fiexchageslist) {
                params.push({
                    "autoid": item.autoid,
                    "invtype": this.invtype,
                    "cmpid": this.loginUser.cmpid,
                    "fy": this.loginUser.fy,
                    "taxname": item.taxname,
                    "coac": item.chartofacid,
                    "taxval": item.taxval,
                    "ontax": item.id,
                    "seq": item.seq,
                    "createdby": this.loginUser.login,
                    "charges": chritem.chares,
                    "amt": chritem.amount,
                    "charon": chritem.id
                })
            }
        }
        return params;
    }

    //Control Clear
    ClearControl() {
        this.invtype = 0;
        this.fiexchageslist = [];
        this.taxmasterlist = [];
        $(".invtype").focus();
    }

    //Add Top Buttons Add Edit And Save
    actionBarEvt(evt) {
        if (evt === "clear") {
            // this.ClearControll();
        }
        if (evt === "back") {
            this._router.navigate(['accounts/taxmaster']);
        }
        if (evt === "save") {
            try {
                var validateme = commonfun.validate();
                if (!validateme.status) {
                    this._msg.Show(messageType.error, "error", validateme.msglist);
                    validateme.data[0].input.focus();
                    return;
                }
                this.actionButton.find(a => a.id === "save").enabled = false;
                this.taxMasterServies.saveTaxMaster({
                    "taxmasterdetail": this.paramjson()
                }).subscribe(result => {
                    var dataset = result.data;
                    if (dataset[0].funsave_taxmaster.msgid > 0) {
                        this._msg.Show(messageType.success, "success", dataset[0].funsave_taxmaster.msg);
                        this.ClearControl();
                    }
                }, err => {
                    console.log("Error");
                }, () => {
                    console.log("Complete");
                })
            } catch (e) {
                this._msg.Show(messageType.error, "error", e.message);
            }
            this.actionButton.find(a => a.id === "save").enabled = true;
        } else if (evt === "edit") {
            $('input').removeAttr('disabled');
            $('select').removeAttr('disabled');
            $('textarea').removeAttr('disabled');
            $(".groupcode").attr('disabled', 'disabled');
            this.actionButton.find(a => a.id === "save").hide = false;
            this.actionButton.find(a => a.id === "edit").hide = true;
            $(".groupName").focus();
            this.actionButton.find(a => a.id === "save").hide = false;
        } else if (evt === "delete") {
            alert("delete called");
        }
    }

    ngOnDestroy() {
        this.actionButton = [];
        this.subscr_actionbarevt.unsubscribe();
        this.setActionButtons.setTitle("");
    }
}