import { ReactElement, Component, FunctionComponent, MouseEventHandler } from 'react';
import { Button } from 'Controls/buttons';
import { TemplateFunction } from 'UI/Base';
import { TEditorsViewMode } from 'Controls/_filterPanel/View/ViewModel';
import rk = require('i18n!Controls');

export interface ISeparatorProps {
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
    editorsViewMode?: TEditorsViewMode;
    toggleExpandHandler?: MouseEventHandler;
    className?: string;
    'data-qa'?: string;
}

function ResetButton(props: ISeparatorProps): ReactElement | null {
    return (
        <Button
            caption={'Сбросить'}
            viewMode={'link'}
            fontColorStyle={'label'}
            fontSize={'xs'}
            className={'controls_filterPanel__resetButton'}
            data-qa={'FilterViewPanel__resetButton'}
            onClick={props.resetButtonClick}
        />
    );
}

function Caption(props: ISeparatorProps): ReactElement {
    const className = `
        controls-FilterViewPanel__group-content
        controls-FilterViewPanel__group-content_${
            props.filterViewMode === 'popup' ? 'popup' : 'default'
        }
        ${props.expanderVisible ? 'controls-FilterViewPanel__group-content-expandable' : ''}
        controls-FilterViewPanel__group-content-align-${props.groupTextAlign}
    `;
    return (
        <div className={className} title={props.caption} onClick={props.toggleExpandHandler}>
            {props.caption}
        </div>
    );
}

function Expander({
    expanded,
    editorsViewMode,
    groupExpanderAlign,
    toggleExpandHandler,
}: ISeparatorProps): ReactElement {
    const className = `
            controls-FilterViewPanel__groupExpander 
            controls-icon controls-icon_size-s ${
                expanded ? 'icon-CollapseLight' : 'icon-ExpandLight'
            }
            ${
                editorsViewMode !== 'popupCloudPanelDefault'
                    ? 'controls-PropertyGrid__groupExpander'
                    : ''
            }
            controls-FilterViewPanel__groupExpander-align-${groupExpanderAlign}`;
    return (
        <div
            title={expanded ? rk('Свернуть') : rk('Развернуть')}
            className={className}
            data-qa="FilterViewPanel__groupExpander"
            onClick={toggleExpandHandler}
        />
    );
}

export default function Separator(props: ISeparatorProps): ReactElement {
    const wrapperClassName = `tw-flex 
                        controls-FilterViewPanel__separator-content_container
                        controls-FilterViewPanel__separator-content_container_${
                            props.filterViewMode === 'popup' ? 'popup' : 'default'
                        }`;
    return (
        <div className={`${wrapperClassName} ${props.className}`} data-qa={props['data-qa']}>
            {props.caption ? <Caption {...props} /> : null}
            {props.expanderVisible ? <Expander {...props} /> : null}
            {props.editorsViewMode !== 'cloud' && props.separatorVisible !== false ? (
                <div className="controls-FilterViewPanel__separator" />
            ) : null}
            {props.resetButtonVisible ? <ResetButton {...props} /> : null}
        </div>
    );
}
