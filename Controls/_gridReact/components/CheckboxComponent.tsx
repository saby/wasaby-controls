/*
 * Файл содержит компонент чекбокса и вспомогательные методы и компоненты
 */

import * as React from 'react';
import { CheckboxMarker } from 'Controls/checkbox';
import { ICheckboxProps } from 'Controls/interface';
import { CollectionItemContext } from 'Controls/list';
import { activate, FocusArea } from 'UI/Focus';
import { useObservableItemStates } from 'Controls/_gridReact/hooks/useItemState';

interface IProps {
    className?: string;
    activateRef?: React.RefObject<HTMLElement>;
    decorationStyle?: 'master' | 'default';
    render?: React.ReactElement;
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

interface ICompatibleRenderProps {
    triState?: boolean;
    value?: boolean | null;
    className?: string;
    readOnly?: boolean;
    viewMode?: 'filled' | 'outlined' | 'ghost';
    render: React.ReactElement;
    horizontalPadding?: 'default' | '3xs';
    decorationStyle?: 'master' | 'default';
}

/*
 * Компонент, необходимый для совместимости MultiSelectTemplate
 */
function CompatibleRender(props: ICompatibleRenderProps): React.ReactElement {
    const item = React.useContext(CollectionItemContext);
    // Если в getMultiSelectTemplate лежит строка, то это наш рендер по умолчаниию,
    // иначе прикладник задал значение MultiSelectTemplate и нужно отрендерить прикладной шаблон с
    // учётом item. Иногда там находится <ws:if>, который смотрит на item И в зависимости от
    // параметров записи рендерит наш шаблон или что-то прикладное, например, <invisible-node/>
    if (typeof item.getMultiSelectTemplate() !== 'string') {
        return React.createElement(item.getMultiSelectTemplate(), {
            ...props,
            item,
            position: 'custom',
        });
    }
    return React.cloneElement(props.render, { ...props });
}

/*
 * Компонент чекбокса
 */
function CheckboxComponent(props: IProps) {
    const { checkboxValue, checkboxVisibility, checkboxReadonly } = useCheckboxProps();

    const onActivatedCallback = React.useCallback(() => {
        if (props.activateRef?.current) {
            activate(props.activateRef.current);
        }
    }, [props.activateRef?.current]);

    if (checkboxVisibility === 'hidden') {
        return null;
    }

    let className = 'js-controls-ListView__checkbox controls-CheckboxMarker_inList';
    if (checkboxVisibility === 'onhover' && checkboxValue === false) {
        className += ' controls-ListView__checkbox-onhover';
    }
    if (props.className) {
        className += ` ${props.className}`;
    }

    return (
        <FocusArea tabIndex={-1} onActivated={onActivatedCallback}>
            <CompatibleRender
                value={checkboxValue}
                readOnly={checkboxReadonly}
                horizontalPadding={props.decorationStyle === 'master' ? '3xs' : 'default'}
                decorationStyle={props.decorationStyle}
                triState={true}
                viewMode={'outlined'}
                className={className}
                render={props.render}
            />
        </FocusArea>
    );
}

CheckboxComponent.defaultProps = {
    render: <CheckboxMarker />,
};

export default React.memo(CheckboxComponent);
