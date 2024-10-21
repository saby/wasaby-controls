/**
 * @kaizen_zone 9a7cef37-31b7-49ee-a384-22b66a35929b
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
