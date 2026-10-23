import { Directive, ElementRef, Input, OnChanges, Renderer2, inject } from '@angular/core';

// <10 red, 10-25 yellow, >25 no color
@Directive({
  selector: '[appStockHighlight]'
})
export class StockHighlightDirective implements OnChanges {
  @Input() appStockHighlight = 0;

  private element = inject(ElementRef);
  private renderer = inject(Renderer2);

  ngOnChanges(): void {
    const row = this.element.nativeElement;

    this.renderer.removeClass(row, 'table-danger');
    this.renderer.removeClass(row, 'table-warning');

    if (this.appStockHighlight < 10) {
      this.renderer.addClass(row, 'table-danger');
    } else if (this.appStockHighlight <= 25) {
      this.renderer.addClass(row, 'table-warning');
    }
  }
}
