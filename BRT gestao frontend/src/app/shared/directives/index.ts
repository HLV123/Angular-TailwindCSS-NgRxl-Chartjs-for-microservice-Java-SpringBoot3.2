import { Directive, ElementRef, Output, EventEmitter, HostListener, Input, OnInit, OnDestroy, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Directive({ selector: '[clickOutside]', standalone: true })
export class ClickOutsideDirective {
    @Output() clickOutside = new EventEmitter<void>();
    constructor(private el: ElementRef) { }
    @HostListener('document:click', ['$event.target'])
    onClick(target: HTMLElement) {
        if (!this.el.nativeElement.contains(target)) this.clickOutside.emit();
    }
}

@Directive({ selector: '[appRoleVisible]', standalone: true })
export class RoleVisibleDirective implements OnInit {
    @Input('appRoleVisible') roles: string[] = [];
    constructor(
        private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef,
        private authService: AuthService
    ) { }
    ngOnInit() {
        if (this.roles.length === 0 || this.authService.hasRole(this.roles)) {
            this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
            this.viewContainer.clear();
        }
    }
}
