import * as React from 'react';
import { TInternalProps } from 'UICore/executor';
import type { CollectionItem } from 'Controls/display';

interface IProps extends TInternalProps {
    viewTemplate: React.FunctionComponent;
    editorTemplate: React.FunctionComponent;
    item?: CollectionItem;
    className?: string;
}

function EditingComponent(
    props: IProps,
    ref: React.ForwardedRef<HTMLDivElement>
): React.ReactElement {
    const isEditing = props.item.isEditing();
    const Render = isEditing ? props.editorTemplate : props.viewTemplate;
    let className = isEditing ? 'controls-ListView__item_editing' : '';
    if (props.className) {
        className += ` ${props.className}`;
    }
    return <Render ref={ref} {...props} className={className} />;
}

export default React.forwardRef(EditingComponent);

/**
 * Компонент для вывода шаблона плитки или шаблона плитки в режиме редактирования.
 * @class Controls-Templates/EditingComponent
 * @implements Controls-Templates/IImageItemProps
 * @public
 */

/**
 * Шаблон плитки
 * @name Controls-Templates/EditingComponent#viewTemplate
 * @cfg {React.ReactElement|UI/Base:TemplateFunction}
 */

/**
 * Шаблон плитки в режиме редактирования
 * @name Controls-Templates/EditingComponent#editorTemplate
 * @cfg {React.ReactElement|UI/Base:TemplateFunction}
 */
