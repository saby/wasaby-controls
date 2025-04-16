import { forwardRef, ReactElement } from 'react';
import { IUserAreaConfig } from 'Controls/selector';
import { loadSync } from 'WasabyLoader/ModulesLoader';
import { createElement } from 'UICore/Jsx';

interface IBeforeTabsTemplateProps extends IUserAreaConfig {
    storeId: string;
}

const BeforeTabsTemplate = forwardRef((props: IBeforeTabsTemplateProps): ReactElement | null => {
    if (!props.templateName) {
        return null;
    }
    const template = loadSync(props.templateName);
    const templateOptions = {
        ...props.templateOptions,
        storeId: props.storeId,
    };
    const ContentTemplate = createElement(template, templateOptions);
    return ContentTemplate;
});

export default BeforeTabsTemplate;
