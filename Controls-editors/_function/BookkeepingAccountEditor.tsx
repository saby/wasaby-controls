import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';
import { Fragment } from 'react';

export interface IBookkeepingAccountEditor extends IPropertyGridPropertyEditorProps<string> {}

/**
 * Редактор типа прикладного объекта "СчетУчета"
 */
function BookkeepingAccountEditor(props: IBookkeepingAccountEditor) {
    const { LayoutComponent = Fragment, value } = props;

    return <LayoutComponent>СчетУчета</LayoutComponent>;
}

export { BookkeepingAccountEditor };
