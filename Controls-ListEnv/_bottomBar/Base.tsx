import { Button } from 'Controls/buttons';
import * as React from 'react';
import 'css!Controls-ListEnv/bottomBar';
import { Register } from 'Controls/event';

export interface IBottomBarBaseProps {
    expanded?: boolean;
    rightTemplate?: React.ReactElement;
    children: React.ReactElement;
    beforeExpanderTemplate?: React.ReactElement;
    className?: string;
    readOnly?: boolean;

    onExpandedChanged(newExpanded: boolean): void;
}

function BottomBarBase(props: IBottomBarBaseProps): JSX.Element {
    const barContainerRef = React.useRef(null);
    const registerRef = React.useRef<Register>(null);
    const onResize = React.useCallback(() => {
        //@ts-ignore
        registerRef.current.start();
    }, []);

    const onExpanderClick = React.useCallback(() => {
        props.onExpandedChanged(!props.expanded);
    }, [props.onExpandedChanged, props.expanded]);

    React.useEffect(() => {
        onResize();
    }, [props.rightTemplate]);

    return (
        <Register register={'controlResize'} ref={registerRef}>
            <div
                ref={barContainerRef}
                className={`${
                    props.className || ''
                } controls-ListEnv-BottomBar controls-ListEnv-BottomBar_${
                    props.expanded ? 'expanded' : 'collapsed'
                }`}
            >
                {props.expanded ? (
                    <div className={'controls-ListEnv-BottomBar__operationsPanelWrapper'}>
                        {props.children}
                    </div>
                ) : null}
                {props.beforeExpanderTemplate
                    ? React.cloneElement(props.beforeExpanderTemplate, {
                          className: 'controls-ListEnv-BottomBar__beforeExpanderTemplate',
                          readOnly: props.readOnly,
                      })
                    : null}
                <Button
                    className={'controls-ListEnv-BottomBar__expander'}
                    data-qa={'controls-ListEnv-BottomBar__expander'}
                    onClick={onExpanderClick}
                    iconStyle={'label'}
                    icon={props.expanded ? 'icon-View' : 'icon-ViewBack'}
                    readOnly={props.readOnly}
                    iconSize={'s'}
                    viewMode={'link'}
                />
                {props.rightTemplate
                    ? React.cloneElement(props.rightTemplate, {
                          className: 'controls-ListEnv-BottomBar__rightTemplate',
                          readOnly: props.readOnly,
                      })
                    : null}
            </div>
        </Register>
    );
}

BottomBarBase.defaultProps = {
    expanded: false,
};

export default BottomBarBase;
