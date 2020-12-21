import { AllServiceResponseModel } from "./../../domain/response/all-service-response.model";
import { SlaMaskAsTemplateRequest } from "./../../domain/request/sla-mask-as-template-request";
import { AllSlaResponseModel } from "../../domain/response/all-sla-response.model";
import { SLAModel } from "./../../domain/sla.model";

import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { SLARepositoty } from "../../repositories/sla.repository";
import { SingleSlaResponseModel } from "../../domain/response/single-sla-response.model";
import { SingleExcuseSlaResponseModel } from "../../domain/response/single-excuse-sla-response.model";

@Injectable({
  providedIn: "root",
})
export class SlaApiRepository extends SLARepositoty {
  constructor(private http: HttpClient) {
    super();
  }

  createSLA(params: SLAModel): Observable<SLAModel> {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };
    return this.http.post<SLAModel>(
      `${this.URL}/api/v1/sla`,
      JSON.stringify(params),
      httpOptions
    );
  }

  updateSLA(params: SLAModel): Observable<SLAModel> {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };
    return this.http.put<SLAModel>(
      `${this.URL}/api/v1/sla/${params.id}`,
      JSON.stringify(params),
      httpOptions
    );
  }
  getAllSLA(): Observable<AllSlaResponseModel> {
    return this.http.get<AllSlaResponseModel>(`${this.URL}/api/v1/sla`);
  }

  getSLABy(id: string): Observable<SingleSlaResponseModel> {
    return this.http.get<SingleSlaResponseModel>(
      `${this.URL}/api/v1/sla/${id}`
    );
  }

  deleleSlaBy(id: string): Observable<SingleSlaResponseModel> {
    return this.http.delete<SingleSlaResponseModel>(
      `${this.URL}/api/v1/sla/${id}`
    );
  }

  excuseSLABy(id: string): Observable<SingleExcuseSlaResponseModel> {
    return this.http.get<SingleExcuseSlaResponseModel>(
      `${this.URL}/api/v1/sla/${id}/execute?source=WEB`
    );
  }

  maskAsTemplate(
    params: SlaMaskAsTemplateRequest
  ): Observable<SingleSlaResponseModel> {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };
    return this.http.put<SingleSlaResponseModel>(
      `${this.URL}/api/v1/sla/${params.id}/mark-template?template=${params.isTemplate}`,

      httpOptions
    );
  }

  getAllService(env: string): Observable<AllServiceResponseModel> {
    return this.http.get<AllServiceResponseModel>(
      `${this.URL}/api/v1/service?environment=${env}`
    );
  }
}
