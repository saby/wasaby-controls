import { Fragment, memo, useCallback, useMemo } from 'react';
import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';
import { RecordSet } from 'Types/collection';
import { Control as CheckboxGroup } from 'Controls/CheckboxGroup';

interface ICheckboxGroupBoolEditorProps extends IPropertyGridPropertyEditorProps<boolean[]> {
    value: boolean[];
    direction?: 'horizontal' | 'vertical';
}

/**
 * Реакт компонент, редактор флагов.
 * @class Controls-editors/_checkboxGroupEditor/CheckboxGroupBoolEditor
 * @public
 */
export const CheckboxGroupBoolEditor = memo((props: ICheckboxGroupBoolEditorProps): JSX.Element => {
    const {
        metaType,
        value = [],
        onChange,
        LayoutComponent = Fragment,
        direction = 'horizontal',
    } = props;

    const selectedKeys = useMemo(() => {
        const res: string[] = [];
        value.forEach((val, idx) => {
            if (val) {
                res.push(String(idx));
            }
        });
        return res;
    }, [value]);

    const items = useMemo(() => {
        const data = metaType?.getElements().map((meta) => ({
            id: meta.getId(),
            title: meta.getTitle(),
        }));

        return new RecordSet({
            keyProperty: 'id',
            rawData: data,
        });
    }, [metaType]);

    const selectedKeysChangedHandler = useCallback(
        (changeValue: string[]) => {
            const booleanArray: boolean[] = new Array(value.length).fill(false);
            changeValue.forEach((indexStr) => {
                const idx = parseInt(indexStr, 10);
                booleanArray[idx] = true;
            });
            onChange?.(booleanArray);
        },
        [onChange, value.length]
    );

    return (
        <LayoutComponent>
            <CheckboxGroup
                items={items}
                direction={direction}
                selectedKeys={selectedKeys}
                onSelectedKeysChanged={selectedKeysChangedHandler}
            />
        </LayoutComponent>
    );
});
