import { SlaComponent } from "./sla.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SlaCreateComponent } from "./create/create.component";
import { SlaConditionsComponent } from "./conditions/conditions.component";
import { SlaDetailComponent } from "./detail/detail.component";

const routes: Routes = [
  {
    path: "",
    component: SlaComponent,
    children: [
      {
        path: "",
        redirectTo: "detail",
        pathMatch: "full",
      },
      { path: "detail/:id", component: SlaDetailComponent },
    ],
  },
  { path: "create", component: SlaCreateComponent, pathMatch: "full" },
  { path: "edit/:id", component: SlaCreateComponent, pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SlaRoutingModule {}
