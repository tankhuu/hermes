import { GetAllSlaUseCase } from "./../../../network/usecases/sla-usecase/get-all-sla.usecase";
import { UpdateSLAUsecase } from "./../../../network/usecases/sla-usecase/update-sla.usecase";
import { GetSlaByIdUseCase } from "./../../../network/usecases/sla-usecase/get-sla-by-id.usecase";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { ActivatedRoute, Router } from "@angular/router";
import {
  SLAModel,
  SALCondition,
  NotificationModel,
} from "./../../../network/domain/sla.model";
import { CreateSLAUsecase } from "./../../../network/usecases/sla-usecase/create-sla.usecase";
import { NzModalService } from "ng-zorro-antd/modal";
import { SlaConditionsComponent } from "./../conditions/conditions.component";
import * as later from "@breejs/later";
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
  FormArray,
} from "@angular/forms";
import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ViewContainerRef,
  ChangeDetectionStrategy,
  Injector,
} from "@angular/core";
import { _HttpClient } from "@delon/theme";

@Component({
  selector: "app-sla-create",
  templateUrl: "./create.component.html",
  styleUrls: ["./create.component.less"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlaCreateComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  scheduleEveryValue: String = "minute";
  editIndex = -1;
  editObj = {};
  id;
  visible = false;

  templateSLAList: SLAModel[] = [];

  data: Array<{
    labelName: string;
    labelType: string;
    conditionType: string;
    environment: string;
    service: string;
    operatorType: string;
    operatorComparationValue: string;
    method: string;
    domain: string;
    headers: string;
    body: string;
    operator: string;
  }> = [];

  frequency = {
    minute: {
      single: "minute",
      plural: "minutes",
    },
    hour: {
      single: "hour",
      plural: "hours",
    },
    daily: {
      single: "day",
      plural: "days",
    },
  };

  chanelOptions = [
    {
      label: "Google Chat",
      value: "GOOGLE_CHAT",
      checkbox: "googleCheckbox",
      chanel: "googleChannel",
    },
    {
      label: "Email",
      value: "EMAIL",
      checkbox: "emailCheckbox",
      chanel: "emailChannel",
    },
    {
      label: "Voice",
      value: "VOICE",
      checkbox: "voiceCheckbox",
      chanel: "chanel",
    },
    {
      label: "Light",
      value: "LIGHT",
      checkbox: "lightCheckbox",
      chanel: "chanel",
    },
  ];

  constructor(
    private fb: FormBuilder,
    private viewContainerRef: ViewContainerRef,
    private modal: NzModalService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private injector: Injector,
    private route: ActivatedRoute,
    private createSLAUseCase: CreateSLAUsecase,
    private getSlaByIdUseCase: GetSlaByIdUseCase,
    private updateSLAUsecase: UpdateSLAUsecase,
    private getAllSlaUseCase: GetAllSlaUseCase
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get("id");
    console.log(this.id);
    this.form = this.fb.group({
      name: [null, [Validators.required]],
      scheduleFrequency: ["minute", [Validators.required]],
      scheduleEvery: [1, [Validators.required, Validators.pattern("^[0-9]*$")]],
      channel: this.fb.array([]),
      googleCheckbox: [null, []],
      emailCheckbox: [null, []],
      lightCheckbox: [null, []],
      voiceCheckbox: [null, []],
      googleChannel: [null, []],
      emailChannel: [null, []],
      message: [null, [Validators.required]],
    });
    this._loadEditMode();
    this._loadAllSLA();
  }

  _loadEditMode() {
    if (this.id == null) {
      return;
    }
    this._loadSla();
  }

  _loadSla() {
    this.getSlaByIdUseCase.execute(this.id).subscribe((res) => {
      this.loading = false;

      this._loadSLAToUI(res.result);
    });
  }

  _loadSLAToUI(sla: SLAModel) {
    this.data = sla.conditions.map((c) => {
      return {
        labelName: c.label,
        body: c.body,
        conditionType: c.type,
        domain: c.url,
        environment: c.environment,
        headers: c.headers,
        labelType: null,
        method: c.method,
        operator: c.operator,
        operatorComparationValue: c.value,
        operatorType: "Number",
        service: c.serviceName,
      };
    });
    var googleChat = sla.notifications.find((s) => s.type == "GOOGLE_CHAT");
    var email = sla.notifications.find((s) => s.type == "EMAIL");
    var light = sla.notifications.find((s) => s.type == "LIGHT");
    var voice = sla.notifications.find((s) => s.type == "VOICE");

    this.form.setValue({
      ...this.form.value,
      name: sla.name,
      message: sla.message,
      googleCheckbox: googleChat.active,
      emailCheckbox: email.active,
      lightCheckbox: light.active,
      voiceCheckbox: voice.active,
      googleChannel: googleChat.channels,
      emailChannel: email.receivers,
      scheduleFrequency: sla.frequency.type,
      scheduleEvery: sla.frequency.value,
    });
    this.frequencyChange(null);
  }

  private get notification(): NzNotificationService {
    return this.injector.get(NzNotificationService);
  }

  //#region get form fields

  get title(): string {
    return this.id
      ? "Edit Service Level Agreement"
      : "Create Service Level Agreement";
  }
  get name(): AbstractControl {
    return this.form.controls.name;
  }

  get items(): FormArray {
    return this.form.controls.items as FormArray;
  }

  _submitForm(event): void {
    Object.keys(this.form.controls).forEach((key) => {
      this.form.controls[key].markAsDirty();
      this.form.controls[key].updateValueAndValidity();
    });
    console.log(this.form.value);
    this._buildSchedule();
    if (this.form.invalid) {
      return;
    }

    let conditions: SALCondition[] = this.data.map((value) => {
      return {
        active: true,
        label: value.labelName,
        type: value.conditionType,
        body: value.body,
        environment: value.environment,
        headers: value.headers,
        method: value.method,
        serviceName: value.service,
        url: value.domain,
        operator: value.operator,
        value: value.operatorComparationValue,
      };
    });

    var param: SLAModel = {
      id: this.id,
      active: true,
      message: this.form.value.message,
      name: this.form.value.name,
      schedule: "*/5 * * * *",
      conditions: conditions,
      notifications: this._buildMessageChanel(),
      frequency: {
        type: this.form.value.scheduleFrequency,
        value: this.form.value.scheduleEvery,
      },
    };

    var apiCall = this.id
      ? this.updateSLAUsecase.execute(param)
      : this.createSLAUseCase.execute(param);

    apiCall.subscribe(
      (res) => {
        console.log(res);
        if (this.id) {
          this.router.navigate(["/sla/detail", this.id]);
        } else {
          this.router.navigate([""]);
        }
      },
      (error) => {
        console.log(error);
        this.notification.error("Create SLA error", error);
      }
    );
  }

  _buildMessageChanel() {
    var a: NotificationModel[] = this.chanelOptions.map((op) => {
      return {
        active: this.form.value[op.checkbox],
        type: op.value,
        channels: op.value == "GOOGLE_CHAT" ? this.form.value[op.chanel] : null,
        receivers: op.value == "EMAIL" ? this.form.value[op.chanel] : null,
      };
    });
    return a;
  }

  log(value: object[]): void {
    console.log(value);
  }

  googleChannelChange(value) {
    console.log(this.form.value);
  }

  emailChannelChange(value: object[]) {
    console.log(value);
  }

  _buildSchedule() {
    let every = this.form.value.scheduleEvery;
    var text = `every ${every} ${this._scheduleEveryValue(every)}`;
  }

  _addConditions() {
    console.log("_addConditions");
    this.createComponentModal();
  }

  _loadAllSLA() {
    this.getAllSlaUseCase.execute().subscribe(
      (res) => {
        console.log(res);
        this.templateSLAList = [...this.templateSLAList, ...res.result].filter(
          (e) => e.template
        );
        this.cdr.detectChanges();
      },
      (err) => {
        console.log(err);
      }
    );
  }

  frequencyChange(e) {
    this.scheduleEveryValue = this._scheduleEveryValue(
      this.form.value.scheduleEvery
    );
  }
  scheduleEveryChange(e) {
    this.scheduleEveryValue = this._scheduleEveryValue(e.key);
  }

  _scheduleEveryValue(value) {
    var frequencyType: string = this.form.value.scheduleFrequency;
    return Number(value) > 1
      ? this.frequency[frequencyType.toLowerCase()].plural
      : this.frequency[frequencyType.toLowerCase()].single;
  }

  deleteRow(labelName: string): void {
    console.log(labelName);
    this.data = this.data.filter((d) => d.labelName !== labelName);
  }

  createComponentModal(): void {
    const modal = this.modal.create({
      nzTitle: "Condition",
      nzContent: SlaConditionsComponent,
      nzViewContainerRef: this.viewContainerRef,
      nzComponentParams: {
        title: "title in component",
        subtitle: "component sub title，will be changed after 2 sec",
      },
      nzOnOk: () => new Promise((resolve) => setTimeout(resolve, 1000)),
      nzFooter: [
        {
          label: "Add",
          type: "primary",
          onClick: (componentInstance) => {
            componentInstance!.submit();
          },
        },
      ],
    });
    const instance = modal.getContentComponent();
    modal.afterOpen.subscribe(() => console.log("[afterOpen] emitted!"));
    // Return a result when closed
    modal.afterClose.subscribe((result) => {
      if (result) {
        console.log(result.data);
        this.data.push(result.data);
        this.data = [...this.data];
        this.cdr.detectChanges();
      }
    });
  }

  selectTemplate(item: SLAModel) {
    this.close();
    this._loadSLAToUI(item);
  }

  open(): void {
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }
  cancelCreate() {
    this.router.navigate([""]);
  }
}
