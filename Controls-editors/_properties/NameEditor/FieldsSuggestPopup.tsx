import { memo, useCallback } from 'react';
import { ListContainer } from 'Controls/suggestPopup';
import { View as ListView, ItemTemplate, GroupTemplate } from 'Controls/list';
import { Highlight } from 'Controls/baseDecorator';
import { Path } from 'Controls/breadcrumbs';
import type { Memory } from 'Types/source';
import type { FieldPath } from './FieldPath';
import {
    IFieldItemDisplayProperty,
    IFieldItemKeyProperty,
} from 'Controls-editors/_properties/NameEditor/dataFactory/FieldsSource';

interface IFieldsSuggestPopup {
    source: Memory;
    pathGetter: FieldPath;
}

const ContentTemplate = memo((props: any) => {
    const contents = props.item.contents;
    const title = contents.get(IFieldItemDisplayProperty);
    return (
        <div className={'ws-ellipsis controls-padding_left-l'}>
            <Highlight value={title} highlightedValue={props.searchValue} />
        </div>
    );
});

const SuggestItemTemplate = memo((props: any) => {
    return <ItemTemplate {...props} contentTemplate={ContentTemplate} />;
});

const FieldsSuggestPopup = memo((props: IFieldsSuggestPopup) => {
    const { pathGetter } = props;

    const GroupContentTemplate = useCallback((contentProps: any) => {
        const parentId: number = contentProps.item.contents;
        const currentValuePath = pathGetter?.getPath(parentId, true) || [];

        return (
            <div className={'ws-ellipsis controls-padding_left-xs'}>
                <Path
                    keyProperty={IFieldItemKeyProperty}
                    displayProperty={IFieldItemDisplayProperty}
                    items={currentValuePath}
                    readOnly={true}
                />
            </div>
        );
    }, []);

    const SuggestGroupTemplate = useCallback(
        (groupProps) => {
            return (
                <GroupTemplate
                    {...groupProps}
                    expanderVisible={false}
                    separatorVisibility={false}
                    textAlign="left"
                    contentTemplate={GroupContentTemplate}
                />
            );
        },
        [GroupContentTemplate]
    );

    const SuggestList = useCallback(
        (listProps: any) => {
            return (
                <ListView
                    {...listProps}
                    itemTemplate={SuggestItemTemplate}
                    markerVisibility="hidden"
                    groupTemplate={SuggestGroupTemplate}
                    groupProperty="Parent"
                />
            );
        },
        [SuggestGroupTemplate]
    );

    return <ListContainer {...props} content={SuggestList} />;
});

export default FieldsSuggestPopup;
