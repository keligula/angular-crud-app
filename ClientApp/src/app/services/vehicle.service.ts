import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import "rxjs/add/operator/map";
import { SaveVehicle } from "../models/vehicle";
import { AuthHttp } from "../../../node_modules/angular2-jwt";

@Injectable()
export class VehicleService {
  private readonly vehiclesEndpoint = "/api/vehicles";
  constructor(private http: Http, private authHttp: AuthHttp) {}

  getMakes() {
    return this.http.get("/api/makes").map(res => res.json());
  }

  getFeatures() {
    return this.http.get("/api/features").map(res => res.json());
  }

  create(vehicle) {
    return this.authHttp
      .post(this.vehiclesEndpoint, vehicle)
      .map(res => res.json());
  }

  getVehicle(id) {
    return this.http
      .get(this.vehiclesEndpoint + "/" + id)
      .map(res => res.json());
  }

  update(vehicle: SaveVehicle) {
    return this.authHttp
      .put(this.vehiclesEndpoint + "/" + vehicle.id, vehicle)
      .map(res => res.json());
  }

  delete(id) {
    return this.authHttp
      .delete(this.vehiclesEndpoint + "/" + id)
      .map(res => res.json());
  }

  getVehicles(filter) {
    return this.http
      .get(this.vehiclesEndpoint + "?" + this.toQueryString(filter))
      .map(res => res.json());
  }

  toQueryString(obj) {
    var parts = [];
    for (let property in obj) {
      let value = obj[property];
      if (value != null && value != undefined)
        parts.push(
          encodeURIComponent(property) + "=" + encodeURIComponent(value)
        );
    }

    return parts.join("&");
  }
}
