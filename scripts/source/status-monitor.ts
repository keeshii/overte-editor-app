
export class ServerScriptStatusMonitor {
  
  private entityID: Uuid;
  private active: boolean;
  private sendRequestTimerID: any;

  constructor(entityId: Uuid, statusCallback: any) {
    var self = this;

    this.entityID = entityId;
    this.active = true;
    this.sendRequestTimerID = null;

    var onStatusReceived = function (success: boolean, isRunning: boolean, status: string, errorInfo: string) {
      if (self.active) {
        statusCallback({
          statusRetrieved: success,
          isRunning: isRunning,
          status: status,
          errorInfo: errorInfo
        });
        self.sendRequestTimerID = Script.setTimeout(function () {
          if (self.active) {
            Entities.getServerScriptStatus(entityId, onStatusReceived);
          }
        }, 1000);
      }
    };
    Entities.getServerScriptStatus(entityId, onStatusReceived);
  }

  public stop() {
    this.active = false;
  };
  
}
