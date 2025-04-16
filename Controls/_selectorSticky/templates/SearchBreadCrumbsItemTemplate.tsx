import Async from 'Controls/Container/Async';
import { IItemTemplateProps } from 'Controls/searchBreadcrumbsGrid';

export default function SearchSelectorBreadcrumbsItemTemplate(props: IItemTemplateProps) {
    const templateOptions = {
        ...props,
        highlightOnHover: false,
    };
    return (
        <Async
            templateName="Controls/searchBreadcrumbsGrid:SearchBreadcrumbsItemTemplate"
            templateOptions={templateOptions}
        ></Async>
    );
}
