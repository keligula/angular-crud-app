import { Injectable } from "@angular/core";
import { Router, CanActivate, ActivatedRouteSnapshot } from "@angular/router";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(private auth: AuthService, public router: Router) {}

  canActivate() {
    if (this.auth.isAuthenticated()) {
      if (this.auth.isInRole("Admin")) return true;

      this.router.navigateByUrl("");
      return false;
    }

    this.auth.login();
    return false;
  }
}
