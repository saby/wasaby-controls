import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { GroupContentComponent as ListGroupTemplate } from 'Controls/baseList';

function Demo(_props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>): React.ReactElement {
    return (
        <div ref={ref} className={'tw-flex tw-flex-wrap'}>
            {[
                'primary',
                'secondary',
                'success',
                'warning',
                'danger',
                'info',
                'label',
                'contrast',
                'unaccented',
            ].map((iconStyle) => {
                return (
                    <div key={iconStyle} ref={ref} className={'controlsDemo__maxWidth200'}>
                        <ListGroupTemplate iconStyle={iconStyle} textRender={'MacBook Pro'} />
                    </div>
                );
            })}
        </div>
    );
}

export default React.forwardRef(Demo);
