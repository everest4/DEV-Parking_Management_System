import { Injectable } from '@angular/core';

export interface ParkingSpace {
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class ParkingService {

  private parkingSpaces: ParkingSpace[] = [];

  getSpaces() {
    return this.parkingSpaces;
  }

  addSpace(name: string): { success: boolean; message: string } {
    const exists = this.parkingSpaces.some(
      p => p.name.toLowerCase() === name.toLowerCase()
    );

    if (exists) {
      return { success: false, message: 'This parking space already exists.' };
    }

    this.parkingSpaces.push({ name });
    return { success: true, message: 'Parking space added.' };
  }
}
