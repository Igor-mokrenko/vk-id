import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';

import { WINDOW } from '../tokens/window.token';
import { TGlobalWindow } from '../types/window.type';

@Injectable({
  providedIn: 'root',
})
export class PlatformService {
    constructor(
        @Inject(DOCUMENT) private readonly documentRef: Document,
        @Inject(WINDOW) readonly windowRef: TGlobalWindow,
    ) {
    }


    public get platform(): string {
        return Capacitor.getPlatform().toLowerCase();
    }

    private get browser(): String | RegExpMatchArray {
        const ua = navigator.userAgent;
        let tem;
        let M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        if (/trident/i.test(M[1])) {
            tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
            return 'IE ' + (tem[1] || '');
        }
        if (M[1] === 'Chrome') {
            tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
            if (tem != null) {
                return tem.slice(1).join(' ').replace('OPR', 'Opera');
            }
        }
        M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
        if ((tem = ua.match(/version\/(\d+)/i)) != null) {
            M.splice(1, 1, tem[1]);
        }
        return M;
    }

    public get browserName(): string {
        return this.browser[0];
    }

    public get browserVersion(): string {
        return this.browser[1];
    }

    public get isAndroid(): boolean {
        return this.platform === 'android';
    }

    public get isIos(): boolean {
        return this.platform === 'ios';
    }

    public get isWeb(): boolean {
        return this.platform === 'web';
    }

    public get isFromLocalWeb(): boolean {
        const currentLocation: string = window.location.href || '';
        return this.isWeb && /localhost/.test(currentLocation);
    }

    public exitApp(): void {
        App.exitApp();
    }

    public isNativePlatform(): boolean {
        return Capacitor.isNativePlatform();
    }
}
