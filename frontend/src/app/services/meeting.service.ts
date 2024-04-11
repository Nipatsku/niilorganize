import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

// TODO: In new meetign view, shouldn't be a week calenmdar...
// we should show a month calendar, where user can select range (start day, end day), that's it
// but this component would be used in VOTE view

export interface Meeting {
  _id: string;
  organizer: string;
  name: string;
  startDate: { year: number; month: number; day: number };
  endDate: { year: number; month: number; day: number };
  inviteCount: number;
  invite: string;
  availabilities: Array<{
    voterUuid: string;
    timestamps: Array<{ time: number; selection: boolean }>;
  }>;
}

@Injectable({
  providedIn: 'root',
})
export class MeetingService {
  constructor(private http: HttpClient, private auth: AuthService) {}

  async getMeetings(): Promise<Meeting[]> {
    let headers = new HttpHeaders();
    headers = this.auth.useAuth(headers);
    headers = headers.append('Content-Type', 'application/json');
    return new Promise((resolve) => {
      this.http.get('/api/meeting', { headers }).subscribe((response) => {
        resolve(response as Meeting[]);
      });
    });
  }

  async createMeeting(data: {
    name: string;
    startDate: { year: number; month: number; day: number };
    endDate: { year: number; month: number; day: number };
    inviteCount: number;
  }): Promise<Meeting> {
    let headers = new HttpHeaders();
    headers = this.auth.useAuth(headers);
    headers = headers.append('Content-Type', 'application/json');
    return new Promise((resolve) => {
      this.http
        .post('/api/meeting', data, { headers })
        .subscribe((response) => {
          const meeting = response as Meeting;
          resolve(meeting);
        });
    });
  }

  async deleteMeeting(meetingId: string) {
    let headers = new HttpHeaders();
    headers = this.auth.useAuth(headers);
    headers = headers.append('Content-Type', 'application/json');
    return new Promise<void>((resolve) => {
      this.http
        .delete('/api/meeting', { body: { meetingId }, headers, responseType: 'text' })
        .subscribe(() => {
          resolve();
        });
    });
  }
}
