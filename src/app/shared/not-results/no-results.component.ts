import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-no-results',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './no-results.component.html',
  styleUrls: ['./no-results.component.css']
})
export class NoResultsComponent {}