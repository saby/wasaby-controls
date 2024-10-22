import { DataSet, SbisService } from 'Types/source';
import { Record } from 'Types/entity';
import { Logger } from 'UI/Utils';

export async function getShortLink(link: string): Promise<string> {
    return new SbisService({
        endpoint: {
            contract: 'ShortLink',
            address: '/go/service/',
        },
    })
        .call('Create', {
            Parameters: Record.fromObject(
                {
                    URL: link,
                },
                'adapter.sbis'
            ),
        })
        .then((answer: DataSet) => {
            const row = answer?.getRow();
            return row?.get('Link');
        })
        .catch((error) => {
            Logger.error(error.message);
            return link;
        });
}
