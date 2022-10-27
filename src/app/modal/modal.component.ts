import { ChangeDetectionStrategy } from '@angular/compiler';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.sass'],
})
export class ModalComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('modal') modal: ElementRef<HTMLElement>;
  @Input() message: string = 'An unknown error occured!';
  @Input() success: boolean = false;
  @Output() closed = new EventEmitter<string>();
  isClosing: boolean = false;
  isOpened: boolean = true;
  timeout: any;

  constructor() {}

  ngOnInit(): void {
    this.timeout = setTimeout(() => {
      if (this.isOpened) this.onClose();
    }, 5000);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.modal.nativeElement.style.transform = 'translateX(0)';
    }, 0);
  }

  onClose() {
    if (this.isClosing) return;
    this.isClosing = true;
    const modal: HTMLElement = this.modal.nativeElement;

    modal.style.transform = 'translateX(100%)';

    setTimeout(() => {
      this.isClosing = false;
      this.isOpened = false;

      this.closed.emit('closed');
    }, 300);
  }

  ngOnDestroy(): void {
    clearTimeout(this.timeout);
  }
}
