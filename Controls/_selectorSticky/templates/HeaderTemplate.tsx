import { ReactElement, forwardRef } from 'react';
import { loadSync } from 'WasabyLoader/ModulesLoader';
import HeaderContentTemplate, { IHeaderTemplateProps } from './HeaderContentTemplate';
import { useSlice } from 'Controls-DataEnv/context';
import { ListSlice } from 'Controls/dataFactory';

export default forwardRef(function HeaderTemplate(props: IHeaderTemplateProps, ref): ReactElement {
    const listContext = useSlice<ListSlice>(props.storeId);
    const breadCrumbsItems = listContext?.state.breadCrumbsItems;
    if (props.headerContentTemplate) {
        let HeaderCustomTemplate = props.headerContentTemplate;
        if (typeof props.headerContentTemplate === 'string') {
            HeaderCustomTemplate = loadSync(props.headerContentTemplate);
        }
        return (
            <HeaderCustomTemplate
                ref={ref}
                {...props}
                headerContentTemplate={null}
                breadCrumbsItems={breadCrumbsItems}
                menuMode="selector"
            />
        );
    }
    return <HeaderContentTemplate {...props} ref={ref} />;
});
