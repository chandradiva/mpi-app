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

  deletePatient(id: string): Observable<any> {
    const url = `${this.base}/patients`;
    const params = new HttpParams().set('id', id);
    return this.http.delete<any>(url, { params });
  }

  getSourceSystems(): Observable<ApiResponseDto<any[]>> {
    const url = `${this.base}/source-systems`;
    return this.http.get<ApiResponseDto<any[]>>(url);
  }

  getPatient(id: string): Observable<ApiResponseDto<Patient>> {
    const url = `${this.base}/patients/${id}`;
    return this.http.get<ApiResponseDto<Patient>>(url);
  }

  updatePatient(id: string, payload: any): Observable<any> {
    const url = `${this.base}/patients/${id}`;
    return this.http.put<any>(url, payload);
  }
}
