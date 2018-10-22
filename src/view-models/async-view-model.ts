import { RootViewModelInput, RootViewModel, RootModelBuilder } from "./root-view-model";
import { OurnetQueryApi } from "@ournet/api-client";
import { badImplementation } from "boom";


export class AsyncViewModelBuilder<T extends RootViewModel, I extends RootViewModelInput> extends RootModelBuilder<T, I> {

    constructor(input: I, protected api: OurnetQueryApi<T>) {
        super(input);
    }

    async build() {
        const data = await this.executeApi(this.api);
        return this.formatModel(data);
    }

    protected formatModel(_data: T): T {
        return this.model;
    }

    protected async executeApi<APIT>(api: OurnetQueryApi<APIT>) {
        return executeApi(api);
    }
}

export async function executeApi<APIT>(api: OurnetQueryApi<APIT>) {
    const apiResult = await api.execute();
    if (apiResult.errors) {
        throw badImplementation(apiResult.errors[0].message);
    }
    return apiResult.data;
}
