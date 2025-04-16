import { ReactNode, useCallback, useState } from 'react';
import { Button } from 'Controls/buttons';
import { ExtendedFieldsNew } from '../ExtendedFieldsNew';
import 'css!Controls-editors/object-type';

/**
 * Базовый интерфейс компонента группы
 * @private
 */
export interface IGroupComponentProps {
    children?: ReactNode;
    /**
     * Название группы
     */
    title: string | undefined;

    /**
     * Идентификатор группы
     */
    id: string | undefined;

    /**
     * Показывать ли кнопку разворачивания группы
     * @default true
     */
    expandable?: boolean;

    /**
     * Является ли группа полностью расширяемой
     */
    extended: boolean;

    /**
     * Является ли группа вложенной
     */
    nestedGroup: boolean;

    className?: string;
}

export function GroupComponent(props: IGroupComponentProps) {
    const { id, title, children, expandable = true, className, nestedGroup } = props;

    const [expanded, setExpanded] = useState(true);

    const hasTitle = !!title;

    const iconName = expanded ? 'icon-MarkExpandBoldMin' : 'icon-MarkRightBoldMin';

    const expanderClickHandler = useCallback(() => {
        setExpanded((prevState) => !prevState);
    }, []);

    let contentClassName = 'controls__object-type__group__content';
    if (!expanded) {
        contentClassName += ' ws-hidden';
    }

    return (
        <div
            className={`controls__object-type__group ${
                className ?? ''
            } ws-flexbox ws-flex-column PropertyGrid__group__${id}`}
            data-qa="ObjectTypeEditor__group"
        >
            {hasTitle && (
                <div className="ws-flexbox ws-flex-row controls__object-type__group__header-container">
                    <div className={'ws-flexbox ws-flex-row controls__object-type__group__header'}>
                        <div
                            className={`controls__object-type__group__title  ${
                                nestedGroup ? 'controls__object-type__group-nested' : ''
                            }`}
                            data-qa="ObjectTypeEditor__groupTitle"
                        >
                            {title}
                        </div>
                        {expandable && (
                            <Button
                                data-qa={'ObjectTypeEditor__groupExpander'}
                                icon={iconName}
                                onClick={expanderClickHandler}
                                iconSize={'2xs'}
                                fontSize={'s'}
                                inlineHeight={'s'}
                                viewMode={'link'}
                            />
                        )}
                    </div>
                </div>
            )}
            <div className={contentClassName} data-qa="ObjectTypeEditor__groupContent">
                {children}
            </div>
            <ExtendedFieldsNew groupId={id} />
        </div>
    );
}
