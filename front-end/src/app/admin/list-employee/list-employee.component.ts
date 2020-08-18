import {Component, OnInit} from '@angular/core';
import {EmployeeService} from '../../services/employee.service';
import {Employees} from '../../models/employees';

@Component({
  selector: 'app-list-employee',
  templateUrl: './list-employee.component.html',
  styleUrls: ['./list-employee.component.scss']
})
export class ListEmployeeComponent implements OnInit {
  size = 6;
  pageClicked = 0;
  employeeList: Employees[];
  pages = [];
  totalPages = 1;
  key = '';

  constructor(private employeeService: EmployeeService) {
  }

  ngOnInit(): void {
    this.getAllEmployeeWithPage(0);
  }

  // tslint:disable-next-line:typedef
  getAllEmployeeWithPage(page) {
    this.employeeService.findAllEmployeeWithPage(page, this.size, this.key).subscribe(
      data => {
        this.pageClicked = page;
        this.employeeList = data.content;
        this.totalPages = data.totalPages;
        this.pages = Array.apply(null, {length: this.totalPages}).map(Number.call, Number);
      }, error => console.log(error)
    );
  }

  // tslint:disable-next-line:typedef
  search() {
    this.ngOnInit();
  }

  // tslint:disable-next-line:typedef
  onPrevious() {
    if (this.pageClicked > 0) {
      this.pageClicked--;
      this.getAllEmployeeWithPage(this.pageClicked);
    }
  }

  // tslint:disable-next-line:typedef
  onNext() {
    if (this.pageClicked < this.totalPages - 1) {
      this.pageClicked++;
      this.getAllEmployeeWithPage(this.pageClicked);
    }
  }

  // tslint:disable-next-line:typedef
  onLast() {
    this.pageClicked = this.totalPages - 1;
    this.getAllEmployeeWithPage(this.pageClicked);
  }
}
