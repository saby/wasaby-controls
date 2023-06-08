import * as React from 'react';
import { ItemsView as List } from 'Controls/list';
import { Container } from 'Controls/animation';
import 'css!DemoStand/Controls-demo';
import { Record } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import { BaseItem } from 'Controls-Templates/BaseItem';

const data1 = [
    {
        key: 1,
        title: 'Агреман, ООО',
        description: 'ЭО продление',
    },
    {
        key: 2,
        title: 'Стандарт-акм, ОАО',
        description: 'Расширение лицензии',
    },
    {
        key: 3,
        title: 'Эвкалипт,АО',
        description: 'Подключить скуд',
    },
    {
        key: 4,
        title: 'Аврора, ОАО',
        description: 'Расширение лицензии',
    },
];

const data2 = [
    {
        key: 5,
        title: 'Агреман, ООО',
        description: 'ЭО продление',
    },
    {
        key: 6,
        title: 'Курицин Сергей Валерьевич, ИП',
        description: 'Сделка прошла успешно',
    },
    {
        key: 7,
        title: 'Смирнов Алексей',
        description: 'Расширение лицензии',
    },
    {
        key: 8,
        title: 'Гипродвигатель ЗАО',
        description: 'Отказ',
    },
    {
        key: 9,
        title: 'Интердол, ООО',
        description: 'Расширение лицензии',
    },
];

const animationTemplate = ({ entity }: { entity: Record }) => {
    return (
        <BaseItem
            className={'controls-background-default'}
            shadowVisibility={'visible'}
            roundAngleBL={'s'}
            roundAngleBR={'s'}
            roundAngleTL={'s'}
            roundAngleTR={'s'}
        >
            <div>
                <div className={'controls-padding-s'}>{entity.get('title')}</div>
                <div className={'controls-padding-s controls-fontsize-s controls-text-label'}>
                    {entity.get('description')}
                </div>
            </div>
        </BaseItem>
    );
};

const itemTemplate = React.memo((props) => {
    return (
        <BaseItem
            {...props}
            shadowVisibility={'onhover'}
            roundAngleBL={'s'}
            roundAngleBR={'s'}
            roundAngleTL={'s'}
            roundAngleTR={'s'}
        >
            <div>
                <div className={'controls-padding-s'}>{props.item.contents.get('title')}</div>
                <div className={'controls-padding-s controls-fontsize-s controls-text-label'}>
                    {props.item.contents.get('description')}
                </div>
            </div>
        </BaseItem>
    );
});

interface IState {
    leftButtonDisabled: boolean;
    rightButtonDisabled: boolean;
}
export default class Index extends React.Component<{}, IState> {
    protected _items1: RecordSet;
    protected _items2: RecordSet;
    protected _list1ref: React.Ref<List>;
    protected _list2ref: React.Ref<List>;
    protected _animationRef: React.Ref<Container>;

    constructor(props: {}) {
        super(props);
        this.state = {
            leftButtonDisabled: false,
            rightButtonDisabled: false,
        };
        this._list1ref = React.createRef();
        this._list2ref = React.createRef();
        this._animationRef = React.createRef();
        this._items1 = new RecordSet({
            keyProperty: 'key',
            rawData: data1,
        });
        this._items2 = new RecordSet({
            keyProperty: 'key',
            rawData: data2,
        });
    }

    _moveItemLeft(): void {
        this._list1ref.current.animateAdding();
        this._list2ref.current.animateRemoving();
        const item = this._items2.at(0);
        this._items1.add(item.clone(), 0);
        this._items2.remove(item);
        this._animationRef.current.startAnimation({
            fromId: 'list2',
            toId: 'list1',
            fromPosition: 0,
            toPosition: 0,
            entity: item.clone(),
        });
        this.setState({
            leftButtonDisabled: this._items2.getCount() === 0,
            rightButtonDisabled: this._items1.getCount() === 0,
        });
    }

    _moveItemRight(): void {
        this._list1ref.current.animateRemoving();
        this._list2ref.current.animateAdding();
        const item = this._items1.at(0);
        this._items2.add(item.clone(), 0);
        this._items1.remove(item);
        this._animationRef.current.startAnimation({
            fromId: 'list1',
            toId: 'list2',
            fromPosition: 0,
            toPosition: 0,
            entity: item.clone(),
        });
        this.setState({
            leftButtonDisabled: this._items2.getCount() === 0,
            rightButtonDisabled: this._items1.getCount() === 0,
        });
    }

    render(): JSX.Element {
        return (
            <div className={'controlsDemo__wrapper'}>
                <Container ref={this._animationRef} animationTemplate={animationTemplate}>
                    <div className={'controlsDemo__flexRow'}>
                        <div className={'controlsDemo__wrapper controlsDemo_fixedWidth300'}>
                            <List
                                ref={this._list1ref}
                                animationId={'list1'}
                                keyProperty={'key'}
                                items={this._items1}
                                itemTemplate={itemTemplate}
                            />
                        </div>
                        <div className={'controlsDemo__wrapper ws-flex-column ws-flexbox'}>
                            <button
                                disabled={this._items2.getCount() === 0}
                                onClick={() => {
                                    this._moveItemLeft();
                                }}
                            >
                                {'<===='}
                            </button>
                            <button
                                disabled={this._items1.getCount() === 0}
                                onClick={() => {
                                    this._moveItemRight();
                                }}
                            >
                                {'====>'}
                            </button>
                        </div>
                        <div className={'controlsDemo__wrapper controlsDemo_fixedWidth300'}>
                            <List
                                ref={this._list2ref}
                                animationId={'list2'}
                                keyProperty={'key'}
                                items={this._items2}
                                itemTemplate={itemTemplate}
                            />
                        </div>
                    </div>
                </Container>
            </div>
        );
    }
}
