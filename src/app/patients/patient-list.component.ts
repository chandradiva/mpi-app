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
      // resp.data expected to be an array of source systems
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
      // keep at least one empty identifier
      this.newPatient.identifiers = [{ type: 'Email', value: '', issuingAuthority: '', verified: false }];
    }
  }

  submit(): void {
    if (this.submitting()) {
      return;
    }
    this.submitting.set(true);
    // clone payload and normalise DOB to dd/mm/yyyy if browser date input provided yyyy-mm-dd
    const payload = JSON.parse(JSON.stringify(this.newPatient));
    payload.dob = this.formatDob(payload.dob);

    this.svc.processPatient(payload).subscribe({
      next: () => {
        this.submitting.set(false);
        this.closeModal();
        this.load();
      },
      error: () => {
        this.submitting.set(false);
        // Ideally show error feedback; for now just keep modal open
      }
    });
  }

  formatDob(dob: string): string {
    if (!dob) { return dob; }
    // if in yyyy-mm-dd (HTML date input) convert to dd/mm/yyyy
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
    this.svc.getPatients(this.page(), this.size()).subscribe(resp => {
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
}
