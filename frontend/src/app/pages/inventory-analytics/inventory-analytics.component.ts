import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-inventory-analytics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inventory-analytics.component.html',
  styleUrl: './inventory-analytics.component.css'
})
export class InventoryAnalyticsComponent {
  isLoading: boolean = true;
  data: any = null;

  private apiUrl = 'https://localhost:7028/api/Dashboard/inventory-analytics';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchAnalyticsData();
  }

  fetchAnalyticsData(): void {
    this.isLoading = true;
    this.http.get<any>(this.apiUrl).subscribe({
      next: (res) => {
        this.data = res;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching inventory analytics:', err);
        this.isLoading = false;
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Optimal':
        return 'bg-success-subtle text-success border border-success-subtle';
      case 'Low':
        return 'bg-warning-subtle text-warning-emphasis border border-warning-subtle';
      case 'Critical':
      case 'Out of Stock':
        return 'bg-danger-subtle text-danger border border-danger-subtle';
      default:
        return 'bg-secondary-subtle text-secondary';
    }
  }

  getSpeedBadge(speed: string): string {
    switch (speed) {
      case 'Fast':
        return 'text-danger fw-bold';
      case 'Medium':
        return 'text-primary fw-semibold';
      default:
        return 'text-muted';
    }
  }
}
