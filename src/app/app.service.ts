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
}
