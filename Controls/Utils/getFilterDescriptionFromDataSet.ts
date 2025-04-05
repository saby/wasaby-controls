import { DataSet } from 'Types/source';
import { IFilterDescriptionItem as IFilterItem } from 'Controls-DataEnv/interface';
import { factory } from 'Types/chain';
import { Model } from 'Types/entity';
import { FilterDescription, FilterHistory } from 'Controls/filter';

interface IFilterItemDataSet {
    Id: string;
    AdditionalInfo: {
        IsArray?: boolean;
        DisplayText?: string;
        Editor?: string;
    };
    AdditionalRecordInfo: {
        value: unknown;
    };
}
export default function getFilterDescriptionFromDataSet(
    filtersDataSet: DataSet,
    filter?: Record<string, unknown> = {},
    {
        historyId,
    }: {
        historyId?: string;
    } = {}
): Promise<IFilterItem[]> {
    const filterDescription: IFilterItem[] = factory<Model<IFilterItemDataSet>>(
        filtersDataSet.getAll()
    )
        .map((item) => {
            const addInfo = item.get('AdditionalInfo');
            const isArray = addInfo.IsArray;
            const splitName = item.get('Id').split('.');
            const name = splitName?.[splitName.length - 1];
            const value = filter[name];
            return {
                name,
                value,
                textValue: '',
                caption: addInfo.DisplayText,
                editorTemplateName: addInfo.Editor,
                editorOptions: {
                    multiSelect: isArray,
                },
            } as unknown as IFilterItem;
        })
        .value();
    if (historyId) {
        return FilterHistory.getHistoryItems(historyId, filterDescription).then((historyItems) => {
            return FilterDescription.mergeFilterDescriptions(
                filterDescription,
                historyItems as IFilterItem[]
            );
        });
    }
    return Promise.resolve(filterDescription);
}
