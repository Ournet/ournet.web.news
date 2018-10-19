
import { GraphQLQueryExecutor, OurnetQueryApi, OurnetMutationApi } from '@ournet/api-client';

const executor = new GraphQLQueryExecutor(process.env.OURNET_API_HOST || 'http://ournetapi.com/graphql');

export function createQueryApiClient<QT>(): OurnetQueryApi<QT> {
    return new OurnetQueryApi<QT>(executor)
}

export function createMutationApiClient<QT>(): OurnetMutationApi<QT> {
    return new OurnetMutationApi<QT>(executor);
}

// export type OurnetApi<QT> = {
//     query: OurnetQueryApi<QT>
// }
