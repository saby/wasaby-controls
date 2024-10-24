import * as React from 'react';
import { ItemTemplate } from 'Controls/menu';

export default function FilterEmptyItem(props) {
    return (
        <ItemTemplate
            {...props}
            multiSelect={false}
            data-qa="SimplePanel-dropdown__emptyItem"
            className={`controls-SimplePanel-dropdown__emptyItem_content
             controls-SimplePanel-dropdown__emptyItem ${
                 props.emptyItemFontWeight === 'bold'
                     ? 'controls-SimplePanel-dropdown__emptyItem_font-weight'
                     : ''
             }`}
        />
    );
}
