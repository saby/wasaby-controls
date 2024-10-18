/**
 * @kaizen_zone 5b9ef316-9f00-45a5-a6b7-3b9f6627b1da
 */
import * as rk from 'i18n!Controls';
import * as React from 'react';
import DropdownSelector from 'Controls/_dropdown/Selector';
import { RecordSet } from 'Types/collection';
import { useReadonly } from 'UI/Contexts';
import { IControlProps } from 'Controls/interface';

interface IToggleProps extends IControlProps {
    selectedKeys: boolean[];
}

const items = new RecordSet({
    rawData: [
        {
            key: true,
            title: rk('Да'),
            icon: 'icon-Successfully',
            iconStyle: 'success',
        },
        { key: false, title: rk('Нет'), icon: 'icon-Decline', iconStyle: 'danger' },
    ],
    keyProperty: 'key',
});

/**
 * Контрол, позволяющий выбрать значение из списка. Отображается в виде выпадающего списка с тремя значениями: "Да", "Нет" и "Не выбрано".
 * @remark
 * Меню можно открыть кликом на контрол. Для работы единичным параметром selectedKeys используйте контрол с {@link Controls/source:SelectedKey}.
 *
 * @extends UI/Base:Control
 * @implements Controls/interface:IMultiSelectable
 * @demo Controls-demo/dropdown_new/Toggle/Simple/Index
 *
 * @public
 */
function DropdownToggle(props: IToggleProps, ref) {
    const readOnly = useReadonly(props);
    return (
        <DropdownSelector
            forwardedRef={ref}
            attrs={props.attrs}
            items={items}
            readOnly={readOnly}
            keyProperty="key"
            displayProperty="title"
            emptyText={rk('Не выбрано')}
            iconSize="m"
            contentTemplate="Controls/dropdown:defaultContentTemplateWithIcon"
            validationStatus={props.validationStatus}
            onSelectedKeysChanged={props.onSelectedKeysChanged}
            selectedKeys={props.selectedKeys || [null]}
        />
    );
}

export default React.forwardRef(DropdownToggle);

/**
 * @name Controls/dropdown:Toggle#selectedKeys
 * @cfg {Array.<Boolean|null>} Массив с единственным элементом, который указывает на выбранный элемент.
 * @remark
 * Соответствие значений элемента массива:
 * * true — пункт "Да".
 * * false — пункт "Нет".
 * * null — пункт "Не выбрано".
 * @default [null]
 * @demo Controls-demo/dropdown_new/Toggle/SelectedKeys/Index
 */
