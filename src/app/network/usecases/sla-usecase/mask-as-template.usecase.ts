import { SlaMaskAsTemplateRequest } from "./../../domain/request/sla-mask-as-template-request";
import { UseCase } from "./../../../core/use-case";
import { SLAModel } from "./../../domain/sla.model";
import { Injectable } from "@angular/core";

import { Observable } from "rxjs";
import { SLARepositoty } from "../../repositories/sla.repository";
import { SingleSlaResponseModel } from "../../domain/response/single-sla-response.model";

@Injectable({
  providedIn: "root",
})
export class MarkSLAAsTemplateUsecase
  implements UseCase<SlaMaskAsTemplateRequest, SingleSlaResponseModel> {
  constructor(private slaRepositoty: SLARepositoty) {}

  execute(
    params: SlaMaskAsTemplateRequest
  ): Observable<SingleSlaResponseModel> {
    return this.slaRepositoty.maskAsTemplate(params);
  }
}
