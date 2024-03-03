import * as React from 'react';
import {
    default as DefaultContentTemplate,
    IDefaultContentTemplateProps,
} from './DefaultContentTemplate';
import { Icon } from 'Controls/icon';
import { Model } from 'Types/entity';
import { TIconSize } from 'Controls/interface';

interface IDefaultContentTemplateContentProps {
    item: Model;
    text?: string;
    icon?: string;
    iconStyle?: string;
    iconSize?: TIconSize;
    tooltip?: string;
    underline?: string;
}

function DefaultContentTemplateContent(props: IDefaultContentTemplateContentProps) {
    const { icon, item, iconStyle, tooltip, text, iconSize, underline } = props;

    return (
        <div className="controls-Dropdown__iconTemplate_wrapper">
            {icon ? (
                <div
                    className={`controls-Dropdown__icon controls-icon_style-${
                        item.get('iconStyle') || iconStyle || 'secondary'
                    } ${text ? ' controls-Dropdown__icon-rightSpacing' : ''}`}
                    title={tooltip || text}
                >
                    <Icon iconSize={iconSize} icon={icon} />
                </div>
            ) : null}
            <div
                className={`controls-Dropdown__text-wrapper controls-Dropdown__text-wrapper-${underline} ws-ellipsis`}
            >
                <div className="controls-Dropdown__text" title={tooltip}>
                    {text}
                </div>
            </div>
        </div>
    );
}

interface IDefaultContentTemplateWithIconProps extends IDefaultContentTemplateProps {}

function DefaultContentTemplateWithIcon(
    props: IDefaultContentTemplateWithIconProps,
    ref: React.ForwardedRef<HTMLDivElement>
) {
    const { icon, item, iconStyle, tooltip, text, iconSize, underline } = props;

    return (
        <DefaultContentTemplate
            {...props}
            ref={ref}
            contentTemplate={DefaultContentTemplateContent}
            contentTemplateProps={{ icon, item, iconStyle, tooltip, text, iconSize, underline }}
        />
    );
}

export default React.forwardRef(DefaultContentTemplateWithIcon);
