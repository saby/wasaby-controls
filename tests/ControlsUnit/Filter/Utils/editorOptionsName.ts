import { Memory } from 'Types/source';

let countCall = 0;

export default function () {
    countCall++;

    if (countCall > 1) {
        throw new Error('ControlsUnit/Filter/editorOptionsName функция вызвана несколько раз');
    }

    return Promise.resolve({
        source: new Memory({
            keyProperty: 'id',
            data: [
                {
                    key: 0,
                    city: 'Ярославль',
                },
            ],
        }),
    });
}
