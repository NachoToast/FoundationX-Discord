import { Colour } from '../types/Colour.js';

type PossibleType =
    | 'string'
    | 'number'
    | 'object'
    | 'boolean'
    | 'undefined'
    | 'null'
    | 'array';

/** A utility class for nested validation of object fields. */
export class Validator<TObject, TKey extends keyof TObject> {
    private readonly value: TObject[TKey];

    /** Name of key to use when logging. */
    private readonly keyName: string;

    /** Name of object to use when logging. */
    private readonly objectName: string;

    // MARK: Creation

    private constructor(
        object: TObject,
        key: TKey,
        objectName: string,
        keyName: string,
        expectedTypes: PossibleType[],
    ) {
        this.value = object[key];
        this.keyName = keyName;
        this.objectName = objectName;

        this.checkType(expectedTypes);
    }

    /** Factory for validators on a preset object. */
    public static for<TObject>(
        object: TObject,
        objectName: string,
    ): <K extends keyof TObject>(
        key: K,
        expectedTypes: PossibleType[],
        keyName?: string,
    ) => Validator<TObject, K> {
        return (key, expectedTypes, keyName) => {
            return new Validator(
                object,
                key,
                objectName,
                keyName ?? key.toString(),
                expectedTypes,
            );
        };
    }

    /**
     * Prepends an indefinite article ("a" or "an") to a given type name if
     * necessary.
     */
    private static withIndefiniteArticle(word: string): string {
        if (word === 'undefined' || word === 'null') return word;
        if (word.at(0)?.match(/[aeiou]/i)) return 'an ' + word;
        return 'a ' + word;
    }

    // MARK: Children

    /** Creates a child validator from the given key of the tracked object. */
    public child<TChildKey extends keyof TObject[TKey]>(
        childKey: TChildKey,
        expectedTypes: PossibleType[],
        callbackFn?: (validator: Validator<TObject[TKey], TChildKey>) => void,
    ): this {
        const validator = new Validator<TObject[TKey], TChildKey>(
            this.value,
            childKey,
            this.objectName,
            `${this.keyName}.${childKey.toString()}`,
            expectedTypes,
        );

        callbackFn?.(validator);

        return this;
    }

    public if(conditionFn: (x: TObject[TKey]) => boolean): this | null {
        if (conditionFn(this.value)) {
            return this;
        }

        return null;
    }

    /**
     * Creates a validator for each item in the tracked array.
     *
     * Only applicable if the tracked object is an array.
     */
    public forEach(
        expectedTypes: PossibleType[],
        callbackFn?: (
            validator: Validator<
                (TObject[TKey] extends (infer T)[] ? T : never)[],
                number
            >,
        ) => void,
    ): this {
        if (!Array.isArray(this.value)) {
            throw new Error('Value is not an array');
        }

        const validate = Validator.for(this.value, this.objectName);

        for (let i = 0; i < this.value.length; i++) {
            const validator = validate(
                i,
                expectedTypes,
                `${this.keyName}[${i.toString()}]`,
            );

            callbackFn?.(validator);
        }

        return this;
    }

    /**
     * Creates a validator for each value in the tracked record.
     *
     * Only applicable if the tracked object is a record.
     */
    public values(
        expectedTypes: PossibleType[],
        callbackFn?: (
            validator: Validator<TObject[TKey], keyof TObject[TKey]>,
        ) => void,
    ): this {
        if (typeof this.value !== 'object' || this.value === null) {
            throw new Error('Value is not an object');
        }

        for (const key of Object.keysT(this.value)) {
            const validator = new Validator<TObject[TKey], keyof TObject[TKey]>(
                this.value,
                key,
                this.objectName,
                `${this.keyName}['${key.toString()}']`,
                expectedTypes,
            );

            callbackFn?.(validator);
        }

        return this;
    }

    // MARK: Validation

