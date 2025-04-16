/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
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
