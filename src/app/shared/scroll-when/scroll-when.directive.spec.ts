import { ElementRef, NgZone } from '@angular/core';
import { ScrollWhenDirective } from './scroll-when.directive';

describe('ScrollWhenDirective', () => {
  
  let elementRef: ElementRef<HTMLElement>;
  let ngZone: NgZone;
  let directive: ScrollWhenDirective;
  
  beforeEach(() => {
    elementRef = {} as ElementRef<HTMLElement>;
    ngZone = {} as NgZone;
    directive = new ScrollWhenDirective(elementRef, ngZone);
  });
  
  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });
});
