import * as React from 'react';
import type { Record } from 'Types/entity';
import PathComponent from './PathComponent';
import type BreadcrumbsItemCell from '../display/BreadcrumbsItemCell';

export interface IItemTemplateProps {
    gridColumn: BreadcrumbsItemCell;
    _onBreadcrumbItemClick: (event: Event, item: Record) => void;
}

export default React.forwardRef(function ItemTemplate(
    props: IItemTemplateProps,
    forwardedRef: React.ForwardedRef<HTMLDivElement>
): JSX.Element {
    return (
        <div className={props.gridColumn.getContentClasses()} ref={forwardedRef}>
            <PathComponent
                {...props.gridColumn.getBreadcrumbsPathProps()}
                onBreadCrumbsItemClick={props._onBreadcrumbItemClick}
            />
        </div>
    );
});
