export function getConfig(args: object): object {
    return {
        data: {
            type: 'custom',
            loadDataMethod: () => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        const dataSource = args.viewSource;
                        if (args.record) {
                            dataSource
                                .read(args.record.get('id'))
                                .then((result) => {
                                    resolve(result);
                                });
                        } else {
                            dataSource.create().then((result) => {
                                result.set(
                                    'id',
                                    Math.floor(Math.random() * 100000)
                                );
                                resolve(result);
                            });
                        }
                    }, 1500);
                });
            },
            dependentArea: ['workspace'],
        },
    };
}
