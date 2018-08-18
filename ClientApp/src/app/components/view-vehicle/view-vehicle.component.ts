import {
  BrowserXhrWithProgress,
  ProgressService
} from "../../services/progress.service";
import { BrowserXhr } from "@angular/http";
import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  NgZone
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { VehicleService } from "../../services/vehicle.service";
import { PhotoService } from "./../../services/photo.service";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-view-vehicle",
  templateUrl: "./view-vehicle.component.html",
  providers: [
    { provide: BrowserXhr, useClass: BrowserXhrWithProgress },
    ProgressService
  ]
})
export class ViewVehicleComponent implements OnInit {
  @ViewChild("fileInput") fileInput: ElementRef;
  vehicle: any;
  vehicleId: number;
  tabName: string = "vehicle";
  photos: any[];
  progress: any;

  constructor(
    private zone: NgZone,
    private route: ActivatedRoute,
    private router: Router,
    private photoService: PhotoService,
    private vehicleService: VehicleService,
    private toastrService: ToastrService,
    private progressService: ProgressService,
    private auth: AuthService
  ) {
    route.params.subscribe(p => {
      this.vehicleId = +p["id"];
      if (isNaN(this.vehicleId) || this.vehicleId <= 0) {
        router.navigate(["/vehicles"]);
        return;
      }
    });
  }

  ngOnInit() {
    this.photoService
      .getPhotos(this.vehicleId)
      .subscribe(photos => (this.photos = photos));

    this.vehicleService.getVehicle(this.vehicleId).subscribe(
      v => (this.vehicle = v),
      err => {
        if (err.status == 404) {
          this.router.navigate(["/vehicles"]);
          return;
        }
      }
    );
  }

  onNavClick(tabName) {
    this.tabName = tabName;
  }

  delete() {
    if (confirm("Are you sure you want to delete this vehicle?")) {
      this.vehicleService.delete(this.vehicle.id).subscribe(x => {
        this.router.navigate(["/vehicles"]);
      });
    }
  }

  uploadPhoto() {
    this.progressService.startTracking().subscribe(
      progress => {
        console.log(progress);
        this.zone.run(() => {
          this.progress = progress;
        });
      },
      null,
      () => {
        this.progress = null;
      }
    );

    var nativeElement: HTMLInputElement = this.fileInput.nativeElement;
    var file = nativeElement.files[0];

    this.photoService.upload(this.vehicleId, file).subscribe(
      photo => {
        this.photos.push(photo);
      },
      err => {
        this.toastrService.error("Invalid file type.", "Error", {
          timeOut: 5000,
          positionClass: "toast-center-center",
          tapToDismiss: true,
          onActivateTick: true
        });
      },
      () => {
        nativeElement.value = "";
      }
    );
  }
}
