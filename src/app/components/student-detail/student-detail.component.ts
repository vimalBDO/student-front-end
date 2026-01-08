import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { StudentService } from '../../services/student.service';
import { Student } from '../../models/student.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/**
 * StudentDetailComponent - Displays full details of a single student
 * Read-only view with options to edit or delete
 */
@Component({
  selector: 'app-student-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-detail.component.html',
  styleUrls: ['./student-detail.component.css']
})
export class StudentDetailComponent implements OnInit, OnDestroy {
  student: Student | null = null;
  loading: boolean = false;
  error: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private studentService: StudentService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Get student ID from route
    this.route.params.subscribe(params => {
      const studentId = params['id'];
 if (studentId) {
        this.loadStudent(studentId);
    }
    });

    // Subscribe to loading state
    this.studentService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => this.loading = loading);

    // Subscribe to error state
    this.studentService.error$
   .pipe(takeUntil(this.destroy$))
      .subscribe(error => this.error = error);
  }

  /**
   * Load student details from backend
   */
  private loadStudent(id: number): void {
 this.studentService.getStudentById(id).subscribe({
      next: (student) => this.student = student,
  error: (err) => console.error('Error loading student:', err)
    });
  }

  /**
   * Navigate to edit page
   */
  editStudent(): void {
    if (this.student) {
      this.router.navigate(['/edit', this.student.stdid]);
    }
  }

  /**
   * Delete the student with confirmation
   */
  deleteStudent(): void {
    if (!this.student) return;

    if (confirm(`Are you sure you want to delete ${this.student.stdname}? This action cannot be undone.`)) {
      this.studentService.deleteStudent(this.student.stdid).subscribe({
   next: () => {
          this.router.navigate(['/list']);
        },
   error: (err) => console.error('Error deleting student:', err)
      });
    }
  }

  /**
   * Navigate back to the list
   */
  backToList(): void {
    this.router.navigate(['/list']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
}
}
