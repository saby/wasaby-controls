import { Component } from 'react';
import {DialogOpener as DialogHelper, IBasePopupOptions} from 'Controls/popup';
import {IMarkSelectorPanelOptions} from 'Controls-Colors/colormark';

/**
 * Интерфейс IDialogOpenerProps.
 * @interface Controls-Colors/_dialogOpener/IDialogOpenerProps
 * @implements Controls/popup:IBasePopupOptions
 * @public
 */
export interface IDialogOpenerProps extends IBasePopupOptions<IMarkSelectorPanelOptions> {
}

/**
 * Хелпер для открытия окна "Пометки цветом"
 * @class Controls-Colors/_dialogOpener/DialogOpener
 * @demo Controls-Colors-demo/DialogOpener/Index
 * @example
 * <pre class="brush: js">
 *     import {DialogOpener} from 'Controls-Colors/dialogOpener';
 *
 *     const helper = new DialogOpener({});
 *     helper.open({
 *                 opener: buttonNode,
 *                 target: buttonNode,
 *                 templateOptions: {
 *                     items: itemsWithCustom,
 *                     palette,
 *                     selectedKeys
 *                 },
 *                 width: 252,
 *                 eventHandlers: {
 *                     onResult(res: string[]) {
 *                         setSelectedKeys(res);
 *                     }
 *                 }
 *             });
 * </pre>
 * @public
 */
export class DialogOpener extends Component {
    protected _dialog: DialogHelper;

    open(props: IDialogOpenerProps) {
        if (!this._dialog) {
            this._dialog = new DialogHelper();
        }
        return this._dialog.open({
            ...props,
            template: 'Controls-Colors/dialogTemplate:ColormarkTemplate',
            eventHandlers: {
                onResult: (res) => {
                    if (props.eventHandlers?.onResult) {
                        props.eventHandlers.onResult(res);
                    }
                    this._dialog.close();
                },
            },
        });
    }

    close() {
        if (this._dialog.isOpened()) {
            this._dialog.close();
        }
    }

    destroy() {
        this._dialog?.destroy();
    }
}

/**
 * Метод открытия диалогового окна.
 * @function Controls-Colors/_dialogOpener/DialogOpener#open
 * @param {Controls-Colors/dialogOpener:IDialogOpenerProps} config Конфигурация окна.
 * @return Promise<void>
 */

/**
 * Метод закрытия диалогового окна.
 * @function Controls-Colors/_dialogOpener/DialogOpener#close
 */

/**
 * Разрушает экземпляр класса.
 * @function Controls-Colors/_dialogOpener/DialogOpener#destroy
 */

