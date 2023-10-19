import * as React from 'react';
import { Indicator, TIndicatorPosition } from 'Controls/display';
import LoadingIndicatorTemplate from './LoadingIndicatorTemplate';
import IterativeLoadingTemplate from './IterativeLoadingTemplate';
import ContinueSearchTemplate from './ContinueSearchTemplate';

export interface IWrapperIndicatorsTemplateProps<TItem extends Indicator = Indicator> {
    item: TItem;
    onClick?: Function;
    className?: string;
}

export interface IIndicatorProps {
    item: Indicator;
    position: TIndicatorPosition;
}

function getContentTemplate(item: Indicator): React.FunctionComponent<IIndicatorProps> {
    const contentTemplate = item.getContentTemplate();
    if (typeof contentTemplate === 'string') {
        switch (contentTemplate) {
            case 'Controls/baseList:LoadingIndicatorTemplate':
                return LoadingIndicatorTemplate;
            case 'Controls/baseList:IterativeLoadingTemplate':
                return IterativeLoadingTemplate;
            case 'Controls/baseList:ContinueSearchTemplate':
                return ContinueSearchTemplate;
        }
    }

    return contentTemplate;
}

function WrapperIndicatorsTemplate(
    props: IWrapperIndicatorsTemplateProps,
    ref: React.ForwardedRef<HTMLDivElement>
): JSX.Element {
    const dataQa = `${
        props.item.listElementName
    }_state_${props.item.getState()}_position_${props.item.getPosition()}`;
    const Content = getContentTemplate(props.item);
    return (
        <div
            ref={ref}
            className={props.item.getClasses() + ' ' + (props.className || '')}
            style={props.item.getStyles()}
            data-qa={dataQa}
            onClick={(event) => {
                return props.onClick?.(event);
            }}
        >
            <Content item={props.item} position={props.item.getPosition()} />
        </div>
    );
}

export default React.forwardRef(WrapperIndicatorsTemplate);
