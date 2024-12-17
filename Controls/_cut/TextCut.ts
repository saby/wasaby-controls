/**
 * @kaizen_zone 15b68a94-a4bb-4fdf-9460-7f62fb494c87
 */
import { descriptor } from 'Types/entity';
import { TemplateFunction } from 'UI/Base';
import { ICutOptions } from './interface/ICut';
import BaseCut from 'Controls/_cut/BaseCut';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as template from 'wml!Controls/_cut/TextCut/TextCut';
import { detection } from 'Env/Env';
import 'css!Controls/cut';

/**
 * Графический контрол, который ограничивает контент заданным числом строк.
 * Если контент превышает указанное число строк, то он обрезается и снизу добавляется многоточие.
 *
 * @extends UI/Base:Control
 * @implements Controls/cut:ICut
 * @implements Controls/cut:ILines
 * @public
 * @demo Controls-demo/Spoiler/Cut/Index
 *
 */
class TextCut extends BaseCut {
    protected _lines: number | null = null;

    protected _template: TemplateFunction = template;
    protected _lineHeight: string;

    protected _beforeMount(options?: ICutOptions): Promise<void> | void {
        super._beforeMount(options);
        this._lines = TextCut._calcLines(options.lines, this._expanded);
        this._setLineHeight(options);
    }

    protected _beforeUpdate(options?: ICutOptions): void {
        super._beforeUpdate(options);
        this._lines = TextCut._calcLines(options.lines, this._expanded);
        this._setLineHeight(options);
    }

    protected _setLineHeight(options: ICutOptions): void {
        this._lineHeight = detection.isPhone ? 'adaptive' : options.lineHeight;
    }

    private static _calcLines(lines: number | null, expanded: boolean): number | null {
        return expanded ? null : lines;
    }

    static getOptionTypes(): object {
        const defaultTypes = BaseCut.getOptionTypes();
        return {
            ...defaultTypes,
            lineHeight: descriptor(String),
            lines: descriptor(Number, null).required(),
        };
    }

    static getDefaultOptions(): object {
        const defaultOptions = BaseCut.getDefaultOptions();
        return {
            ...defaultOptions,
            lineHeight: 'm',
        };
    }
}

export default TextCut;
