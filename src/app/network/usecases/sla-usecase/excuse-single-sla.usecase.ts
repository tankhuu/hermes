import { SingleSlaResponseModel } from "./../../domain/response/single-sla-response.model";
import { AllSlaResponseModel } from "../../domain/response/all-sla-response.model";
import { UseCase } from "./../../../core/use-case";
import { Injectable } from "@angular/core";

import { Observable } from "rxjs";
import { SLARepositoty } from "../../repositories/sla.repository";
import { SingleExcuseSlaResponseModel } from "../../domain/response/single-excuse-sla-response.model";

@Injectable({
  providedIn: "root",
})
export class ExcuseSingleSlaByIdUseCase
  implements UseCase<string, SingleExcuseSlaResponseModel> {
  constructor(private slaRepositoty: SLARepositoty) {}

  execute(id: string): Observable<SingleExcuseSlaResponseModel> {
    return this.slaRepositoty.excuseSLABy(id);
  }
}
