import { ReactElement, Component, FunctionComponent, MouseEventHandler } from 'react';
import { TemplateFunction } from 'UI/Base';
import { TEditorsViewMode } from 'Controls/_filterPanel/View/ViewModel';
import Separator from 'Controls/_filterPanel/View/Separator';

export interface IGroupTemplateProps {
    filterViewMode: 'popup' | 'default';
    caption?: string;
    expanderVisible?: boolean;
    groupTextAlign?: string;
    groupExpanderAlign?: string;
    separatorVisible?: boolean;
    resetButtonVisible?: boolean;
    resetButtonClick?: MouseEventHandler;
    beforeSeparatorTemplate?: Component | FunctionComponent | TemplateFunction;
    expanded: boolean;
    isFirstEditor?: boolean;
    editorsViewMode?: TEditorsViewMode;
    toggleExpandHandler?: MouseEventHandler;
}

function getMarginTopClassName({
    filterViewMode,
    editorsViewMode,
    isFirstEditor,
}: IGroupTemplateProps): string | void {
    if (filterViewMode === 'popup' && !isFirstEditor) {
        return 'controls-FilterViewPanel__group-wrapper-margin-top';
    } else if (filterViewMode === 'default' && editorsViewMode === 'cloud' && isFirstEditor) {
        return 'controls-FilterViewPanel__group_first-margin-top';
    }
}

export default function GroupTemplate(props: IGroupTemplateProps): ReactElement | null {
    if (
        !props.resetButtonVisible &&
        !props.caption &&
        !props.separatorVisible &&
        !props.expanderVisible &&
        !props.resetButtonVisible
    ) {
        return null;
    }

    const expandClassName = `${
        !props.expanded ? 'controls-FilterViewPanel__group-wrapper-collapsed' : ''
    }`;
    const separatorClassName = `controls-FilterViewPanel__group controls-FilterViewPanel__group_height_viewMode-${props.filterViewMode}`;

    return (
        <div
            className={`controls-FilterViewPanel__group-wrapper ${expandClassName} ${getMarginTopClassName(
                props
            )}`}
            data-qa="FilterViewPanel__group-wrapper"
        >
            <Separator
                {...props}
                className={separatorClassName}
                data-qa={'FilterViewPanel__group'}
            />
        </div>
    );
}
