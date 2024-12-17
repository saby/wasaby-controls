import * as React from 'react';
import { ListItem, IListItemProps } from 'Controls-Templates/itemTemplates';
import 'css!DemoStand/Controls-demo';
import 'css!Controls-Templates-demo/styles';

export default class Index extends React.Component {
    private readonly _commonItemsProps: Partial<IListItemProps> = {
        className: 'Controls-Templates-demo__itemsSpacing',
        shadowVisibility: 'visible',
        roundAngleBL: 'm',
        roundAngleBR: 'm',
        roundAngleTL: 'm',
        roundAngleTR: 'm',
    };
    render(): JSX.Element {
        return (
            <div
                ref={this.props.forwardedRef}
                className={'controlsDemo__wrapper controlsDemo__maxWidth800'}
            >
                <ListItem
                    {...this._commonItemsProps}
                    markerVisible={true}
                    caption={'ListItem принимает в качестве caption строку, или ReactNode.'}
                />
                <ListItem
                    {...this._commonItemsProps}
                    captionHAlign={'middle'}
                    caption={
                        <span>
                            Например, можно вставить{' '}
                            <a className={'ws-link'} href={'https://wasaby.dev/'}>
                                ссылку
                            </a>
                        </span>
                    }
                />
                <ListItem
                    {...this._commonItemsProps}
                    captionHAlign={'right'}
                    captionFontSize={'xl'}
                    caption={<div>А еще можно выравнивать, и стилизовать текст</div>}
                />
            </div>
        );
    }
}
