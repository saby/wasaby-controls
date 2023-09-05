/**
 * @kaizen_zone 4caa6c7f-c139-49cb-876d-d68aca67db9f
 */
import * as React from 'react';
import { IControlProps } from 'Controls/interface';
import { Wrapper } from 'Controls/themes';
import { wasabyAttrsToReactDom } from 'UICore/Jsx';

const getVariables = (): Record<string, string> => {
    return {
        '--label_text-color': '#666',
        '--label_hover_text-color': '#333',
        '--separator_color': '#EAEAEA',
        '--hover_background-color': '#E3E5E8',
        '--active_background-color': '#CDD0D6',
        '--readonly_color': '#B5B5B5',
        '--pale_border-color': '#DFE2E7',
        '--readonly_border-color': '#DFE2E7',
        '--pale_contrast_background-color': '#E7E9E9',
        '--pale_hover_contrast_background-color': '#DFE2E7',
        '--background-color_default_sticky': 'var(--contrast_background-color)',
    };
};

/**
 * Контейнер для контрастной стилизации элементов списка, лежащих на сером фоне
 * @class Controls/_themesExt/ContrastWrapper
 * @implements Controls/interface:IControl
 * @public
 * @demo Controls-demo/themes/ContrastWrapper/Index
 */

function ContrastWrapper(props: IControlProps, ref): React.ReactElement {
    const attrs = props.attrs ? wasabyAttrsToReactDom(props.attrs) || {} : {};
    return (
        <Wrapper
            variables={getVariables()}
            ref={ref}
            onKeyDown={props.onKeyDown}
            content={props.content}
            children={props.children}
            context={props.context}
            className={`controls_theme-default controls-ContrastWrapper ${attrs.className}`}
            readOnly={props.readOnly}
        />
    );
}

export default React.forwardRef(ContrastWrapper);
