import { TInternalProps } from 'UICore/Executor';
import * as React from 'react';
import * as rk from 'i18n!Controls';

export interface IClearRecordsTemplateOptions extends TInternalProps {
    theme?: string;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
}

function ClearRecordsTemplate(
    props: IClearRecordsTemplateOptions,
    ref: React.ForwardedRef<HTMLDivElement>
): JSX.Element {
    return (
        <div
            className={`controls_lookup_theme-${props.theme}
                        controls-Lookup__icon controls-Lookup__clearRecords icon-Close ${props.attrs?.className}`}
            tabIndex={0}
            data-qa="Lookup__clearRecords"
            ref={ref}
            title={rk('Очистить')}
            onClick={props.onClick}
            ws-no-focus={'true'}
        ></div>
    );
}

export default React.forwardRef(ClearRecordsTemplate);
