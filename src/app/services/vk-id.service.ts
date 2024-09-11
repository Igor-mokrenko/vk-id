import { Inject, Injectable } from '@angular/core';
import { VkID } from 'vk-id-plugin-capacitor';
import { IAuthResult } from 'vk-id-plugin-capacitor/dist/esm/auth.interface';

import { IVKIDPayload } from '../interfaces/vk-id-payload.interface';
import { IVkIdState } from '../interfaces/vk-id-state.interface';
import { WINDOW } from '../tokens/window.token';
import { UrlUtilsService } from './url-utils.service';
import { PlatformService } from './platform.service';

@Injectable({
  providedIn: 'root',
})
export class VkIdService {
  private clientId = this.getClientId();
  private clientSecret = this.getClientSecret();
  private afterAuthAction: (() => void) | null = null;
  private readonly scope = ['email', 'phone'];

  constructor(
    @Inject(WINDOW) private readonly windowRef: Window,
    private platformService: PlatformService,
    private urlParseService: UrlUtilsService,
  ) {
  }

  public setAfterAuthAction(action: () => void): void {
    this.afterAuthAction = action;
  }

  public getAfterAuthAction(): (() => void) | null {
    return this.afterAuthAction;
  }

  public initSdk(vkIdState: IVkIdState, container: HTMLElement): void {
    if (!this.isVkSettingsValid) return;

    const map = {
      web: () => this.initWebSdk(vkIdState, container),
    };

    // @ts-ignore
    map[this.platformService.platform]?.();
  }

  public async auth(state: IVkIdState): Promise<IAuthResult | null> {
    if (!this.isVkSettingsValid) return null;

    const map = {
      android: () => null,
      web: () => null,
      ios: () => this.authPlugin(state),
    };

    // @ts-ignore
    return map[this.platformService.platform]?.();
  }

  private get isVkSettingsValid(): boolean {
    if (!this.clientId || !this.clientSecret) {
      this.setCredentials();
    }

    if (this.platformService.isWeb && !this.clientId) {
      console.error('VK_ID_CLIENT_ID is not defined');
      return false;
    }

    if (!this.platformService.isWeb && (!this.clientId || !this.clientSecret)) {
      console.error('VK_ID_CLIENT_ID or VK_ID_CLIENT_SECRET is not defined');
      return false;
    }

    return true;
  }

  private setCredentials(): void {
    this.clientId = this.getClientId();
    this.clientSecret = this.getClientSecret();
  }

  private getClientId(): string {
    return (<any>this.windowRef).VK_ID_CLIENT_ID ?? '';
  }

  private getClientSecret(): string {
    return (<any>this.windowRef).VK_ID_CLIENT_SECRET ?? '';
  }

  private authPlugin({state, code_challenge}: IVkIdState): Promise<IAuthResult> {
    return VkID.auth({
      clientId: this.clientId,
      clientSecret: this.clientSecret,
      state,
      codeChallenge: code_challenge,
      scope: this.scope,
    });
  }

  private initWebSdk(vkIdState: IVkIdState, container: HTMLElement): void {

  }

  public checkSearchParams(): void {
    const currentUrl = this.windowRef.location.href;
    const [baseUrl] = currentUrl.split('#');
    const url = new URL(baseUrl);
    const params = new URLSearchParams(url.search);
    const type = params.get('type');
    const code = params.get('code');
    const state = params.get('state');
    const device_id = params.get('device_id');

    if (type && code && state && device_id) {
      params.delete('type');
      params.delete('code');
      params.delete('state');
      params.delete('device_id');

      const newUrl = `${ url.origin }${ url.pathname }?${ params.toString() }#${
        url.hash
      }?type=${ type }&code=${ code }&state=${ state }&device_id=${ device_id }`;

      this.windowRef.location.replace(newUrl);
    }
  }

  public getPayload(): IVKIDPayload | null {
    const params = new URLSearchParams(`?${ this.windowRef.location.hash.split('?')[1] }`);
    const type = params.get('type');
    const code = params.get('code');
    const state = params.get('state');
    const device_id = params.get('device_id');

    if (type && code && state && device_id) {
      return {type, code, state, device_id};
    }

    return null;
  }

  public async showError(): Promise<boolean> {
    return false;
  }

  public setQueryParams(): void {
    if ((<any>this.windowRef).WEB_MO) return;

    const clientId = this.urlParseService.getQueryParam('vkIdClientId');

    if (clientId) {
      (<any>this.windowRef).VK_ID_CLIENT_ID = clientId;
    }
  }
}
