import { forwardRef, ReactElement } from 'react';
import { TemplateFunction } from 'UI/Base';
import { Dialog } from 'Controls/popupTemplate';
import { Icon } from 'Controls/icon';
import { Title } from 'Controls/heading';
import { useAdaptiveMode } from 'UI/Adaptive';
import { useTheme } from 'UI/Contexts';
import { TPopupWidth } from 'Controls/popup';
import { IComponentPropsWithReadonly } from 'Controls/interface';

export interface IFilterStickyPopupTemplate {
    headingCaption?: string;
    headerContentTemplate?: string | ReactElement | TemplateFunction;
    bodyContentTemplate?: string | ReactElement | TemplateFunction;
    orientation?: 'horizontal' | 'vertical';
    width?: Exclude<TPopupWidth, number> | 'default';
}

export default forwardRef(function FilterPanelPopupStickyTemplate(
    props: IFilterStickyPopupTemplate & IComponentPropsWithReadonly,
    ref
) {
    const isAdaptive = useAdaptiveMode().device.isPhone();
    const theme = useTheme(props);
    const orientation = props.orientation || 'vertical';
    let className = isAdaptive
        ? 'controls-FilterPanelPopup__adaptive'
        : `controls-FilterPanelPopup_close-padding ${getWidthClassName(props)}`;
    className += ` controls-FilterPanelPopup-${
        props.withHistory ? 'withHistory' : 'withoutHistory'
    }`;

    return (
        <Dialog
            forwardedRef={ref}
            closeButtonViewMode="toolButton"
            closeButtonOffset="null"
            closeButtonVisible={!isAdaptive}
            headerBackgroundStyle={props.headerBackgroundStyle || 'unaccented'}
            style={props.style}
            data-qa={props['data-qa']}
            className={`controls-FilterPanelPopup controls-FilterPanelPopup-${orientation} controls_filterPanelPopup_theme-${theme} controls_filterPanel_theme-${theme} controls_filterPopup_theme-${theme} ${className} ${props.className}`}
            headerContentTemplate={
                <HeaderTemplate
                    caption={props.headingCaption}
                    contentTemplate={props.headerContentTemplate}
                    orientation={orientation}
                    isAdaptive={isAdaptive}
                />
            }
            bodyContentTemplate={props.bodyContentTemplate}
        ></Dialog>
    );
});

function HeaderTemplate(props: {
    caption: IFilterStickyPopupTemplate['headingCaption'];
    contentTemplate: IFilterStickyPopupTemplate['headerContentTemplate'];
    orientation?: IFilterStickyPopupTemplate['orientation'];
    isAdaptive: boolean;
}) {
    return (
        <div
            className={`controls-FilterPanelPopup__header-wrapper ws-flexbox ws-align-items-baseline controls-FilterPanelPopup__header-${
                props.orientation
            }${props.isAdaptive ? '_adaptive' : ''}`}
        >
            <Icon
                icon="Controls-icons/common:icon-Filter"
                iconSize="xs"
                iconStyle="primaryFilter"
                className={`controls-icon controls-margin_right-xs ${
                    props.isAdaptive ? 'controls-margin_left-3xs' : 'controls-margin_left-s'
                }`}
            />
            <HeadingCaption caption={props.caption} />
            <HeaderContentTemplate contentTemplate={props.contentTemplate} />
        </div>
    );
}

function HeadingCaption(props: { caption: IFilterStickyPopupTemplate['headingCaption'] }) {
    if (props.caption) {
        return (
            <Title
                className="ws-ellipsis"
                caption={props.caption}
                tooltip={props.caption}
                fontColorStyle="primaryFilter"
                fontSize="xl"
                readOnly={true}
                fontWeight="normal"
            />
        );
    }
    return null;
}

function HeaderContentTemplate(props: {
    contentTemplate: IFilterStickyPopupTemplate['headerContentTemplate'];
}) {
    if (props.contentTemplate) {
        return <props.contentTemplate />;
    }
    return null;
}

function getWidthClassName(props: IFilterStickyPopupTemplate): string {
    const width = props.width || 'default';
    return width !== 'default'
        ? ' controls-FilterPanelPopup_' + props.orientation + '_width-' + width
        : ' controls-FilterPanelPopup-' + props.orientation + '-' + width;
}
