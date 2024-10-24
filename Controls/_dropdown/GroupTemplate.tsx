import * as React from 'react';
import { loadSync } from 'WasabyLoader/ModulesLoader';
import { delimitProps } from 'UICore/Jsx';

interface IItemTemplateProps {
    className?: string;
}

function GroupTemplate(props: IItemTemplateProps, ref: React.ForwardedRef<HTMLDivElement>) {
    const { clearProps, userAttrs, events } = delimitProps(props);

    const MenuGroupTemplate = loadSync('Controls/menu:GroupTemplate');

    return <MenuGroupTemplate {...clearProps} {...events} attrs={userAttrs} forwardedRef={ref} />;
}

GroupTemplate.displayName = 'Controls/dropdown:GroupTemplate';

export default React.forwardRef(GroupTemplate);
