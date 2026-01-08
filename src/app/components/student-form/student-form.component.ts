import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StudentService } from '../../services/student.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/**
 * StudentFormComponent - Reusable form for creating new students
 * Handles form validation and submission
 */
@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.css']
})
export class StudentFormComponent implements OnInit, OnDestroy {
  studentForm!: FormGroup;
  loading: boolean = false;
  error: string | null = null;
  successMessage: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();

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
   * Initialize the reactive form with validation rules
   */
  private initializeForm(): void {
    this.studentForm = this.fb.group({
      stdname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      mobileno: ['', [Validators.maxLength(15), this.phoneValidator.bind(this)]],
      email: ['', [Validators.maxLength(100), Validators.email]],
      city: ['', Validators.maxLength(50)],
      state: ['', Validators.maxLength(50)],
      pincode: ['', [Validators.maxLength(10), this.pincodeValidator.bind(this)]],
      address1: ['', Validators.maxLength(255)],
      address2: ['', Validators.maxLength(255)]
    });
  }

  /**
   * Custom validator for phone numbers
   */
  private phoneValidator(control: any): { [key: string]: any } | null {
    if (!control.value) return null;
const phoneRegex = /^[0-9\-\+\(\)\s]+$/;
    return phoneRegex.test(control.value) ? null : { invalidPhone: true };
  }

  /**
   * Custom validator for pincode
   */
  private pincodeValidator(control: any): { [key: string]: any } | null {
if (!control.value) return null;
    const pincodeRegex = /^[0-9\-]+$/;
return pincodeRegex.test(control.value) ? null : { invalidPincode: true };
  }

  /**
   * Handle form submission
   */
  onSubmit(): void {
    if (this.studentForm.invalid) {
      this.markFormGroupTouched(this.studentForm);
      return;
    }

    const formValue = this.studentForm.value;

    this.studentService.createStudent(formValue).subscribe({
      next: (student) => {
        this.successMessage = `Student "${student.stdname}" created successfully!`;
      setTimeout(() => {
        this.router.navigate(['/list']);
        }, 1500);
      },
      error: (err) => {
 console.error('Error creating student:', err);
      }
    });
  }

  /**
   * Mark all form fields as touched to show validation errors
   */
  private markFormGroupTouched(formGroup: FormGroup): void {
Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * Navigate back to the list
   */
  cancel(): void {
    this.router.navigate(['/list']);
  }

  /**
   * Clear the success message
   */
  clearSuccessMessage(): void {
    this.successMessage = null;
  }

  /**
   * Get error message for a specific field
   */
  getErrorMessage(fieldName: string): string {
    const control = this.studentForm.get(fieldName);
    if (!control || !control.errors) return '';

    if (control.errors['required']) return `${fieldName} is required`;
    if (control.errors['minlength']) return `${fieldName} must be at least ${control.errors['minlength'].requiredLength} characters`;
    if (control.errors['maxlength']) return `${fieldName} cannot exceed ${control.errors['maxlength'].requiredLength} characters`;
    if (control.errors['email']) return 'Please enter a valid email';
 if (control.errors['invalidPhone']) return 'Please enter a valid phone number';
    if (control.errors['invalidPincode']) return 'Please enter a valid pincode';

    return 'Invalid input';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
 this.destroy$.complete();
  }
}
