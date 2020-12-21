import { SingleSlaResponseModel } from "./../../domain/response/single-sla-response.model";
import { AllSlaResponseModel } from "../../domain/response/all-sla-response.model";
import { UseCase } from "./../../../core/use-case";
import { Injectable } from "@angular/core";

import { Observable } from "rxjs";
import { SLARepositoty } from "../../repositories/sla.repository";

@Injectable({
  providedIn: "root",
})
export class GetSlaByIdUseCase
  implements UseCase<string, SingleSlaResponseModel> {
  constructor(private slaRepositoty: SLARepositoty) {}

  execute(id: string): Observable<SingleSlaResponseModel> {
    return this.slaRepositoty.getSLABy(id);
  }
}
