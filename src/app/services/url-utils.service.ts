import { Inject, Injectable } from '@angular/core';
import { WINDOW } from '../tokens/window.token';

@Injectable({
    providedIn: 'root',
})
export class UrlUtilsService {
    constructor(@Inject(WINDOW) private readonly windowRef: Window) {}

    // Поскольку ionic не дает возможность вытащить квери параметры из url
    // когда они были зашиты в ссылку пришлось сделать такую реализацию
    public getQueryParam(paramName: string): string {
        const paramsMap = this.getSearchParamsMap();

        return paramsMap.get(paramName) ?? '';
    }

    public getParamsList(): string[] {
        return this.search.substring(1).split('&');
    }

    private getSearchParamsMap(): URLSearchParams {
        return new URLSearchParams(this.search);
    }

    private get search(): string {
        return this.windowRef.location.search;
    }
}
