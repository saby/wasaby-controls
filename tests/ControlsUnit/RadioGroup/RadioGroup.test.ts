import { Control as RadioGroup } from 'Controls/RadioGroup';
import { Model } from 'Types/entity';
import { RecordSet } from 'Types/collection';

describe('Controls/RadioGroup', () => {
    it('change selected key', function () {
        let keyChanged = false;
        const handler = () => {
            keyChanged = true;
        };
        const radio = new RadioGroup({ onSelectedkeychanged: handler });
        radio.componentDidMount();
        const item = new Model({
            keyProperty: '2',
            rawData: 'test',
        });
        radio._selectKeyChanged('event', item, '2');
        expect(keyChanged).toBe(true);
    });

    it('componentDidMount', () => {
        const items = new RecordSet({
            keyProperty: 'id',
            rawData: [
                {
                    id: '1',
                    tittle: 'test1',
                },
                {
                    id: '2',
                    tittle: 'test2',
                },
            ],
        });
        const props = {
            items,
        };

        const radio = new RadioGroup({ ...props });
        radio.componentDidMount();
        const currentItems = radio.state.items;

        expect(currentItems.at(0).get('tittle') === 'test1').toBe(true);
        expect(currentItems.at(1).get('tittle') === 'test2').toBe(true);
    });

    it('componentDidUpdate', () => {
        const items1 = new RecordSet({
            keyProperty: 'id',
            rawData: [
                {
                    id: '1',
                    tittle: 'test1',
                },
                {
                    id: '2',
                    tittle: 'test2',
                },
            ],
        });
        const radio = new RadioGroup({ items: items1 });
        radio.componentDidMount();
        const items2 = new RecordSet({
            keyProperty: 'id',
            rawData: [
                {
                    id: '1',
                    tittle: 'caption1',
                },
                {
                    id: '2',
                    tittle: 'caption2',
                },
            ],
        });
        radio.props = { items: items2 };
        radio.setState = (data) => {
            radio.state = data;
        };
        radio.componentDidUpdate({ items: items1 }, radio.state);
        expect(radio.state.items.at(0).get('tittle') === 'caption1').toBe(true);
        expect(radio.state.items.at(1).get('tittle') === 'caption2').toBe(true);
    });
});
