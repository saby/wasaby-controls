import { Control } from 'Controls/Chips';
import { SyntheticEvent } from 'UICommon/Events';
import * as React from 'react';

/**
 * Редактор свойства "Границы" в колонке
 * @param props
 * @constructor
 */
export function ColumnSeparatorEditor(props): JSX.Element {
    const { value, onChange, LayoutComponent, items } = props;
    const separatorFields = React.useMemo(() => {
        return ['right', 'left'];
    }, []);
    const selectedKeys = React.useMemo(() => {
        const keys: string[] = [];
        separatorFields.map((field: string) => {
            if (value[field] === 'bold') {
                keys.push(field);
            }
        });
        return keys;
    }, [separatorFields, value]);
    const onSelectedKeysChanged = React.useCallback(
        (event: SyntheticEvent<Event>, keys: string[]) => {
            const newValue = {};
            separatorFields.map((field: string) => {
                const selected = keys.includes(field);
                if (selected) {
                    newValue[field] = 'bold';
                } else {
                    newValue[field] = 's';
                }
            });
            onChange(newValue);
        },
        [separatorFields, onChange, selectedKeys]
    );
    return (
        <LayoutComponent>
            <Control
                items={items}
                viewMode={'filled'}
                contrastBackground={false}
                fontSize={'4xl'}
                onSelectedKeysChanged={onSelectedKeysChanged}
                selectedKeys={selectedKeys}
            />
        </LayoutComponent>
    );
}
