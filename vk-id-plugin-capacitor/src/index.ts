import { registerPlugin } from '@capacitor/core';

import type { VkIDPlugin } from './definitions';

const VkID = registerPlugin<VkIDPlugin>('VkID', {
  web: () => import('./web').then(m => new m.VkIDWeb()),
});

export * from './definitions';
export { VkID };
