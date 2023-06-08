/**
 * @kaizen_zone 4f556a12-3d12-4c5d-bfd8-53e193344358
 */
import { descriptor } from 'Types/entity';
import { TemplateFunction } from 'UI/Base';
import { ICutOptions } from './interface/ICut';
import BaseCut from 'Controls/_spoiler/BaseCut';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as template from 'wml!Controls/_spoiler/TextCut/TextCut';
import 'css!Controls/spoiler';

/**
 * Графический контрол, который ограничивает контент заданным числом строк.
 * Если контент превышает указанное число строк, то он обрезается и снизу добавляется многоточие.
 *
 * @class Controls/_spoiler/TextCut
 * @extends UI/Base:Control
 * @implements Controls/spoiler:ICut
 * @implements Controls/spoiler:ILines
 * @public
 * @demo Controls-demo/Spoiler/Cut/Index
 *
 */
class TextCut extends BaseCut {
    protected _lines: number | null = null;

    protected _template: TemplateFunction = template;

    protected _beforeMount(options?: ICutOptions): Promise<void> | void {
        super._beforeMount(options);
        this._lines = TextCut._calcLines(options.lines, this._expanded);
    }

    protected _beforeUpdate(options?: ICutOptions): void {
        super._beforeUpdate(options);
        this._lines = TextCut._calcLines(options.lines, this._expanded);
    }

    private static _calcLines(
        lines: number | null,
        expanded: boolean
    ): number | null {
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
