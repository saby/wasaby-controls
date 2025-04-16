/**
 * @kaizen_zone 15b68a94-a4bb-4fdf-9460-7f62fb494c87
 */
import BaseCut from 'Controls/_cut/BaseCut';
import { ICutOptions } from './interface/ICut';
import { descriptor } from 'Types/entity';
import { TemplateFunction } from 'UI/Base';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import 'css!Controls/cut';
import * as template from 'wml!Controls/_cut/Cut/Cut';

export interface ICutProps extends ICutOptions {
    maxHeight?: number;
}

/**
 * Графический контрол, который ограничивает контент заданной высотой.
 * Если контент превышает указанную высоту, то он обрезается и снизу добавляется многоточие.
 *
 * @extends UI/Base:Control
 * @implements Controls/cut:ICut
 * @public
 * @demo Controls-demo/Spoiler/Cut/MaxHeight/Index
 *
 */
class Cut extends BaseCut<ICutProps> {
    protected _template: TemplateFunction = template;

    protected _getMaxHeightStyle(): string {
        if (!this._expanded) {
            return 'max-height: ' + this._getMaxHeightValue();
        }
        return '';
    }

    protected _resizeObserverCallback(entries: [ResizeObserverEntry]): void {
        const maxHeight = +this._options.maxHeight + this._lineHeightForIE.m;
        if (this._isChanged(entries) && this._expanded && maxHeight > this._cutHeight) {
            this._expanded = false;
            this._notify('expandedChanged', [this._expanded]);
        }
    }

    private _getMaxHeightValue(): string {
        let maxHeightValue = 'calc(' + this._options.maxHeight + 'px + ';
        if (this._isIE) {
            maxHeightValue += this._lineHeightForIE.m + 'px)';
        } else {
            maxHeightValue += 'var(--line-height_m)';
        }
        return maxHeightValue;
    }

    protected _getMarginStyle(): string {
        let marginStyle = '';
        if (this._expanded) {
            marginStyle = 'margin-bottom: ';
            if (this._isIE) {
                marginStyle += this._lineHeightForIE.m + 'px';
            } else {
                marginStyle += 'var(--line-height_m)';
            }
        } else {
            marginStyle = 'margin-top: ' + this._getMaxHeightValue();
        }
        return marginStyle;
    }

    static getOptionTypes(): object {
        const defaultTypes = BaseCut.getOptionTypes();
        return {
            maxHeight: descriptor(Number, String),
            ...defaultTypes,
        };
    }

    static getDefaultOptions(): object {
        const defaultOptions = BaseCut.getDefaultOptions();
        return {
            ...defaultOptions,
        };
    }
}

/**
 * @name Controls/_cut/Cut#maxHeight
 * @cfg {Number} Максимальная высота, привысив которую контент ограничится и появится кнопка разворота ката.
 * @demo Controls-demo/Spoiler/Cut/MaxHeight/Index
 */

export default Cut;
