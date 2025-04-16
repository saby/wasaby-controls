import * as template from 'wml!Controls/_popup/WasabyOpeners/Edit/WrappedContainer';
import { Control, TemplateFunction } from 'UI/Base';

// По какой-то причине обертка Controls.Container.Async перетирает _options у wml шаблона
// По этой причине сделаем WrappedContainer компонентом
export default class WrappedContainer extends Control {
    protected _template: TemplateFunction = template;
}
