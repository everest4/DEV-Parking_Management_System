import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { ParkingService } from '../../services/parking.service';
import { ParkingSpot } from '../../models/parking-spot.model';

@Component({
  standalone: true,
  selector: 'app-parking-spots-page',
  imports: [MatTableModule],
  templateUrl: './parking-spots.html',
  styleUrls: ['./parking-spots.scss'],
})
export class ParkingSpotsPage {
  displayedColumns = ['number', 'status', 'vehicleId'];
  data: ParkingSpot[] = [];

  constructor(private parkingService: ParkingService) {
    this.parkingService.getAll().subscribe((res: ParkingSpot[]) => {
      this.data = res;
    });
  }
}
