import { AllSlaResponseModel } from "../../domain/response/all-sla-response.model";
import { UseCase } from "./../../../core/use-case";
import { Injectable } from "@angular/core";

import { Observable } from "rxjs";
import { SLARepositoty } from "../../repositories/sla.repository";

@Injectable({
  providedIn: "root",
})
export class GetAllSlaUseCase implements UseCase<void, AllSlaResponseModel> {
  constructor(private slaRepositoty: SLARepositoty) {}

  execute(params: void): Observable<AllSlaResponseModel> {
    return this.slaRepositoty.getAllSLA();
  }
}
