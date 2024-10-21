import { View } from 'Controls/list';

describe('Controls/list:View', () => {
    describe('EditInPlace', () => {
        describe('Public API', () => {
            [
                ['beginEdit', false, true],
                ['beginEdit', true, false],
                ['beginAdd', false, true],
                ['beginAdd', true, false],
                ['cancelEdit', false, true],
                ['cancelEdit', true, false],
                ['commitEdit', false, true],
                ['commitEdit', true, false],
            ].forEach(([methodName, readOnly, expectedIsSuccessful]) => {
                it(`${methodName}, readOnly: ${readOnly}`, async () => {
                    const list = new View();

                    let isSuccessful = null;
                    list.saveOptions({ readOnly });

                    list._children = {
                        listControl: {
                            beginEdit: () => {
                                return Promise.resolve();
                            },
                            beginAdd: () => {
                                return Promise.resolve();
                            },
                            cancelEdit: () => {
                                return Promise.resolve();
                            },
                            commitEdit: () => {
                                return Promise.resolve();
                            },
                        },
                    };

                    const result = list[methodName]({})
                        .then(() => {
                            isSuccessful = true;
                        })
                        .catch(() => {
                            isSuccessful = false;
                        });
                    expect(result).toBeInstanceOf(Promise);

                    await result;

                    if (expectedIsSuccessful) {
                        expect(isSuccessful).toBe(true);
                    } else {
                        expect(isSuccessful).toBe(false);
                    }
                });
            });
        });
    });
});
