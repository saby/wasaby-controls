import { TInternalProps } from 'UICore/Executor';
import { Model } from 'Types/entity';
import * as React from 'react';
import { TSelectionType } from 'Controls/_interface/ISelectionType';
import { Icon } from 'Controls/icon';

export interface IContentTemplateOptions extends TInternalProps {
    fontColorStyle?: string;
    clickable?: boolean;
    tooltip?: string;
    caption?: string;
    size?: string;
    item: Model;
    displayProperty?: string;
    className?: string;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
    theme?: string;
    fontWeight?: string;
    underlineVisible?: boolean;
    multiLine?: boolean;
    multiLineViewMode?: 'multiLine' | 'singleLine' | 'single-multiLine';
    parentProperty?: string;
    nodeProperty?: string;
    selectionType?: TSelectionType;
}

function ContentTemplate(
    props: IContentTemplateOptions,
    ref: React.ForwardedRef<HTMLDivElement>
): JSX.Element {
    return (
        <div
            className={`js-controls-SelectedCollection__item__caption
                        ${
                            props.underlineVisible
                                ? 'controls-SelectedCollection__item__caption-underline'
                                : ''
                        }
                        controls-SelectedCollection__item__caption
                        controls-text-${
                            props.fontColorStyle === 'accent' ? 'secondary' : props.fontColorStyle
                        }
                        controls-SelectedCollection__item__caption-style-${props.fontColorStyle}
                        controls-SelectedCollection__item__caption-style-${props.fontWeight}
                        controls-SelectedCollection__item__caption-size-${props.size}
                        ${
                            props.clickable
                                ? 'controls-SelectedCollection__item__caption-clickable'
                                : ''
                        }
                        ${
                            props.multiLineViewMode === 'single-multiLine'
                                ? 'controls-SelectedCollection__item__caption--multiline'
                                : ''
                        }
                        ${props.className || props.attrs?.className}`}
            ref={ref}
            title={
                props.tooltip || props.caption || props.item.get(props.displayProperty || 'title')
            }
            data-qa="SelectedCollection__item__caption"
            onClick={props.onClick}
        >
            {props.nodeProperty && props.item.get(props.nodeProperty) !== null ? (
                <Icon
                    icon="icon-CreateFolder2"
                    iconSize="s"
                    className="controls-margin_right-2xs"
                    iconStyle="secondary"
                />
            ) : (
                ''
            )}
            {props.caption || props.item.get(props.displayProperty || 'title')}
        </div>
    );
}

export default React.forwardRef(ContentTemplate);
