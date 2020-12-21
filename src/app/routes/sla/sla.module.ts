import { SlaComponent } from './sla.component';
import { NgModule, Type } from '@angular/core';
import { SharedModule } from '@shared';
import { SlaRoutingModule } from './sla-routing.module';
import { SlaCreateComponent } from './create/create.component';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { SlaConditionsComponent } from './conditions/conditions.component';
import { SlaDetailComponent } from './detail/detail.component';

const COMPONENTS: Type<void>[] = [SlaComponent, SlaCreateComponent, SlaConditionsComponent,
  SlaDetailComponent];
const COMPONENTS_NOROUNT: Type<void>[] = [];

@NgModule({
  imports: [SharedModule, SlaRoutingModule, NzTimePickerModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
})
export class SlaModule {}
