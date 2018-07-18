import * as Raven from "raven-js";
import { ErrorHandler, Inject, Injector, isDevMode } from "@angular/core";
import { ToastrService } from "ngx-toastr";

export class AppErrorHandler implements ErrorHandler {
  constructor(@Inject(Injector) private injector: Injector) {}

  private get toastrService(): ToastrService {
    return this.injector.get(ToastrService);
  }

  handleError(error: any): void {
    if (!isDevMode()) Raven.captureException(error.originalError || error);
    else throw error;

    this.toastrService.error("Please resubmit the form.", "Error", {
      timeOut: 5000,
      positionClass: "toast-center-center",
      tapToDismiss: true,
      onActivateTick: true
    });
  }
}
