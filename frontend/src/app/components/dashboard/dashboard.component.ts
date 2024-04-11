import { Component, OnInit } from '@angular/core';
import { Meeting, MeetingService } from '../../services/meeting.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  meetings: Meeting[] = [];

  constructor(private meetingService: MeetingService, private router: Router) {}

  ngOnInit(): void {
    this.meetingService.getMeetings().then((meetings) => {
      this.meetings = meetings;
    });
  }

  arrangeNewMeeting() {
    this.router.navigate(['/organize']);
  }

  closeMeeting(event: Event) {
    const meetingId = (event.target as HTMLButtonElement).getAttribute(
      'data-meetingId'
    );
    if (!meetingId) return
    this.meetingService.deleteMeeting(meetingId).then(() => {
      this.reloadCurrentRoute()
    });
    event.preventDefault();
    event.stopPropagation();
  }
  reloadCurrentRoute() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }
}
