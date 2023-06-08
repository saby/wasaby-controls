/**
 * @kaizen_zone f2525ebd-e747-4591-b4c8-935558e9eb48
 */
import {
    Control,
    IControlOptions,
    TemplateFunction,
    IControlChildren,
} from 'UI/Base';
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
