import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stockQuantity: number;
  isActive: boolean;
}
@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-management.component.html',
  styleUrl: './product-management.component.css'
})
export class ProductManagementComponent {
productsList: Product[] = [];
  productForm: FormGroup;

  isEditMode: boolean = false;
  selectedProductId: number | null = null;
  isModalOpen: boolean = false;
  isLoading: boolean = false;
  successMessage: string = '';
  private apiUrl = 'https://localhost:7028/api/products';
  constructor(private http: HttpClient,
    private toastr: ToastrService,
     private fb: FormBuilder) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required]],
      category: ['Electronics', [Validators.required]],
      price: [0, [Validators.required, Validators.min(1)]],
      stockQuantity: [0, [Validators.required, Validators.min(0)]],
      isActive: [true]
    });
  }
  ngOnInit(): void {
    this.loadProducts();
  }
  loadProducts(): void {
    this.isLoading = true;
    this.http.get<Product[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.productsList = data;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }
  openCreateModal(): void {
    this.isEditMode = false;
    this.selectedProductId = null;
    this.productForm.reset({ category: 'Electronics', price: 0, stockQuantity: 0, isActive: true });
    this.isModalOpen = true;
  }
  openEditModal(product: Product): void {
    this.isEditMode = true;
    this.selectedProductId = product.id;
    this.productForm.patchValue(product);
    this.isModalOpen = true;
  }
  closeModal(): void {
    this.isModalOpen = false;
  }
  onSaveProduct(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const payload = this.productForm.value;

    if (this.isEditMode && this.selectedProductId) {
      this.http.put(`${this.apiUrl}/${this.selectedProductId}`, payload).subscribe(() => {
        this.toastr.success('', 'Product updated successfully!!');
        //this.showSuccess('Product updated successfully!');
        this.loadProducts();
        this.closeModal();
      });
    } else {
      this.http.post(this.apiUrl, payload).subscribe(() => {
        this.toastr.success('', 'Product created successfully!');
        //this.showSuccess('Product created successfully!');
        this.loadProducts();
        this.closeModal();
      });
    }
  }

  onDeleteProduct(id: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.http.delete(`${this.apiUrl}/${id}`).subscribe(() => {
       this.toastr.error('', 'Product deleted!');
        //this.showSuccess('Product deleted!');
        this.loadProducts();
      });
    }
  }
  // private showSuccess(msg: string): void {
  //   this.successMessage = msg;
  //   setTimeout(() => this.successMessage = '', 3000);
  // }
}
