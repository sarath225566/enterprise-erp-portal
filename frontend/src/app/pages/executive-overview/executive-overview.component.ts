import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-executive-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './executive-overview.component.html',
  styleUrl: './executive-overview.component.css'
})
export class ExecutiveOverviewComponent {
  isLoading: boolean = true;
  metrics: any = null;

  private apiUrl = 'https://localhost:7028/api/Dashboard/executive-overview';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchOverviewData();
  }

  fetchOverviewData(): void {
    this.isLoading = true;
    this.http.get<any>(this.apiUrl).subscribe({
      next: (res) => {
        this.metrics = res;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching dashboard metrics', err);
        this.isLoading = false;
      }
    });
  }
}
