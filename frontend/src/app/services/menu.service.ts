import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
export interface MenuItemModel {
  id: string;
  label: string;
  icon: string;
  expanded?: boolean;
  children?: MenuItemModel[];
}
@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private readonly apiUrl = 'https://localhost:7028/api/Menus';

  constructor(private http: HttpClient) {}

  getSidebarMenus(): Observable<MenuItemModel[]> {
    return this.http.get<MenuItemModel[]>(`${this.apiUrl}/sidebar-menus`);
  }
}
