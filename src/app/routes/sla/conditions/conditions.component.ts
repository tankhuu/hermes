import { GetAllServiceUseCase } from "./../../../network/usecases/sla-usecase/get-all-service-by-env.usecase";
import { NzMessageService } from "ng-zorro-antd/message";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Component, OnInit, Input, ChangeDetectorRef } from "@angular/core";
import { _HttpClient } from "@delon/theme";
import { NzModalRef } from "ng-zorro-antd/modal";
import { stringify } from "@angular/compiler/src/util";

@Component({
  selector: "app-sla-conditions",
  templateUrl: "./conditions.component.html",
  styleUrls: ["./conditions.component.less"],
})
export class SlaConditionsComponent implements OnInit {
  @Input() title?: string;
  @Input() subtitle?: string;
  form!: FormGroup;
  submitting = false;
  selectedConditionType = "BACKEND";
  services: string[] = [];

  constructor(
    private http: _HttpClient,
    private modal: NzModalRef,
    private fb: FormBuilder,
    private msg: NzMessageService,
    private cdr: ChangeDetectorRef,
    private getAllServiceUseCase: GetAllServiceUseCase
  ) {}

  ngOnInit() {
    this.form = this.fb.group(this._backendFormGroup());
    this._loadService("stage");
  }

  _backendFormGroup() {
    return {
      labelName: [null, [Validators.required]],
      labelType: ["Number", [Validators.required]],
      conditionType: [this.selectedConditionType, [Validators.required]],
      environment: [null, [Validators.required]],
      service: [null, [Validators.required]],
      operatorType: ["Number", [Validators.required]],
      operator: [null, [Validators.required]],
      operatorComparationValue: [null, [Validators.required]],
    };
  }

  _apiFormGroup() {
    return {
      labelName: [null, [Validators.required]],
      labelType: ["Number", [Validators.required]],
      conditionType: [this.selectedConditionType, [Validators.required]],
      method: ["GET", [Validators.required]],
      domain: [null, [Validators.required]],
      headers: [null, []],
      body: [null, []],
      // operatorType: ["String", [Validators.required]],
      // operatorComparationValue: [null, [Validators.required]],
    };
  }

  _webFormGroup() {
    return {
      labelName: [null, [Validators.required]],
      labelType: ["Number", [Validators.required]],
      conditionType: [this.selectedConditionType, [Validators.required]],
      domain: [null, [Validators.required]],
    };
  }

  _loadService(data: string) {
    console.log(data);
    this.getAllServiceUseCase.execute("stage").subscribe(
      (res) => {
        console.log(res);
        this.services = [...res.result];
      },
      (err) => {
        console.log(err);
      }
    );
  }

  destroyModal(): void {
    this.modal.destroy({ data: "this the result data" });
  }

  submit(): void {
    console.log("Add Operation");
    Object.keys(this.form.controls).forEach((key) => {
      this.form.controls[key].markAsDirty();
      this.form.controls[key].updateValueAndValidity();
    });
    if (this.form.invalid) {
      return;
    }
    console.log(this.form.value);
    this.modal.result = this.form.value;
    this.modal.destroy({ data: this.form.value });
  }

  slaTypeChange(type) {
    if (this.selectedConditionType == type) {
      return;
    }
    this.selectedConditionType = type;
    switch (type) {
      case "BACKEND":
        this.form = this.fb.group(this._backendFormGroup());
        break;
      case "API":
        this.form = this.fb.group(this._apiFormGroup());
        break;
      default:
        this.form = this.fb.group(this._webFormGroup());
        break;
    }
  }
}
