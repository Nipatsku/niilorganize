import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Meeting } from '../../services/meeting.service';
import { CalendarComponent } from '../calendar/calendar.component';
import { VoteService } from '../../services/vote.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vote',
  standalone: true,
  imports: [CalendarComponent, CommonModule],
  templateUrl: './vote.component.html',
  styleUrl: './vote.component.css',
})
export class VoteComponent {
  meeting?: Meeting;
  uuid?: string;
  inviteToken?: string;
  dates: Date[] = [];
  timestamps: Array<{ time: number; selection: boolean }> = [];
  hasVoted: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private voteService: VoteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    let uuid = localStorage.getItem('vote-uuid');
    if (!uuid) {
      uuid = `${Math.round(Math.random() * 1_000_000_000_000_000)}`;
      localStorage.setItem('vote-uuid', uuid);
    }
    this.uuid = uuid;

    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    this.inviteToken = id;
    this.voteService.getMeeting(this.inviteToken).then((meeting) => {
      this.meeting = meeting;
      let date = new Date(
        meeting.startDate.year,
        meeting.startDate.month - 1,
        meeting.startDate.day
      );
      date.setHours(0, 0, 0, 0);
      const endDate = new Date(
        meeting.endDate.year,
        meeting.endDate.month - 1,
        meeting.endDate.day
      );
      this.dates = [];
      while (date.getTime() <= endDate.getTime()) {
        this.dates.push(new Date(date.getTime()));
        date.setDate(date.getDate() + 1);
      }

      const savedTimestamps = localStorage.getItem(meeting._id);
      if (savedTimestamps) {
        this.hasVoted = true;
        this.timestamps = JSON.parse(savedTimestamps);
      }
    });
  }

  handleCalendarSave(timestamps: Array<{ time: number; selection: boolean }>) {
    if (!this.meeting || !this.uuid || !this.inviteToken) return;
    if (!this.hasVoted) {
      setTimeout(() => {
        this.reloadCurrentRoute()
      }, 1000)
    }
    this.hasVoted = true;
    this.timestamps = timestamps;
    localStorage.setItem(this.meeting._id, JSON.stringify(this.timestamps));
    this.voteService.reportAvailability(
      this.inviteToken,
      this.uuid,
      this.timestamps
    );
  }
  reloadCurrentRoute() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }
}
