import { createFieldsSource, IFieldItem } from './FieldsSource';
import { IListDataFactoryArguments, ListSlice, List } from 'Controls/dataFactory';

const DEFAULT_FIELDS_SLICE_NAME = 'FieldsData';

export interface IFieldsListDataFactoryArguments extends IListDataFactoryArguments {
    fieldsSliceName?: string;
}

export default {
    getDataFactoryArguments(
        dataFactoryParams: IFieldsListDataFactoryArguments,
        dependenciesResults: { [sliceName: string]: IFieldItem[] }
    ) {
        const fieldsData =
            dependenciesResults[dataFactoryParams.fieldsSliceName || DEFAULT_FIELDS_SLICE_NAME] ||
            [];
        const source = createFieldsSource(fieldsData);
        return {
            source,
            expandedItems: fieldsData
                .filter((field) => field.Parent_ && !field.Parent)
                .map((field) => field.Id),
            ...dataFactoryParams,
        };
    },
    loadData: List.loadData,
    slice: ListSlice,
};
