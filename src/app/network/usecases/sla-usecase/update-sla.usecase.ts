import { UseCase } from "./../../../core/use-case";
import { SLAModel } from "./../../domain/sla.model";
import { Injectable } from "@angular/core";

import { Observable } from "rxjs";
import { SLARepositoty } from "../../repositories/sla.repository";

@Injectable({
  providedIn: "root",
})
export class UpdateSLAUsecase implements UseCase<SLAModel, SLAModel> {
  constructor(private slaRepositoty: SLARepositoty) {}

  execute(params: SLAModel): Observable<SLAModel> {
    return this.slaRepositoty.updateSLA(params);
  }
}
