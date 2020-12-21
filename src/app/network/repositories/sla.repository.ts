import { AllServiceResponseModel } from "./../domain/response/all-service-response.model";
import { SlaMaskAsTemplateRequest } from "./../domain/request/sla-mask-as-template-request";
import { SingleSlaResponseModel } from "./../domain/response/single-sla-response.model";
import { AllSlaResponseModel } from "../domain/response/all-sla-response.model";
import { SLAModel } from "./../domain/sla.model";
import { BaseRepository } from "./base.repository";
import { Observable } from "rxjs";
import { SingleExcuseSlaResponseModel } from "../domain/response/single-excuse-sla-response.model";

export abstract class SLARepositoty extends BaseRepository {
  abstract createSLA(params: SLAModel): Observable<SLAModel>;
  abstract updateSLA(params: SLAModel): Observable<SLAModel>;
  abstract getAllSLA(): Observable<AllSlaResponseModel>;
  abstract getSLABy(id: string): Observable<SingleSlaResponseModel>;
  abstract deleleSlaBy(id: string): Observable<SingleSlaResponseModel>;
  abstract excuseSLABy(id: string): Observable<SingleExcuseSlaResponseModel>;
  abstract maskAsTemplate(
    params: SlaMaskAsTemplateRequest
  ): Observable<SingleSlaResponseModel>;
  abstract getAllService(env: string): Observable<AllServiceResponseModel>;
}
