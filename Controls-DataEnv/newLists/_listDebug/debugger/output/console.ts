/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { IOutputItem } from './IOutput';
import { logger as AppLogger } from 'Application/Env';
import { TMakeRequired } from '../types/TMakeRequired';
import { AbstractOutput } from './AbstractOutput';

const BACKGROUND_COLOR = '#222';
const ADDITIONAL_INFO_COLOR = '#6e6e6e';
const ADDITIONAL_SUCCESS_COLOR = '#549159';
const ERROR_COLOR = '#d32f2f';
const WARNING_COLOR = '#f57c00';
const SUCCESS_COLOR = '#42b94a';

export class ConsoleOutput extends AbstractOutput {
    renderItemImmediate({
        type,
        status = 'default',
        args = [],
    }: TMakeRequired<IOutputItem, 'type'>) {
        this._showItem({
            type,
            args,
            status,
        });
    }

    renderAll(): void {
        this._showItems(this._allItems);
    }

    renderNew(): void {
        this._showItems(this._newItems);
    }

    private _showItems(items: IOutputItem[]): void {
        const result: IOutputItem[] = [];

        for (let i = 0; i < items.length; i++) {
            if (items[i].type === 'group' || items[i].type === 'groupCollapsed') {
                if (i < items.length - 1 && items[i + 1].type === 'groupEnd') {
                    if (this._config.style === 'All' || this._config.style === 'AllShort') {
                        result.push({
                            ...items[i],
                            type: 'info',
                            status: 'additionalInfo',
                        } as IOutputItem);
                    }

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
        if (
            !item.args.length ||
            item.status === 'default' ||
            (item.args.length === 1 && typeof item.args[0] === 'object')
        ) {
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
