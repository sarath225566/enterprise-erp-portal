import { Component, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AiAssistantService } from '../../../services/ai-assistant.service';
import { FormsModule } from '@angular/forms';
import { MenuItemModel, MenuService } from '../../../services/menu.service';
export interface ChatMessage {
  text: string;
  isUser: boolean;
  time: string;
}
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  @ViewChild('chatScrollContainer') private chatScrollContainer!: ElementRef;
  isSidebarCollapsed: boolean = false;
  isMobileMenuOpen: boolean = false;
  isChatOpen: boolean = false;
  currentLang: string = 'English';
  activeTab: string = 'analytics';

  // Chatbot State
  userMessage: string = '';
  isLoading: boolean = false;
  isMenuLoading: boolean = true;
  menuItems: MenuItemModel[] = []
  messages: ChatMessage[] = [
    {
      text: 'Hello! How can I assist you with your portal today?',
      isUser: false,
      time: this.getCurrentTimeString()
    }
  ];




  toggleMenu(item: any) {
  item.expanded = !item.expanded;
}

  toggleChat() {
    this.isChatOpen = !this.isChatOpen;
  }

  changeLang(lang: string) {
    this.currentLang = lang;
  }
  constructor(
    private authService: AuthService,
    private aiAssistantService: AiAssistantService,
    private menuService: MenuService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.loadSidebarMenus();
  }
  loadSidebarMenus(): void {
    this.isMenuLoading = true;
    this.menuService.getSidebarMenus().subscribe({
      next: (menus) => {
        this.menuItems = menus;
        this.isMenuLoading = false;
      },
      error: (err) => {
        console.error('Failed to load dynamic menus:', err);
        this.isMenuLoading = false;
      }
    });
  }
  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['']);
  }
  sendMessage(): void {
    const prompt = this.userMessage.trim();
    if (!prompt || this.isLoading) {
      return;
    }

    // 1. User message chat bubble ആയി പുഷ് ചെയ്യുന്നു
    this.messages.push({
      text: prompt,
      isUser: true,
      time: this.getCurrentTimeString()
    });

    this.userMessage = '';
    this.isLoading = true;

    // 2. Service വഴി Backend .NET API കോൾ ചെയ്യുന്നു
    this.aiAssistantService.sendMessage(prompt).subscribe({
      next: (res) => {
        this.messages.push({
          text: res.reply,
          isUser: false,
          time: this.getCurrentTimeString()
        });
        this.isLoading = false;
      },
      error: (err) => {
        console.error('AI API Error:', err);
        this.messages.push({
          text: 'Sorry, I am facing an issue connecting to the server. Please try again.',
          isUser: false,
          time: this.getCurrentTimeString()
        });
        this.isLoading = false;
      }
    });
  }
  private getCurrentTimeString(): string {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  // Dynamic Navigation on Menu Click
  selectMenu(id: string): void {
    console.log('Navigating to menu ID:', id);
  this.activeTab = id;

  // Relative path vazhi dashboard child route load cheyyunnu:
  this.router.navigate([id], { relativeTo: this.route }).then(success => {
    if (!success) {
      console.error(`Route not found for: ${id}. Please ensure it is registered in app.routes.ts.`);
    }
  }).catch(err => console.error('Navigation error:', err));
  }
  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }
  private scrollToBottom(): void {
    try {
      if (this.chatScrollContainer) {
        this.chatScrollContainer.nativeElement.scrollTop = this.chatScrollContainer.nativeElement.scrollHeight;
      }
    } catch (err) {}
  }
}
