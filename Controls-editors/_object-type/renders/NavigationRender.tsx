import { useStrictSlice } from 'Controls-DataEnv/context';
import { ObjectTypeSlice } from '../factory/ObjectTypeSlice';
import { GroupRender, IGroupRenderProps } from './GroupRender';
import { getGroupsFromMeta } from '../utils/getGroupsFromMeta';
import { useMemo } from 'react';

export interface INavigationRenderProps
    extends Pick<
        IGroupRenderProps,
        | 'onChange'
        | 'GroupComponent'
        | 'validation'
        | 'metaType'
        | 'EditorLayoutComponent'
        | 'value'
        | 'GroupHeaderComponent'
    > {
    storeId: string;

    /**
     * Строится ли сейчас редактор вложенного объекта.
     */
    nestedEdtior: boolean;
}

export function NavigationRender({
    storeId,
    nestedEdtior,
    value,
    onChange,
    validation,
    GroupComponent,
    EditorLayoutComponent,
    metaType,
    GroupHeaderComponent,
}: INavigationRenderProps) {
    const slice = useStrictSlice<ObjectTypeSlice>(storeId);
    const navigation = slice.state.navigation;

    const groups = useMemo(() => {
        return getGroupsFromMeta(
            metaType,
            slice.getEditor,
            nestedEdtior ? undefined : navigation,
            slice.state.useCategories
        );
    }, [metaType, slice, navigation, nestedEdtior]);

    return (
        <>
            {groups.map((x) => {
                return (
                    <GroupRender
                        key={`key_${x.id}`}
                        {...x}
                        value={value}
                        metaType={metaType}
                        GroupHeaderProps={undefined}
                        EditorLayoutComponent={EditorLayoutComponent}
                        EditorLayoutProps={undefined}
                        onChange={onChange}
                        GroupComponent={GroupComponent}
                        GroupHeaderComponent={GroupHeaderComponent}
                        validation={validation}
                        storeId={storeId}
                    />
                );
            })}
        </>
    );
}
