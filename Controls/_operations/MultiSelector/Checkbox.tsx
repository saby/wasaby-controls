import * as React from 'react';
import { IControlOptions } from 'UI/Base';
import { IMultiSelectableOptions } from 'Controls/interface';
import { default as Async } from 'Controls/Container/Async';
import { __notifyFromReact } from 'UI/Events';
import * as rk from 'i18n!Controls';
import 'css!Controls/operations';

const { useMemo, useCallback, useRef } = React;

export interface IMultiSelectCheckboxProps extends IMultiSelectableOptions, IControlOptions {
    selectedKeysCount: number | void;
    isAllSelected: boolean;
    isAdaptive?: boolean;
    onSelectedTypeChanged?: (selectedType: string) => void;
}

type TCheckboxValue = boolean | null;
/**
 * Контрол, который отображает чекбокс, позволяющий произвести массовую отметку записей в списке.
 * @remark
 * Полезные ссылки:
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/actions/operations/ руководство разработчика}
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_operations.less переменные тем оформления}
 *
 * @class Controls/_operations/MultiSelector/Checkbox
 * @extends UI/Base:Control
 *
 * @public
 * @demo Controls-demo/operations/MultiSelectorCheckbox/Index
 */

const Checkbox = function (props: IMultiSelectCheckboxProps): JSX.Element {
    const contentRef = useRef();
    const checkboxState = useMemo((): TCheckboxValue => {
        const hasSelected = props.selectedKeys.length;
        const count = props.selectedKeysCount;
        let result;

        if (hasSelected && props.isAllSelected) {
            result = true;
        } else if (hasSelected && (count > 0 || count === null)) {
            result = null;
        } else {
            result = false;
        }

        return result;
    }, [props.selectedKeysCount, props.selectedKeys, props.isAllSelected]);
    const onClick = useCallback(
        (e) => {
            if (!props.readOnly) {
                const eventName = checkboxState === false ? 'selectAll' : 'unselectAll';
                if (props.onSelectedtypechanged) {
                    props.onSelectedtypechanged(e, eventName);
                } else if (props.onSelectedTypeChanged) {
                    props.onSelectedTypeChanged(eventName);
                } else {
                    __notifyFromReact(contentRef.current, 'selectedTypeChanged', [eventName], true);
                }
            }
        },
        [props.readOnly, checkboxState, props.onSelectedTypeChanged, props.onSelectedtypechanged]
    );
    return (
        <Async
            forwardedRef={contentRef}
            templateName={'Controls/checkbox:CheckboxMarker'}
            templateOptions={{
                readOnly: props.readOnly,
                viewMode: 'outlined',
                value: checkboxState,
                triState: true,
                title: checkboxState === false ? rk('Отметить') : rk('Снять'),
                onClick,
                className: `controls-MultiSelector__checkbox ${
                    props.isAdaptive
                        ? 'controls-MultiSelector__checkbox_adaptiveAlign'
                        : 'controls-MultiSelector__checkbox_align'
                }`,
            }}
        />
    );
};

export default Checkbox;
