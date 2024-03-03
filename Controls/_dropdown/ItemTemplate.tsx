import * as React from 'react';
import { loadSync } from 'WasabyLoader/ModulesLoader';
import { delimitProps } from 'UICore/Jsx';

interface IItemTemplateProps {
    itemData: { treeItem: any };
    className?: string;
}

function ItemTemplate(props: IItemTemplateProps, ref: React.ForwardedRef<HTMLDivElement>) {
    const { clearProps, userAttrs, events } = delimitProps(props);

    const MenuItemTemplate = loadSync('Controls/menu:ItemTemplate');

    return (
        <MenuItemTemplate
            {...clearProps}
            {...events}
            attrs={userAttrs}
            forwardedRef={ref}
            treeItem={clearProps.itemData.treeItem}
        />
    );
}

ItemTemplate.displayName = 'Controls/dropdown:ItemTemplate';

export default React.forwardRef(ItemTemplate);
