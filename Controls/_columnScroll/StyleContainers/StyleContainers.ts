/**
 * @kaizen_zone 9a7cef37-31b7-49ee-a384-22b66a35929b
 */
import { Control, IControlOptions, TemplateFunction, IControlChildren } from 'UI/Base';
import * as template from 'wml!Controls/_columnScroll/StyleContainers/StyleContainers';

export interface IContainers extends IControlChildren {
    staticStyles: HTMLStyleElement;
    transformStyles: HTMLStyleElement;
    shadowsStyles: HTMLStyleElement;
    dragScrollStyles: HTMLStyleElement;
}

interface IStyleContainersOptions extends IControlOptions {
    preRenderTransformStyles?: string;
}

export default class StyleContainers extends Control<IStyleContainersOptions> {
    protected _template: TemplateFunction = template;
    protected _children: IContainers;

    getContainers(): IContainers {
        return {
            staticStyles: this._children.staticStyles,
            transformStyles: this._children.transformStyles,
            shadowsStyles: this._children.shadowsStyles,
            dragScrollStyles: this._children.dragScrollStyles,
        };
    }
}
