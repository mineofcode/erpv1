import { NgModule, Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '../../../_service/authguard-service';
import { AddDebitNote } from './aded/adddebitnote.comp';
import { ViewDebitNote } from './view/viewdebitnote.comp';
import { SharedComponentModule } from '../../../_shared/sharedcomp.module';
import { ActionBarModule } from '../../../_shared/shared.module'

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LazyLoadEvent, DataTableModule, DataListModule, CheckboxModule, AutoCompleteModule } from 'primeng/primeng';
import { CalendarModule } from '../../usercontrol/calendar';
import { NumTextModule } from '../../usercontrol/numtext';

@Component({
    template: '<router-outlet></router-outlet>'
})

export class DebitNoteComp implements OnInit {
    constructor() {
    }

    ngOnInit() {
    }
}

const routerConfig = [
    {
        path: '',
        component: DebitNoteComp,
        canActivate: [AuthGuard],
        data: { "module": "accs" },
        children: [
            {
                path: '',
                children: [
                    { path: 'add', component: AddDebitNote, canActivateChid: [AuthGuard], data: { "module": "accs", "submodule": "dn", "rights": "add", "urlname": "/add" } },
                    { path: 'details/:id', component: AddDebitNote, canActivateChid: [AuthGuard], data: { "module": "accs", "submodule": "dn", "rights": "edit", "urlname": "/edit" } },
                    { path: 'edit/:id', component: AddDebitNote, canActivateChid: [AuthGuard], data: { "module": "accs", "submodule": "dn", "rights": "edit", "urlname": "/edit" } },
                    { path: '', component: ViewDebitNote, canActivateChid: [AuthGuard], data: { "module": "accs", "submodule": "dn", "rights": "view", "urlname": "/debitnote" } },
                ]
            }
        ]
    }
]

@NgModule({
    imports: [RouterModule.forChild(routerConfig), CommonModule, FormsModule, SharedComponentModule,
        DataTableModule, DataListModule, AutoCompleteModule, CheckboxModule, CalendarModule, NumTextModule],
    declarations: [
        AddDebitNote,
        ViewDebitNote,
        DebitNoteComp
    ],
    providers: [AuthGuard]
})

export default class DebitNoteModule {
}