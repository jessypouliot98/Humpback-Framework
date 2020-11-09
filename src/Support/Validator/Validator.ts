export enum Status {
    null = 'null',
    success = 'success',
    error = 'error',
}

export type property = { key: string, value: any }
export type propertyError = { key: string, value: any, error: string }

class Validator {

    protected _rules: any[] = [];

    protected _errors: property[] = [];
    protected _passes: property[] = [];
    protected _skipped: property[] = [];
    protected _status: Status = Status.null;

    public constructor(rules: any[]) {
        this._rules = rules;
    }

    public static make(payload: any, rules: any) {
		return new this(rules).validate(payload);
    }

    public validate(payload: any) {
        Object.entries(payload).forEach(([key, value]) => {
			const rule = this._rules.find(rule => rule.name === key);

			if (!rule) {
                this._skipped.push({ key, value });
				return;
			}

            this._passes.push({ key, value });
		});

        return this;
    }

    public getStatus() {
        return this._status;
    }

    public getPasses() {
        return this._passes;
    }

    public getSkipped() {
        return this._skipped;
    }

    public getErrors() {
        return this._errors;
    }

    public isValid() {
        return this._status === Status.success;
    }

    public hasErrors() {
        return this._errors.length > 0;
    }

}

export default Validator
