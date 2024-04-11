import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NgbCalendar,
  NgbDate,
  NgbDatepickerModule,
} from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MeetingService } from '../../services/meeting.service';

@Component({
  selector: 'app-organize',
  standalone: true,
  imports: [NgbDatepickerModule, FormsModule, ReactiveFormsModule],
  templateUrl: './organize.component.html',
  styleUrl: './organize.component.css',
})
export class OrganizeComponent {
  organizeForm = this.formBuilder.group({
    name: '',
    inviteCount: 2,
  });

  calendar = inject(NgbCalendar);

  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate = this.calendar.getToday();
  toDate: NgbDate | null = this.calendar.getNext(this.fromDate, 'd', 10);

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private meetingService: MeetingService
  ) {}

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isHovered(date: NgbDate) {
    return (
      this.fromDate &&
      !this.toDate &&
      this.hoveredDate &&
      date.after(this.fromDate) &&
      date.before(this.hoveredDate)
    );
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return (
      date.equals(this.fromDate) ||
      (this.toDate && date.equals(this.toDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }

  onSubmit() {
    const name = this.organizeForm.value.name;
    const inviteCount = Number(this.organizeForm.value.inviteCount);
    const startDate = this.fromDate;
    const endDate = this.toDate;
    if (!name || !inviteCount || !startDate || !endDate) return
    this.meetingService.createMeeting({
      name,
      inviteCount,
      startDate,
      endDate,
    })
    .then((meeting) => {
      this.router.navigate([`/results`, meeting._id])
    })
  }
}
