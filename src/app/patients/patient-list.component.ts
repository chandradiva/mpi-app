import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PatientService } from '../services/patient.service';
import { Patient } from '../models/patient';
import { SourceSystem } from '../models/source-system';

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.css']
})
export class PatientListComponent implements OnInit {
  patients = signal<Patient[]>([]);
  page = signal(0);
  size = signal(10);
  totalPages = signal(0);
  totalElements = signal(0);
  showModal = signal(false);
  submitting = signal(false);
  sourceSystems = signal<SourceSystem[]>([]);
  keyword: string = '';

  newPatient: any = {
    firstName: '',
    lastName: '',
    dob: '',
    gender: 'MALE',
    phoneNo: '',
    email: '',
    address: '',
    suburb: '',
    state: '',
    postalCode: '',
    country: '',
    sourceSystemId: '',
    externalPatientId: '',
    identifiers: [
      { type: 'Email', value: '', issuingAuthority: '', verified: false }
    ]
  };

  constructor(private svc: PatientService) {}

  ngOnInit(): void {
    this.load();
    this.loadSourceSystems();
  }

  loadSourceSystems(): void {
    this.svc.getSourceSystems().subscribe(resp => {
      this.sourceSystems.set(resp?.data || []);
    });
  }

  openModal(): void {
    this.newPatient = {
      firstName: '',
      lastName: '',
      dob: '',
      gender: 'MALE',
      phoneNo: '',
      email: '',
      address: '',
      suburb: '',
      state: '',
      postalCode: '',
      country: '',
      sourceSystemId: '',
      externalPatientId: '',
      identifiers: [{ type: 'Email', value: '', issuingAuthority: '', verified: false }]
    };
    this.showModal.set(true);
  }

  onSearch(): void {
    this.page.set(0);
    this.load();
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  addIdentifier(): void {
    if (!this.newPatient.identifiers) {
      this.newPatient.identifiers = [];
    }
    this.newPatient.identifiers.push({ type: 'Email', value: '', issuingAuthority: '', verified: false });
  }

  removeIdentifier(index: number): void {
    if (!this.newPatient.identifiers) { return; }
    if (this.newPatient.identifiers.length > 1) {
      this.newPatient.identifiers.splice(index, 1);
    } else {
      this.newPatient.identifiers = [{ type: 'Email', value: '', issuingAuthority: '', verified: false }];
    }
  }

  submit(): void {
    if (this.submitting()) {
      return;
    }
    this.submitting.set(true);
    const payload = JSON.parse(JSON.stringify(this.newPatient));
    payload.dob = this.formatDob(payload.dob);

    if (payload.id) {
      const id = payload.id;
      this.svc.updatePatient(id, payload).subscribe({
        next: () => {
          this.submitting.set(false);
          this.closeModal();
          this.load();
        },
        error: () => {
          this.submitting.set(false);
        }
      });
    } else {
      this.svc.processPatient(payload).subscribe({
        next: () => {
          this.submitting.set(false);
          this.closeModal();
          this.load();
        },
        error: () => {
          this.submitting.set(false);
        }
      });
    }
  }

  parseDobToInput(dob: string): string {
    if (!dob) { return '' }
    if (dob.includes('/')) {
      const parts = dob.split('/');
      if (parts.length === 3) {
        const [d, m, y] = parts;
        return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
      }
    }
    return dob;
  }

  formatDob(dob: string): string {
    if (!dob) { return dob; }
    if (dob.includes('-')) {
      const parts = dob.split('-');
      if (parts.length === 3) {
        const [y, m, d] = parts;
        return `${d}/${m}/${y}`;
      }
    }
    return dob;
  }

  load(): void {
    this.svc.getPatients(this.page(), this.size(), 'id', 'desc', this.keyword || '').subscribe(resp => {
      this.patients.set(resp.data.entries);
      this.totalPages.set(resp.data.paginationInfo.totalPages);
      this.totalElements.set(resp.data.paginationInfo.totalElements);
    });
  }

  next(): void {
    if (this.page() + 1 < this.totalPages()) {
      this.page.set(this.page() + 1);
      this.load();
    }
  }

  prev(): void {
    if (this.page() > 0) {
      this.page.set(this.page() - 1);
      this.load();
    }
  }

  deletePatient(id: string): void {
    if (!confirm('Are you sure you want to delete this patient?')) { return; }
    this.svc.deletePatient(id).subscribe({
      next: () => this.load(),
      error: () => alert('Failed to delete patient')
    });
  }

  editPatient(p: Patient): void {
    if (!p?.id) { return; }
    this.svc.getPatient(p.id).subscribe(resp => {
      const data: any = resp?.data || {};
      // reuse existing newPatient shape, map fields
      this.newPatient = {
        id: data.id,
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        dob: this.parseDobToInput(data.dob || ''),
        gender: (data.gender || 'MALE').toUpperCase(),
        phoneNo: data.phoneNo || '',
        email: data.email || '',
        address: data.address || '',
        suburb: data.suburb || '',
        state: data.state || '',
        postalCode: data.postalCode || '',
        country: data.country || '',
        sourceSystemId: data.systemId || '',
        externalPatientId: data.externalPatientId || '',
        identifiers: (data.identifiers && data.identifiers.length) ? data.identifiers : [{ type: 'Email', value: '', issuingAuthority: '', verified: false }]
      };
      this.showModal.set(true);
    }, () => {
      alert('Failed to load patient details');
    });
  }
}
