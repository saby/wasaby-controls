import * as React from 'react';
import { loadSync } from 'WasabyLoader/ModulesLoader';
import { delimitProps } from 'UICore/Jsx';

interface IItemTemplateProps {
    className?: string;
}

function HeaderTemplate(props: IItemTemplateProps, ref: React.ForwardedRef<HTMLDivElement>) {
    const { clearProps, userAttrs, events } = delimitProps(props);

    const MenuHeaderTemplate = loadSync('Controls/menu:HeaderTemplate');

    const attrs = {
        ...userAttrs,
        className:
            (userAttrs?.className || '') +
            ' controls-MenuButton__popup-header' +
            (props.multiSelect || (props.markerVisibility && props.markerVisibility !== 'hidden')
                ? ' controls-MenuButton__popup-header-paddingLeft_s'
                : ' controls-MenuButton__popup-header-paddingLeft_default'),
    };

    return <MenuHeaderTemplate {...clearProps} {...events} attrs={attrs} ref={ref} />;
}

HeaderTemplate.displayName = 'Controls/dropdown:HeaderTemplate';

export default React.forwardRef(HeaderTemplate);
