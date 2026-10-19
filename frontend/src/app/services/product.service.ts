import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { Product } from '../models/product.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'https://localhost:7028/api/products';
  private products = ['Angular Book', 'RxJS Masterclass', 'Signals Guide', 'TypeScript Deep Dive'];
  constructor(private http: HttpClient) { }
  searchProducts(query: string): Observable<string[]> {
    const filtered = this.products.filter(p => p.toLowerCase().includes(query.toLowerCase()));
    return of(filtered).pipe(delay(500)); // Simulating network latency
  }
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  updateProduct(id: number, product: Product): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
