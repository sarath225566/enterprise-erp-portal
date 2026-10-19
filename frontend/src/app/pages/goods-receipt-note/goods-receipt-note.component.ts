import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
export interface GrnItemModel {
  itemSku: string;
  itemName: string;
  orderedQty: number;
  receivedQty: number;
  damagedQty: number;
  acceptedQty?: number;
  batchNumber: string;
  expiryDate: string;
  storageBinLocation: string;
  unitPrice: number;
}
@Component({
  selector: 'app-goods-receipt-note',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './goods-receipt-note.component.html',
  styleUrl: './goods-receipt-note.component.css'
})
export class GoodsReceiptNoteComponent {
  grnList: any[] = [];
  filteredList: any[] = [];
  pendingPOs: any[] = [];
  isLoading: boolean = false;
  isCreateModalOpen: boolean = false;
  selectedGrnForView: any = null;

  searchQuery: string = '';
  warehouseFilter: string = 'All';

  // Form State
  newGrn = {
    purchaseOrderId: null as number | null,
    poNumber: '',
    vendorName: '',
    challanNumber: '',
    warehouseLocation: 'Main Central Depot',
    remarks: '',
    items: [] as GrnItemModel[]
  };

  private readonly apiUrl = 'https://localhost:7028/api/Grn';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchGrnList();
    this.fetchPendingPOs();
  }

  fetchGrnList(): void {
    this.isLoading = true;
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (res) => {
        this.grnList = res;
        this.applyFilter();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching GRNs:', err);
        this.isLoading = false;
      }
    });
  }

  fetchPendingPOs(): void {
    this.http.get<any[]>(`${this.apiUrl}/pending-pos`).subscribe({
      next: (res) => {
        this.pendingPOs = res;
      },
      error: (err) => console.error('Error loading POs:', err)
    });
  }

  applyFilter(): void {
    this.filteredList = this.grnList.filter((grn) => {
      const matchSearch =
        grn.grnNumber.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        grn.vendorName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        (grn.poNumber && grn.poNumber.toLowerCase().includes(this.searchQuery.toLowerCase()));
      const matchWarehouse =
        this.warehouseFilter === 'All' || grn.warehouseLocation === this.warehouseFilter;
      return matchSearch && matchWarehouse;
    });
  }

  onPoSelect(event: Event): void {
    const selectedPoId = Number((event.target as HTMLSelectElement).value);
    const selectedPo = this.pendingPOs.find((p) => p.id === selectedPoId);

    if (selectedPo) {
      this.newGrn.purchaseOrderId = selectedPo.id;
      this.newGrn.poNumber = selectedPo.poNumber;
      this.newGrn.vendorName = selectedPo.vendorName;

      // Auto-populate line items from PO
      this.newGrn.items = selectedPo.items.map((item: any) => ({
        itemSku: item.itemSku,
        itemName: item.itemName,
        orderedQty: item.quantity,
        receivedQty: item.quantity,
        damagedQty: 0,
        acceptedQty: item.quantity,
        batchNumber: `BAT-${new Date().getFullYear()}${Math.floor(1000 + Math.random() * 9000)}`,
        expiryDate: new Date(Date.now() + 365 * 86400000).toISOString().substring(0, 10),
        storageBinLocation: 'Rack-A1-Bin02',
        unitPrice: item.unitPrice
      }));
    }
  }

  addItemRow(): void {
    this.newGrn.items.push({
      itemSku: '',
      itemName: '',
      orderedQty: 0,
      receivedQty: 1,
      damagedQty: 0,
      acceptedQty: 1,
      batchNumber: '',
      expiryDate: '',
      storageBinLocation: 'Bin-General',
      unitPrice: 0
    });
  }

  removeItemRow(index: number): void {
    if (this.newGrn.items.length > 1) {
      this.newGrn.items.splice(index, 1);
    }
  }

  getAcceptedQty(item: GrnItemModel): number {
    const accepted = (item.receivedQty || 0) - (item.damagedQty || 0);
    return accepted > 0 ? accepted : 0;
  }

  openCreateModal(): void {
    this.newGrn = {
      purchaseOrderId: null,
      poNumber: '',
      vendorName: '',
      challanNumber: '',
      warehouseLocation: 'Main Central Depot',
      remarks: '',
      items: [
        {
          itemSku: '',
          itemName: '',
          orderedQty: 10,
          receivedQty: 10,
          damagedQty: 0,
          acceptedQty: 10,
          batchNumber: '',
          expiryDate: '',
          storageBinLocation: 'Bin-General',
          unitPrice: 0
        }
      ]
    };
    this.isCreateModalOpen = true;
  }

  closeCreateModal(): void {
    this.isCreateModalOpen = false;
  }

  submitGrn(): void {
    if (!this.newGrn.vendorName || this.newGrn.items.length === 0) {
      alert('Vendor Name and Line items are required.');
      return;
    }

    this.http.post(this.apiUrl, this.newGrn).subscribe({
      next: () => {
        alert('Goods Receipt Note Verified & Inwarded Successfully!');
        this.closeCreateModal();
        this.fetchGrnList();
        this.fetchPendingPOs();
      },
      error: (err) => {
        console.error('Failed to submit GRN:', err);
        alert(err.error?.message || 'Error creating GRN');
      }
    });
  }

  viewDetails(grn: any): void {
    this.selectedGrnForView = grn;
  }

  closeViewModal(): void {
    this.selectedGrnForView = null;
  }
}
