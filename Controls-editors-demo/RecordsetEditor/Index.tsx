import { ArrayType, ObjectType, StringType, BooleanType } from 'Meta/types';
import { data, columns } from './data';
import { Editor } from 'Controls-editors/recordset';
import * as React from 'react';
import { RecordSet } from 'Types/collection';
interface IMetaType {
    name: string;
    type: string;
    comment: string;
    unique: boolean;
}
export default React.forwardRef(function Index(
    _: unknown,
    ref: React.ForwardedRef<HTMLDivElement>
) {
    const [items, setItems] = React.useState(
        new RecordSet({
            rawData: data,
            keyProperty: 'key',
        })
    );
    const onChange = React.useCallback((value: RecordSet) => {
        setItems(value);
    }, []);
    const itemType = ObjectType.properties<IMetaType>({
        name: StringType,
        type: StringType.oneOf(['Auto', 'Double', 'Decimal', 'Flags', 'Time'])
            .editor('Controls-editors/dropdown:EnumStringEditor', {
                options: ['Auto', 'Double', 'Decimal', 'Flags', 'Time'],
            })
            .defaultValue('Auto'),
        comment: StringType,
        unique: BooleanType.defaultValue(true),
    });
    const metaType = ArrayType.of(itemType).title('Колонки');
    return (
        <div ref={ref}>
            <Editor value={items} onChange={onChange} metaType={metaType} columns={columns} />
        </div>
    );
});
