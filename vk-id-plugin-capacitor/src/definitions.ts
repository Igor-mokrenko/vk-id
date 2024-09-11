import { IAuthProps, IAuthResult } from './auth.interface';

export interface VkIDPlugin {
  auth(options: IAuthProps ): Promise<IAuthResult>;
}
