import { JwtHelper } from "angular2-jwt";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { filter } from "rxjs/operators";
import * as auth0 from "auth0-js";

(window as any).global = window;

@Injectable()
export class AuthService {
  requestedScopes: string = "openid email profile";

  auth0 = new auth0.WebAuth({
    clientID: "19yD4i0WGP1W7b1Pi7u06wWK8rf5g03F",
    domain: "cargoproject.auth0.com",
    responseType: "token",
    audience: "https://api.cargo.com",
    redirectUri: "https://localhost:5001/callback",
    scope: this.requestedScopes
  });
  profile: any;
  private roles: string[] = [];

  constructor(public router: Router) {
    this.handleAuthentication();
    this.readUserFromLocalStorage();
  }

  private readUserFromLocalStorage() {
    this.profile = JSON.parse(localStorage.getItem("profile"));

    var token = localStorage.getItem("token");
    if (token) {
      var jwtHelper = new JwtHelper();
      var decodedToken = jwtHelper.decodeToken(token);
      this.roles = decodedToken["https://cargo.com/roles"] || [];
    }
  }

  public login(): void {
    this.auth0.authorize();
  }

  public isInRole(roleName) {
    return this.roles.indexOf(roleName) > -1;
  }

  public handleAuthentication(): void {
    this.auth0.parseHash(
      { hash: window.location.hash, _idTokenVerification: false },
      (err, authResult) => {
        if (authResult && authResult.accessToken) {
          window.location.hash = "";
          this.setSession(authResult);
          this.router.navigate(["/vehicles"]);
        } else if (err) {
          this.router.navigate(["/home"]);
          console.log(err);
        }
      }
    );
  }

  private setSession(authResult): void {
    // Set the time that the Access Token will expire at
    const expiresAt = JSON.stringify(
      authResult.expiresIn * 1000 + new Date().getTime()
    );
    const scopes = authResult.scope || this.requestedScopes || "";
    const profile = authResult.accessToken.profile || this.profile || "";

    localStorage.setItem("token", authResult.accessToken);
    localStorage.setItem("expires_at", expiresAt);
    localStorage.setItem("scopes", JSON.stringify(scopes));
    localStorage.setItem("profile", JSON.stringify(profile));

    this.readUserFromLocalStorage();
  }

  public logout(): void {
    // Remove tokens and expiry time from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("expires_at");
    localStorage.removeItem("scopes");
    localStorage.removeItem("profile");
    this.profile = null;
    this.roles = [];
    // Go back to the home route
    this.router.navigate(["/home"]);
  }

  public isAuthenticated(): boolean {
    // Check whether the current time is past the
    // Access Token's expiry time
    const expiresAt = JSON.parse(localStorage.getItem("expires_at") || "{}");
    return new Date().getTime() < expiresAt;
  }
}
