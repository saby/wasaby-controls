import * as React from 'react';
import { HeaderTemplate } from 'Controls/selectorSticky';

const HEADER_TYPE = {
    regl: 'Выберите регламент',
    event: 'Выберите событие',
};

const PLACEHOLDER_TYPE = {
    regl: 'Регламент',
    event: 'Событие',
};

export default React.forwardRef(function HeaderContentTemplate(props, ref) {
    const [headingCaption, searchPlaceholder] = React.useMemo(() => {
        const rootItemType =
            props.breadCrumbsItems?.[props.breadCrumbsItems?.length - 1]?.get('type');
        if (rootItemType) {
            return [HEADER_TYPE[rootItemType], PLACEHOLDER_TYPE[rootItemType]];
        }
        return [props.caption, props.searchPlaceholder];
    }, [props.caption, props.searchPlaceholder, props.breadCrumbsItems]);

    return (
        <HeaderTemplate
            {...props}
            ref={ref}
            caption={headingCaption}
            searchPlaceholder={searchPlaceholder}
        />
    );
});
