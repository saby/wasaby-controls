import * as React from 'react';

interface IBreadCrumbItemProps {
    title: string;
    isLast?: boolean;
    className?: string;
}

const iconContainerStyle = { height: 0 };

export function BreadCrumbItem({
    title,
    isLast,
    className,
}: IBreadCrumbItemProps): React.ReactElement {
    return (
        <div className={className}>
            {title}
            {!isLast && (
                <div
                    style={iconContainerStyle}
                    className={
                        'controls-icon controls-icon_size-m controls-icon_style-label icon-MarkRightBold ControlsLists-overviewTree__breadCrumbsItem__icon'
                    }
                />
            )}
        </div>
    );
}
