import { AllServiceResponseModel } from "./../../domain/response/all-service-response.model";
import { AllSlaResponseModel } from "../../domain/response/all-sla-response.model";
import { UseCase } from "./../../../core/use-case";
import { Injectable } from "@angular/core";

import { Observable } from "rxjs";
import { SLARepositoty } from "../../repositories/sla.repository";

@Injectable({
  providedIn: "root",
})
export class GetAllServiceUseCase
  implements UseCase<string, AllServiceResponseModel> {
  constructor(private slaRepositoty: SLARepositoty) {}

  execute(params: string): Observable<AllServiceResponseModel> {
    return this.slaRepositoty.getAllService(params);
  }
}
