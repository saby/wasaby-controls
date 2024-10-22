/**
 * @kaizen_zone 620ede61-d6a1-43c3-b811-f368d16d19f5
 */
import * as React from 'react';

interface ISelectedContainerOptions {
    propertyValue: string | string[];
    resetValue: string | string[];
    multiSelect?: boolean;
    children?: React.ReactNode;
}

/**
 * Контейнер для работы со списочным редактором, который отслеживает изменение выбранного элемента и уведомляет с помощью события selectedKeyChanged.
 * @class Controls/_filterPanelEditors/SelectionContainer
 * @private
 */

/**
 * @name Controls/_filterPanelEditors/SelectionContainer#selectedKeyChanged
 * @event Происходит при изменении выбранного значения в списке.
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {number|string} selectedKey Ключ выбранного элемента.
 */

export default React.forwardRef(function SelectionContainer(
    props: ISelectedContainerOptions,
    ref: React.ForwardedRef<unknown>
): React.ReactElement {
    const getSelectedKeys = ({
        multiSelect,
        propertyValue,
        resetValue,
    }: ISelectedContainerOptions) => {
        let newSelectedKeys = [];
        if (propertyValue === undefined) {
            return newSelectedKeys;
        }

        if (propertyValue !== null || (resetValue && propertyValue !== resetValue)) {
            if (multiSelect && propertyValue instanceof Array) {
                newSelectedKeys = propertyValue;
            } else {
                newSelectedKeys = [propertyValue];
            }
        }

        return newSelectedKeys;
    };

    let selectedKeys = getSelectedKeys(props);

    const updateKeyAndNotifyChanged = (key: string[]) => {
        selectedKeys = getSelectedKeys({
            multiSelect: props.multiSelect,
            propertyValue: key,
            resetValue: props.resetValue,
        });
        const result = props.multiSelect ? key : key[0];
        (props.onSelectedKeysChanged || props.onSelectedkeyschanged)?.(result);
    };

    const updateSingleSelectionKey = (
        keys: number[] | string[],
        added?: number[] | string[],
        deleted?: number[] | string[]
    ) => {
        let selectedKey;
        if (!added && !deleted) {
            selectedKey = keys.length ? keys[0] : null;
        } else {
            selectedKey = added.length ? added[0] : deleted[0];
        }
        updateKeyAndNotifyChanged([selectedKey]);
    };

    return (
        <props.content
            {...props.contentProps}
            selectedKeys={selectedKeys}
            onSelectedKeysChanged={
                props.multiSelect ? updateKeyAndNotifyChanged : updateSingleSelectionKey
            }
            customEvents={['onSelectedKeysChanged']}
        />
    );
});
