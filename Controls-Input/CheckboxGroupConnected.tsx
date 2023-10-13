import { useConnectedValue, clearProps } from './useConnectedValue';
import { RecordSet } from 'Types/collection';
import { Control } from 'Controls/CheckboxGroup';
import { IControlProps, TSelectedKey } from 'Controls/interface';
import { InputLabel } from 'Controls-Input/inputConnected';
import { useValidation, getValidators } from 'Controls-Input/validators';
import { defaultItemTemplate as CheckboxItemTemplate } from 'Controls/CheckboxGroup';
import * as rk from 'i18n!Controls-Input';
import {
    INameOptions,
    ILabelOptions,
    IRequiredOptions,
    IItemsOptions,
    IDirectionOptions,
    IWrapOptions,
    IItem,
} from 'Controls-Input/interface';
import { useContent } from 'UICore/Jsx';
import { useMemo, useCallback } from 'react';

export interface ICheckBoxGroupProps
    extends INameOptions,
        ILabelOptions,
        IRequiredOptions,
        IItemsOptions,
        IDirectionOptions,
        IWrapOptions {
}

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
    return <CheckboxItemTemplate {...innerProps} multiline={wrapText || false}/>;
}

/**
 * Редактор "Группа чекбоксов", работающий со слайсом формы
 * @param props
 */
function CheckboxGroupConnected(props: ICheckBoxGroupProps & IControlProps) {
    const {value, onChange} = useConnectedValue(props.name);
    const itemTemplate = useContent(
        (outerProps) => ItemTemplate(outerProps, props.wrapText),
        [props.wrapText]
    );
    const {resetValidation, validate, validationStatus} = useValidation(
        props.name,
        getValidators(props)
    );
    const variantsItems = props.variants?.items;
    const items = useMemo(() => {
        return variantsItems
            ? new RecordSet({
                keyProperty: 'id',
                rawData: variantsItems,
            })
            : defaultItems;
    }, [variantsItems, defaultItems]);
    const onBlurHandler = useCallback(() => {
        validate();
    }, []);
    const onSelectedKeyChanged = useCallback(
        (selectedKeys: TSelectedKey[]) => {
            resetValidation();
            onChange(selectedKeys);
        },
        [onChange]
    );
    const classes = `${props.className} ${!!value ? 'controls-Input-connected_filled' : ''}`;

    return (
        <InputLabel value={value} label={props.label} className={classes}>
            <Control
                selectedKeys={value || props.variants?.selectedKeys}
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
