import { cloneElement, ForwardedRef, forwardRef, useMemo, useEffect } from 'react';
import { IControlOptions } from 'UI/Base';
import { TKey } from 'Controls/interface';
import { RecordSet } from 'Types/collection';

export interface IOperationsPanelContainerProps extends IControlOptions {
    selectedKeys: TKey[];
    listMarkedKey: TKey;
    selectedKeysCount: number;
    items?: RecordSet;
    parentProperty?: string;
    onOperationsPanelOpen?: Function;
    onOperationsPanelClose?: Function;
}

/**
 * Контрол используют в качестве контейнера для {@link Controls/operations:Panel}.
 * Он обеспечивает передачу выделения (опции selectedKeys, excludedKeys, markedKey) между {@link Controls/operations:Controller} и {@link Controls/operations:Panel}.
 * @remark
 * Полезные ссылки:
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/actions/operations/basic-configuration/ руководство разработчика}
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_operations.less переменные тем оформления}
 *
 *
 * @class Controls/_operations/Panel/Container
 * @extends UI/Base:Control
 *
 * @public
 */

function isEmptySelectionFn(selectedKeys: TKey[], listMarkedKey: TKey, items: RecordSet): boolean {
    return !selectedKeys?.length && listMarkedKey !== null && (!items || !!items.getCount());
}

function OperationsPanelContainer(
    props: IOperationsPanelContainerProps,
    ref: ForwardedRef<unknown>
): JSX.Element {
    const isEmptySelection = isEmptySelectionFn(
        props.selectedKeys,
        props.listMarkedKey,
        props.items
    );
    const selectedKeys = useMemo(() => {
        let result;

        if (isEmptySelection) {
            result = [props.listMarkedKey];
        } else {
            result = props.selectedKeys;
        }

        return result;
    }, [isEmptySelection, props.listMarkedKey, props.selectedKeys]);

    const listMarkedKey = useMemo(() => {
        return isEmptySelection ? props.listMarkedKey : null;
    }, [isEmptySelection, props.listMarkedKey]);

    const selectedKeysCount = props.selectedKeys?.length ? props.selectedKeysCount : 0;

    return cloneElement(props.children, {
        ...props,
        listParentProperty: props.parentProperty,
        forwardedRef: ref,
        listMarkedKey,
        selectedKeys,
        items: null,
        source: null,
        selectedKeysCount,
    });
}

export default forwardRef(OperationsPanelContainer);
