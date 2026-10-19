import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { ToastrService } from 'ngx-toastr';
import { Product } from '../../models/product.model';


@Component({
  selector: 'app-stock-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './stock-management.component.html',
  styleUrl: './stock-management.component.css'
})
export class StockManagementComponent {
  products: Product[] = [];
  productForm!: FormGroup;
  isEditMode: boolean = false;
  selectedProductId: number | null = null;
  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private toastr: ToastrService
  ) {}
  ngOnInit(): void {
    this.initForm();
    this.loadProducts();
  }
  initForm(): void {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      category: ['', Validators.required],
      sku: [''],
      description: [''],
      purchasePrice: [0, [Validators.min(0)]],
      price: [0, [Validators.required, Validators.min(0.01)]],
      stockQuantity: [0, [Validators.required, Validators.min(0)]],
      reorderLevel: [10],
      unitOfMeasure: ['Pcs'],
      isActive: [true]
    });
  }
  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data) => (this.products = data),
      error: () => this.toastr.error('Failed to load products', 'Error')
    });
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.toastr.warning('Please fill in all required fields.', 'Validation Warning');
      return;
    }

    const productData: Product = this.productForm.value;

    if (this.isEditMode && this.selectedProductId) {
      this.productService.updateProduct(this.selectedProductId, productData).subscribe({
        next: () => {
          this.toastr.success('Stock item updated successfully!', 'Success');
          this.resetForm();
          this.loadProducts();
        },
        error: (err) => this.toastr.error(err.error?.message || 'Update failed', 'Error')
      });
    } else {
      this.productService.createProduct(productData).subscribe({
        next: () => {
          this.toastr.success('New stock item added!', 'Success');
          this.resetForm();
          this.loadProducts();
        },
        error: (err) => this.toastr.error(err.error?.message || 'Add failed', 'Error')
      });
    }
  }

  onEdit(product: Product): void {
    this.isEditMode = true;
    this.selectedProductId = product.id || null;
    this.productForm.patchValue(product);
  }

  onDelete(id: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.toastr.success('Product deleted successfully', 'Deleted');
          this.loadProducts();
        },
        error: () => this.toastr.error('Failed to delete product', 'Error')
      });
    }
  }

  resetForm(): void {
    this.productForm.reset({
      purchasePrice: 0,
      price: 0,
      stockQuantity: 0,
      reorderLevel: 10,
      unitOfMeasure: 'Pcs',
      isActive: true
    });
    this.isEditMode = false;
    this.selectedProductId = null;
  }
}
