import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { StudentService } from '../../services/student.service';
import { Student } from '../../models/student.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/**
 * StudentListComponent - Displays all students in a table format
 * Allows viewing, editing, and deleting students
 */
@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css']
})
export class StudentListComponent implements OnInit, OnDestroy {
  students: Student[] = [];
  loading: boolean = false;
  error: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private studentService: StudentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadStudents();

    // Subscribe to loading state
    this.studentService.loading$
   .pipe(takeUntil(this.destroy$))
      .subscribe(loading => this.loading = loading);

    // Subscribe to error state
    this.studentService.error$
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => this.error = error);

    // Subscribe to students data
  this.studentService.students$
      .pipe(takeUntil(this.destroy$))
      .subscribe(students => this.students = students);
  }

  /**
   * Load all students from the backend
   */
  loadStudents(): void {
    this.studentService.getAllStudents().subscribe({
      error: (err) => console.error('Error loading students:', err)
    });
  }

  /**
   * Navigate to the create student form
   */
  createStudent(): void {
    this.router.navigate(['/create']);
  }

  /**
   * Navigate to edit a specific student
   */
  editStudent(id: number): void {
    this.router.navigate(['/edit', id]);
  }

  /**
   * View details of a specific student
   */
  viewStudent(id: number): void {
    this.router.navigate(['/detail', id]);
  }

  /**
   * Delete a student with confirmation
   */
  deleteStudent(id: number, stdname: string): void {
    if (confirm(`Are you sure you want to delete ${stdname}?`)) {
      this.studentService.deleteStudent(id).subscribe({
        error: (err) => console.error('Error deleting student:', err)
      });
    }
  }

  /**
   * Retry loading students if there was an error
   */
  retryLoadStudents(): void {
    this.error = null;
    this.loadStudents();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
