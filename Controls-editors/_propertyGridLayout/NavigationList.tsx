import { useStrictSlice } from 'Controls-DataEnv/context';
import { ObjectTypeSlice } from 'Controls-editors/object-type';

import { ItemsView as TreeGridView } from 'Controls/treeGrid';
import { useCallback, useMemo, useState } from 'react';
import { RecordSet } from 'Types/collection';
import { scrollToElement } from 'Controls/scroll';
import { Container as ScrollContainer } from 'Controls/scroll';
import { Model } from 'Types/entity';

export interface INavigationListProps {
    storeId: string;
    attrs?: Record<string, string>;
}

export const NavigationList = function NavigationList(props: INavigationListProps) {
    const { storeId, attrs } = props;
    const slice = useStrictSlice<ObjectTypeSlice>(storeId);

    const navigation = slice.state.navigation;

    const navigationRecordSet = useMemo(() => {
        return new RecordSet({
            rawData: navigation ?? [],
            keyProperty: 'id',
        });
    }, [navigation]);

    const [markedKey, setMarkedKey] = useState(navigation?.[0]?.id);

    const scrollToKey = useCallback((navigationId) => {
        const element = document.getElementsByClassName(
            `PropertyGrid__group__${navigationId}`
        )[0] as HTMLElement;
        if (element) {
            setMarkedKey(navigationId);
            scrollToElement(element);
        }
    }, []);

    const selectedKeyChangeHandler = useCallback(
        (_, keys: string[]) => {
            if (keys.length > 1) {
                scrollToKey(keys[0]);
            }
        },
        [scrollToKey]
    );

    const markedKeyChangeHandler = useCallback(
        (model: Model) => {
            scrollToKey(model.get('id'));
        },
        [scrollToKey]
    );

    return (
        <ScrollContainer className={attrs?.className} backgroundStyle={'transparent'}>
            <TreeGridView
                keyProperty={'id'}
                parentProperty={'parent'}
                hasChildrenProperty={'hasChild'}
                columns={columnsConfig}
                markedKey={markedKey}
                nodeProperty={'hasChild'}
                // @ts-ignore
                onSelectedKeyChanged={selectedKeyChangeHandler}
                // @ts-ignore
                onItemClick={markedKeyChangeHandler}
                items={navigationRecordSet}
                style={'master'}
            />
        </ScrollContainer>
    );
};

const columnsConfig = [
    {
        displayProperty: 'name',
    },
];
