import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * AppComponent - Root component of the application
 * Contains the main layout and routing outlet
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  title = 'Student Management System';
}
