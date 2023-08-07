import { Directive, ElementRef, Input, NgZone, OnDestroy } from '@angular/core';
import { Subject, Subscription, debounceTime, delayWhen, filter } from 'rxjs';

@Directive({
  selector: '[ovtScrollWhen]'
})
export class ScrollWhenDirective implements OnDestroy {

  private value: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  private subject = new Subject<boolean>();
  private subscription: Subscription;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input('ovtScrollWhen') public set scrollWhen(value: any) {
    this.subject.next(value);
    this.value = value;
  }

  @Input()
  public enabled = true;

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    private ngZone: NgZone
  ) {
    this.subscription = this.subject
      .pipe(
        filter(value => value && this.value !== value && this.enabled),
        debounceTime(100),
        delayWhen(() => this.ngZone.onStable)
      )
      .subscribe(() => this.scrollToBottom());
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private scrollToBottom(): void {
    const element = this.elementRef.nativeElement;
    element.scrollTop = element.scrollHeight;
  }

}
