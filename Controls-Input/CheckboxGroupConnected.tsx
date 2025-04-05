/**
 * @kaizen_zone 4efc1ffa-202d-406f-befe-efa4a5d4ee0c
 */
import { clearProps, useConnectedValue } from 'Controls-DataEnv/context';
import { RecordSet } from 'Types/collection';
import { Control, defaultItemTemplate as CheckboxItemTemplate } from 'Controls/CheckboxGroup';
import { IComponentProps, TSelectedKey } from 'Controls/interface';
import { InputLabel } from 'Controls-Input/inputConnected';
import { getValidators, useValidation } from 'Controls-Input/validators';
import * as rk from 'i18n!Controls-Input';
import {
    IDirectionOptions,
    IItem,
    IItemsOptions,
    ILabelOptions,
    INameOptions,
    IRequiredOptions,
    IWrapOptions,
} from 'Controls-Input/interface';
import { useContent } from 'UICore/Jsx';
import { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { Flags } from 'Types/collection';

/**
 * Интерфейс для редактора "Группа чекбоксов"
 * @public
 */
export interface ICheckBoxGroupProps
    extends INameOptions,
        ILabelOptions,
        IRequiredOptions,
        IItemsOptions,
        IDirectionOptions,
        IWrapOptions {}

const defaultItems = new RecordSet<IItem>({
    keyProperty: 'id',
    rawData: [
        {
            id: 1,
            title: rk('Первый'),
            parent: null,
            node: false,
        },
        {
            id: 2,
            title: rk('Второй'),
            parent: null,
            node: false,
        },
    ],
});

function ItemTemplate(innerProps, wrapText: boolean): JSX.Element {
    return <CheckboxItemTemplate {...innerProps} multiline={wrapText || false} />;
}

function getSelectedKeysFromFlags(value: Flags<string>): string[] {
    const selectedKeys = [];
    value.each((item) => {
        if (value.get(item)) {
            selectedKeys.push(item);
        }
    });
    return selectedKeys;
}

function getArrayFromFlags(value: Flags<string>): object[] {
    const resultArray = [];
    value.each((item) => {
        const itemConfig = {
            id: item,
            title: item,
            parent: null,
            node: false,
        };
        resultArray.push(itemConfig);
    });
    return resultArray;
}

function changeFlagsSelectedKeys(value: Flags<string>, selectedKeys: TSelectedKey[]) {
    value.each((item) => {
        if (selectedKeys.includes(item)) {
            value.set(item, true);
        } else {
            value.set(item, false);
        }
    });
}

function getSelectedKeys(value: Flags<string> | TSelectedKey[]): TSelectedKey[] {
    return value instanceof Flags ? getSelectedKeysFromFlags(value) : value;
}

/**
 * Редактор "Группа чекбоксов", работающий со слайсом формы
 * @param {ICheckBoxGroupProps} props
 * @public
 */
function CheckboxGroupConnected(props: ICheckBoxGroupProps & IComponentProps) {
    const { value, onChange } = useConnectedValue(props.name);
    const itemTemplate = useContent(
        (outerProps) => ItemTemplate(outerProps, props.wrapText),
        [props.wrapText]
    );
    const [checkboxSelectedKeys, setCheckboxSelectedKeys] = useState<TSelectedKey[]>(
        getSelectedKeys(value)
    );
    useEffect(() => {
        setCheckboxSelectedKeys(getSelectedKeys(value));
    }, [value]);
    const ref = useRef();
    const { resetValidation, validate, validationStatus } = useValidation(
        props.name,
        getValidators(props),
        ref
    );
    const variantsItems = props.variants?.items;
    const items = useMemo(() => {
        const data = value instanceof Flags ? getArrayFromFlags(value) : props.variants?.items;
        return data
            ? new RecordSet({
                  keyProperty: 'id',
                  rawData: data,
              })
            : defaultItems;
    }, [variantsItems, defaultItems, value]);
    const onBlurHandler = useCallback(() => {
        validate();
    }, []);
    const onSelectedKeyChanged = useCallback(
        (selectedKeys: TSelectedKey[]) => {
            if (value instanceof Flags) {
                changeFlagsSelectedKeys(value, selectedKeys);
            }
            resetValidation();
            onChange(value instanceof Flags ? value : selectedKeys);
            setCheckboxSelectedKeys(getSelectedKeys(value));
        },
        [onChange]
    );
    const classes = `${props.className} ${!!value ? 'controls-Input-connected_filled' : ''}`;

    return (
        <InputLabel value={value} label={props.label} className={classes}>
            <Control
                ref={ref}
                selectedKeys={checkboxSelectedKeys || props.variants?.selectedKeys}
                onSelectedKeysChanged={onSelectedKeyChanged}
                customEvents={['onSelectedKeysChanged']}
                parentProperty="parent"
                nodeProperty="node"
                keyProperty="id"
                itemTemplate={itemTemplate}
                {...clearProps(props)}
                items={items}
                validationStatus={validationStatus}
                onBlur={onBlurHandler}
            />
        </InputLabel>
    );
}

CheckboxGroupConnected.displayName = 'Controls-Input/CheckboxGroupConnected';
export default CheckboxGroupConnected;
