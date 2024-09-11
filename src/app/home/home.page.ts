import { Component, inject } from '@angular/core';
import { RefresherCustomEvent } from '@ionic/angular';
import { MessageComponent } from '../message/message.component';

import { DataService, Message } from '../services/data.service';
import { VkIdService } from '../services/vk-id.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  private data = inject(DataService);

  constructor(private vkIdService: VkIdService) {}

  refresh(ev: any) {
    setTimeout(() => {
      (ev as RefresherCustomEvent).detail.complete();
    }, 3000);
  }

  getMessages(): Message[] {
    return this.data.getMessages();
  }


  public vkId(): void {
    this.vkIdService.auth({
      success: true,
      code_challenge: '123',
      state: '123',
    })
  }
}
