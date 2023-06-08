import * as React from 'react';
import { IControlOptions } from 'UI/Base';
import { BaseItem, IBaseItemProps } from 'Controls-Templates/itemTemplates';
import TickMarker from 'Controls-Templates/TickMarker';
import { Button } from 'Controls/buttons';
import 'css!DemoStand/Controls-demo';
import 'css!Controls-Templates-demo/styles';

export default class Index extends React.Component {
    private readonly _commonItemsProps: Partial<IBaseItemProps> = {
        className: 'Controls-Templates-demo__itemsSpacing',
        shadowVisibility: 'visible',
        roundAngleBL: 'm',
        roundAngleBR: 'm',
        roundAngleTL: 'm',
        roundAngleTR: 'm',
    };
    constructor(props: IControlOptions) {
        super(props);
        this.state = {
            checkboxValue: false,
        };
    }
    render(): JSX.Element {
        return (
            <div className={'controlsDemo__wrapper controlsDemo__maxWidth200'}>
                <BaseItem
                    {...this._commonItemsProps}
                    checkboxVisibility={'hidden'}
                >
                    В базовый шаблон записи можно поместить произвольное
                    содержимое, например, текст
                    <TickMarker />
                </BaseItem>
                <BaseItem
                    {...this._commonItemsProps}
                    checkboxValue={this.state.checkboxValue}
                    checkboxVisibility={'onhover'}
                >
                    <div>
                        Или даже контролы
                        <Button
                            caption={'Click me!'}
                            onClick={() => {
                                this.setState({
                                    checkboxValue: !this.state.checkboxValue,
                                });
                            }}
                        />
                    </div>
                </BaseItem>
            </div>
        );
    }
}
