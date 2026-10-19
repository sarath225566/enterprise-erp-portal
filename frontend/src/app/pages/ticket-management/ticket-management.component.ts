import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
export interface Ticket {
  id: number;
  title: string;
  description: string;
  priority: string;
  status: string;
  createdAt?: string;
}
@Component({
  selector: 'app-ticket-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ticket-management.component.html',
  styleUrl: './ticket-management.component.css'
})
export class TicketManagementComponent {
  ticketsList: Ticket[] = [];
  ticketForm: FormGroup;

  isEditMode: boolean = false;
  selectedTicketId: number | null = null;
  isModalOpen: boolean = false;
  isLoading: boolean = false;
  successMessage: string = '';

  private apiUrl = 'https://localhost:7028/api/tickets';
  constructor(private http: HttpClient, private fb: FormBuilder) {
    this.ticketForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      priority: ['Low', [Validators.required]],
      status: ['Pending', [Validators.required]]
    });
  }
  ngOnInit(): void{
    this.loadTickets();
  }
  loadTickets(): void{
    this.isLoading=true;
    this.http.get<Ticket[]>(this.apiUrl).subscribe({
      next:(data)=>{
        this.ticketsList = data;
        this.isLoading=true;
      },
      error:()=>this.isLoading=false
    });
  }

  openCreateModal(): void{
    this.isEditMode =false;
    this.selectedTicketId=null;
    this.ticketForm.reset({ priority: 'Low', status: 'Pending' });
    this.isModalOpen = true;
  }
  openEditModal(ticket: Ticket): void {
    this.isEditMode = true;
    //this.selectedTicketId = ticket.id;
    this.ticketForm.patchValue(ticket);
    this.isModalOpen = true;
  }
  closeModal(): void {
    this.isModalOpen = false;
  }
  onSaveTicket(): void {
    if (this.ticketForm.invalid) {
      this.ticketForm.markAllAsTouched();
      return;
    }

    const payload = this.ticketForm.value;

    if (this.isEditMode && this.selectedTicketId) {
      this.http.put(`${this.apiUrl}/${this.selectedTicketId}`, payload).subscribe(() => {
        this.showSuccess('Ticket updated successfully!');
        this.loadTickets();
        this.closeModal();
      });
    } else {
      this.http.post(this.apiUrl, payload).subscribe(() => {
        this.showSuccess('Ticket created successfully!');
        this.loadTickets();
        this.closeModal();
      });
    }
  }

  onDeleteTicket(id: number): void {
    if (confirm('Are you sure you want to delete this ticket?')) {
      this.http.delete(`${this.apiUrl}/${id}`).subscribe(() => {
        this.showSuccess('Ticket deleted!');
        this.loadTickets();
      });
    }
  }

  private showSuccess(msg: string): void {
    this.successMessage = msg;
    setTimeout(() => this.successMessage = '', 3000);
  }
  get totalTickets(): number {
  return this.ticketsList.length;
}

get pendingTickets(): number {
  return this.ticketsList.filter(t => t.status === 'Pending').length;
}

get inProgressTickets(): number {
  return this.ticketsList.filter(t => t.status === 'InProgress').length;
}

get completedTickets(): number {
  return this.ticketsList.filter(t => t.status === 'Completed').length;
}
}
