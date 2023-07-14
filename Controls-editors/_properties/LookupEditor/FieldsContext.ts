import { createContext, MutableRefObject } from 'react';
import { TKey } from 'Controls/interface';
import { IDataConfig } from 'Controls-DataEnv/dataFactory';
import { IFieldItem } from './FieldsSource';

export interface IFieldsContextValue<TFieldsConfig = unknown, TFieldItem = IFieldItem> {
    itemsGetterRef: MutableRefObject<(config: TFieldsConfig) => Promise<TFieldItem[]>>;
    fieldsConfigRef: MutableRefObject<TFieldsConfig>;
    fieldsDataRef: MutableRefObject<TFieldItem[]>;
    getDataAsync: () => Promise<TFieldItem[]>;
    getDataContextPropsAsync: () => Promise<IDataContextOptions>;
}

interface IDataContextOptions {
    loadResults?: Record<TKey, unknown>;
    configs?: Record<TKey, IDataConfig>;
    changedCallback?: (store: unknown) => void;
}

export const emptyFieldsContextValue: IFieldsContextValue = {
    itemsGetterRef: { current: () => Promise.resolve([]) },
    fieldsConfigRef: { current: {} },
    fieldsDataRef: { current: [] },
    getDataAsync: () => Promise.resolve([]),
    getDataContextPropsAsync: () => Promise.resolve({}),
};

export const FieldsContext = createContext<IFieldsContextValue>(emptyFieldsContextValue);
