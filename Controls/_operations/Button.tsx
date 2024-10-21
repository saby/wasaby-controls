/**
 * @kaizen_zone ddbc0bdc-0710-4e01-9472-8d1982a63a4e
 */
// eslint-disable-next-line
/* eslint-disable deprecated-anywhere */
import * as React from 'react';
import { IExpandableOptions } from 'Controls/interface';
import { isLeftMouseButton } from 'Controls/popup';
import { Button, IButtonOptions } from 'Controls/buttons';
import { IControlOptions } from 'UI/Base';

import { getWasabyContext, useReadonly, useTheme } from 'UI/Contexts';
import * as rk from 'i18n!Controls';
import 'css!Controls/operations';
import { useDependencyLoader, useDeprecatedStore } from 'Controls/hooks';

const { useCallback, useMemo, memo, forwardRef } = React;

export interface IOperationsButtonProps extends IControlOptions, IExpandableOptions {
    useStore?: boolean;
    expanded?: boolean;
    forwardedRef?: React.Ref<unknown>;
    className?: string;
    onExpandedChanged?: (event: React.MouseEventHandler, expanded: boolean) => void;
    onExpandedchanged?: (event: React.MouseEventHandler, expanded: boolean) => void;
    attrs?: { className: string };
    iconSize?: IButtonOptions['iconSize'];
    viewMode?: IButtonOptions['viewMode'];
    inlineHeight?: IButtonOptions['inlineHeight'];
}

const dependencies = ['Controls/operationsPanel', 'Controls/checkbox'];

function OperationsButtonUseStoreWrapper(props: IOperationsButtonProps): JSX.Element {
    const storeParams = useMemo(() => {
        return {
            values: ['operationsPanelExpanded'],
        };
    }, []);
    const { values } = useDeprecatedStore(storeParams);
    const onExpandedChanged = useCallback(
        (e, newState) => {
            values.operationsPanelExpanded = newState;
        },
        [values]
    );

    return React.cloneElement(props.children, {
        ...props,
        expanded: values.operationsPanelExpanded,
        onExpandedChanged,
    });
}

const OperationsButtonTemplate = function OperationsButtonTemplate(
    props: IOperationsButtonProps
): JSX.Element {
    const wasabyContext = React.useContext(getWasabyContext());
    const readOnly = useReadonly(props);
    const highlightedOnFocus = useMemo(() => {
        return wasabyContext?.workByKeyboard && !readOnly;
    }, [wasabyContext, readOnly]);
    const className = `controls_operations_theme-${useTheme(props)} ${
        highlightedOnFocus ? 'controls-focused-item_background' : ''
    }
     controls-OperationsButton controls-OperationsButton_button__size controls-OperationsButton_button ${
         props.attrs?.className || ''
     } ${props.className || ''}`;
    const { onMouseEnter, onMouseLeave } = useDependencyLoader(dependencies);

    const onMouseDown = React.useCallback(
        (event) => {
            const shouldToggleExpanded = !props.readOnly && isLeftMouseButton(event);
            const expandedCallback = props.onExpandedChanged || props.onExpandedchanged;
            if (shouldToggleExpanded && expandedCallback) {
                expandedCallback(event, !props.expanded);
            }
        },
        [props.onExpandedChanged, props.onExpandedchanged, props.readOnly, props.expanded]
    );

    return (
        <Button
            data-qa={'Controls-operations__Button'}
            forwardedRef={props.forwardedRef}
            {...props.attrs}
            icon={props.expanded ? 'icon-CloseCheck' : 'icon-Check2'}
            iconSize={props.iconSize}
            tooltip={props.expanded ? rk('Завершить выделение') : rk('Отметить')}
            className={className}
            viewMode={props.viewMode}
            readOnly={props.readOnly}
            inlineHeight={props.inlineHeight}
            onMouseLeave={onMouseLeave}
            onMouseEnter={onMouseEnter}
            onMouseDown={onMouseDown}
        />
    );
};

/**
 * Контрол-кнопка, использующийся для показа и скрытия панели действий {@link Controls/operations:Panel}.
 *
 * @remark
 * Полезные ссылки:
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/actions/operations/ руководство разработчика}
 * * {@link https://git.sbis.ru/saby/wasaby-controls/-/blob/rc-24.6100/Controls-default-theme/variables/_operations.less переменные тем оформления}
 *
 * @class Controls/_operations/Button
 * @extends UI/Base:Control
 * @implements Controls/interface:IExpandable
 * @implements Controls/interface:IIconSize
 * @implements Controls/interface:IHeight
 * @demo Controls-demo/OperationsPanelNew/PanelWithList/Default/Index
 * @public
 *
 */
const OperationsButton = forwardRef(function OperationsButton(
    props: IOperationsButtonProps,
    ref: React.ForwardedRef<unknown>
): JSX.Element {
    return props.useStore ? (
        <OperationsButtonUseStoreWrapper {...props}>
            <OperationsButtonTemplate {...props} forwardedRef={ref} />
        </OperationsButtonUseStoreWrapper>
    ) : (
        <OperationsButtonTemplate {...props} forwardedRef={ref} />
    );
});

OperationsButton.defaultProps = {
    iconSize: 'operationsButton',
    inlineHeight: 's',
    viewMode: 'link',
};
export default memo(OperationsButton);
