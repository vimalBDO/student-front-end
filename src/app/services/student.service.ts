import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError, finalize } from 'rxjs/operators';
import { environment } from '../../environments/environment.development';
import { Student, CreateStudentDto } from '../models/student.model';

/**
 * StudentService - Handles all HTTP communication with the backend API
 * Provides methods for CRUD operations on students
 */
@Injectable({ providedIn: 'root' })
export class StudentService {
  // Base must end with /api (from launchSettings profile you run)
  private apiBase = environment.apiBaseUrl;          // e.g., 'https://localhost:7139/api'
  private studentsUrl = `${this.apiBase}/Student`;   // -> '/api/Student'

  // State
  private studentsSubject = new BehaviorSubject<Student[]>([]);
  public students$ = this.studentsSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  private errorSubject = new BehaviorSubject<string | null>(null);
  public error$ = this.errorSubject.asObservable();

  constructor(private http: HttpClient) {}

  // GET /api/Student
  getAllStudents(): Observable<Student[]> {
    this.setLoading(true);
    return this.http.get<Student[]>(this.studentsUrl).pipe(
      tap(students => {
        this.studentsSubject.next(students);
        this.clearError();
      }),
      catchError(err => this.forwardError(err)),
      finalize(() => this.setLoading(false))
    );
  }

  // GET /api/Student/{id}
  getStudentById(id: number): Observable<Student> {
    this.setLoading(true);
    return this.http.get<Student>(`${this.studentsUrl}/${id}`).pipe(
      tap(() => this.clearError()),
      catchError(err => this.forwardError(err)),
      finalize(() => this.setLoading(false))
    );
  }

  // POST /api/Student
  createStudent(dto: CreateStudentDto): Observable<Student> {
    this.setLoading(true);
    return this.http.post<Student>(this.studentsUrl, dto).pipe(
      tap(newStudent => {
        const current = this.studentsSubject.value;
        this.studentsSubject.next([...current, newStudent]);
        this.clearError();
      }),
      catchError(err => this.forwardError(err)),
      finalize(() => this.setLoading(false))
    );
  }

  // PUT /api/Student/{id}
  updateStudent(id: number, dto: CreateStudentDto): Observable<void> {
    this.setLoading(true);
    return this.http.put<void>(`${this.studentsUrl}/${id}`, dto).pipe(
      tap(() => {
        const updated = this.studentsSubject.value.map(s =>
          s.stdid === id ? ({ ...s, ...dto } as Student) : s
        );
        this.studentsSubject.next(updated);
        this.clearError();
      }),
      catchError(err => this.forwardError(err)),
      finalize(() => this.setLoading(false))
    );
  }

  // DELETE /api/Student/{id}
  deleteStudent(id: number): Observable<void> {
    this.setLoading(true);
    return this.http.delete<void>(`${this.studentsUrl}/${id}`).pipe(
      tap(() => {
        this.studentsSubject.next(
          this.studentsSubject.value.filter(s => s.stdid !== id)
        );
        this.clearError();
      }),
      catchError(err => this.forwardError(err)),
      finalize(() => this.setLoading(false))
    );
  }

  // State helpers
  private setLoading(v: boolean): void {
    this.loadingSubject.next(v);
  }

  private handleError(error: any): void {
    console.error('API Error:', error);
    const message = error?.error?.message || error?.message || 'An error occurred';
    this.errorSubject.next(message);
  }

  private clearError(): void {
    this.errorSubject.next(null);
  }

  private forwardError(error: any) {
    this.handleError(error);
    return throwError(() => error);
  }

  // Snapshot helper
  getStudentsSnapshot(): Student[] {
    return this.studentsSubject.value;
  }
}