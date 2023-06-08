import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-ListEnv/_operations/WrappedButton';
import { IBrowserSlice } from 'Controls/context';

export interface IOperationsButtonWidget extends IControlOptions {
    _dataOptionsValue: Record<string, IBrowserSlice>;
    storeId: string;
}

export default class OperationsButtonWidget extends Control<IOperationsButtonWidget> {
    protected _template: TemplateFunction = template;
}
