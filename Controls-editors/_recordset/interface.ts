import { RecordSet } from 'Types/collection';
import { ArrayMeta, Meta } from 'Meta/types';
import { IColumn, IHeaderCell } from 'Controls/gridDisplay';
import { TKey } from 'Controls/interface';
import { IEditorValidation } from 'Controls-editors/object-type';
import { Record } from 'Types/entity';

export interface IEditor<T> {
    value: RecordSet;
    onChange: (value: RecordSet) => void;
    metaType: ArrayMeta<T[]>;
    columns: IColumn[];
    header: IHeaderCell[];
    keyProperty?: TKey;
    propertyGridStoreId: string;
    validation?: IEditorValidation;
    onBeforeCreate?: (metaType: Meta<T>) => Promise<Record>;
}
