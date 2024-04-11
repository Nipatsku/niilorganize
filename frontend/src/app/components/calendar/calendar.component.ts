import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css',
})
export class CalendarComponent implements AfterViewInit {
  @Input() dates: Date[] = [];
  @Input() timestamps: Array<{ time: number; selection: boolean }> = [];
  hours: number[] = Array.from({ length: 15 }, (_, i) => i + 8); // Hours from 8 AM to 10 PM

  @Output() handleSave: EventEmitter<
    Array<{ time: number; selection: boolean }>
  > = new EventEmitter();

  private mouseDown = false;
  private curGestureToggledCells: { header: Element; row: Element }[] = [];
  private curGestureMode?: boolean;
  private subSave?: any;

  ngAfterViewInit(): void {
    this.applyColoringRules();
  }

  applyColoringRules() {
    const headers = Array.from(
      document.getElementsByClassName('header-row')[0].children
    );
    const rows = Array.from(document.getElementsByClassName('hour-row'));
    rows.forEach((row, iRow) => {
      const hour = Number(row.children[0].innerHTML);
      Array.from(row.children).forEach((cell, iCell) => {
        if (iCell === 0) return;
        const header = headers[iCell];
        const dayTime = Number(header.getAttribute('data-time'));
        const date = new Date(dayTime);
        date.setHours(hour);
        const entry = this.timestamps.find(
          (item) => item.time === date.getTime()
        );
        if (entry)
          (cell as HTMLDivElement).style.backgroundColor = entry.selection
            ? 'green'
            : '';
      });
    });
  }

  onMouseDown(event: MouseEvent) {
    this.mouseDown = true;
    this.curGestureToggledCells = [];
    this.curGestureMode = undefined;
    this.onMouseMove(event)
  }

  onMouseMove(event: MouseEvent) {
    if (!this.mouseDown) return;
    const headers = Array.from(
      document.getElementsByClassName('header-row')[0].children
    );
    const rows = Array.from(document.getElementsByClassName('hour-row'));
    const row = rows.find((row) => {
      const bounds = row.getBoundingClientRect();
      return event.clientY >= bounds.top && event.clientY <= bounds.bottom;
    });
    const header = headers.find((header) => {
      const bounds = header.getBoundingClientRect();
      return event.clientX >= bounds.left && event.clientX <= bounds.right;
    });
    //
    if (!row || !header) return;
    try {
      const hour = Number(row.children[0].innerHTML);
      const dayTime = Number(header.getAttribute('data-time'));
      if (
        this.curGestureToggledCells.find(
          (item) => item.header === header && item.row === row
        )
      )
        return;

      this.curGestureToggledCells.push({ header, row });
      const iCol = headers.indexOf(header);
      if (iCol === 0) return;
      const date = new Date(dayTime);
      date.setHours(hour);
      //
      let entry = this.timestamps.find((item) => item.time === date.getTime());
      if (this.curGestureMode === undefined) {
        this.curGestureMode = entry ? !entry.selection : true;
      }
      if (!entry) {
        entry = { time: date.getTime(), selection: this.curGestureMode };
        this.timestamps.push(entry);
      } else {
        entry.selection = this.curGestureMode;
      }
      this.applyColoringRules();
      if (this.subSave) clearTimeout(this.subSave);
      this.subSave = setTimeout(() => this.save(), 2000);
    } catch (e) {
      console.log(e);
    }
  }

  onMouseUp(event: MouseEvent) {
    this.mouseDown = false;
  }

  save() {
    this.handleSave.emit(this.timestamps);
  }
}
