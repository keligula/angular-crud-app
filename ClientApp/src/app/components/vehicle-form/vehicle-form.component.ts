import * as _ from "underscore";
import { Component, OnInit } from "@angular/core";
import { VehicleService } from "../../services/vehicle.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/forkJoin";
import { SaveVehicle, Vehicle } from "../../models/vehicle";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-vehicle-form",
  templateUrl: "./vehicle-form.component.html",
  styleUrls: ["./vehicle-form.component.css"]
})
export class VehicleFormComponent implements OnInit {
  makes: any[];
  models: any[];
  features: any[];
  vehicle: SaveVehicle = {
    id: 0,
    makeId: 0,
    modelId: 0,
    isRegistered: false,
    features: [],
    contact: {
      name: "",
      email: "",
      phone: ""
    }
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vehicleService: VehicleService,
    private toastrService: ToastrService
  ) {
    route.params.subscribe(p => {
      this.vehicle.id = +p["id"] || 0;
    });
  }

  ngOnInit() {
    var sources = [
      this.vehicleService.getMakes(),
      this.vehicleService.getFeatures()
    ];

    if (this.vehicle.id)
      sources.push(this.vehicleService.getVehicle(this.vehicle.id));

    Observable.forkJoin(sources).subscribe(
      data => {
        this.makes = data[0];
        this.features = data[1];

        if (this.vehicle.id) {
          this.setVehicle(data[2]);
          this.populateModels();
        }
      },
      err => {
        if (err.status == 404) this.router.navigate(["/"]);
      }
    );
  }

  private setVehicle(v: Vehicle) {
    this.vehicle.id = v.id;
    this.vehicle.makeId = v.make.id;
    this.vehicle.modelId = v.model.id;
    this.vehicle.isRegistered = v.isRegistered;
    this.vehicle.contact = v.contact;
    this.vehicle.features = _.pluck(v.features, "id");
  }

  onMakeChange() {
    this.populateModels();
    delete this.vehicle.modelId;
  }

  private populateModels() {
    var selectedMake = this.makes.find(m => m.id == this.vehicle.makeId);
    this.models = selectedMake ? selectedMake.models : [];
  }

  onFeatureToggle(featureId, $event) {
    if ($event.target.checked) this.vehicle.features.push(featureId);
    else {
      var index = this.vehicle.features.indexOf(featureId);
      this.vehicle.features.splice(index, 1);
    }
  }

  submit() {
    if (this.vehicle.id) {
      this.vehicleService.update(this.vehicle).subscribe(x => {
        this.toastrService.success(
          "Your vehicle has been updated!",
          "Success",
          {
            timeOut: 5000,
            positionClass: "toast-center-center",
            tapToDismiss: true,
            onActivateTick: true
          }
        );
      });
    } else {
      this.vehicleService.create(this.vehicle).subscribe(x => console.log(x));
    }
  }

  delete() {
    if (confirm("Are you sure you want to delete this vehicle?")) {
      this.vehicleService.delete(this.vehicle.id).subscribe(x => {
        this.router.navigate(["/"]);
      });
    }
  }
}
