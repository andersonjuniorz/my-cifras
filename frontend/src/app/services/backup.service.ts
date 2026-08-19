import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BackupService {
  private readonly api = `${environment.apiUrl}/api/backup`;
  private readonly http = inject(HttpClient);

  backup(): Observable<Blob> {
    return this.http.get(this.api, { responseType: 'blob' });
  }
}
