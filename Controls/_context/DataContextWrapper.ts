/**
 * @kaizen_zone 997e2040-c20b-4857-8580-c283c4b85f85
 */
import * as template from 'wml!Controls/_context/DataContextWrapper';
import { Control, TemplateFunction } from 'UI/Base';

export default function connectData<T>(innerControl: T): T {
    const component = class DataWrappedComponent extends Control {
        protected _innerTemplate: TemplateFunction = innerControl;
        protected _template: TemplateFunction = template;
    };
    // @ts-ignore for react devtools
    component.displayName = `connectData(${innerControl.displayName})`;
    return component as unknown as T;
}
