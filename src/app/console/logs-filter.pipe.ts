import { Pipe, PipeTransform } from '@angular/core';
import { LogItem } from '../shared/session/session.interface';

@Pipe({ name: 'filterLogs' })
export class FilterLogsPipe implements PipeTransform {
  transform(logs: LogItem[], showErrors: boolean, showInfos: boolean) {
    return logs.filter(log => showErrors && log.logType === 'ERROR'
      || showInfos && log.logType === 'INFO');
  }
}
