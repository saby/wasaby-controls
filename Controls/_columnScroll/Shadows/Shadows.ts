/**
 * @kaizen_zone f2525ebd-e747-4591-b4c8-935558e9eb48
 */
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls/_columnScroll/Shadows/Shadows';
import ColumnScrollController from './../ColumnScrollController';
import { TBottomPaddingClass } from 'Controls/baseList';

interface IShadowsOptions extends IControlOptions {
    backgroundStyle?: string;
    bottomPaddingClass?: TBottomPaddingClass;
}

export default class Shadows extends Control<IControlOptions> {
    private _template: TemplateFunction = template;

    private _getClasses(options: IShadowsOptions, position: 'start' | 'end'): string {
        return ColumnScrollController.getShadowClasses(position, {
            backgroundStyle: options.backgroundStyle || 'default',
            needBottomPadding: !!options.bottomPaddingClass,
        });
    }
}
