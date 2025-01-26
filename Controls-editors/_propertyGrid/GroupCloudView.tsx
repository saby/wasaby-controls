import { ReactNode, useCallback, useState } from 'react';
import { Button } from 'Controls/buttons';
import { ExtendedFields } from 'Controls-editors/object-type';

export interface IGroupCloudViewProps {
    children?: ReactNode;
    /**
     * Название группы
     */
    title: string;

    /**
     * Идентификатор группы
     */
    id: string | undefined;
}

export const GroupCloudView = function (props: IGroupCloudViewProps) {
    const { children, title } = props;

    const [expanded, setExpanded] = useState(true);

    const hasTitle = !!title;

    const iconName = expanded ? 'icon-MarkExpandBoldMin' : 'icon-MarkRightBoldMin';

    const expanderClickHandler = useCallback(() => {
        setExpanded((prevState) => !prevState);
    }, []);

    let contentClassName = 'controls_PropertyGrid__GroupCloud__content';
    if (!expanded) {
        contentClassName += ' ws-hidden';
    }

    return (
        <div className={'controls_PropertyGrid__GroupCloud ws-flexbox ws-flex-column'}>
            {hasTitle && (
                <div className="ws-flexbox ws-flex-row controls_PropertyGrid__GroupCloud__header-container">
                    <div
                        className={
                            'ws-flexbox ws-flex-row controls_PropertyGrid__GroupCloud__header'
                        }
                    >
                        <div className={'controls_PropertyGrid__GroupCloud__title'}>{title}</div>
                        <Button
                            icon={iconName}
                            onClick={expanderClickHandler}
                            iconSize={'2xs'}
                            fontSize={'s'}
                            inlineHeight={'s'}
                            viewMode={'link'}
                        />
                    </div>
                </div>
            )}
            <div className={contentClassName}>{children}</div>
            <ExtendedFields />
        </div>
    );
};
