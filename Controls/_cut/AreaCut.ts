/**
 * @kaizen_zone 15b68a94-a4bb-4fdf-9460-7f62fb494c87
 */
import { TemplateFunction } from 'UI/Base';
import TextCut from './TextCut';
import * as template from 'wml!Controls/_cut/AreaCut/AreaCut';
import { ICutOptions } from './interface/ICut';
import { IAreaOptions } from 'Controls/input';
import { SyntheticEvent } from 'Vdom/Vdom';

interface IAreaCutOptions extends IAreaOptions, ICutOptions {}

/**
 * Графический контрол, который ограничивает контент заданным числом строк в полях ввода.
 * Если контент превышает указанное число строк, то он обрезается и снизу добавляется многоточие.
 *
 * @extends UI/Base:Control
 * @implements Controls/cut:ICut
 * @implements Controls/cut:ILines
 * @implements Controls/input:IArea
 * @see Controls/_input/Area
 * @public
 * @demo Controls-demo/Spoiler/AreaCut/Index
 *
 */

class AreaCut extends TextCut {
    protected _template: TemplateFunction = template;
    protected _expanded: boolean = true;
    protected _value: string | null;
    protected _firstEditPassed: boolean = false;
    protected _isPaddingVisible: boolean = true;
    protected _maxHeight: number = 0;
    protected _children: {
        wrapper: HTMLElement;
        content: HTMLElement;
    };

    protected _beforeMount(options: IAreaCutOptions): void {
        if (options.value) {
            this._firstEditPassed = true;
            this._value = options.value;
        }
        super._beforeMount(options);
    }

    protected _beforeUpdate(options: IAreaCutOptions): void {
        if (
            options.value !== undefined &&
            this._value !== options.value &&
            !(this._value === undefined && options.value === this._options.value)
        ) {
            this._firstEditPassed = true;
            this._value = options.value;
        }
        if (!options.readOnly && !this._firstEditPassed) {
            this._expanded = true;
        }
        if (!this._options.readOnly && options.readOnly) {
            this._expanded = false;
            if (options.readOnly && this._value) {
                this._firstEditPassed = true;
            }
        }
        super._beforeUpdate(options);
    }

    protected _hasResizeObserver(): boolean {
        // В AreCut нет нужды в ResizeObserver, т.к. размер контента меняется после того как пользователь вводит текст
        // в поле ввода. Таким образом кат будет сворчаиваться каждый раз, когда текст переведется на следующиую строку.
        return false;
    }

    protected _keyDownHandler(event: SyntheticEvent<KeyboardEvent>) {
        const arrowKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
        if (!this._expanded && arrowKeys.includes(event.nativeEvent.key)) {
            this._expanded = true;
            this._notify('expandedChanged', [this._expanded]);
        }
    }

    protected _valueChangedHandler(event: Event, value: string): void {
        this._value = value;
        this._notify('valueChanged', [value]);
        if (!this._expanded) {
            this._expanded = true;
            this._maxHeight = +window
                .getComputedStyle(this._children.wrapper)
                .maxHeight.replace('px', '');
            this._notify('expandedChanged', [this._expanded]);
        }

        const lines = value.match(/\n/g)?.length || 0;
        this._isPaddingVisible =
            this._maxHeight <= this._children.content.clientHeight || lines >= this._options.lines;
    }

    protected _mousedownHandler(event: Event): void {
        if (!this._options.readOnly && !this._expanded) {
            this._expanded = true;
            this._notify('expandedChanged', [this._expanded]);
            event.preventDefault();
        }
    }

    protected _onExpandedChangedHandler(event: Event, expanded: boolean): void {
        if (this._expanded !== expanded) {
            this._expanded = expanded;
            this._notify('expandedChanged', [this._expanded]);
        }
    }

    static getDefaultOptions(): object {
        return {
            lineHeight: 'm',
            backgroundStyle: 'default',
        };
    }
}

export default AreaCut;
