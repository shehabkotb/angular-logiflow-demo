import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

interface NavItem {
  label: string;
  path: string;
}

const SMALL_SCREEN_WIDTH = 768;

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent implements OnInit, OnDestroy {
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