    /**
     * Ensures the tracked object meets a minimum:
     *
     * - Length (if string)
     * - Value (if number)
     * - Item count (if array)
     *
     * Only applicable if the tracked object is a string, number, or array.
     *
     * @param [trim=true] Whether to trim the leading and trailing whitespace
     * when considering length, only applicable for strings.
     */
    public min(target: number, trim = true): this {
        if (typeof this.value === 'number') {
            if (this.value < target) {
                this.logError(
                    `should be greater than or equal to ${target.toString()}`,
                );
            }
        } else if (typeof this.value === 'string') {
            const trimmedValue = trim ? this.value.trim() : this.value;

            if (trimmedValue.length < target) {
                this.logError(
                    `should be at least ${target.toString()} characters long`,
                );
            }
        } else if (Array.isArray(this.value)) {
            if (this.value.length < target) {
                this.logError(
                    `should have at least ${target.toString()} items`,
                );
            }
        } else {
            throw new Error('Value is not a string, number, or array');
        }

        return this;
    }

    /**
     * Ensures the tracked object meets a maximum:
     *
     * - Length (if string)
     * - Value (if number)
     * - Item count (if array)
     *
     * Only applicable if the tracked object is a string, number, or array.
     *
     * @param [trim=true] Whether to trim the leading and trailing whitespace
     * when considering length, only applicable for strings.
     */
    public max(target: number, trim = true): this {
        if (typeof this.value === 'number') {
            if (this.value > target) {
                this.logError(
                    `should be less than or equal to ${target.toString()}`,
                );
            }
        } else if (typeof this.value === 'string') {
            const trimmedValue = trim ? this.value.trim() : this.value;

            if (trimmedValue.length > target) {
                this.logError(
                    `should be at most ${target.toString()} characters long`,
                );
            }
        } else if (Array.isArray(this.value)) {
            if (this.value.length > target) {
                this.logError(`should have at most ${target.toString()} items`);
            }
        } else {
            throw new Error('Value is not a string, number, or array');
        }

        return this;
    }

    /**
     * Ensures the tracked number is an integer.
     *
     * Only applicable if the tracked object is a number.
     */
    public integer(): this {
        if (!Number.isInteger(this.value)) {
            this.logError('should be an integer');
        }

        return this;
    }

    public finite(): this {
        if (!Number.isFinite(this.value)) {
            this.logError('should be a finite number');
        }

        return this;
    }

    /**
     * Runs a custom validation function on the tracked object.
     *
     * Will log an error if the function throws one.
     */
    public custom(callbackFn: (x: TObject[TKey]) => void): this {
        try {
            callbackFn(this.value);
        } catch (error) {
            if (!(error instanceof Error)) {
                throw error;
            }

            this.logError(error.message);
        }

        return this;
    }

    /** Ensures the tracked object is one of the expected types. */
    private checkType(expectedTypes: PossibleType[]): this {
        let isValid: boolean;
        let reportedType: string;

        if (this.value === undefined) {
            reportedType = 'undefined';
            isValid = expectedTypes.includes('undefined');
        } else if (this.value === null) {
            reportedType = 'null';
            isValid = expectedTypes.includes('null');
        } else if (Array.isArray(this.value)) {
            reportedType = 'array';
            isValid = expectedTypes.includes('array');
        } else {
            reportedType = typeof this.value;

            const expectedTypesRaw: string[] = expectedTypes;
            isValid = expectedTypesRaw.includes(reportedType);
        }

        if (!isValid) {
            const expected = expectedTypes
                .map((type) => Validator.withIndefiniteArticle(type))
                .join(' or ');

            const actual = Validator.withIndefiniteArticle(reportedType);

            this.logError(`should be ${expected} but is ${actual}`);
        }

        return this;
    }

    // MARK: Logging

    /** Logs a misconfiguration nicely before exiting the process. */
    private logError(message: string): void {
        console.error(
            `Error in ${this.objectName}: ${Colour.FgCyan}${this.keyName}${Colour.Reset} ${message}`,
        );

        process.exit(1);
    }
}
