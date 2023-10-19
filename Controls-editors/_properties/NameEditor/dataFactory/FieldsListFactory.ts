import { IListState, ListSlice } from 'Controls/dataFactory';
import { createFieldsRecordSet, createFieldsSource, IFieldItem } from './FieldsSource';
import { RecordSet } from 'Types/collection';

export interface IDataFactoryParams {
    fields: IFieldItem[];
}

export interface IFieldListState extends IListState {
    fields: IFieldItem[];
}

export interface IFieldLoadResult {
    items: RecordSet;
}

async function loadData(config: IDataFactoryParams): Promise<IFieldLoadResult> {
    return Promise.resolve({
        items: createFieldsRecordSet(config.fields),
    });
}

/**
 * Слайс для списка полей, работающий с внешним хранилищем полей.
 */
export class FieldListSlice extends ListSlice<IFieldListState> {
    protected _initState(
        loadResult: IFieldLoadResult,
        initConfig: IDataFactoryParams
    ): IFieldListState {
        const fields = this._filterFields(initConfig.fields);
        return {
            ...super._initState(loadResult, initConfig),
            fields,
            source: createFieldsSource(fields),
        };
    }

    /**
     * Метод предварительной фильтрации полей
     * @param fields
     * @protected
     */
    protected _filterFields(fields: IFieldItem[]): IFieldItem[] {
        //Скрываем все поля, которые являются колонками
        const result = fields.filter((field) => {
            if (!!field.Parent && fields.find((p) => p.Id === field.Parent)?.View === 'list') {
                return false;
            }

            return true;
        });

        result.forEach((field) => {
            if (field.View === 'list') {
                field.Parent_ = false;
            }
        });

        //Скрываем поля без дочерних элементов, которые оказались без типа
        return result.filter((field) => {
            if (!!field.FieldType) {
                return true;
            }

            return result.some((x) => x.Parent === field.Id);
        });
    }

    protected _beforeApplyState(
        nextState: IFieldListState
    ): Promise<IFieldListState> | IFieldListState {
        if (nextState.fields !== this.state.fields) {
            nextState.fields = this._filterFields(nextState.fields);
            nextState.source = createFieldsSource(nextState.fields);
        }
        return super._beforeApplyState(nextState);
    }
}

export default {
    loadData,
    slice: FieldListSlice,
};
