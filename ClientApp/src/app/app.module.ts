import * as Raven from "raven-js";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { HttpModule, BrowserXhr } from "@angular/http";
import { NgModule, ErrorHandler } from "@angular/core";
import { RouterModule } from "@angular/router";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ToastrModule } from "ngx-toastr";

import { AppComponent } from "./app.component";
import { CounterComponent } from "./components/counter/counter.component";
import { FetchDataComponent } from "./components/fetch-data/fetch-data.component";
import { HomeComponent } from "./components/home/home.component";
import { NavMenuComponent } from "./components/nav-menu/nav-menu.component";
import { VehicleFormComponent } from "./components/vehicle-form/vehicle-form.component";
import { VehicleListComponent } from "./components/vehicle-list/vehicle-list.component";
import { ViewVehicleComponent } from "./components/view-vehicle/view-vehicle.component";
import { PaginationComponent } from "./components/shared/pagination.component";

import { PhotoService } from "./services/photo.service";
import { VehicleService } from "./services/vehicle.service";
import { AppErrorHandler } from "./app.error-handler";
import {
  BrowserXhrWithProgress,
  ProgressService
} from "./services/progress.service";
import { AuthService } from "./services/auth.service";
import { AuthGuardService } from "./services/auth-guard.service";

Raven.config(
  "https://3a076fd13a50424aa436b3bafbfbe21c@sentry.io/1244999"
).install();

@NgModule({
  declarations: [
    AppComponent,
    CounterComponent,
    FetchDataComponent,
    HomeComponent,
    NavMenuComponent,
    VehicleFormComponent,
    VehicleListComponent,
    ViewVehicleComponent,
    PaginationComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: "ng-cli-universal" }),
    FormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    HttpClientModule,
    HttpModule,
    RouterModule.forRoot([
      { path: "", redirectTo: "vehicles", pathMatch: "full" },
      { path: "vehicles/new", component: VehicleFormComponent },
      { path: "vehicles/edit/:id", component: VehicleFormComponent },
      { path: "vehicles/:id", component: ViewVehicleComponent },
      { path: "vehicles", component: VehicleListComponent },
      { path: "home", component: HomeComponent },
      { path: "counter", component: CounterComponent },
      { path: "fetch-data", component: FetchDataComponent },
      { path: "**", redirectTo: "home" }
    ])
  ],
  providers: [
    { provide: ErrorHandler, useClass: AppErrorHandler },
    { provide: BrowserXhr, useClass: BrowserXhrWithProgress },
    AuthService,
    AuthGuardService,
    PhotoService,
    ProgressService,
    VehicleService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
