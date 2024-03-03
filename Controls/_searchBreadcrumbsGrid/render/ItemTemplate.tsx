import * as React from 'react';
import type { Record } from 'Types/entity';
import PathComponent from './PathComponent';
import type BreadcrumbsItemCell from '../display/BreadcrumbsItemCell';

export interface IItemTemplateProps {
    gridColumn: BreadcrumbsItemCell;
    _onBreadcrumbItemClick: (event: Event, item: Record) => void;
    className?: string;
}

export default React.forwardRef(function ItemTemplate(
    props: IItemTemplateProps,
    forwardedRef: React.ForwardedRef<HTMLDivElement>
): JSX.Element {
    let classes = props.gridColumn.getContentClasses();

    if (props.className) {
        classes += ` ${props.className}`;
    }

    return (
        <div className={classes} ref={forwardedRef}>
            <PathComponent
                {...props.gridColumn.getBreadcrumbsPathProps()}
                onBreadCrumbsItemClick={props._onBreadcrumbItemClick}
            />
        </div>
    );
});

/**
 * Шаблон отображения элемента с хлебными крошками по умолчанию. Не имеет настраиваемых опций ,может быть встроен в пользовательский шаблон. см {@link Controls/_explorer/interface/IExplorer#searchBreadCrumbsItemTemplate Иерархический проводник}
 * @class Controls/_searchBreadcrumbsGrid/render/ItemTemplate
 * @public
 */
