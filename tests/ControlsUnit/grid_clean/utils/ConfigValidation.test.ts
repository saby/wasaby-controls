import {
    validateGridParts as originValidateGridParts,
    ERROR_MSG as ERRORS,
    IGridParts,
} from 'Controls/_grid/utils/ConfigValidation';

const validateGridParts = (options: IGridParts) => {
    return originValidateGridParts(options, 'throw');
};

describe('Controls/grid_clean/utils/ConfigValidation', () => {
    describe('header', () => {
        describe('Simplest header', () => {
            describe('valid', () => {
                it('Default', () => {
                    expect(() => {
                        expect(
                            validateGridParts({
                                columns: [{}],
                                header: [{}],
                            })
                        ).toBe(true);
                    }).not.toThrow();

                    expect(() => {
                        expect(
                            validateGridParts({
                                columns: [{}, {}],
                                header: [{}, {}],
                            })
                        ).toBe(true);
                    }).not.toThrow();
                });
            });

            describe('invalid', () => {
                it('less then columns', () => {
                    expect(() => {
                        validateGridParts({
                            columns: [{}, {}],
                            header: [{}],
                        });
                    }).toThrow();
                });

                it('more then columns', () => {
                    expect(() => {
                        validateGridParts({
                            columns: [{}, {}],
                            header: [{}, {}, {}],
                        });
                    }).toThrow();
                });
            });
        });

        describe('One row with column indexes', () => {
            describe('valid', () => {
                it('Default', () => {
                    expect(() => {
                        expect(
                            validateGridParts({
                                columns: [{}, {}],
                                header: [
                                    {
                                        startColumn: 1,
                                        endColumn: 2,
                                    },
                                    {
                                        startColumn: 2,
                                        endColumn: 3,
                                    },
                                ],
                            })
                        ).toBe(true);
                    }).not.toThrow();

                    expect(() => {
                        expect(
                            validateGridParts({
                                columns: [{}, {}],
                                header: [
                                    {
                                        startColumn: 1,
                                        endColumn: 3,
                                    },
                                ],
                            })
                        ).toBe(true);
                    }).not.toThrow();
                });
            });

            describe('invalid', () => {
                it('not all columns indexes setted', () => {
                    expect(() => {
                        validateGridParts({
                            columns: [{}, {}, {}],
                            header: [
                                {},
                                {},
                                {
                                    startColumn: 3,
                                    endColumn: 4,
                                },
                            ],
                        });
                    }).toThrow();
                });

                it('starts not from one', () => {
                    expect(() => {
                        validateGridParts({
                            columns: [{}, {}, {}],
                            header: [
                                {
                                    startColumn: 2,
                                    endColumn: 4,
                                },
                            ],
                        });
                    }).toThrow();
                });

                it('end is less then columns length', () => {
                    expect(() => {
                        validateGridParts({
                            columns: [{}, {}, {}],
                            header: [
                                {
                                    startColumn: 1,
                                    endColumn: 2,
                                },
                                {
                                    startColumn: 2,
                                    endColumn: 3,
                                },
                            ],
                        });
                    }).toThrow();

                    expect(() => {
                        validateGridParts({
                            columns: [{}, {}, {}],
                            header: [
                                {
                                    startColumn: 1,
                                    endColumn: 3,
                                },
                            ],
                        });
                    }).toThrow();
                });

                it('end is bigger then columns length', () => {
                    expect(() => {
                        validateGridParts({
                            columns: [{}, {}, {}],
                            header: [
                                {
                                    startColumn: 1,
                                    endColumn: 4,
                                },
                                {
                                    startColumn: 4,
                                    endColumn: 5,
                                },
                            ],
                        });
                    }).toThrow();
                });

                it('space between columns', () => {
                    expect(() => {
                        validateGridParts({
                            columns: [{}, {}, {}],
                            header: [
                                {
                                    startColumn: 1,
                                    endColumn: 2,
                                },
                                {
                                    startColumn: 3,
                                    endColumn: 4,
                                },
                            ],
                        });
                    }).toThrow();
                });
            });
        });

        describe('Multirow header', () => {
            describe('valid', () => {
                it('one column', () => {
                    const header = [
                        {
                            startRow: 1,
                            endRow: 2,
                            startColumn: 1,
                            endColumn: 2,
                        },
                        {
                            startRow: 2,
                            endRow: 3,
                            startColumn: 1,
                            endColumn: 2,
                        },
                        {
                            startRow: 3,
                            endRow: 4,
                            startColumn: 1,
                            endColumn: 2,
                        },
                    ];
                    expect(() => {
                        expect(
                            validateGridParts({
                                columns: [{}],
                                header,
                            })
                        ).toBe(true);
                    }).not.toThrow();
                });
            });

            describe('invalid', () => {
                it('one column, gap', () => {
                    const header = [
                        {
                            startRow: 1,
                            endRow: 2,
                            startColumn: 1,
                            endColumn: 2,
                        },
                        {
                            startRow: 3,
                            endRow: 4,
                            startColumn: 1,
                            endColumn: 2,
                        },
                    ];
                    expect(() => {
                        validateGridParts({
                            columns: [{}],
                            header,
                        });
                    }).toThrow();
                });

                it('indexes setted not in pair', () => {
                    expect(() => {
                        validateGridParts({
                            columns: [{}, {}],
                            header: [
                                {
                                    startRow: 1,
                                    endRow: 2,
                                    startColumn: 1,
                                    endColumn: 2,
                                },
                                {
                                    startRow: 1,
                                    startColumn: 2,
                                    endColumn: 3,
                                },
                                {
                                    startRow: 2,
                                    endRow: 3,
                                    startColumn: 1,
                                    endColumn: 3,
                                },
                            ],
                        });
                    }).toThrow();
                });

                it('not all rows indexes setted', () => {
                    expect(() => {
                        validateGridParts({
                            columns: [{}, {}],
                            header: [
                                {
                                    startRow: 1,
                                    endRow: 2,
                                    startColumn: 1,
                                    endColumn: 2,
                                },
                                {
                                    startColumn: 2,
                                    endColumn: 3,
                                },
                                {
                                    startRow: 2,
                                    endRow: 3,
                                    startColumn: 1,
                                    endColumn: 3,
                                },
                            ],
                        });
                    }).toThrow();
                });

                it('not all columns indexes setted, but rows indexes are', () => {
                    expect(() => {
                        validateGridParts({
                            columns: [{}, {}],
                            header: [
                                {
                                    startRow: 1,
                                    endRow: 2,
                                },
                                {
                                    startRow: 1,
                                    endRow: 2,
                                },
                                {
                                    startRow: 2,
                                    endRow: 3,
                                },
                            ],
                        });
                    }).toThrow();
                });

                it('header rows are not the same width', () => {
                    /*
                     * +-------+-------+
                     * |       |   2   |   ?
                     * |   1   +-------+------+
                     * |       |   3   |   4  |  <- неверно
                     * +-------+-------+------+
                     */
                    const header = [
                        {
                            startRow: 1,
                            endRow: 3,
                            startColumn: 1,
                            endColumn: 2,
                        },
                        {
                            startRow: 1,
                            endRow: 2,
                            startColumn: 2,
                            endColumn: 3,
                        },
                        {
                            startRow: 2,
                            endRow: 3,
                            startColumn: 2,
                            endColumn: 3,
                        },
                        {
                            startRow: 1,
                            endRow: 2,
                            startColumn: 3,
                            endColumn: 4,
                        },
                    ];
                    expect(() => {
                        validateGridParts({
                            columns: [{}, {}],
                            header,
                        });
                    }).toThrow();
                });

                it('cell overflows other cell', () => {
                    /*
                     * +--------+--------------------+
                     * |        |          2         |
                     * |        |--------------------+
                     * |    1   |          3         |
                     * |        | (должна быть тут,  |
                     * |        | но задана с первой |
                     * |        |    по 3 строку)    |
                     * +--------+--------------------+
                     */
                    const header = [
                        {
                            startColumn: 1,
                            endColumn: 2,
                            startRow: 1,
                            endRow: 3,
                        },
                        {
                            startColumn: 2,
                            endColumn: 3,
                            startRow: 1,
                            endRow: 2,
                        },
                        {
                            startColumn: 2,
                            endColumn: 3,
                            startRow: 1,
                            endRow: 3,
                        },
                    ];
                    expect(() => {
                        validateGridParts({
                            columns: [{}, {}, {}, {}],
                            header,
                        });
                    }).toThrow();
                });
            });
        });
    });

    describe('parts collaboration', () => {
        describe('valid', () => {
            it('columns', () => {
                expect(() => {
                    expect(
                        validateGridParts({
                            columns: [{}, {}],
                        })
                    ).toBe(true);
                }).not.toThrow();
            });

            it('columns + header', () => {
                expect(() => {
                    expect(
                        validateGridParts({
                            columns: [{}, {}],
                            header: [{}, {}],
                        })
                    ).toBe(true);
                }).not.toThrow();
            });

            it('columns + footer', () => {
                expect(() => {
                    expect(
                        validateGridParts({
                            columns: [{}, {}],
                            footer: [{}, {}],
                        })
                    ).toBe(true);
                }).not.toThrow();
            });

            it('columns + emptyTemplateColumns', () => {
                expect(() => {
                    expect(
                        validateGridParts({
                            columns: [{}, {}],
                            emptyTemplateColumns: [{}, {}],
                        })
                    ).toBe(true);
                }).not.toThrow();
            });

            it('all exist', () => {
                expect(() => {
                    expect(
                        validateGridParts({
                            columns: [{}, {}],
                            header: [{}, {}],
                            emptyTemplateColumns: [{}, {}],
                            footer: [{}, {}],
                        })
                    ).toBe(true);
                }).not.toThrow();
            });

            it('columns + footer colspaned', () => {
                expect(() => {
                    expect(
                        validateGridParts({
                            columns: [{}, {}],
                            footer: [
                                {
                                    startColumn: 1,
                                    endColumn: 3,
                                },
                            ],
                        })
                    ).toBe(true);
                }).not.toThrow();
            });

            it('columns + emptyTemplateColumns colspaned', () => {
                expect(() => {
                    expect(
                        validateGridParts({
                            columns: [{}, {}],
                            emptyTemplateColumns: [
                                {
                                    startColumn: 1,
                                    endColumn: 3,
                                },
                            ],
                        })
                    ).toBe(true);
                }).not.toThrow();
            });
        });

        describe('invalid', () => {
            it('no columns', () => {
                expect(() => {
                    validateGridParts({});
                }).toThrow();
            });

            it('columns + footer colspaned less', () => {
                expect(() => {
                    validateGridParts({
                        columns: [{}, {}],
                        footer: [
                            {
                                startColumn: 1,
                                endColumn: 2,
                            },
                        ],
                    });
                }).toThrow();
            });

            it('columns + emptyTemplateColumns colspaned less', () => {
                expect(() => {
                    validateGridParts({
                        columns: [{}, {}],
                        emptyTemplateColumns: [
                            {
                                startColumn: 1,
                                endColumn: 2,
                            },
                        ],
                    });
                }).toThrow();
            });

            it('columns + footer colspaned bigger', () => {
                expect(() => {
                    validateGridParts({
                        columns: [{}, {}],
                        footer: [
                            {
                                startColumn: 1,
                                endColumn: 4,
                            },
                        ],
                    });
                }).toThrow();
            });

            it('columns + emptyTemplateColumns colspaned bigger', () => {
                expect(() => {
                    validateGridParts({
                        columns: [{}, {}],
                        emptyTemplateColumns: [
                            {
                                startColumn: 1,
                                endColumn: 4,
                            },
                        ],
                    });
                }).toThrow();
            });
        });
    });

    describe('left sticky columns widths validation', () => {
        describe('valid', () => {
            it('all sticky columns widths are in pixels', () => {
                expect(() => {
                    expect(
                        validateGridParts({
                            columns: [
                                { width: '10px' },
                                { width: '10px' },
                                { width: '10fr' },
                                { width: '10px' },
                            ],
                            gridControl: {
                                columns: [{}, {}],
                                groupViewMode: 'default',
                                canResetSorting: false,
                                stickyColumnsCount: 2,
                                columnScroll: true,
                            },
                        })
                    ).toBe(true);
                }).not.toThrow();
            });
        });

        describe('invalid', () => {
            it('some sticky columns widths are in percents', () => {
                expect(() => {
                    validateGridParts({
                        columns: [
                            { width: '10px' },
                            { width: '10%' },
                            { width: '10px' },
                            { width: '10px' },
                        ],
                        gridControl: {
                            columns: [{}, {}],
                            groupViewMode: 'default',
                            canResetSorting: false,
                            stickyColumnsCount: 2,
                            columnScroll: true,
                        },
                    });
                }).toThrow();
            });

            it('some sticky columns widths are in fr', () => {
                expect(() => {
                    validateGridParts({
                        columns: [
                            { width: '10px' },
                            { width: '10px' },
                            { width: '10fr' },
                            { width: '10px' },
                        ],
                        gridControl: {
                            columns: [{}, {}],
                            groupViewMode: 'default',
                            canResetSorting: false,
                            stickyColumnsCount: 3,
                            columnScroll: true,
                        },
                    });
                }).toThrow();
            });

            it('some sticky columns widths are auto', () => {
                expect(() => {
                    validateGridParts({
                        columns: [
                            { width: '10px' },
                            { width: '10px' },
                            { width: 'auto' },
                            { width: '10px' },
                        ],
                        gridControl: {
                            columns: [{}, {}],
                            groupViewMode: 'default',
                            canResetSorting: false,
                            stickyColumnsCount: 3,
                            columnScroll: true,
                        },
                    });
                }).toThrow();
            });

            it('some sticky columns widths are minmax', () => {
                expect(() => {
                    validateGridParts({
                        columns: [
                            { width: 'minmax(10px, 10fr)' },
                            { width: '10px' },
                            { width: '10px' },
                            { width: '10px' },
                        ],
                        gridControl: {
                            columns: [{}, {}],
                            groupViewMode: 'default',
                            canResetSorting: false,
                            stickyColumnsCount: 3,
                            columnScroll: true,
                        },
                    });
                }).toThrow();
            });
        });
    });
});
