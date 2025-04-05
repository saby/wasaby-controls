import { useItemData } from 'Controls/grid';
import { Text } from 'Controls/input';
import { RecordSet } from 'Types/collection';
import ComboBox from 'Controls/ComboBox';
import * as React from 'react';
export function RowEditor() {
    const {
        item,
        renderValues: { name, type, comment },
    } = useItemData(['name', 'type', 'comment']);
    const items = React.useMemo(() => {
        return new RecordSet({
            keyProperty: 'key',
            rawData: [
                {
                    key: 1,
                    title: 'Double',
                },
                {
                    key: 2,
                    title: 'Auto',
                },
                {
                    key: 3,
                    title: 'Decimal',
                },
                {
                    key: 4,
                    title: 'Flags',
                },
                {
                    key: 5,
                    title: 'Time',
                },
            ],
        });
    }, []);
    const onChange = React.useCallback(
        (field) => {
            return (newValue) => {
                if (field === 'type') {
                    item.set('type', items.getRecordById(newValue).get('title'));
                } else {
                    item.set(field, newValue);
                }
            };
        },
        [item]
    );
    const selectedKey = React.useMemo(() => {
        let result;
        for (let i = 0; i < items.getCount(); i++) {
            if (type === items.at(i).get('title')) {
                result = items.at(i).get('key');
            }
        }
        return result || 2;
    }, [item, type]);
    return (
        <div>
            <div style={{ paddingBottom: 'var(--offset_s)' }}>
                <Text contrastBackground={true} value={name} onValueChanged={onChange('name')} />
            </div>
            <div style={{ paddingBottom: 'var(--offset_s)' }}>
                <ComboBox
                    keyProperty={'key'}
                    displayProperty={'title'}
                    items={items}
                    selectedKey={selectedKey}
                    contrastBackground={true}
                    onSelectedKeyChanged={onChange('type')}
                />
            </div>
            <div style={{ paddingBottom: 'var(--offset_2xs)' }}>
                <Text
                    contrastBackground={true}
                    value={comment}
                    onValueChanged={onChange('comment')}
                />
            </div>
        </div>
    );
}
