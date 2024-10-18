import * as React from 'react';
import { Icon } from 'Controls/icon';
import { useTheme } from 'UI/Contexts';
import 'css!Controls/list';

export interface ICharacteristic {
    imgSrc?: string;
    icon?: string;
    tooltip?: string;
    title?: string;
}

export interface ICharacteristicsRenderProps {
    items: ICharacteristic[];
    className?: string;
    attrs?: { className?: string };
}

const Item = React.memo(function ({
    imgSrc,
    icon,
    tooltip,
    title,
}: ICharacteristic): React.ReactElement {
    return (
        <div className="controls-list_Characteristics-item" title={tooltip}>
            {imgSrc && <img className="controls-list_Characteristics-item_image" src={imgSrc} />}
            {!imgSrc && icon && <Icon icon={icon} iconSize="s" iconStyle="label" />}
            {title && (
                <div className="controls-fontsize-s controls-text-label controls-list_Characteristics-item_title">
                    {title}
                </div>
            )}
        </div>
    );
});

const CharacteristicsRender = React.memo(function (
    props: ICharacteristicsRenderProps
): React.ReactElement {
    const theme = useTheme();
    const className = props.className || props.attrs?.className || '';
    return (
        <div className={`controls-list_Characteristics controls_list_theme-${theme} ${className}`}>
            {props.items.map((item) => {
                return <Item key={item.title + item.tooltip + item.icon} {...item} />;
            })}
        </div>
    );
});

export default CharacteristicsRender;
