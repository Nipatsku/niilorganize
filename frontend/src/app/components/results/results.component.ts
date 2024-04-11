import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Meeting, MeetingService } from '../../services/meeting.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './results.component.html',
  styleUrl: './results.component.css',
})
export class ResultsComponent implements OnInit {
  dates: Date[] = [];
  meeting?: Meeting;
  hours: number[] = Array.from({ length: 15 }, (_, i) => i + 8); // Hours from 8 AM to 10 PM

  constructor(
    private route: ActivatedRoute,
    private meetingService: MeetingService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.meetingService.getMeetings().then((allMeetings) => {
      this.meeting = allMeetings.find((item) => item._id === id);
      if (!this.meeting) return;
      let date = new Date(
        this.meeting.startDate.year,
        this.meeting.startDate.month - 1,
        this.meeting.startDate.day
      );
      date.setHours(0, 0, 0, 0);
      const endDate = new Date(
        this.meeting.endDate.year,
        this.meeting.endDate.month - 1,
        this.meeting.endDate.day
      );
      this.dates = [];
      while (date.getTime() <= endDate.getTime()) {
        this.dates.push(new Date(date.getTime()));
        date.setDate(date.getDate() + 1);
      }
      requestAnimationFrame(() => this.applyColorRules());
    });
  }

  applyColorRules(): void {
    const headers = Array.from(
      document.getElementsByClassName('header-row')[0].children
    );
    const rows = Array.from(document.getElementsByClassName('hour-row'));
    const meeting = this.meeting;
    if (!meeting) return;
    rows.forEach((row, iRow) => {
      const hour = Number(row.children[0].innerHTML);
      Array.from(row.children).forEach((cell, iCell) => {
        if (iCell === 0) return;
        const header = headers[iCell];
        const dayTime = Number(header.getAttribute('data-time'));
        const date = new Date(dayTime);
        date.setHours(hour);
        //
        let countConfirmedOK = 0;
        // let countConfirmedNotOK = 0
        // let countUnconfirmed = 0;
        meeting.availabilities.forEach((voter) => {
          const match = voter.timestamps.find(
            (item) => item.time === date.getTime()
          );
          if (match && match.selection === true) countConfirmedOK += 1;
        });
        //
        const joinRate = 100 * countConfirmedOK / meeting.inviteCount;
        const color = interpolateColor('#FF0000', '#00FF00', joinRate)
        ;(cell as HTMLDivElement).style.backgroundColor = color
      });
    });
  }
}

function interpolateColor(color1: string, color2: string, percent: number) {
  if (percent < 0) percent = 0;
  if (percent > 100) percent = 100;

  // Convert hexadecimal color codes to RGB values
  const r1 = parseInt(color1.substring(1, 3), 16);
  const g1 = parseInt(color1.substring(3, 5), 16);
  const b1 = parseInt(color1.substring(5, 7), 16);

  const r2 = parseInt(color2.substring(1, 3), 16);
  const g2 = parseInt(color2.substring(3, 5), 16);
  const b2 = parseInt(color2.substring(5, 7), 16);

  // Calculate the interpolated RGB values
  const r = Math.round(r1 + (r2 - r1) * (percent / 100));
  const g = Math.round(g1 + (g2 - g1) * (percent / 100));
  const b = Math.round(b1 + (b2 - b1) * (percent / 100));

  // Convert the interpolated RGB values back to hexadecimal format
  const interpolatedColor =
    '#' + (r * 65536 + g * 256 + b).toString(16).padStart(6, '0');

  return interpolatedColor;
}
