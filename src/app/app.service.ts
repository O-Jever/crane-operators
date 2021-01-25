import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Shift } from './shift.interface';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private http: HttpClient) { }

  getListOfShifts(): Observable<Shift[]> {
    return this.http.get<Shift[]>(`${environment.apiPath}/shifts`);
  }

  addShift(shift: Shift): Observable<Shift> {
    return this.http.post<Shift>(`${environment.apiPath}/shifts/`, shift);
  }

  editShift(id: number, shift: Shift): Observable<Shift> {
    return this.http.patch<Shift>(`${environment.apiPath}/shifts/${id}`, shift);
  }

  deleteShift(id: number): Observable<Shift>  {
    return this.http.delete<Shift>(`${environment.apiPath}/shifts/${id}`);
  }
}
