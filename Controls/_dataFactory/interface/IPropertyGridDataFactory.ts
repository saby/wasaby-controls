/**
 * @kaizen_zone 997e2040-c20b-4857-8580-c283c4b85f85
 */
import { IBaseDataFactoryArguments, IDataFactory } from './IDataFactory';
import { IProperty, IPropertyGrid } from 'Controls/propertyGrid';

export interface IPropertyGridDataFactoryArguments extends IBaseDataFactoryArguments {
    typeDescription: IProperty[];
    editingObject: IPropertyGrid.TEditingObject;
    keyProperty?: string;
    valueProperty?: string;
}

export type IPropertyGridDataFactory = IDataFactory<
    IPropertyGridDataFactoryArguments,
    IPropertyGridDataFactoryArguments
>;
