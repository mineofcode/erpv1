import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MasterComp } from '../master/master.comp';
import { AuthGuard } from '../../_service/authguard-service';
import { SharedComponentModule } from '../../_shared/sharedcomp.module';
import { MasterDashboardComp } from '../master/dashboard/dashboard.comp';

import { acadd } from '../master/acgroup/add/add.comp';                //Purchase Add
import { acview } from '../master/acgroup/view/view.comp';             //Purchase View

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

const routerConfig = [
  {
    path: '',
    component: MasterComp,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        children: [
            
           //Ac Group Add And View 
          { path: 'acadd', component: acadd, canActivateChid: [AuthGuard], },
          { path: 'acedit/:id', component: acadd, canActivateChid: [AuthGuard], },
          { path: 'acview', component: acview, canActivateChid: [AuthGuard], },

         

          { path: '', component: MasterDashboardComp, canActivateChid: [AuthGuard], },
        ]
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routerConfig), SharedComponentModule, FormsModule, CommonModule],
  declarations: [
    //Common Module
     MasterComp,
     MasterDashboardComp,

     //Ac Group Add And View 
     acadd,
     acview,

    // //Supplier Bill 
    //  billadd,
    //  billview,

    // //Supplier Payment 
    // payadd,
    // payview,

    // //Supplier Items Master
    // itemadd,
    // itemview,
    
    // //Supplier Details
    // supplierdetailsview,

    // //Supplier Expenses 
    // expadd,
    // expview,

  ],
  providers: [AuthGuard]
})

export default class MasterModule {
}