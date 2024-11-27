import * as React from 'react';
import { SearchHeaderTemplate } from 'Controls/menu';

const HEADER_TYPE = {
    regl: 'Выберите регламент',
    event: 'Выберите событие',
};

const PLACEHOLDER_TYPE = {
    regl: 'Регламент',
    event: 'Событие',
};

export default function HeaderContentTemplate(props): React.ReactElement {
    const [headingCaption, searchPlaceholder] = React.useMemo(() => {
        const rootItemType =
            props.breadCrumbsItems?.[props.breadCrumbsItems?.length - 1]?.get('type');
        if (rootItemType) {
            return [HEADER_TYPE[rootItemType], PLACEHOLDER_TYPE[rootItemType]];
        }
        return [props.caption, props.searchPlaceholder];
    }, [props.caption, props.searchPlaceholder, props.breadCrumbsItems]);

    return (
        <SearchHeaderTemplate
            {...props}
            caption={headingCaption}
            searchPlaceholder={searchPlaceholder}
        />
    );
}
