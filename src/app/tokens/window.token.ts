import { inject, InjectionToken } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { TGlobalWindow } from '../types/window.type';

export const WINDOW = new InjectionToken<TGlobalWindow>('Global window', {
    factory: () => inject(DOCUMENT).defaultView!,
});
