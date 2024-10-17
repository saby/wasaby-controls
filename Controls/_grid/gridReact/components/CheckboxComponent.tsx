/*
 * Файл содержит компонент чекбокса и вспомогательные методы и компоненты
 */

import * as React from 'react';
import { CheckboxMarker, ICheckboxMarkerOptions } from 'Controls/checkbox';
import { ICheckboxProps, TGridVPaddingSize } from 'Controls/interface';
import { CollectionItemContext } from 'Controls/list';
import { activate, FocusArea } from 'UI/Focus';
import { templateLoader } from 'Controls/_grid/compatibleLayer/utils/templateLoader';
import { useObservableItemStates } from 'Controls/_grid/gridReact/hooks/useItemState';
import { getVerticalPaddingsClasses } from 'Controls/_grid/cleanRender/cell/utils/Classes/Offset';

const DEFAULT_MULTI_SELECT_TEMPLATE = 'Controls/baseList:MultiSelectTemplate';

interface IProps {
    className?: string;
    activateRef?: React.RefObject<HTMLElement>;
    decorationStyle?: 'master' | 'default';
    render?: React.ReactElement;
    paddingTop?: TGridVPaddingSize;
    paddingBottom?: TGridVPaddingSize;
}

const CHECKBOX_STATES = ['selected', 'multiSelectVisibility', 'multiSelectAccessibility'];

/*
 * Приватный хук, позволяющий получить состояние чекбокса
 */
function useCheckboxProps(): ICheckboxProps {
    const item = React.useContext(CollectionItemContext);
    useObservableItemStates(CHECKBOX_STATES);

    return {
        checkboxValue: item.isSelected(),
        checkboxReadonly: item.isReadonlyCheckbox(),
        checkboxVisibility: item.isVisibleCheckbox() ? item.getMultiSelectVisibility() : 'hidden',
    };
}

/*
 * Компонент чекбокса
 */
function CheckboxComponent(props: IProps) {
    const { checkboxValue, checkboxVisibility, checkboxReadonly } = useCheckboxProps();
    const item = React.useContext(CollectionItemContext);
    const multiSelectTemplate = item.getMultiSelectTemplate();

    const onActivatedCallback = React.useCallback(() => {
        if (props.activateRef?.current) {
            activate(props.activateRef.current);
        }
    }, [props.activateRef?.current]);

    if (checkboxVisibility === 'hidden') {
        return null;
    }

    const className =
        (props.className || '') + getVerticalPaddingsClasses(props.paddingTop, props.paddingBottom);

    const templateProps: ICheckboxMarkerOptions = {
        value: checkboxValue,
        readOnly: checkboxReadonly,
        horizontalPadding: props.decorationStyle === 'master' ? '3xs' : 'default',
        triState: true,
        viewMode: 'outlined',
        className,
    };

    let template;

    if (multiSelectTemplate === DEFAULT_MULTI_SELECT_TEMPLATE) {
        if (props.render) {
            template = React.cloneElement(props.render, templateProps);
        } else {
            templateProps.className +=
                ' js-controls-ListView__checkbox controls-CheckboxMarker_inList';
            if (checkboxVisibility === 'onhover' && checkboxValue === false) {
                templateProps.className += ' controls-ListView__checkbox-onhover';
            }
            template = <CheckboxMarker {...templateProps} />;
        }
    } else {
        template = templateLoader(multiSelectTemplate, {
            ...templateProps,
            decorationStyle: props.decorationStyle,
            item,
        });
    }

    return (
        <FocusArea tabIndex={-1} onActivated={onActivatedCallback}>
            {template}
        </FocusArea>
    );
}

export default React.memo(CheckboxComponent);
