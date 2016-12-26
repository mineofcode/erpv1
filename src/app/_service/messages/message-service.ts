import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class MessageService {

    constructor() { }


    //
    private notificationSource = new Subject<NotificationsStack>();
    public notificationReceiver$ = this.notificationSource.asObservable();
    private ShowMsg(notification: NotificationsStack) {
        this.notificationSource.next(notification);
    }

    public Show(msgtype: messageType, title: string, msg: string) {
        var msgtyp = "";
        switch (msgtype) {
            case messageType.success:
                msgtyp = "success";
                break;
            case messageType.info:
                msgtyp = "info";
                break;
            case messageType.error:
                msgtyp = "error";
                break;
            case messageType.warn:
                msgtyp = "warn";
                break;
            default:
                msgtyp = "info";
                break
        }
        this.ShowMsg(new NotificationsStack(msgtyp, title, msg));
    }

}

export enum messageType {
    warn = 1,
    success = 2,
    error = 3,
    info = 4
}

export class NotificationsStack {

    constructor(public severity: string,
        public summary: string,
        public detail: string
    ) {

    }

}
