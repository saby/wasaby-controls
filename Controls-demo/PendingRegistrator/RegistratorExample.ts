import { Control, TemplateFunction } from 'UI/Base';
import Pending from 'Controls/Pending';
import * as template from 'wml!Controls-demo/PendingRegistrator/RegistratorExample';

const noPendings = 'нет зарегистрированных пендингов';
const pendingRegistered = 'пендинг зарегистрирован';
const pendingsRegistered = ' пендинги зарегистрированы';
const pendingProcessFinishing = 'пендинг завершится через = ';
const pendingProcessFinished = 'пендинг завершился';
const pendingFinished = 'вызов пендинга завершился с результатом = ';
const waitingPendings = 'ожидание завершения пендингов...';
const cancelledPendings = 'ожидание пендингов отменено';

export default class RegistratorExample extends Control {
    protected _template: TemplateFunction = template;
    protected _children: {
        registrator: Pending;
    };

    protected _message: string = noPendings;
    protected _pendingMessage: string = '';
    protected _pendingCount: number = 0;

    protected _finish(): void {
        this._pendingMessage = waitingPendings;
        this._children.registrator
            .finishPendingOperations()
            .then((res) => {
                this._pendingMessage =
                    pendingFinished + '[' + res.toString() + ']';
                this._forceUpdate();
                return res;
            })
            .catch((err) => {
                this._message = err.toString();
                this._forceUpdate();
                return err;
            });
    }

    protected _registerPending(): void {
        this._pendingCount++;
        this._message =
            this._pendingCount === 1
                ? pendingRegistered
                : this._pendingCount + pendingsRegistered;
    }

    protected _finishingPendingProcess(e: Event, timeout: number): void {
        this._message = pendingProcessFinishing + timeout + 'ms';
    }

    protected _finishedPendingProcess(): void {
        this._pendingCount--;
        this._message = pendingProcessFinished;
    }

    protected _cancelFinishingPending(): void {
        this._pendingMessage = cancelledPendings;
    }

    static _styles = ['Controls-demo/PendingRegistrator/RegistratorExample'];
}
