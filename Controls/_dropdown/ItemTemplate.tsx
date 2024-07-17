import * as React from 'react';
import { loadSync } from 'WasabyLoader/ModulesLoader';
import { delimitProps } from 'UICore/Jsx';
import { TemplateFunction } from 'UI/Base';
import { CollectionItem } from 'Controls/display';

export interface IItemTemplateProps {
    itemData: { treeItem: any };
    className?: string;
    contentTemplate?: TemplateFunction;
    item: CollectionItem;
}

function ItemTemplate(props: IItemTemplateProps, ref: React.ForwardedRef<HTMLDivElement>) {
    const { clearProps, userAttrs, events } = delimitProps(props);

    const MenuItemTemplate = loadSync('Controls/menu:ItemTemplate');

    return <MenuItemTemplate {...clearProps} {...events} attrs={userAttrs} forwardedRef={ref} />;
}

ItemTemplate.displayName = 'Controls/dropdown:ItemTemplate';

export default React.forwardRef(ItemTemplate);
