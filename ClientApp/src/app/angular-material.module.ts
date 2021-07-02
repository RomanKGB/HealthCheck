import { NgModule } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
  imports: [MatCheckboxModule, MatTableModule, MatPaginatorModule, MatSortModule, MatInputModule, MatSelectModule],
  exports: [MatCheckboxModule, MatTableModule, MatPaginatorModule, MatSortModule, MatInputModule, MatSelectModule]
})

export class AngularMaterialModule { }
