import { Memory } from 'Types/source';
import { RecordSet } from 'Types/collection';
import { Model, adapter, Guid } from 'Types/entity';

interface IData {
    key: string;

    number: string;
    date: Date;

    company: string;
    sender: string;
    account: string;
    comment: string;
    additionalData: string[];

    sum: number;
    icons: string[];
}

function createItem(props?: Partial<IData>): IData {
    return {
        key: props?.key ?? Guid.create(),

        number: props?.number,
        date: props?.date,

        company: props?.company ?? 'ВТБ 24',
        sender: props?.sender ?? 'Отправитель 1',
        account: props?.account ?? 'Аккаунт 4531232',
        comment: props?.comment ?? 'Лосиная поляна',
        additionalData: props?.additionalData ?? ['Вафельная крошка', 'Огурец'],

        sum: props?.sum ?? 450,
        icons: props?.icons ?? [],
    };
}

function getData(): IData[] {
    return [
        createItem({
            key: '2626c5cb-a665-4426-b3a6-9b9f8204ad9c',
            number: '...08111',
            date: new Date(2025, 4, 8),
        }),
        createItem({
            key: '28147c2c-12c4-432f-865d-5a468c601418',
            number: '...08111',
            date: new Date(2025, 4, 8),
        }),
        createItem({
            key: '72fb6caa-4211-4a67-aa29-62e4639f000e',
            number: '...08111',
            date: new Date(2025, 4, 8),
        }),
        createItem({
            key: 'cf9fdffb-5cc1-4fd3-b8ca-443739bd7871',
            number: '...08111',
            date: new Date(2023, 1, 20),
        }),
        createItem({
            key: '51be641a-80bb-46cf-bb93-23a391bf33da',
            number: '...08111',
            date: new Date(2023, 1, 20),
        }),
        createItem({
            key: 'a79d162c-e415-4559-999a-742e4c393b78',
            number: '...08123',
            date: new Date(2023, 1, 20),
            icons: ['icon-Payment'],
        }),
        createItem({
            key: '129360bd-63bb-46a5-8643-46c00f8f7e33',
            number: '...08123',
            date: new Date(2023, 1, 18),
        }),
        createItem({
            key: '323ee9ac-c0eb-4fe6-b845-1f29d8d72898',
            number: '...08123',
            date: new Date(2023, 1, 18),
            icons: ['icon-Shipment', 'icon-Payment'],
        }),
        createItem({
            key: 'f905f322-61e8-4879-9c57-577a8613dcff',
            number: '...08123',
            date: new Date(2023, 1, 5),
            icons: [],
        }),
        createItem({
            key: 'aa241a98-c8f9-4105-ae49-6fe0825c1c73',
            number: '...08123',
            date: new Date(2023, 1, 5),
            icons: ['icon-Shipment', 'icon-Payment', 'icon-WaitingSignature'],
        }),
        createItem({
            key: '3c6bfac0-f4a0-415b-ad6c-20fca61043ba',
            number: '...08123',
            date: new Date(2023, 1, 5),
            icons: [],
        }),
        createItem({
            key: 'dca1e8c6-072b-44b1-9db3-553a662aa575',
            number: '...09005',
            date: new Date(2023, 1, 5),
            icons: ['icon-Shipment', 'icon-Payment', 'icon-WaitingSignature'],
        }),
        createItem({
            key: 'e76a8ec1-f233-4e17-b6e8-ecd0b571c428',
            number: '...09007',
            date: new Date(2023, 1, 5),
            icons: [],
        }),
        createItem({
            key: '88bef0bd-ca4e-4644-8e6f-7d6223e95260',
            number: '...09008',
            date: new Date(2023, 1, 5),
            icons: ['icon-Shipment', 'icon-Payment'],
        }),
        createItem({
            key: 'f4a56757-60db-45c3-8f88-82e2e4504908',
            number: '...09011',
            date: new Date(2022, 10, 8),
            icons: ['icon-Shipment'],
        }),
        createItem({
            key: '82fafc21-33f6-4d6d-bccb-141b3369187e',
            number: '...09011',
            date: new Date(2022, 10, 8),
            icons: ['icon-Shipment'],
        }),
        createItem({
            key: '0f651f7a-d339-4fe1-b717-c6212c9b8243',
            number: '...09011',
            date: new Date(2022, 10, 8),
            icons: [],
        }),
        createItem({
            key: 'aa23a187-5e62-48b3-938f-4d293c64210f',
            number: '...09013',
            date: new Date(2022, 10, 8),
            icons: ['icon-Shipment', 'icon-Payment', 'icon-WaitingSignature'],
        }),
        createItem({
            key: '3558e829-0949-43a2-ba78-561522d2a22c',
            number: '...09013',
            date: new Date(2022, 10, 8),
            icons: [],
        }),
        createItem({
            key: 'f10492d0-523b-4e22-b293-424d710f16dc',
            number: '...09013',
            date: new Date(2022, 10, 8),
            icons: [],
        }),
        createItem({
            key: 'dfd94570-be4d-484d-a019-8d371e5de158',
            number: '...09567',
            date: new Date(2022, 10, 8),
            icons: [],
        }),
        createItem({
            key: 'cbcbbb1a-a6df-493c-a84d-b6b7d2591807',
            number: '...09567',
            date: new Date(2022, 10, 8),
            icons: ['icon-Shipment', 'icon-Payment'],
        }),
        createItem({
            key: '65f385c2-266a-414b-a75a-09d471435955',
            number: '...09567',
            date: new Date(2022, 10, 8),
            icons: ['icon-Payment'],
        }),
        createItem({
            key: '3cb3c4ed-5a3d-4289-a7d4-cfeac80e7238',
            number: '...09567',
            date: new Date(2022, 10, 4),
            icons: [],
        }),
        createItem({
            key: '5da256d6-8a4b-424f-b749-c9e7fa8bd827',
            number: '...09567',
            date: new Date(2022, 10, 4),
            icons: [],
        }),
        createItem({
            key: '4245d7d2-b4c7-4118-8632-42b0650807c8',
            number: '...09567',
            date: new Date(2022, 10, 4),
            icons: [],
        }),
        createItem({
            key: 'eaee6472-dc2c-4a3a-b6e7-788291785132',
            number: '...09567',
            date: new Date(2022, 10, 4),
            icons: ['icon-Shipment', 'icon-WaitingSignature'],
        }),
        createItem({
            key: '9c29d033-d925-425b-8aba-0080d2857e8d',
            number: '...09567',
            date: new Date(2022, 10, 4),
            icons: [],
        }),
        createItem({
            key: '1d0a9a65-749c-465a-bc0e-ef9914450b21',
            number: '...09777',
            date: new Date(2022, 10, 4),
            icons: [],
        }),
        createItem({
            key: 'e1031ba3-4797-4680-a76c-bc0d0ee0be0c',
            number: '...09777',
            date: new Date(2022, 10, 4),
            icons: ['icon-Shipment', 'icon-Payment', 'icon-WaitingSignature'],
        }),
        createItem({
            key: 'b35bf0a8-6917-4a7f-8b68-144a91a2ba69',
            number: '...09777',
            date: new Date(2022, 10, 4),
            icons: [],
        }),
    ];
}

function getMetaData() {
    return {
        results: new Model({
            rawData: {
                secondFixed: 200,
                scrollable_0: 122,
                scrollable_1: 23,
                scrollable_2: 345.05,
            },
        }),
    };
}

export const KEY_PROPERTY = 'key';

export function getSource(): Memory {
    return new Memory({
        keyProperty: KEY_PROPERTY,
        data: getData(),
    });
}

export function getSourceWithMetaData() {
    return new Memory({
        keyProperty: KEY_PROPERTY,
        adapter: new adapter.RecordSet(),
        data: new RecordSet({
            keyProperty: KEY_PROPERTY,
            rawData: getData(),
            metaData: getMetaData(),
        }),
    });
}
