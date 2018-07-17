import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { HttpModule } from "@angular/http";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ToastrModule } from "ngx-toastr";

import { AppComponent } from "./app.component";
import { CounterComponent } from "./components/counter/counter.component";
import { FetchDataComponent } from "./components/fetch-data/fetch-data.component";
import { HomeComponent } from "./components/home/home.component";
import { NavMenuComponent } from "./components/nav-menu/nav-menu.component";
import { VehicleFormComponent } from "./components/vehicle-form/vehicle-form.component";

import { VehicleService } from "./services/vehicle.service";

@NgModule({
  declarations: [
    AppComponent,
    CounterComponent,
    FetchDataComponent,
    HomeComponent,
    NavMenuComponent,
    VehicleFormComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: "ng-cli-universal" }),
    FormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    HttpClientModule,
    HttpModule,
    RouterModule.forRoot([
      { path: "", component: HomeComponent, pathMatch: "full" },
      { path: "vehicles/new", component: VehicleFormComponent },
      { path: "counter", component: CounterComponent },
      { path: "fetch-data", component: FetchDataComponent }
    ])
  ],
  providers: [VehicleService],
  bootstrap: [AppComponent]
})
export class AppModule {}
