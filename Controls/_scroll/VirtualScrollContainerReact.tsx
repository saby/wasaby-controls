import * as React from 'react';

interface IProps {
    position: 'top' | 'bottom';
    register: (callback: Function) => Function;
}

function VirtualScrollContainerReact(
    props: React.PropsWithChildren<IProps>,
    ref: React.ForwardedRef<unknown>
) {
    const [visible, setVisible] = React.useState(true);

    React.useEffect(() => {
        const unregister = props.register((position: 'top' | 'bottom', enabled: boolean) => {
            if (position === props.position) {
                setVisible(!enabled);
            }
        });
        return () => unregister();
    }, []);

    const className = visible ? '' : 'ws-hidden';
    return React.cloneElement(props.children, { className, ref });
}

export default React.forwardRef(VirtualScrollContainerReact);
