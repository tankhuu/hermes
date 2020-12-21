import { Component, Inject, OnDestroy, Optional } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { StartupService } from "@core";
import { ReuseTabService } from "@delon/abc/reuse-tab";
import {
  DA_SERVICE_TOKEN,
  ITokenService,
  SocialOpenType,
  SocialService,
} from "@delon/auth";
import { SettingsService, _HttpClient } from "@delon/theme";
import { environment } from "@env/environment";
import { NzMessageService } from "ng-zorro-antd/message";

@Component({
  selector: "passport-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.less"],
  providers: [SocialService],
})
export class UserLoginComponent implements OnDestroy {
  constructor(
    fb: FormBuilder,
    private router: Router,
    private settingsService: SettingsService,
    private socialService: SocialService,
    @Optional()
    @Inject(ReuseTabService)
    private reuseTabService: ReuseTabService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private startupSrv: StartupService,
    public http: _HttpClient,
    public msg: NzMessageService
  ) {
    this.form = fb.group({
      userName: [
        null,
        [Validators.required, Validators.pattern(/^(admin|user)$/)],
      ],
      password: [null, [Validators.required, Validators.pattern(/^(12345)$/)]],
      mobile: [null, [Validators.required, Validators.pattern(/^1\d{10}$/)]],
      captcha: [null, [Validators.required]],
      remember: [true],
    });
  }

  // #region fields

  get userName(): AbstractControl {
    return this.form.controls.userName;
  }
  get password(): AbstractControl {
    return this.form.controls.password;
  }
  get mobile(): AbstractControl {
    return this.form.controls.mobile;
  }
  get captcha(): AbstractControl {
    return this.form.controls.captcha;
  }
  form: FormGroup;
  error = "";
  type = 0;

  // #region get captcha

  count = 0;
  interval$: any;

  // #endregion

  switch({ index }: { index: number }): void {
    this.type = index;
  }

  getCaptcha(): void {
    if (this.mobile.invalid) {
      this.mobile.markAsDirty({ onlySelf: true });
      this.mobile.updateValueAndValidity({ onlySelf: true });
      return;
    }
    this.count = 59;
    this.interval$ = setInterval(() => {
      this.count -= 1;
      if (this.count <= 0) {
        clearInterval(this.interval$);
      }
    }, 1000);
  }

  // #endregion

  submit(): void {
    this.error = "";
    if (this.type === 0) {
      this.userName.markAsDirty();
      this.userName.updateValueAndValidity();
      this.password.markAsDirty();
      this.password.updateValueAndValidity();
      if (this.userName.invalid || this.password.invalid) {
        return;
      }
    } else {
      this.mobile.markAsDirty();
      this.mobile.updateValueAndValidity();
      this.captcha.markAsDirty();
      this.captcha.updateValueAndValidity();
      if (this.mobile.invalid || this.captcha.invalid) {
        return;
      }
    }

    var user = {
      token: "123456789",
      name: "Admin",
      email: `kupids@karrostech.com`,
      id: 10000,
      time: +new Date(),
    };

    this.reuseTabService.clear();

    user["expired"] = +new Date() + 1000 * 60 * 5;
    this.tokenService.set(user);
    this.startupSrv.load().then(() => {
      let url = this.tokenService.referrer!.url || "/";
      if (url.includes("/passport")) {
        url = "/";
      }
      this.router.navigateByUrl(url);
    });
  }

  // #region social

  open(type: string, openType: SocialOpenType = "href"): void {
    let url = ``;
    let callback = ``;
    // tslint:disable-next-line: prefer-conditional-expression
    if (environment.production) {
      callback = "https://ng-alain.github.io/ng-alain/#/callback/" + type;
    } else {
      callback = "http://localhost:4200/#/callback/" + type;
    }
    switch (type) {
      case "auth0":
        url = `//cipchk.auth0.com/login?client=8gcNydIDzGBYxzqV0Vm1CX_RXH-wsWo5&redirect_uri=${decodeURIComponent(
          callback
        )}`;
        break;
      case "github":
        url = `//github.com/login/oauth/authorize?client_id=9d6baae4b04a23fcafa2&response_type=code&redirect_uri=${decodeURIComponent(
          callback
        )}`;
        break;
      case "weibo":
        url = `https://api.weibo.com/oauth2/authorize?client_id=1239507802&response_type=code&redirect_uri=${decodeURIComponent(
          callback
        )}`;
        break;
    }
    if (openType === "window") {
      this.socialService
        .login(url, "/", {
          type: "window",
        })
        .subscribe((res) => {
          if (res) {
            this.settingsService.setUser(res);
            this.router.navigateByUrl("/");
          }
        });
    } else {
      this.socialService.login(url, "/", {
        type: "href",
      });
    }
  }

  // #endregion

  ngOnDestroy(): void {
    if (this.interval$) {
      clearInterval(this.interval$);
    }
  }
}
