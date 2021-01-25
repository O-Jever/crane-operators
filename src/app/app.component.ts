import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AppService } from './app.service';
import { ShiftFormDialog } from './shift-form.component';
import { Shift } from './shift.interface';
import * as moment from 'moment'; 

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  
  public displayedColumns: string[] = ['fullName', 'start', 'end', 'craneCount', 'cranes', 'actions'];
  public dataSource: MatTableDataSource<any>;

  constructor(private appService: AppService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getShifts();
  }

  getShifts(): void {
    this.appService.getListOfShifts().subscribe(data => {
      this.dataSource = new MatTableDataSource<Shift>(data);
    });
  }

  formatDate(date) {
    return moment(date).format('DD.MM.YY H-mm');
  }

  getTotalLoaded(cranes) {
    let result = 0;

    for (const crane of cranes) {
      for (const { loaded } of crane) {
        result += +loaded;
      }
    }

    return result || null;
  }

  public addShift(): void {
    const dialogRef = this.openDialog({title: 'Добавление',  isChange: false}, ShiftFormDialog);
    this.afterClosed(dialogRef);
  }

  public editShift(shift: Shift) {
    const dialogRef = this.openDialog({shift, title: 'Редактирование', isChange: true}, ShiftFormDialog);
    this.afterClosed(dialogRef);
  }

  public deleteShift(id: number) {
    this.appService.deleteShift(id).subscribe(() => {
      this.getShifts();
    });
  }

  private openDialog(data, dialog) {
    return this.dialog.open(dialog, {
      width: '650px',
      data: data
    });
  }

  private afterClosed(dialogRef) {
    dialogRef.afterClosed()
    .subscribe(() => {
      this.getShifts();
    });
  }

}
