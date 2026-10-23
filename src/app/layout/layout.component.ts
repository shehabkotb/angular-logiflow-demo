import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { NotificationBannerComponent } from '../shared/notification-banner/notification-banner.component';

interface NavItem {
  label: string;
  path: string;
}

const SMALL_SCREEN_WIDTH = 768;

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NotificationBannerComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);

  collapsed = signal(false);

  navItems: NavItem[] = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Inventory', path: '/inventory' },
    { label: 'Shipments', path: '/shipments' },
    { label: 'Suppliers', path: '/suppliers' }
  ];

  // hardcoded for the demo
  userName = 'Alex Morgan';
  userInitials = 'AM';

  ngOnInit(): void {
    this.checkScreenSize();
    window.addEventListener('resize', this.onResize);
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.onResize);
  }

  logout(): void {
    this.authService.logout();
  }

  toggleSidebar(): void {
    this.collapsed.update(value => !value);
  }

  // arrow fn so `this` works and removeEventListener gets the same reference
  private onResize = (): void => {
    this.checkScreenSize();
  };

  private checkScreenSize(): void {
    if (window.innerWidth < SMALL_SCREEN_WIDTH) {
      this.collapsed.set(true);
    }
  }
}
