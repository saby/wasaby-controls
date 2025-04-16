/*
 * Файл содержит компонент чекбокса и вспомогательные методы и компоненты
 */

import * as React from 'react';
import { ICheckboxMarkerOptions } from 'Controls/checkbox';
import { ICheckboxProps, TGridVPaddingSize } from 'Controls/interface';
import { CollectionItemContext, ICollectionItemContextValue } from 'Controls/listsCommonLogic';
import { activate, FocusArea } from 'UI/Focus';
import { templateLoader } from 'Controls/_gridRender/utils/templateLoader';
import { useObservableItemStates } from 'Controls/_gridRender/hooks/useItemState';
import { getVerticalPaddingsClasses } from 'Controls/_gridRender/cell/utils/Classes/Offset';
import { isLoaded, loadSync } from 'WasabyLoader/ModulesLoader';
import { IDecorationStyleProps } from 'Controls/_gridRender/interface/CommonInterface';

const DEFAULT_MULTI_SELECT_TEMPLATE = 'Controls/baseList:MultiSelectTemplate';

interface IProps extends IDecorationStyleProps {
    className?: string;
    activateRef?: React.RefObject<HTMLElement>;
    render?: React.ReactElement;
    paddingTop?: TGridVPaddingSize;
    paddingBottom?: TGridVPaddingSize;
}

const CHECKBOX_STATES = ['selected', 'multiSelectVisibility', 'multiSelectAccessibility'];

/*
 * Приватный хук, позволяющий получить состояние чекбокса
 */
function useCheckboxProps(): ICheckboxProps {
    const { item } = React.useContext(CollectionItemContext) as ICollectionItemContextValue;
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
function Checkbox(props: IProps) {
    const { checkboxValue, checkboxVisibility, checkboxReadonly } = useCheckboxProps();
    const { item } = React.useContext(CollectionItemContext) as ICollectionItemContextValue;
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

            const CheckboxMarker = isLoaded('Controls/checkbox')
                ? loadSync<typeof import('Controls/checkbox')>('Controls/checkbox').CheckboxMarker
                : undefined;
            template = <CheckboxMarker {...templateProps} />;
        }
    } else {
        template = templateLoader(multiSelectTemplate, {
            ...templateProps,
            backgroundColorStyle: 'transparent',
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

export default Checkbox;
