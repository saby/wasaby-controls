import { ReactElement, useMemo } from 'react';
import { TemplateFunction } from 'UI/Base';
import { IComponentProps } from 'Controls/interface';
import { StickyBlock } from 'Controls/stickyBlock';
import { loadSync } from 'WasabyLoader/ModulesLoader';
import { Model } from 'Types/entity';
import { CrudEntityKey } from 'Types/source';
import Async from 'Controls/Container/Async';

interface IFooterItemData {
    item: Model;
    key: CrudEntityKey;
    [key: string]: unknown;
}

interface IFooterTemplate extends IMenuFooterContentProps {
    stickyFooter?: boolean;
    backgroundStyle?: string;
    footerItemData?: IFooterItemData;
    stickyBlockClassName?: string;
}

export default function MenuControlFooterTemplate(props: IFooterTemplate) {
    if (props.stickyFooter) {
        if (props.moreButtonVisible || props.expanderButtonVisible || props.showMoreRightTemplate) {
            return (
                <StickyBlock
                    mode="stackable"
                    backgroundStyle={props.backgroundStyle}
                    position="bottom"
                    className={props.stickyBlockClassName}
                >
                    <MenuFooterContentTemplate {...props} />
                </StickyBlock>
            );
        }
        return null;
    } else {
        return (
            <>
                {props.moreButtonVisible ||
                props.expanderButtonVisible ||
                props.showMoreRightTemplate ? (
                    <MenuFooterContentTemplate {...props} />
                ) : null}
                {props.footerContentTemplate ? (
                    <div
                        className={`tw-flex tw-items-center tw-flex-0 controls-padding_bottom-s ${props.className}`}
                    >
                        <FooterCustomContentTemplate {...props} className="" />
                    </div>
                ) : null}
            </>
        );
    }
}

function FooterCustomContentTemplate(props: {
    footerContentTemplate?: string | TemplateFunction | ReactElement;
    [key: string]: unknown;
}): ReactElement {
    if (typeof props.footerContentTemplate === 'string') {
        const FooterCustomTpl = loadSync(props.footerContentTemplate);
        return <FooterCustomTpl {...props} />;
    } else {
        return <props.footerContentTemplate {...props} />;
    }
}

interface IMenuFooterContentProps
    extends IComponentProps,
        IExpanderButtonProps,
        IShowMoreRightTemplateProps {
    expanderButtonVisible?: boolean;
    moreButtonVisible?: boolean;
    onFooterMouseEnter?: () => void;
    onMoreButtonClick?: () => void;
}
const moreButtonProps = {
    iconSize: 'm',
};
function MenuFooterContentTemplate(props: IMenuFooterContentProps): ReactElement {
    return (
        <div
            className={`controls-Menu__footer ${
                props.showMoreRightTemplate ? 'controls-Menu__footer-minHeight' : ''
            }`}
            onMouseEnter={props.onFooterMouseEnter}
        >
            {props.moreButtonVisible ? (
                <div
                    className="controls-Menu__moreButton controls-Menu__footer-moreButton"
                    onClick={props.onMoreButtonClick}
                >
                    <Async
                        templateName="Controls/ShowMoreButton"
                        templateOptions={moreButtonProps}
                        data-qa="controls-Menu__moreButton"
                    />
                </div>
            ) : props.expanderButtonVisible ? (
                <ExpanderButton
                    allowAdaptive={props.allowAdaptive}
                    expanded={props.expanded}
                    footerContentTemplate={props.footerContentTemplate}
                    onExpanderButtonClick={props.onExpanderButtonClick}
                />
            ) : null}

            <ShowMoreRightTemplate showMoreRightTemplate={props.showMoreRightTemplate} />
        </div>
    );
}

interface IExpanderButtonProps {
    allowAdaptive?: boolean;
    expanded?: boolean;
    onExpanderButtonClick: () => void;
    footerContentTemplate?: string | TemplateFunction | ReactElement;
}
function ExpanderButton(props: IExpanderButtonProps): ReactElement {
    const moreButtonOptions = useMemo(() => {
        return {
            iconMode: 'arrow',
            iconSize: 'l',
            value: props.expanded,
        };
    }, [props.expanded]);
    return (
        <div
            className={`controls-Menu__additional
                                 controls-Menu__footer-additional_padding-top_m
                                 ${props.allowAdaptive ? 'controls-padding_bottom-xs' : ''}
                                 ${
                                     props.footerContentTemplate
                                         ? 'controls-Menu__footer-additional_padding-bottom'
                                         : ''
                                 }`}
            onClick={props.onExpanderButtonClick}
        >
            <Async
                templateName="Controls/ShowMoreButton"
                templateOptions={moreButtonOptions}
                className="controls-Menu_additionalButton_color"
            />
        </div>
    );
}

interface IShowMoreRightTemplateProps {
    showMoreRightTemplate?: TemplateFunction | ReactElement;
}
function ShowMoreRightTemplate(props: IShowMoreRightTemplateProps) {
    const className = 'controls-Menu__footer-showMoreRightTemplate';
    if (props.showMoreRightTemplate) {
        if (typeof props.showMoreRightTemplate === 'string') {
            const ShowMoreTemplate = loadSync(props.showMoreRightTemplate);
            return <ShowMoreTemplate className={className} />;
        } else {
            return <props.showMoreRightTemplate className={className} />;
        }
    }
    return null;
}
