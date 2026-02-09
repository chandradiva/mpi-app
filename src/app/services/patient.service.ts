import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponseDto, PaginatedResponse } from '../models/pagination';
import { Patient } from '../models/patient';

@Injectable({ providedIn: 'root' })
export class PatientService {
  private base = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getPatients(page = 0, size = 10, sortBy = 'id', sortOrder = 'desc', keyword = '', status = ''): Observable<ApiResponseDto<PaginatedResponse<Patient>>> {
    let params = new HttpParams()
      .set('page', String(page))
      .set('size', String(size))
      .set('sortBy', sortBy)
      .set('sortOrder', sortOrder)
      .set('keyword', keyword)
      .set('status', status);

    const url = `${this.base}/patients`;
    return this.http.get<ApiResponseDto<PaginatedResponse<Patient>>>(url, { params });
  }

  processPatient(payload: any): Observable<any> {
    const url = `${this.base}/patients/process`;
    return this.http.post<any>(url, payload);
  }

  getSourceSystems(): Observable<ApiResponseDto<any[]>> {
    const url = `${this.base}/source-systems`;
    return this.http.get<ApiResponseDto<any[]>>(url);
  }
}
