import { Component, Input } from '@angular/core';
import { StatusType } from '../../shared/session/session.interface';
import { ApiService } from 'src/app/shared/api/api.service';

@Component({
  selector: 'ovt-status-info',
  templateUrl: './status-info.component.html',
  styleUrls: ['./status-info.component.scss']
})
export class StatusInfoComponent {

  @Input()
  public status: StatusType;
  
  constructor(
    private apiService: ApiService
  ) {
    this.status = StatusType.UNLOADED;
  }

  public stop() {
    this.apiService.stopScript();
  }

}
