import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-TabsLayout/_popup/Template';
import 'css!Controls-TabsLayout/_popup/Template';
import { SyntheticEvent } from 'Vdom/Vdom';
import { constants } from 'Env/Env';
import { getSettings, setSettings } from 'Controls/Application/SettingsController';
import { MIN_TAB_WIDTH } from 'Controls-TabsLayout/floatingTabs';

interface ITemplateOptions extends IControlOptions {
    propStorageId?: string;
    maxWidth: number;
    minWidth: number;
    backgroundImage?: string;
}

/**
 * Базовый шаблон, который используется при создании шаблонов для вертикальных вкладок.
 * @extends UI/Base:Control
 *
 * @public
 * @demo Controls-TabsLayout-demo/Floating/Panel
 */

export default class Template extends Control<ITemplateOptions> {
    protected _template: TemplateFunction = template;
    protected _styles: string;
    protected _width: number;
    protected _minOffset: number;
    protected _maxOffset: number;

    protected _beforeMount(options: ITemplateOptions): Promise<void> | void {
        if (options.propStorageId) {
            return new Promise((resolve) => {
                getSettings([options.propStorageId]).then((storage) => {
                    if (storage && storage[options.propStorageId]) {
                        this._width = Math.min(options.maxWidth, storage[options.propStorageId]);
                    } else {
                        this._width = options.maxWidth;
                    }
                    this._updateOffset(options);
                    resolve();
                });
            });
        }
        this._width = Math.max(options.maxWidth, MIN_TAB_WIDTH);
        this._updateOffset(options);
    }

    protected _afterMount(): void {
        this._notify('initFloatingTab', []);
    }

    protected _beforeUpdate(newOptions: ITemplateOptions): void {
        if (
            newOptions.minWidth !== this._options.minWidth ||
            newOptions.maxWidth !== this._options.maxWidth
        ) {
            this._width = Math.max(newOptions.maxWidth, MIN_TAB_WIDTH);
            this._updateOffset(newOptions);
        }
    }

    private _updateOffset(options: ITemplateOptions = this._options): void {
        // protect against wrong options
        this._maxOffset = Math.max(options.maxWidth - this._width, 0);
        this._minOffset = Math.max(this._width - options.minWidth, 0);
    }

    protected _offsetHandler(event: Event, offset: number): void {
        this._width += offset;
        this._updateOffset();
        setSettings({ [this._options.propStorageId]: this._width });
    }

    protected _transitionendHandler(): void {
        const isVisible = !!this._container.style.right;
        if (isVisible) {
            this.activate();
        }
    }

    protected _keydownHandler(event: SyntheticEvent<KeyboardEvent>): void {
        if (event.nativeEvent.keyCode === constants.key.esc) {
            this.hide();
            event.preventDefault();
            event.stopImmediatePropagation();
        }
    }

    protected _getMinWidth(): number {
        let minWidth = this._options.minWidth;
        if (minWidth && minWidth > this._width) {
            minWidth = this._width;
        }
        return minWidth;
    }
    hide(): void {
        this._notify('hideFloatingTab', []);
    }

    protected _closeButtonClickHandler(): void {
        this.hide();
    }
}

/**
 * @name Controls-TabsLayout/_popup/Template#propStorageId
 * @cfg {String} Уникальный идентификатор контрола, по которому будет сохраняться конфигурация в хранилище данных.
 * При задании опции minWidth, maxWidth, propStorageId включается функционал движения границ.
 */

/**
 * @name Controls-TabsLayout/_popup/Template#maxWidth
 * @cfg {Number} Определяет максимальный размер шаблона, до которого он может увеличиться.
 * При задании опции minWidth, maxWidth, propStorageId включается функционал движения границ.
 */

/**
 * @name Controls-TabsLayout/_popup/Template#minWidth
 * @cfg {Number} Определяет минимальный размер шаблона, до которого он может уменьшиться.
 * При задании опции minWidth, maxWidth, propStorageId включается функционал движения границ.
 */

/**
 * @name Controls-TabsLayout/_popup/Template#backgroundImage
 * @cfg {Number} Определяет сслыку на изображение для задания фона вкладки.
 */
