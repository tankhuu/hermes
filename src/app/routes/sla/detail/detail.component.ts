import { SlaMaskAsTemplateRequest } from "./../../../network/domain/request/sla-mask-as-template-request";
import { MarkSLAAsTemplateUsecase } from "./../../../network/usecases/sla-usecase/mask-as-template.usecase";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { ExcuseSingleSlaByIdUseCase } from "./../../../network/usecases/sla-usecase/excuse-single-sla.usecase";
import { DeleteSlaByIdUseCase } from "./../../../network/usecases/sla-usecase/delete-sla-by-id.usecase";
import { SALCondition, SLAModel } from "./../../../network/domain/sla.model";
import { ActivatedRoute, Router } from "@angular/router";
import { GetSlaByIdUseCase } from "./../../../network/usecases/sla-usecase/get-sla-by-id.usecase";
import { Component, Injector, OnInit } from "@angular/core";
import { _HttpClient } from "@delon/theme";
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-sla-detail",
  templateUrl: "./detail.component.html",
})
export class SlaDetailComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private injector: Injector,
    private getSlaByIdUseCase: GetSlaByIdUseCase,
    private deleteSlaByIdUseCase: DeleteSlaByIdUseCase,
    private excuseSingleSlaByIdUseCase: ExcuseSingleSlaByIdUseCase,
    private markSLAAsTemplateUsecase: MarkSLAAsTemplateUsecase
  ) {}
  id;
  loading = true;
  slaData: SLAModel;
  conditions: SALCondition[] = [];
  switchTemplateValue = false;
  excuseLoading = false;
  templateLoading = false;
  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get("id");
    this._loadSla();
  }

  _loadSla() {
    this.getSlaByIdUseCase.execute(this.id).subscribe((res) => {
      this.loading = false;
      this.slaData = res.result;
      this.conditions = res.result.conditions;
      this.switchTemplateValue = res.result.template;
      console.log(this.slaData);
    });
  }

  get schedule(): string {
    if (this.slaData != null && this.slaData.frequency) {
      var plural = this.slaData.frequency.value > 1 ? "s" : "";
      return `Every ${this.slaData.frequency.value} ${
        this.slaData.frequency.type + plural
      }`;
    }
    return "N/A";
  }

  private get notification(): NzNotificationService {
    return this.injector.get(NzNotificationService);
  }
  get channels(): String {
    return (
      this.slaData && this.slaData.notifications.map((n) => n.type).join("/ ")
    );
  }

  get totalCondition(): number {
    return this.slaData ? this.slaData.conditions.length : 0;
  }

  get getName(): string {
    return this.slaData ? this.slaData.name : "--";
  }

  get getExcuteDate(): string {
    var datepipe = new DatePipe("en-US");
    return (
      "Execution date: " +
      (this.slaData.lastExecution
        ? datepipe.transform(
            this.slaData.lastExecution.createdTime,
            "yyyy/MM/dd HH:mm"
          )
        : "--")
    );
  }

  loadFailureConditions(): SALCondition[] {
    if (this.slaData != null) {
      return this.conditions.filter((c) => !c.lastExecution.success);
    }
    return [];
  }

  navigateEditSLA() {
    this.router.navigate(["/sla/edit", this.id]);
  }

  deleteSLA() {
    this.deleteSlaByIdUseCase.execute(this.id).subscribe((res) => {
      this.loading = false;
      this.router.navigate([""]);
    });
  }

  excuseSLA() {
    this.excuseLoading = true;
    this.excuseSingleSlaByIdUseCase.execute(this.id).subscribe(
      (res) => {
        this.excuseLoading = false;
        this._loadSla();
        this.notification.success(
          "SLA Excuse",
          `Excuse SLA ${this.slaData.name} success`
        );
      },
      (err) => {
        this.excuseLoading = false;

        this.notification.success(
          "SLA Excuse",
          `Excuse SLA ${this.slaData.name} Fail`
        );
      }
    );
  }

  maskAsTemplate() {
    console.log(this.switchTemplateValue);
    if (!this.templateLoading) {
      this.switchTemplateValue = !this.switchTemplateValue;
      this.templateLoading = true;
      var params: SlaMaskAsTemplateRequest = {
        id: this.id,
        isTemplate: this.switchTemplateValue,
      };
      this.markSLAAsTemplateUsecase.execute(params).subscribe(
        (res) => {
          this.templateLoading = false;
        },
        (err) => {
          this.templateLoading = false;
          this.switchTemplateValue = !this.switchTemplateValue;
        }
      );
    }
  }

  checkStatus(sla: SLAModel) {
    if (sla.lastExecution == null) {
      return false;
    }

    return sla.lastExecution.success;
  }
}
