import * as React from 'react';
import { createElement } from 'UICore/Jsx';
import WasabyHeaderBreadcrumbs from 'Controls/_explorer/HeaderBreadcrumbs';

export interface IHeaderCellReactComponentProps {
    breadcrumbsOptions: object;
}

export default React.memo(
    React.forwardRef(function HeaderBreadcrumbs(
        props: IHeaderCellReactComponentProps,
        ref
    ): JSX.Element {
        return createElement(WasabyHeaderBreadcrumbs, {
            ...props.breadcrumbsOptions,
            forwardedRef: ref,
        });
    })
);
