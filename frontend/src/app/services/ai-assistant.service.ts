import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
export interface ChatRequest {
  message: string;
}

export interface ChatResponse {
  reply: string;
  success: boolean;
}
@Injectable({
  providedIn: 'root'
})
export class AiAssistantService {
  private readonly apiUrl = 'https://localhost:7028/api/AiAssistant/chat';

  constructor(private http: HttpClient) {}

  sendMessage(message: string): Observable<ChatResponse> {
    return this.http.post<ChatResponse>(this.apiUrl, { message });
  }
}
