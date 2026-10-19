import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
interface PoItem {
  itemSku: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  taxPercent: number;
  lineTotal?: number;
}
@Component({
  selector: 'app-purchase-order',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './purchase-order.component.html',
  styleUrl: './purchase-order.component.css'
})
export class PurchaseOrderComponent {
  purchaseOrders: any[] = [];
  filteredOrders: any[] = [];
  isLoading: boolean = false;
  isCreateModalOpen: boolean = false;
  selectedPoForView: any = null;

  searchQuery: string = '';
  statusFilter: string = 'All';

  // New PO Form Data
  newOrder = {
    vendorName: '',
    expectedDeliveryDate: '',
    notes: '',
    items: [
      { itemSku: '', itemName: '', quantity: 1, unitPrice: 0, taxPercent: 18 }
    ] as PoItem[]
  };

  private apiUrl = 'https://localhost:7028/api/PurchaseOrders';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders(): void {
    this.isLoading = true;
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (res) => {
        this.purchaseOrders = res;
        this.applyFilter();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching POs:', err);
        this.isLoading = false;
      }
    });
  }

  applyFilter(): void {
    this.filteredOrders = this.purchaseOrders.filter((po) => {
      const matchSearch =
        po.poNumber.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        po.vendorName.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchStatus =
        this.statusFilter === 'All' || po.status === this.statusFilter;
      return matchSearch && matchStatus;
    });
  }

  // Row Calculations
  calculateLineTotal(item: PoItem): number {
    const base = (item.quantity || 0) * (item.unitPrice || 0);
    const tax = base * ((item.taxPercent || 0) / 100);
    return base + tax;
  }

  get calculatedGrandTotal(): number {
    return this.newOrder.items.reduce(
      (sum, item) => sum + this.calculateLineTotal(item),
      0
    );
  }

  addItemRow(): void {
    this.newOrder.items.push({
      itemSku: '',
      itemName: '',
      quantity: 1,
      unitPrice: 0,
      taxPercent: 18
    });
  }

  removeItemRow(index: number): void {
    if (this.newOrder.items.length > 1) {
      this.newOrder.items.splice(index, 1);
    }
  }

  openCreateModal(): void {
    this.newOrder = {
      vendorName: '',
      expectedDeliveryDate: new Date(Date.now() + 7 * 86400000)
        .toISOString()
        .substring(0, 10),
      notes: '',
      items: [{ itemSku: '', itemName: '', quantity: 1, unitPrice: 0, taxPercent: 18 }]
    };
    this.isCreateModalOpen = true;
  }

  closeCreateModal(): void {
    this.isCreateModalOpen = false;
  }

  submitOrder(): void {
    if (!this.newOrder.vendorName || this.newOrder.items.length === 0) {
      alert('Please fill vendor name and at least one item.');
      return;
    }

    this.http.post(this.apiUrl, this.newOrder).subscribe({
      next: () => {
        alert('Purchase Order Generated Successfully!');
        this.closeCreateModal();
        this.fetchOrders();
      },
      error: (err) => {
        console.error('Failed to create PO', err);
        alert(err.error?.message || 'Error creating Purchase Order');
      }
    });
  }

  updateStatus(po: any, status: string): void {
    this.http.put(`${this.apiUrl}/${po.id}/status`, JSON.stringify(status), {
      headers: { 'Content-Type': 'application/json' }
    }).subscribe({
      next: () => {
        po.status = status;
      },
      error: (err) => console.error(err)
    });
  }

  viewDetails(po: any): void {
    this.selectedPoForView = po;
  }

  closeViewModal(): void {
    this.selectedPoForView = null;
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'Approved':
        return 'bg-success-subtle text-success border border-success-subtle';
      case 'Pending Approval':
        return 'bg-warning-subtle text-warning-emphasis border border-warning-subtle';
      case 'Issued':
        return 'bg-primary-subtle text-primary border border-primary-subtle';
      case 'Closed':
        return 'bg-secondary-subtle text-secondary';
      case 'Cancelled':
        return 'bg-danger-subtle text-danger border border-danger-subtle';
      default:
        return 'bg-light text-dark border';
    }
  }
}
