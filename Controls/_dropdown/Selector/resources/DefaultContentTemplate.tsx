import * as React from 'react';
import { TemplateFunction } from 'UI/Base';
import { Model } from 'Types/entity';
import { Icon } from 'Controls/icon';
import { TIconSize } from 'Controls/interface';
import { isRenderer } from 'Controls/_dropdown/Utils/isRenderer';

export interface IDefaultContentTemplateProps {
    item: Model;
    fontSize?: string;
    validationStatus?: 'invalid' | 'invalidAccent';
    readOnly?: boolean;
    needOpenMenuOnClick?: boolean;
    style?: string;
    isEmptyItem?: boolean;
    fontColorStyle?: string;
    text?: string;
    icon?: string;
    iconStyle?: string;
    contentTemplate?: TemplateFunction | React.FC;
    contentTemplateProps?: Record<string, any>;
    iconSize?: TIconSize;
    tooltip?: string;
    hasMoreText?: string;
    underline?: string;
    className?: string;
}

function renderContentTemplate(ContentTemplate: TemplateFunction | React.FC, props: any = {}) {
    if (typeof ContentTemplate === 'string') {
        return ContentTemplate;
    }

    return isRenderer(ContentTemplate) ? (
        <ContentTemplate {...props} />
    ) : (
        React.cloneElement(ContentTemplate, props)
    );
}

function DefaultContentTemplate(
    props: IDefaultContentTemplateProps,
    ref: React.ForwardedRef<HTMLDivElement>
) {
    const {
        fontSize,
        validationStatus,
        readOnly,
        needOpenMenuOnClick,
        style,
        isEmptyItem,
        fontColorStyle,
        contentTemplate,
        contentTemplateProps,
        icon,
        item,
        iconStyle,
        tooltip,
        iconSize,
        text,
        hasMoreText,
        underline,
        className,
    } = props;

    return (
        <div
            ref={ref}
            onMouseDown={props.onMouseDown}
            className={`controls-Dropdown__wrapper ${
                fontSize ? 'controls-fontsize-' + fontSize : 'controls-Dropdown-fontsize'
            } ${className || ''}`}
        >
            <div
                tabIndex={0}
                className={`controls-Dropdown__content-wrapper ${
                    validationStatus === 'invalid' || validationStatus === 'invalidAccent'
                        ? ' controls-invalid-container'
                        : ''
                } ${
                    !readOnly && needOpenMenuOnClick !== false
                        ? 'controls-Dropdown__text_enabled controls-Dropdown__item_style-' + style
                        : ''
                } ${
                    isEmptyItem && !fontColorStyle
                        ? 'controls-Dropdown__emptyItem'
                        : !style
                        ? 'controls-Dropdown__defaultItem controls-text-' +
                          (fontColorStyle && fontColorStyle !== 'link'
                              ? fontColorStyle
                              : !readOnly && needOpenMenuOnClick !== false
                              ? 'link'
                              : '')
                        : ''
                }`}
                data-qa={icon || !text ? 'controls-Dropdown__content' : undefined}
                name="popupTarget"
            >
                {contentTemplate ? (
                    renderContentTemplate(contentTemplate, {
                        text,
                        hasMoreText,
                        iconSize,
                        icon,
                        item,
                        style,
                        attr: { tabindex: '0' },
                        ...(contentTemplateProps || {}),
                    })
                ) : (
                    <>
                        {icon ? (
                            <div
                                className={`controls-Dropdown__icon controls-icon_style-${
                                    item.get('iconStyle') || iconStyle || 'secondary'
                                }`}
                                title={tooltip}
                            >
                                <Icon iconSize={iconSize} icon={icon} />
                            </div>
                        ) : null}
                        <div
                            className={`controls-Dropdown__text-wrapper controls-Dropdown__text-wrapper-${underline}`}
                            title={tooltip}
                        >
                            {!icon && text ? (
                                <div
                                    className="controls-Dropdown__text"
                                    data-qa="controls-Dropdown__content"
                                >
                                    {text}
                                </div>
                            ) : null}
                            <span className="controls-Dropdown__hasMoreText">{hasMoreText}</span>
                        </div>
                    </>
                )}

                {(validationStatus === 'invalid' || validationStatus === 'invalidAccent') &&
                !readOnly ? (
                    <div
                        className={
                            'controls-invalid-border controls-' + validationStatus + '-border'
                        }
                    />
                ) : null}
            </div>
        </div>
    );
}

export default React.forwardRef(DefaultContentTemplate);
