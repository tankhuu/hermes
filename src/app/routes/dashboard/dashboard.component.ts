import { NzNotificationService } from "ng-zorro-antd/notification";
import { GetAllSlaUseCase } from "./../../network/usecases/sla-usecase/get-all-sla.usecase";
import { SLAModel } from "./../../network/domain/sla.model";
import { Router } from "@angular/router";
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Injector,
} from "@angular/core";
import { _HttpClient } from "@delon/theme";
import { NzDividerModule } from "ng-zorro-antd/divider";
import { error } from "protractor";
import { ExcuseSingleSlaByIdUseCase } from "src/app/network/usecases/sla-usecase/excuse-single-sla.usecase";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  list: Array<SLAModel | null> = [null];
  loading = true;
  excuseId = null;
  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private getAllSlaUseCase: GetAllSlaUseCase,
    private excuseSingleSlaByIdUseCase: ExcuseSingleSlaByIdUseCase,
    private injector: Injector
  ) {}

  ngOnInit() {
    this._loadSLA();
  }
  private get notification(): NzNotificationService {
    return this.injector.get(NzNotificationService);
  }

  schedule(sla: SLAModel): string {
    if (sla.frequency) {
      var plural = sla.frequency.value > 1 ? "s" : "";
      return `Every ${sla.frequency.value} ${sla.frequency.type + plural}`;
    }
    return "N/A";
  }

  checkStatus(sla: SLAModel) {
    if (sla.lastExecution == null) {
      return false;
    }

    return sla.lastExecution.success;
  }

  _loadSLA() {
    this.getAllSlaUseCase.execute().subscribe(
      (res) => {
        this.list = [];
        this.list = [null, ...res.result];
        console.log(this.list);
        this.loading = false;
        this.cdr.detectChanges();
      },
      (err) => {
        console.log(err);
        this.loading = false;
      }
    );
  }

  excuseSLA(data: SLAModel) {
    this.excuseId = data.id;
    this.excuseSingleSlaByIdUseCase.execute(data.id).subscribe(
      (res) => {
        this.excuseId = null;
        this._loadSLA();

        this.notification.success(
          "SLA Excuse",
          `Excuse SLA ${data.name} success`
        );
      },
      (err) => {
        this.excuseId = null;
        this.cdr.detectChanges();
        console.log(err);
      }
    );
  }

  createNewSLA() {
    this.router.navigate(["/sla/create"]);
  }

  viewDetail(id: string) {
    this.router.navigate(["/sla/detail", id]);
  }
}
