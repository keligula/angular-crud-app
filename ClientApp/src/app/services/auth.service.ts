import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { filter } from "rxjs/operators";
import * as auth0 from "auth0-js";

(window as any).global = window;

@Injectable()
export class AuthService {
  requestedScopes: string = "openid profile read:messages write:messages";

  auth0 = new auth0.WebAuth({
    clientID: "19yD4i0WGP1W7b1Pi7u06wWK8rf5g03F",
    domain: "cargoproject.auth0.com",
    responseType: "token id_token",
    audience: "https://cargoproject.auth0.com/userinfo",
    redirectUri: "https://localhost:5001/callback",
    scope: this.requestedScopes
  });
  userProfile: any;

  constructor(public router: Router) {}

  public login(): void {
    this.auth0.authorize();
  }

  public handleAuthentication(): void {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        window.location.hash = "";
        this.setSession(authResult);
        this.router.navigate(["/vehicles"]);
      } else if (err) {
        this.router.navigate(["/vehicles"]);
        console.log(err);
      }
    });
  }

  private setSession(authResult): void {
    // Set the time that the Access Token will expire at
    const expiresAt = JSON.stringify(
      authResult.expiresIn * 1000 + new Date().getTime()
    );
    const scopes = authResult.scope || this.requestedScopes || "";

    localStorage.setItem("access_token", authResult.accessToken);
    localStorage.setItem("id_token", authResult.idToken);
    localStorage.setItem("expires_at", expiresAt);
    localStorage.setItem("scopes", JSON.stringify(scopes));
  }

  public userHasScopes(scopes: Array<string>): boolean {
    const grantedScopes = JSON.parse(localStorage.getItem("scopes")).split(" ");
    return scopes.every(scope => grantedScopes.includes(scope));
  }

  public logout(): void {
    // Remove tokens and expiry time from localStorage
    localStorage.removeItem("access_token");
    localStorage.removeItem("id_token");
    localStorage.removeItem("expires_at");
    // Go back to the home route
    this.router.navigate(["/home"]);
  }

  public isAuthenticated(): boolean {
    // Check whether the current time is past the
    // Access Token's expiry time
    const expiresAt = JSON.parse(localStorage.getItem("expires_at") || "{}");
    return new Date().getTime() < expiresAt;
  }

  public getProfile(cb): void {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      throw new Error("Access Token must exist to fetch profile");
    }

    const self = this;
    this.auth0.client.userInfo(accessToken, (err, profile) => {
      if (profile) {
        self.userProfile = profile;
      }
      cb(err, profile);
    });
  }
}
