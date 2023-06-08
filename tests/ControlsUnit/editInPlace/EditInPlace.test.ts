import { Controller as EditInPlace, CONSTANTS } from 'Controls/editInPlace';
import { Collection } from 'Controls/display';
import { Model } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import { Logger } from 'UI/Utils';

describe('Controls/_editInPlace/EditInPlace', () => {
    let items: RecordSet;
    let newItem: Model;
    let collection: Collection<Model>;
    let onBeforeBeginEditCalled: boolean;
    let onAfterBeginEditCalled: boolean;
    let onBeforeEndEditCalled: boolean;
    let onAfterEndEditCalled: boolean;
    let editInPlace: EditInPlace;
    const nativeLoggerError = Logger.error;

    before(() => {
        Logger.error = (
            msg: string = '',
            errorPoint?: object | Node | any,
            errorInfo?: object
        ): object => {
            return {};
        };
    });
    after(() => {
        Logger.error = nativeLoggerError;
    });

    beforeEach(() => {
        newItem = new Model({
            keyProperty: 'id',
            rawData: { id: 4, title: 'Fourth' },
        });

        items = new RecordSet<{ id: number; title: string }>({
            keyProperty: 'id',
            rawData: [
                { id: 1, title: 'First' },
                { id: 2, title: 'Second' },
                { id: 3, title: 'Third' },
            ],
        });

        collection = new Collection({
            keyProperty: 'id',
            collection: items,
        });

        onBeforeBeginEditCalled = false;
        onAfterBeginEditCalled = false;
        onBeforeEndEditCalled = false;
        onAfterEndEditCalled = false;

        editInPlace = new EditInPlace({
            collection,
            onBeforeBeginEdit: () => {
                onBeforeBeginEditCalled = true;
            },
            onAfterBeginEdit: () => {
                onAfterBeginEditCalled = true;
            },
            onBeforeEndEdit: () => {
                onBeforeEndEditCalled = true;
            },
            onAfterEndEdit: () => {
                onAfterEndEditCalled = true;
            },
        });
    });

    describe('edit', () => {
        it('cancel operation [sync callback]', () => {
            editInPlace.updateOptions({
                onBeforeBeginEdit: () => {
                    onBeforeBeginEditCalled = true;
                    return CONSTANTS.CANCEL;
                },
            });

            return editInPlace
                .edit({ item: collection.at(0).contents })
                .then((res) => {
                    expect(res && res.canceled).toBe(true);
                    expect(onBeforeBeginEditCalled).toBe(true);
                    expect(onAfterBeginEditCalled).toBe(false);
                    expect(editInPlace.isEditing()).toBe(false);
                });
        });

        it('cancel operation [async callback]', () => {
            editInPlace.updateOptions({
                onBeforeBeginEdit: () => {
                    onBeforeBeginEditCalled = true;
                    return Promise.resolve(CONSTANTS.CANCEL);
                },
            });

            return editInPlace
                .edit({ item: collection.at(0).contents })
                .then((res) => {
                    expect(res && res.canceled).toBe(true);
                    expect(onBeforeBeginEditCalled).toBe(true);
                    expect(onAfterBeginEditCalled).toBe(false);
                    expect(editInPlace.isEditing()).toBe(false);
                });
        });

        it('commit if current adding item has changes', () => {
            return editInPlace.add({ item: newItem }).then(() => {
                collection
                    .find((i) => {
                        return i.isEditing();
                    })
                    .contents.set('title', 'Changed');

                // Первый запуск пропускаем, он нам не интересен
                onBeforeBeginEditCalled = false;
                onAfterBeginEditCalled = false;

                let wasSaved = false;
                let savingStartedForItemWithKey;

                editInPlace.updateOptions({
                    onBeforeEndEdit: (params) => {
                        if (params.willSave) {
                            savingStartedForItemWithKey = params.item.getKey();
                        }
                    },
                    onAfterEndEdit: (item) => {
                        if (
                            savingStartedForItemWithKey ===
                            item.contents.getKey()
                        ) {
                            wasSaved = true;
                        }
                    },
                    onBeforeBeginEdit: () => {
                        onBeforeBeginEditCalled = true;
                    },
                });
                return editInPlace
                    .edit({ item: items.at(1) })
                    .then((result) => {
                        expect(wasSaved).toBe(true);
                        expect(result).not.toBeDefined();
                        expect(onBeforeBeginEditCalled).toBe(true);
                        expect(onAfterBeginEditCalled).toBe(true);
                        expect(
                            collection
                                .find((i) => {
                                    return i.isEditing();
                                })
                                .contents.getKey()
                        ).toEqual(2);
                    });
            });
        });

        it('commit if current editing item has changes', () => {
            return editInPlace.edit({ item: items.at(0) }).then((res) => {
                collection
                    .find((i) => {
                        return i.isEditing();
                    })
                    .contents.set('title', 'Changed');

                // Первый запуск пропускаем, он нам не интересен
                onBeforeBeginEditCalled = false;
                onAfterBeginEditCalled = false;

                let wasSaved = false;
                let savingStartedForItemWithKey;

                editInPlace.updateOptions({
                    onBeforeEndEdit: (params) => {
                        if (params.willSave) {
                            savingStartedForItemWithKey = params.item.getKey();
                        }
                    },
                    onAfterEndEdit: (item) => {
                        if (
                            savingStartedForItemWithKey ===
                            item.contents.getKey()
                        ) {
                            wasSaved = true;
                        }
                    },
                    onBeforeBeginEdit: () => {
                        onBeforeBeginEditCalled = true;
                    },
                });
                return editInPlace
                    .edit({ item: collection.at(1).contents })
                    .then((result) => {
                        expect(wasSaved).toBe(true);
                        expect(result).not.toBeDefined();
                        expect(onBeforeBeginEditCalled).toBe(true);
                        expect(onAfterBeginEditCalled).toBe(true);
                        expect(
                            collection
                                .find((i) => {
                                    return i.isEditing();
                                })
                                .contents.getKey()
                        ).toEqual(2);
                    });
            });
        });

        it('cancel if current adding item has no changes', () => {
            return editInPlace.edit({ item: items.at(0) }).then((res) => {
                // Первый запуск пропускаем, он нам не интересен
                onBeforeBeginEditCalled = false;
                onAfterBeginEditCalled = false;

                let wasSaved = false;

                editInPlace.updateOptions({
                    onBeforeEndEdit: (params) => {
                        wasSaved = params.willSave;
                    },
                    onBeforeBeginEdit: () => {
                        onBeforeBeginEditCalled = true;
                    },
                });
                return editInPlace
                    .edit({ item: items.at(1) })
                    .then((result) => {
                        expect(wasSaved).toBe(false);
                        expect(result).not.toBeDefined();
                        expect(onBeforeBeginEditCalled).toBe(true);
                        expect(onAfterBeginEditCalled).toBe(true);
                        expect(
                            collection
                                .find((i) => {
                                    return i.isEditing();
                                })
                                .contents.getKey()
                        ).toEqual(2);
                    });
            });
        });

        it('cancel if current editing item has no changes', () => {
            const editingItem = collection.at(0).contents;

            return editInPlace.edit({ item: editingItem }).then((res) => {
                // Первый запуск пропускаем, он нам не интересен
                onBeforeBeginEditCalled = false;
                onAfterBeginEditCalled = false;

                let wasCanceled = false;
                let savingStartedForItemWithKey;

                editInPlace.updateOptions({
                    onBeforeEndEdit: (params) => {
                        if (!params.willSave) {
                            savingStartedForItemWithKey = params.item.getKey();
                        }
                    },
                    onAfterEndEdit: (item) => {
                        if (
                            savingStartedForItemWithKey ===
                            item.contents.getKey()
                        ) {
                            wasCanceled = true;
                        }
                    },
                    onBeforeBeginEdit: () => {
                        onBeforeBeginEditCalled = true;
                    },
                });
                return editInPlace
                    .edit({ item: collection.at(1).contents })
                    .then((result) => {
                        expect(wasCanceled).toBe(true);
                        expect(result).not.toBeDefined();
                        expect(onBeforeBeginEditCalled).toBe(true);
                        expect(onAfterBeginEditCalled).toBe(true);
                        expect(
                            collection
                                .find((i) => {
                                    return i.isEditing();
                                })
                                .contents.getKey()
                        ).toEqual(2);
                    });
            });
        });

        it('cancel operation if saving previous led to error', () => {
            const editingItem = collection.at(0).contents;

            return editInPlace.edit({ item: editingItem }).then((res) => {
                // Первый запуск пропускаем, он нам не интересен
                onBeforeBeginEditCalled = false;
                onAfterBeginEditCalled = false;

                editInPlace.updateOptions({
                    onBeforeEndEdit: (params) => {
                        if (!params.willSave) {
                            throw Error('Error while saving');
                        }
                    },
                    onBeforeBeginEdit: () => {
                        onBeforeBeginEditCalled = true;
                    },
                });
                return editInPlace
                    .edit({ item: collection.at(1).contents })
                    .then((result) => {
                        expect(result && result.canceled).toBe(true);
                        expect(onBeforeBeginEditCalled).toBe(false);
                        expect(onAfterBeginEditCalled).toBe(false);
                        expect(
                            collection
                                .find((i) => {
                                    return i.isEditing();
                                })
                                .contents.getKey()
                        ).toEqual(1);
                    });
            });
        });

        it('item given in arguments', () => {
            expect(editInPlace.isEditing()).toBe(false);

            editInPlace.updateOptions({
                onBeforeBeginEdit: (params) => {
                    onBeforeBeginEditCalled = true;
                    expect(params.options.item).toEqual(
                        collection.at(0).contents
                    );
                },
            });

            return editInPlace
                .edit({ item: collection.at(0).contents })
                .then((result) => {
                    expect(result).not.toBeDefined();
                    expect(onBeforeBeginEditCalled).toBe(true);
                    expect(onAfterBeginEditCalled).toBe(true);
                    expect(
                        collection
                            .find((i) => {
                                return i.isEditing();
                            })
                            .contents.getKey()
                    ).toEqual(1);
                });
        });

        it('item given in callback', () => {
            expect(editInPlace.isEditing()).toBe(false);

            editInPlace.updateOptions({
                onBeforeBeginEdit: (options) => {
                    onBeforeBeginEditCalled = true;
                    expect(options.item).not.toBeDefined();
                    return { item: collection.at(0).contents };
                },
            });

            return editInPlace.edit().then((result) => {
                expect(result).not.toBeDefined();
                expect(onBeforeBeginEditCalled).toBe(true);
                expect(onAfterBeginEditCalled).toBe(true);
                expect(
                    collection
                        .find((i) => {
                            return i.isEditing();
                        })
                        .contents.getKey()
                ).toEqual(1);
            });
        });

        it('item was not given', () => {
            return editInPlace.edit().then((res) => {
                expect(res && res.canceled).toBe(true);
                expect(onBeforeBeginEditCalled).toBe(true);
                expect(onAfterBeginEditCalled).toBe(false);
                expect(editInPlace.isEditing()).toBe(false);
            });
        });

        it('error in before callback [sync callback]', () => {
            let isPromiseRejected = false;
            editInPlace.updateOptions({
                onBeforeBeginEdit: () => {
                    onBeforeBeginEditCalled = true;
                    throw Error('Error in callback');
                },
            });

            return editInPlace
                .edit({ item: collection.at(0).contents })
                .catch((result) => {
                    isPromiseRejected = true;
                    return result;
                })
                .then((res) => {
                    expect(res && res.canceled).toBe(true);
                    expect(onBeforeBeginEditCalled).toBe(true);
                    expect(onAfterBeginEditCalled).toBe(false);
                    expect(isPromiseRejected).toBe(false);
                    expect(editInPlace.isEditing()).toBe(false);
                });
        });

        it('error in before callback [async callback]', () => {
            let isPromiseRejected = false;
            editInPlace.updateOptions({
                onBeforeBeginEdit: () => {
                    onBeforeBeginEditCalled = true;
                    return Promise.reject(
                        Error('Error in callback')
                    ) as Promise<void>;
                },
            });

            return editInPlace
                .edit({ item: collection.at(0).contents })
                .catch((result) => {
                    isPromiseRejected = true;
                    return result;
                })
                .then((res) => {
                    expect(res && res.canceled).toBe(true);
                    expect(onBeforeBeginEditCalled).toBe(true);
                    expect(onAfterBeginEditCalled).toBe(false);
                    expect(isPromiseRejected).toBe(false);
                    expect(editInPlace.isEditing()).toBe(false);
                });
        });

        it('correct [sync callback]', () => {
            return editInPlace
                .edit({ item: collection.at(0).contents })
                .then((res) => {
                    expect(res).not.toBeDefined();
                    expect(onBeforeBeginEditCalled).toBe(true);
                    expect(onAfterBeginEditCalled).toBe(true);
                    expect(
                        collection
                            .find((i) => {
                                return i.isEditing();
                            })
                            .contents.getKey()
                    ).toEqual(1);
                });
        });

        it('correct [async callback]', () => {
            editInPlace.updateOptions({
                onBeforeBeginEdit: () => {
                    onBeforeBeginEditCalled = true;
                    return Promise.resolve();
                },
            });
            return editInPlace
                .edit({ item: collection.at(0).contents })
                .then((res) => {
                    expect(res).not.toBeDefined();
                    expect(onBeforeBeginEditCalled).toBe(true);
                    expect(onAfterBeginEditCalled).toBe(true);
                    expect(
                        collection
                            .find((i) => {
                                return i.isEditing();
                            })
                            .contents.getKey()
                    ).toEqual(1);
                });
        });

        it('callback arguments', () => {
            editInPlace.updateOptions({
                onBeforeBeginEdit: (params) => {
                    onBeforeBeginEditCalled = true;
                    expect(params.options.item).toEqual(items.at(0));
                    expect(params.isAdd).toBe(false);
                },
                onAfterBeginEdit: (item, isAdd) => {
                    onAfterBeginEditCalled = true;
                    expect(item.contents).toEqual(
                        collection.find((i) => {
                            return i.isEditing();
                        }).contents
                    );
                    expect(isAdd).toBe(false);
                },
            });
            return editInPlace.edit({ item: items.at(0) }).then((res) => {
                expect(res).not.toBeDefined();
                expect(onBeforeBeginEditCalled).toBe(true);
                expect(onAfterBeginEditCalled).toBe(true);
                expect(
                    collection
                        .find((i) => {
                            return i.isEditing();
                        })
                        .contents.getKey()
                ).toEqual(1);
            });
        });

        it('item was modified in callback', () => {
            editInPlace.updateOptions({
                onBeforeBeginEdit: (params) => {
                    onBeforeBeginEditCalled = true;
                    params.options.item.set('modified', true);
                },
                onAfterBeginEdit: (item, isAdd) => {
                    onAfterBeginEditCalled = true;
                    expect(item.contents).toEqual(collection.at(0).contents);
                    expect(isAdd).toBe(false);
                    expect(item.contents.get('modified')).toBe(true);
                },
            });
            return editInPlace
                .edit({ item: collection.at(0).contents })
                .then((res) => {
                    expect(res).not.toBeDefined();
                    expect(onBeforeBeginEditCalled).toBe(true);
                    expect(onAfterBeginEditCalled).toBe(true);
                    expect(
                        collection
                            .find((i) => {
                                return i.isEditing();
                            })
                            .contents.getKey()
                    ).toEqual(1);
                });
        });

        it('should accept all changes made before starting editing', () => {
            const item = collection.at(0).contents;
            item.set('title', 'changedTitle');

            return editInPlace.edit({ item }).then((res) => {
                expect(res).not.toBeDefined();
                expect(onBeforeBeginEditCalled).toBe(true);
                expect(onAfterBeginEditCalled).toBe(true);
                expect(
                    collection
                        .find((i) => {
                            return i.isEditing();
                        })
                        .contents.getKey()
                ).toEqual(1);
                expect(
                    collection
                        .find((i) => {
                            return i.isEditing();
                        })
                        .contents.isChanged()
                ).toBe(false);
            });
        });

        it('should exists a possibility to pass args from edit to before callback', () => {
            const options = {
                myOptions: true,
                item: collection.at(0).contents,
            };

            editInPlace.updateOptions({
                onBeforeBeginEdit: (params) => {
                    onBeforeBeginEditCalled = true;
                    expect(params.options).toEqual(options);
                },
            });

            return editInPlace.edit(options).then(() => {
                expect(onBeforeBeginEditCalled).toBe(true);
            });
        });

        describe('skip editing item', () => {
            describe('go to prev', () => {
                it('skip editing second item and go to first', () => {
                    editInPlace.updateOptions({
                        // eslint-disable-next-line max-len
                        onBeforeBeginEdit: (params) => {
                            return params.options.item.getKey() === 2
                                ? CONSTANTS.GOTOPREV
                                : undefined;
                        },
                    });
                    // Try start editing item with key 2
                    return editInPlace
                        .edit({ item: collection.at(1).contents })
                        .then(() => {
                            // Started editing of item with key 1
                            expect(
                                collection
                                    .find((i) => {
                                        return i.isEditing();
                                    })
                                    .contents.getKey()
                            ).toEqual(1);
                        });
                });

                it('skip all', () => {
                    editInPlace.updateOptions({
                        onBeforeBeginEdit: () => {
                            return CONSTANTS.GOTOPREV;
                        },
                    });
                    // Try start editing item with key 2
                    return editInPlace
                        .edit({ item: collection.at(1).contents })
                        .then(() => {
                            // Started editing of item with key 1
                            expect(
                                collection.find((i) => {
                                    return i.isEditing();
                                })
                            ).toBeNull();
                        });
                });
            });

            describe('go to next', () => {
                it('skip editing first item and go to second', () => {
                    const callback = (params) => {
                        return params.options.item.getKey() === 1
                            ? CONSTANTS.GOTONEXT
                            : undefined;
                    };
                    editInPlace.updateOptions({
                        onBeforeBeginEdit: callback,
                    });
                    // Try start editing item with key 1
                    return editInPlace
                        .edit({ item: collection.at(0).contents })
                        .then(() => {
                            // Started editing of item with key 2
                            expect(
                                collection
                                    .find((i) => {
                                        return i.isEditing();
                                    })
                                    .contents.getKey()
                            ).toEqual(2);
                        });
                });

                it('skip all', () => {
                    editInPlace.updateOptions({
                        onBeforeBeginEdit: () => {
                            return CONSTANTS.GOTONEXT;
                        },
                    });
                    // Try start editing item with key 2
                    return editInPlace
                        .edit({ item: collection.at(2).contents })
                        .then(() => {
                            // Started editing of item with key 1
                            expect(
                                collection.find((i) => {
                                    return i.isEditing();
                                })
                            ).toBeNull();
                        });
                });
            });
        });

        describe('cell editing mode', () => {
            beforeEach(() => {
                editInPlace.updateOptions({
                    mode: 'cell',
                });
            });

            it('column index missed. should use default', () => {
                editInPlace.updateOptions({
                    onBeforeBeginEdit: (options, isAdd, columnIndex) => {
                        onBeforeBeginEditCalled = true;
                        expect(columnIndex).toEqual(0);
                    },
                });
                return editInPlace.edit({ item: items.at(0) }).then((res) => {
                    expect(onBeforeBeginEditCalled).toBe(true);
                });
            });

            it('column index defined. should use it', () => {
                editInPlace.updateOptions({
                    onBeforeBeginEdit: (options, isAdd, columnIndex) => {
                        onBeforeBeginEditCalled = true;
                        expect(columnIndex).toEqual(2);
                    },
                });
                return editInPlace
                    .edit({ item: items.at(0) }, { columnIndex: 2 })
                    .then((res) => {
                        expect(onBeforeBeginEditCalled).toBe(true);
                    });
            });
        });
    });

    describe('add', () => {
        it('cancel operation [sync callback]', () => {
            editInPlace.updateOptions({
                onBeforeBeginEdit: () => {
                    onBeforeBeginEditCalled = true;
                    return CONSTANTS.CANCEL;
                },
            });

            return editInPlace.add({ item: newItem }, 'bottom').then((res) => {
                expect(res && res.canceled).toBe(true);
                expect(onBeforeBeginEditCalled).toBe(true);
                expect(onAfterBeginEditCalled).toBe(false);
                expect(editInPlace.isEditing()).toBe(false);
            });
        });

        it('cancel operation [async callback]', () => {
            editInPlace.updateOptions({
                onBeforeBeginEdit: () => {
                    onBeforeBeginEditCalled = true;
                    return Promise.resolve(CONSTANTS.CANCEL);
                },
            });

            return editInPlace.add({ item: newItem }, 'bottom').then((res) => {
                expect(res && res.canceled).toBe(true);
                expect(onBeforeBeginEditCalled).toBe(true);
                expect(onAfterBeginEditCalled).toBe(false);
                expect(editInPlace.isEditing()).toBe(false);
            });
        });

        it('commit if current adding item has changes', () => {
            return editInPlace.add({ item: newItem }).then(() => {
                collection
                    .find((i) => {
                        return i.isEditing();
                    })
                    .contents.set('title', 'Changed');

                // Первый запуск пропускаем, он нам не интересен
                onBeforeBeginEditCalled = false;
                onAfterBeginEditCalled = false;

                let wasSaved = false;
                let savingStartedForItemWithKey;

                editInPlace.updateOptions({
                    onBeforeEndEdit: (params) => {
                        if (params.willSave) {
                            savingStartedForItemWithKey = params.item.getKey();
                        }
                    },
                    onAfterEndEdit: (item) => {
                        if (
                            savingStartedForItemWithKey ===
                            item.contents.getKey()
                        ) {
                            wasSaved = true;
                        }
                    },
                    onBeforeBeginEdit: () => {
                        onBeforeBeginEditCalled = true;
                    },
                });
                const secondNewItem = new Model({
                    keyProperty: 'id',
                    rawData: {
                        id: 5,
                        title: 'Fives',
                    },
                });
                return editInPlace
                    .add({ item: secondNewItem })
                    .then((result) => {
                        expect(wasSaved).toBe(true);
                        expect(result).not.toBeDefined();
                        expect(onBeforeBeginEditCalled).toBe(true);
                        expect(onAfterBeginEditCalled).toBe(true);
                        expect(
                            collection
                                .find((i) => {
                                    return i.isEditing();
                                })
                                .contents.getKey()
                        ).toEqual(secondNewItem.getKey());
                    });
            });
        });

        it('commit if current editing item has changes', () => {
            return editInPlace.edit({ item: items.at(0) }).then((res) => {
                collection
                    .find((i) => {
                        return i.isEditing();
                    })
                    .contents.set('title', 'Changed');

                // Первый запуск пропускаем, он нам не интересен
                onBeforeBeginEditCalled = false;
                onAfterBeginEditCalled = false;

                let wasSaved = false;
                let savingStartedForItemWithKey;

                editInPlace.updateOptions({
                    onBeforeEndEdit: (params) => {
                        if (params.willSave) {
                            savingStartedForItemWithKey = params.item.getKey();
                        }
                    },
                    onAfterEndEdit: (item) => {
                        if (
                            savingStartedForItemWithKey ===
                            item.contents.getKey()
                        ) {
                            wasSaved = true;
                        }
                    },
                    onBeforeBeginEdit: () => {
                        onBeforeBeginEditCalled = true;
                    },
                });
                return editInPlace.add({ item: newItem }).then((result) => {
                    expect(items.at(0).get('title')).toEqual('Changed');
                    expect(wasSaved).toBe(true);
                    expect(result).not.toBeDefined();
                    expect(onBeforeBeginEditCalled).toBe(true);
                    expect(onAfterBeginEditCalled).toBe(true);
                    expect(
                        collection
                            .find((i) => {
                                return i.isEditing();
                            })
                            .contents.getKey()
                    ).toEqual(newItem.getKey());
                });
            });
        });

        it('cancel if current adding item has no changes', () => {
            return editInPlace.edit({ item: items.at(0) }).then((res) => {
                // Первый запуск пропускаем, он нам не интересен
                onBeforeBeginEditCalled = false;
                onAfterBeginEditCalled = false;

                let wasSaved = false;

                editInPlace.updateOptions({
                    onBeforeEndEdit: (params) => {
                        wasSaved = params.willSave;
                    },
                    onBeforeBeginEdit: () => {
                        onBeforeBeginEditCalled = true;
                    },
                });
                return editInPlace.add({ item: newItem }).then((result) => {
                    expect(wasSaved).toBe(false);
                    expect(result).not.toBeDefined();
                    expect(onBeforeBeginEditCalled).toBe(true);
                    expect(onAfterBeginEditCalled).toBe(true);
                    expect(
                        collection
                            .find((i) => {
                                return i.isEditing();
                            })
                            .contents.getKey()
                    ).toEqual(newItem.getKey());
                });
            });
        });

        it('cancel if current editing item has no changes', () => {
            const editingItem = collection.at(0).contents;

            return editInPlace.edit({ item: editingItem }).then((res) => {
                // Первый запуск пропускаем, он нам не интересен
                onBeforeBeginEditCalled = false;
                onAfterBeginEditCalled = false;

                let wasCanceled = false;
                let savingStartedForItemWithKey;

                editInPlace.updateOptions({
                    onBeforeEndEdit: (params) => {
                        if (!params.willSave) {
                            savingStartedForItemWithKey = params.item.getKey();
                        }
                    },
                    onAfterEndEdit: (item) => {
                        if (
                            savingStartedForItemWithKey ===
                            item.contents.getKey()
                        ) {
                            wasCanceled = true;
                        }
                    },
                    onBeforeBeginEdit: () => {
                        onBeforeBeginEditCalled = true;
                    },
                });
                return editInPlace.add({ item: newItem }).then((result) => {
                    expect(wasCanceled).toBe(true);
                    expect(result).not.toBeDefined();
                    expect(onBeforeBeginEditCalled).toBe(true);
                    expect(onAfterBeginEditCalled).toBe(true);
                    expect(
                        collection
                            .find((i) => {
                                return i.isEditing();
                            })
                            .contents.getKey()
                    ).toEqual(newItem.getKey());
                });
            });
        });

        it('cancel operation if saving previous led to error', () => {
            const editingItem = collection.at(0).contents;

            return editInPlace.edit({ item: editingItem }).then((res) => {
                // Первый запуск пропускаем, он нам не интересен
                onBeforeBeginEditCalled = false;
                onAfterBeginEditCalled = false;

                editInPlace.updateOptions({
                    onBeforeEndEdit: (params) => {
                        if (!params.willSave) {
                            throw Error('Error while saving');
                        }
                    },
                    onBeforeBeginEdit: () => {
                        onBeforeBeginEditCalled = true;
                    },
                });
                return editInPlace.add({ item: newItem }).then((result) => {
                    expect(result && result.canceled).toBe(true);
                    expect(onBeforeBeginEditCalled).toBe(false);
                    expect(onAfterBeginEditCalled).toBe(false);
                    expect(
                        collection
                            .find((i) => {
                                return i.isEditing();
                            })
                            .contents.getKey()
                    ).toEqual(1);
                });
            });
        });

        it('item given in arguments', () => {
            expect(editInPlace.isEditing()).toBe(false);

            editInPlace.updateOptions({
                onBeforeBeginEdit: (params) => {
                    onBeforeBeginEditCalled = true;
                    expect(params.options.item).toEqual(newItem);
                },
            });

            return editInPlace.add({ item: newItem }).then((result) => {
                expect(result).not.toBeDefined();
                expect(onBeforeBeginEditCalled).toBe(true);
                expect(onAfterBeginEditCalled).toBe(true);
                expect(
                    collection
                        .find((i) => {
                            return i.isEditing();
                        })
                        .contents.getKey()
                ).toEqual(newItem.getKey());
            });
        });

        it('item given in callback', () => {
            expect(editInPlace.isEditing()).toBe(false);

            editInPlace.updateOptions({
                onBeforeBeginEdit: (params) => {
                    onBeforeBeginEditCalled = true;
                    expect(params.options.item).not.toBeDefined();
                    return { item: newItem };
                },
            });

            return editInPlace.add().then((result) => {
                expect(result).not.toBeDefined();
                expect(onBeforeBeginEditCalled).toBe(true);
                expect(onAfterBeginEditCalled).toBe(true);
                expect(
                    collection
                        .find((i) => {
                            return i.isEditing();
                        })
                        .contents.getKey()
                ).toEqual(newItem.getKey());
            });
        });

        it('item was not given', () => {
            return editInPlace.add().then((res) => {
                expect(res && res.canceled).toBe(true);
                expect(onBeforeBeginEditCalled).toBe(true);
                expect(onAfterBeginEditCalled).toBe(false);
                expect(editInPlace.isEditing()).toBe(false);
            });
        });

        it('error in before callback [sync callback]', () => {
            let isPromiseRejected = false;
            editInPlace.updateOptions({
                onBeforeBeginEdit: () => {
                    onBeforeBeginEditCalled = true;
                    throw Error('Error in callback');
                },
            });

            return editInPlace
                .add({ item: newItem })
                .catch((result) => {
                    isPromiseRejected = true;
                    return result;
                })
                .then((res) => {
                    expect(res && res.canceled).toBe(true);
                    expect(onBeforeBeginEditCalled).toBe(true);
                    expect(onAfterBeginEditCalled).toBe(false);
                    expect(isPromiseRejected).toBe(false);
                    expect(editInPlace.isEditing()).toBe(false);
                });
        });

        it('error in before callback [async callback]', () => {
            let isPromiseRejected = false;
            editInPlace.updateOptions({
                onBeforeBeginEdit: () => {
                    onBeforeBeginEditCalled = true;
                    return Promise.reject(
                        Error('Error in callback')
                    ) as Promise<void>;
                },
            });

            return editInPlace
                .add({ item: newItem })
                .catch((result) => {
                    isPromiseRejected = true;
                    return result;
                })
                .then((res) => {
                    expect(res && res.canceled).toBe(true);
                    expect(onBeforeBeginEditCalled).toBe(true);
                    expect(onAfterBeginEditCalled).toBe(false);
                    expect(isPromiseRejected).toBe(false);
                    expect(editInPlace.isEditing()).toBe(false);
                });
        });

        it('correct [sync callback]', () => {
            return editInPlace.add({ item: newItem }).then((res) => {
                expect(res).not.toBeDefined();
                expect(onBeforeBeginEditCalled).toBe(true);
                expect(onAfterBeginEditCalled).toBe(true);
                expect(
                    collection
                        .find((i) => {
                            return i.isEditing();
                        })
                        .contents.getKey()
                ).toEqual(newItem.getKey());
            });
        });

        it('correct [async callback]', () => {
            editInPlace.updateOptions({
                onBeforeBeginEdit: () => {
                    onBeforeBeginEditCalled = true;
                    return Promise.resolve();
                },
            });
            return editInPlace.add({ item: newItem }).then((res) => {
                expect(res).not.toBeDefined();
                expect(onBeforeBeginEditCalled).toBe(true);
                expect(onAfterBeginEditCalled).toBe(true);
                expect(
                    collection
                        .find((i) => {
                            return i.isEditing();
                        })
                        .contents.getKey()
                ).toEqual(newItem.getKey());
            });
        });

        it('callback arguments', () => {
            editInPlace.updateOptions({
                onBeforeBeginEdit: (params) => {
                    onBeforeBeginEditCalled = true;
                    expect(params.options.item).toEqual(newItem);
                    expect(params.isAdd).toBe(true);
                },
                onAfterBeginEdit: (item, isAdd) => {
                    onAfterBeginEditCalled = true;
                    expect(item.contents).toEqual(
                        collection.find((i) => {
                            return i.isEditing();
                        }).contents
                    );
                    expect(isAdd).toBe(true);
                },
            });
            return editInPlace.add({ item: newItem }).then((res) => {
                expect(res).not.toBeDefined();
                expect(onBeforeBeginEditCalled).toBe(true);
                expect(onAfterBeginEditCalled).toBe(true);
                expect(
                    collection
                        .find((i) => {
                            return i.isEditing();
                        })
                        .contents.getKey()
                ).toEqual(newItem.getKey());
            });
        });

        it('item was modified in callback', () => {
            editInPlace.updateOptions({
                onBeforeBeginEdit: (params) => {
                    onBeforeBeginEditCalled = true;
                    params.options.item.set('modified', true);
                },
                onAfterBeginEdit: (item, isAdd) => {
                    onAfterBeginEditCalled = true;
                    expect(item.contents.get('modified')).toBe(true);
                    expect(item.contents.isChanged()).toBe(false);
                },
            });
            return editInPlace.add({ item: newItem }).then((res) => {
                expect(res).not.toBeDefined();
                expect(onBeforeBeginEditCalled).toBe(true);
                expect(onAfterBeginEditCalled).toBe(true);
                expect(
                    collection
                        .find((i) => {
                            return i.isEditing();
                        })
                        .contents.getKey()
                ).toEqual(newItem.getKey());
            });
        });

        it('keyProperty value should be the same all time (and nullable too)', () => {
            newItem.set(newItem.getKeyProperty(), null);

            editInPlace.updateOptions({
                onBeforeBeginEdit: (params) => {
                    onBeforeBeginEditCalled = true;
                    expect(params.options.item.getKey()).toBeNull();
                },
                onAfterBeginEdit: (collectionItem) => {
                    onAfterBeginEditCalled = true;
                    expect(collectionItem.contents.getKey()).toBeNull();
                },
                onBeforeEndEdit: (params) => {
                    onBeforeEndEditCalled = true;
                    expect(params.item.getKey()).toBeNull();
                },
                onAfterEndEdit: (collectionItem) => {
                    onAfterEndEditCalled = true;
                    expect(collectionItem.contents.getKey()).toBeNull();
                },
            });

            return editInPlace.add({ item: newItem }).then(() => {
                return editInPlace.cancel().then(() => {
                    expect(
                        onBeforeBeginEditCalled &&
                            onAfterBeginEditCalled &&
                            onBeforeEndEditCalled &&
                            onAfterEndEditCalled
                    ).toBe(true);
                });
            });
        });

        describe('cell editing mode', () => {
            beforeEach(() => {
                editInPlace.updateOptions({
                    mode: 'cell',
                });
            });

            it('column index missed. should use default', () => {
                editInPlace.updateOptions({
                    onBeforeBeginEdit: (options, isAdd, columnIndex) => {
                        onBeforeBeginEditCalled = true;
                        expect(columnIndex).toEqual(0);
                    },
                });
                return editInPlace.add({ item: items.at(0) }).then((res) => {
                    expect(onBeforeBeginEditCalled).toBe(true);
                });
            });

            it('column index defined. should use it', () => {
                editInPlace.updateOptions({
                    onBeforeBeginEdit: (options, isAdd, columnIndex) => {
                        onBeforeBeginEditCalled = true;
                        expect(columnIndex).toEqual(2);
                    },
                });
                return editInPlace
                    .add({ item: newItem }, { columnIndex: 2 })
                    .then((res) => {
                        expect(onBeforeBeginEditCalled).toBe(true);
                    });
            });
        });
    });

    describe('commit', () => {
        testEndEditWith('commit');

        it('should cancel editing if called commit with commit strategy "hasChanges" on unchanged item', () => {
            expect(
                collection
                    .find((i) => {
                        return i.isEditing();
                    })
                    .contents.getKey()
            ).toEqual(1);
            editInPlace.updateOptions({
                onBeforeEndEdit: (params) => {
                    onBeforeEndEditCalled = true;
                    expect(params.willSave).toBe(false);
                },
            });
            return editInPlace.commit('hasChanges').then((res) => {
                expect(res).not.toBeDefined();
                expect(onBeforeEndEditCalled).toBe(true);
                expect(onAfterEndEditCalled).toBe(true);
                expect(
                    collection.find((i) => {
                        return i.isEditing();
                    })
                ).toBeNull();
            });
        });
    });

    describe('cancel', () => {
        testEndEditWith('cancel');

        it('should ignore cancel as a result of callback if force', () => {
            expect(
                collection
                    .find((i) => {
                        return i.isEditing();
                    })
                    .contents.getKey()
            ).toEqual(1);
            editInPlace.updateOptions({
                onBeforeEndEdit: () => {
                    onBeforeEndEditCalled = true;
                    return CONSTANTS.CANCEL;
                },
            });
            return editInPlace.cancel(true).then((res) => {
                expect(res).not.toBeDefined();
                expect(onBeforeEndEditCalled).toBe(true);
                expect(onAfterEndEditCalled).toBe(true);
                expect(
                    collection.find((i) => {
                        return i.isEditing();
                    })
                ).toBeNull();
            });
        });

        it('should execute cancel operation in sync mode if', () => {
            expect(
                collection
                    .find((i) => {
                        return i.isEditing();
                    })
                    .contents.getKey()
            ).toEqual(1);

            const result = editInPlace.cancel(true);
            expect(onBeforeEndEditCalled).toBe(true);
            expect(onAfterEndEditCalled).toBe(true);
            expect(
                collection.find((i) => {
                    return i.isEditing();
                })
            ).toBeNull();

            return result;
        });

        it('should ignore promise as a result of callback if force', () => {
            expect(
                collection
                    .find((i) => {
                        return i.isEditing();
                    })
                    .contents.getKey()
            ).toEqual(1);
            editInPlace.updateOptions({
                onBeforeEndEdit: () => {
                    onBeforeEndEditCalled = true;
                    return new Promise(jest.fn());
                },
            });
            return editInPlace.cancel(true).then((res) => {
                expect(res).not.toBeDefined();
                expect(onBeforeEndEditCalled).toBe(true);
                expect(onAfterEndEditCalled).toBe(true);
                expect(
                    collection.find((i) => {
                        return i.isEditing();
                    })
                ).toBeNull();
            });
        });

        it('should skip then branch if controller was destroyed while cancelling', () => {
            expect(
                collection
                    .find((i) => {
                        return i.isEditing();
                    })
                    .contents.getKey()
            ).toEqual(1);
            editInPlace.updateOptions({
                onBeforeEndEdit: () => {
                    onBeforeEndEditCalled = true;
                },
            });

            const endPromise = editInPlace.cancel();
            editInPlace.destroy();
            return endPromise.then((res) => {
                expect({ canceled: true }).toEqual(res);
                expect(onBeforeEndEditCalled).toBe(true);
                expect(onAfterEndEditCalled).toBe(false);
            });
        });
    });

    it('should not throw console error if it was processed by error controller', () => {
        editInPlace.updateOptions({
            onBeforeBeginEdit: (params) => {
                // eslint-disable-next-line @typescript-eslint/no-throw-literal
                throw { errorProcessed: true };
            },
        });
        let consoleErrorThrown = false;

        Logger.error = () => {
            consoleErrorThrown = true;
        };

        return editInPlace.add({ item: newItem }).then((result) => {
            expect(result && result.canceled).toBe(true);
            expect(consoleErrorThrown).toBe(false);
            Logger.error = () => {
                return {};
            };
        });
    });

    function testEndEditWith(operation: 'commit' | 'cancel'): void {
        beforeEach(async () => {
            if (operation === 'commit') {
                editInPlace.cancel = () => {
                    return Promise.reject('Method shouldn\nt be called');
                };
            } else {
                editInPlace.commit = () => {
                    return Promise.reject('Method shouldn\nt be called');
                };
            }
            await editInPlace.edit({ item: collection.at(0).contents });
        });

        it(`skip ${operation} if has no editing`, () => {
            editInPlace = new EditInPlace({
                collection,
                onBeforeEndEdit: () => {
                    onBeforeEndEditCalled = true;
                },
                onAfterEndEdit: () => {
                    onAfterEndEditCalled = true;
                },
            });

            return editInPlace[operation]().then((res) => {
                expect(res).not.toBeDefined();
                expect(onBeforeEndEditCalled).toBe(false);
                expect(onAfterEndEditCalled).toBe(false);
            });
        });

        it('cancel operation [sync callback]', () => {
            expect(
                collection
                    .find((i) => {
                        return i.isEditing();
                    })
                    .contents.getKey()
            ).toEqual(1);
            editInPlace.updateOptions({
                onBeforeEndEdit: () => {
                    onBeforeEndEditCalled = true;
                    return CONSTANTS.CANCEL;
                },
            });
            return editInPlace[operation]().then((res) => {
                expect(res && res.canceled).toBe(true);
                expect(onBeforeEndEditCalled).toBe(true);
                expect(onAfterEndEditCalled).toBe(false);
                expect(
                    collection
                        .find((i) => {
                            return i.isEditing();
                        })
                        .contents.getKey()
                ).toEqual(1);
            });
        });

        it('cancel operation [async callback]', () => {
            expect(
                collection
                    .find((i) => {
                        return i.isEditing();
                    })
                    .contents.getKey()
            ).toEqual(1);
            editInPlace.updateOptions({
                onBeforeEndEdit: () => {
                    onBeforeEndEditCalled = true;
                    return Promise.resolve(CONSTANTS.CANCEL);
                },
            });
            return editInPlace[operation]().then((res) => {
                expect(res && res.canceled).toBe(true);
                expect(onBeforeEndEditCalled).toBe(true);
                expect(onAfterEndEditCalled).toBe(false);
                expect(
                    collection
                        .find((i) => {
                            return i.isEditing();
                        })
                        .contents.getKey()
                ).toEqual(1);
            });
        });

        it('error in before callback [sync callback]', () => {
            let isPromiseRejected = false;
            expect(
                collection
                    .find((i) => {
                        return i.isEditing();
                    })
                    .contents.getKey()
            ).toEqual(1);
            editInPlace.updateOptions({
                onBeforeEndEdit: () => {
                    onBeforeEndEditCalled = true;
                    throw Error('Some error in callback.');
                },
            });
            return editInPlace[operation]()
                .catch((result) => {
                    isPromiseRejected = true;
                    return result;
                })
                .then((result) => {
                    expect(result && result.canceled).toBe(true);
                    expect(onBeforeEndEditCalled).toBe(true);
                    expect(onAfterEndEditCalled).toBe(false);
                    expect(isPromiseRejected).toBe(false);
                    expect(
                        collection
                            .find((i) => {
                                return i.isEditing();
                            })
                            .contents.getKey()
                    ).toEqual(1);
                });
        });

        it('error in before callback [async callback]', () => {
            let isPromiseRejected = false;
            expect(
                collection
                    .find((i) => {
                        return i.isEditing();
                    })
                    .contents.getKey()
            ).toEqual(1);
            editInPlace.updateOptions({
                onBeforeEndEdit: () => {
                    onBeforeEndEditCalled = true;
                    return Promise.reject(Error('Some error in callback.'));
                },
            });
            return editInPlace[operation]()
                .catch((result) => {
                    isPromiseRejected = true;
                    return result;
                })
                .then((result) => {
                    expect(result && result.canceled).toBe(true);
                    expect(onBeforeEndEditCalled).toBe(true);
                    expect(onAfterEndEditCalled).toBe(false);
                    expect(isPromiseRejected).toBe(false);
                    expect(
                        collection
                            .find((i) => {
                                return i.isEditing();
                            })
                            .contents.getKey()
                    ).toEqual(1);
                });
        });

        it('correct [sync callback]', () => {
            expect(
                collection
                    .find((i) => {
                        return i.isEditing();
                    })
                    .contents.getKey()
            ).toEqual(1);
            return editInPlace[operation]().then((result) => {
                expect(result).not.toBeDefined();
                expect(onBeforeEndEditCalled).toBe(true);
                expect(onAfterEndEditCalled).toBe(true);
                expect(editInPlace.isEditing()).toBe(false);
            });
        });

        it('correct [async callback]', () => {
            expect(
                collection
                    .find((i) => {
                        return i.isEditing();
                    })
                    .contents.getKey()
            ).toEqual(1);
            editInPlace.updateOptions({
                onBeforeEndEdit: () => {
                    onBeforeEndEditCalled = true;
                    return Promise.resolve();
                },
            });
            return editInPlace[operation]().then((res) => {
                expect(res).not.toBeDefined();
                expect(onBeforeEndEditCalled).toBe(true);
                expect(onAfterEndEditCalled).toBe(true);
                expect(editInPlace.isEditing()).toBe(false);
            });
        });

        it('callback arguments', () => {
            const editingItem = collection.find((i) => {
                return i.isEditing();
            });
            editInPlace.updateOptions({
                onBeforeEndEdit: (params) => {
                    onBeforeEndEditCalled = true;
                    expect(params.item).toEqual(editingItem.contents);
                    expect(params.isAdd).toBe(false);
                },
                onAfterEndEdit: (item, isAdd) => {
                    onAfterEndEditCalled = true;
                    expect(item.contents).toEqual(editingItem.contents);
                    expect(isAdd).toBe(false);
                },
            });
            return editInPlace[operation]().then((res) => {
                expect(onBeforeEndEditCalled).toBe(true);
                expect(onAfterEndEditCalled).toBe(true);
            });
        });
    }
});
