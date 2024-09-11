import { WebPlugin } from '@capacitor/core';

import type { VkIDPlugin } from './definitions';
import { IAuthProps, IAuthResult } from './auth.interface';

export class VkIDWeb extends WebPlugin implements VkIDPlugin {
  async auth(options: IAuthProps): Promise<IAuthResult> {
    console.log(options);
    return {
      data: {
        code: '',
        state: '',
        deviceId: '',
        redirectURI: null,
      },
      success: true,
    };
  }
}
