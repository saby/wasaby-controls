import { useConnectedValue, clearProps } from './useConnectedValue';
import { RecordSet } from 'Types/collection';
import { Control } from 'Controls/CheckboxGroup';
import { IControlProps } from 'Controls/interface';
import { InputLabel } from './_inputConnected/InputLabel';
import { defaultItemTemplate as CheckboxItemTemplate } from 'Controls/CheckboxGroup';
import * as rk from 'i18n!Controls';
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

/**
 * Редактор "Группа чекбоксов", работающий со слайсом формы
 * @param props
 */
function CheckboxGroupConnected(props: ICheckBoxGroupProps & IControlProps) {
    const { value, onChange } = useConnectedValue(props.name);
    const itemTemplate = useContent(
        (outerProps) => ItemTemplate(outerProps, props.wrapText),
        [props.wrapText]
    );

    return (
        <InputLabel value={value} label={props.label} className={props.className}>
            <Control
                selectedKeys={value}
                onSelectedKeysChanged={onChange}
                customEvents={['onSelectedKeysChanged']}
                parentProperty="parent"
                nodeProperty="node"
                keyProperty="id"
                itemTemplate={itemTemplate}
                {...clearProps(props)}
                items={props.items || defaultItems}
            />
        </InputLabel>
    );
}

CheckboxGroupConnected.displayName = 'Controls-Input/CheckboxGroupConnected';
export default CheckboxGroupConnected;
