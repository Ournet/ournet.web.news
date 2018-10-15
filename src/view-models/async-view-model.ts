import { RootViewModelInput, RootViewModel, RootModelBuilder } from "./root-view-model";
import { OurnetQueryApi } from "@ournet/api-client";
import { badImplementation } from "boom";


export class AsyncViewModelBuilder<T extends RootViewModel, I extends RootViewModelInput> extends RootModelBuilder<T, I> {

    constructor(input: I, protected api: OurnetQueryApi<T>) {
        super(input);
    }

    async build() {
        const apiResult = await this.api.execute();
        if (apiResult.errors) {
            throw badImplementation(apiResult.errors[0].message);
        }
        return this.formatModel(apiResult.data);
    }

    protected formatModel(_data: T): T {
        return this.model;
    }
}