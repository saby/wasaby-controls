import * as React from 'react';
import { groupConstants } from 'Controls/baseList';
import { IGroupRowComponentProps } from 'Controls/_gridReact/group/interface';
import RowComponent from 'Controls/_gridReact/row/RowComponent';
import { useItemData } from 'Controls/_gridReact/hooks/useItemData';

function isHiddenGroup(contents: string): boolean {
    return contents === groupConstants.hiddenGroup;
}

/*
 * Компонент для рендера колонок групп.
 * @param props
 * @constructor
 */
function GroupRowComponent(props: IGroupRowComponentProps): React.ReactElement {
    const { item } = useItemData();
    const className = ` controls-ListView__group${
        isHiddenGroup(item as unknown as string) ? 'Hidden' : ''
    }`;
    return <RowComponent {...props} className={className} />;
}

export default React.memo(GroupRowComponent);
