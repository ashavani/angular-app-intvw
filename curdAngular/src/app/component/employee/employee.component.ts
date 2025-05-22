import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddEmployeeComponent } from '../add-employee/add-employee.component';
import { Employee } from '../../model/Employee';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { EmployeeService } from '../../service/employee.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatDialogModule, MatTableModule,CommonModule],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css'
})
export class EmployeeComponent implements OnInit, OnDestroy {
  employeeList: Employee[] = [];
  dataSource!: MatTableDataSource<Employee>;
  displayedColumns:string[] = ['id', 'name', 'role', 'doj', 'salary', 'action'];
  subcription = new Subscription();

  constructor(private dialog: MatDialog,private empService:EmployeeService) { }

  ngOnInit(): void {
    this.GetallEmployee();
  }
  GetallEmployee(){
    let sub = this.empService.GetAll().subscribe(res =>{
      this.employeeList = res;
      this.dataSource =  new MatTableDataSource(this.employeeList);
    })
    this.subcription.add(sub);
  }
  addEmployee() {
   this.openpopup(0)
  }
    DeleteEmployee(empId: number) {
    if ( confirm('Are you sure?')) {
      let sub = this.empService.Delete(empId).subscribe(item => {
        this.GetallEmployee();
      })
      this.subcription.add(sub)
      // this.store.dispatch(deleteEmployee({ empId: empId }));
    }
  }

  EditEmployee(empId: number) {
     this.openpopup(empId);
  }
  openpopup(empid: number) {
  this.dialog.open(AddEmployeeComponent, {
    width: '50%',
    exitAnimationDuration: '1000ms',
    enterAnimationDuration: '1000ms',
    data: {
      'code': empid
    }
  }).afterClosed().subscribe(o => {
    this.GetallEmployee();
  });
}
  ngOnDestroy(): void {
   this.subcription.unsubscribe();
  }
}
