import { IOutputItem } from './IOutput';
import { TMakeRequired } from '../types/TMakeRequired';
import { AbstractOutput } from './AbstractOutput';

const BACKGROUND_COLOR = '#222';
const ADDITIONAL_INFO_COLOR = '#6e6e6e';
const BIG_ERROR_BACKGROUND_COLOR = '#b03636';
const ADDITIONAL_SUCCESS_COLOR = '#549159';
const ERROR_COLOR = '#ff2424';
const ERROR_COLOR3 = '#be2626';
const ERROR_COLOR2 = '#e71010';
const ERROR_COLOR1 = '#ff0000';
const BIG_ERROR_COLOR = '#fcfcfc';
const WARNING_COLOR = '#f57c00';
const WARNING_COLOR3 = '#f89939';
const WARNING_COLOR2 = WARNING_COLOR;
const WARNING_COLOR1 = '#f55e00';

const ATTENTION_COLOR1 = '#f5b000';
const ATTENTION_COLOR2 = ATTENTION_COLOR1;
const ATTENTION_COLOR3 = ATTENTION_COLOR2;

const SUCCESS_COLOR = '#42b94a';

const SUBFOCUS_COLOR = '#00758f';

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
        return this;
    }

    protected _renderItems(items: IOutputItem[]): void {
        items.forEach(this._showItem.bind(this));
    }

    private _showItem(item: IOutputItem): void {
        const { type, args } = this._addStyleToItem(item);

        switch (type) {
            case 'info':
                // eslint-disable-next-line no-console
                console.info(...args);
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

        if (styledArgs.length > 1) {
            styledArgs.splice(1, 0, '');
        }

        switch (item.status) {
            case 'warning':
                styledArgs[1] = `background: ${BACKGROUND_COLOR}; color: ${WARNING_COLOR}`;
                break;
            case 'warning3':
                styledArgs[1] = `background: ${BACKGROUND_COLOR}; color: ${WARNING_COLOR3}`;
                break;
            case 'warning2':
                styledArgs[1] = `color: ${WARNING_COLOR2}`;
                break;
            case 'warning1':
                styledArgs[1] = `background: ${BACKGROUND_COLOR}; color: ${WARNING_COLOR1}`;
                break;
            case 'error':
                styledArgs[1] = `background: ${BACKGROUND_COLOR}; color: ${ERROR_COLOR}`;
                break;
            case 'error3':
                styledArgs[1] = `color: ${ERROR_COLOR3}`;
                break;
            case 'error2':
                styledArgs[1] = `color: ${ERROR_COLOR2}`;
                break;
            case 'error1':
                styledArgs[1] = `color: ${ERROR_COLOR1}`;
                break;
            case 'attention1':
                styledArgs[1] = `color: ${ATTENTION_COLOR1}`;
                break;
            case 'attention2':
                styledArgs[1] = `color: ${ATTENTION_COLOR2}`;
                break;
            case 'attention3':
                styledArgs[1] = `color: ${ATTENTION_COLOR3}`;
                break;
            case 'errorBig':
                styledArgs[1] = `background: ${BIG_ERROR_BACKGROUND_COLOR}; color: ${BIG_ERROR_COLOR}`;
                break;
            case 'additionalSuccess':
                styledArgs[1] = `color: ${ADDITIONAL_SUCCESS_COLOR}`;
                break;
            case 'additionalInfo':
                styledArgs[1] = `color: ${ADDITIONAL_INFO_COLOR}`;
                break;
            case 'subfocusInfo':
                styledArgs[1] = `color: ${SUBFOCUS_COLOR}`;
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
