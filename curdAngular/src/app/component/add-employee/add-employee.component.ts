import { Component, Inject, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { Employee } from '../../model/Employee';
import { EmployeeService } from '../../service/employee.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-add-employee',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [MatCardModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, MatDatepickerModule, MatIconModule],
  templateUrl: './add-employee.component.html',
  styleUrl: './add-employee.component.css'
})
export class AddEmployeeComponent implements OnInit {
  title = 'Add Employee'
  dialogdata: any;
  isEdit = false;

  constructor(private empService: EmployeeService,
    private ref: MatDialogRef<AddEmployeeComponent>,
    private toastr: ToastrService, @Inject(MAT_DIALOG_DATA) public data: any) { }


  empForm = new FormGroup({
    id: new FormControl(0),
    name: new FormControl('', Validators.required),
    doj: new FormControl(new Date, Validators.required),
    role: new FormControl('', Validators.required),
    salary: new FormControl(0, Validators.required)
  })
  ngOnInit(): void {
    this.dialogdata = this.data;
    if (this.dialogdata.code > 0) {
      this.title = 'Edit Employee';
      this.isEdit = true;
      this.empService.Get(this.dialogdata.code).subscribe(item => {
        let _data: any = item;
        if (_data != null) {
          this.empForm.setValue({
            id: _data.id,
            name: _data.name,
            doj: _data.doj,
            role: _data.role,
            salary: _data.salary
          })

        }
      })
    }
    //we can use patchValue
    //   if (this.dialogdata?.code > 0) {
    //   this.title = 'Edit Employee';

    //   this.empService.Get(this.dialogdata.code).subscribe((data: any) => {
    //     if (data) {
    //       this.empForm.patchValue(data);
    //     }
    //   });
    // }
  }
  SaveEmployee() {
    if (this.empForm.valid) {
      console.log(this.empForm.value)
      const employee = this.mapFormToEmployee(this.empForm.value);
      if (this.isEdit) {
        this.empService.Update(employee).subscribe(item => {
          // alert("Saved");
          this.toastr.success('saved successfully' , 'Updated')
          this.closePopup();

        })

      } else {
        this.empService.Create(employee).subscribe(item => {
          // alert("Saved");
          this.toastr.success('saved successfully', 'Created')
          this.closePopup();

        })
      }

    }
  }
  closePopup() {
    this.ref.close();
  }

  private mapFormToEmployee(formValue: any): Employee {
    const { id, name, doj, role, salary } = formValue;

    return {
      id: Number(id),
      name: String(name),
      doj: new Date(doj),
      role: String(role),
      salary: Number(salary)
    };
  }
}
