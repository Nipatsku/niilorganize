import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Meeting } from './meeting.service';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VoteService {
  constructor(private http: HttpClient) {}

  async getMeeting(inviteToken: string): Promise<Meeting> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', inviteToken);
    return new Promise((resolve) => {
      this.http.get('/api/vote', { headers }).subscribe((response) => {
        resolve(response as Meeting);
      });
    });
  }

  reportAvailability(
    inviteToken: string,
    voterUuid: string,
    timestamps: Array<{ time: number; selection: boolean }>
  ) {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', inviteToken);
    this.http
      .post('/api/vote', { voterUuid, timestamps }, { headers, responseType: 'text' })
      .subscribe((r) => {
        console.log(r)
      });
  }
}
