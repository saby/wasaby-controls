import { logger as AppLogger } from 'Application/Env';
import {
    IOutput,
    IOutputItem,
    TOutputItemType,
    TOutputItemArgs,
    TOutputItemStatus,
} from './IOutput';

const BACKGROUND_COLOR = '#222';
const ADDITIONAL_INFO_COLOR = '#6e6e6e';
const ADDITIONAL_SUCCESS_COLOR = '#549159';
const ERROR_COLOR = '#d32f2f';
const WARNING_COLOR = '#f57c00';
const SUCCESS_COLOR = '#42b94a';

export class ConsoleOutput implements IOutput {
    private _items: IOutputItem[] = [];
    private _new: number[] = [];

    add(
        type: TOutputItemType,
        args: TOutputItemArgs = [],
        status: TOutputItemStatus = 'default'
    ): IOutput {
        this._new.push(
            this._items.push({
                type,
                args,
                status,
            }) - 1
        );
        return this;
    }

    clearAll(): void {
        this._items = [];
        this._new = [];
    }

    clearNew(): void {
        this._new = [];
    }

    showAll(): void {
        this._showItems(this._items);
    }

    showNew(): void {
        this._showItems(this._new.map((i) => this._items[i]));
    }

    private _showItems(items: IOutputItem[]): void {
        const result: IOutputItem[] = [];

        for (let i = 0; i < items.length; i++) {
            if (items[i].type === 'group' || items[i].type === 'groupCollapsed') {
                if (i < items.length - 1 && items[i + 1].type === 'groupEnd') {
                    result.push({
                        ...items[i],
                        type: 'info',
                        status: 'additionalInfo',
                    } as IOutputItem);
                    i++;
                    continue;
                }
            }
            result.push(items[i]);
        }

        result.forEach(this._showItem.bind(this));
    }

    private _showItem(item: IOutputItem): void {
        const { type, args } = this._addStyleToItem(item);

        switch (type) {
            case 'info':
                AppLogger.info(...args);
                break;
            case 'group':
                // eslint-disable-next-line no-console
                console.group(...args);
                break;
            case 'groupCollapsed':
                // eslint-disable-next-line no-console
                console.groupCollapsed(...args);
                break;
            case 'groupEnd':
                // eslint-disable-next-line no-console
                console.groupEnd();
                break;
            case 'trace':
                // eslint-disable-next-line no-console
                console.trace(...args);
                break;
        }
    }

    private _addStyleToItem(item: IOutputItem): IOutputItem {
        if (!item.args.length || item.status === 'default') {
            return item;
        }
        const styledArgs = [...item.args];
        styledArgs[0] = `%c${item.args[0]}`;

        if (item.args.length > 1) {
            item.args.splice(1, 0, '');
        }

        switch (item.status) {
            case 'warning':
                styledArgs[1] = `background: ${BACKGROUND_COLOR}; color: ${WARNING_COLOR}`;
                break;
            case 'error':
                styledArgs[1] = `background: ${BACKGROUND_COLOR}; color: ${ERROR_COLOR}`;
                break;
            case 'additionalSuccess':
                styledArgs[1] = `color: ${ADDITIONAL_SUCCESS_COLOR}`;
                break;
            case 'additionalInfo':
                styledArgs[1] = `color: ${ADDITIONAL_INFO_COLOR}`;
                break;
            case 'success':
                styledArgs[1] = `background: ${BACKGROUND_COLOR}; color: ${SUCCESS_COLOR}`;
                break;
        }

        return {
            ...item,
            args: styledArgs,
        };
    }
}
