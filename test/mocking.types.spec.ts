import {MethodToStub} from "../src/MethodToStub";
import {instance, mock, when} from "../src/ts-mockito";
import {Bar} from "./utils/Bar";

describe("mocking", () => {
    describe("mocking abstract class", () => {
        let mockedFoo: SampleAbstractClass;
        let foo: SampleAbstractClass;

        it("does not execute getter or setter code (not throwing null pointer exception)", () => {
            // given

            // when
            mockedFoo = mock(SampleAbstractClass);
            foo = instance(mockedFoo);

            // then

        });

        it("does create own property descriptors on mock", () => {
            // given

            // when
            mockedFoo = mock(SampleAbstractClass);

            // then
            expect((mockedFoo.twoPlusTwo as any) instanceof MethodToStub).toBe(true);
        });

        it("does create own property descriptors on instance", () => {
            // given
            mockedFoo = mock(SampleAbstractClass);
            foo = instance(mockedFoo);

            // when
            when(mockedFoo.twoPlusTwo).thenReturn(42);

            // then
            expect(foo.twoPlusTwo).toBe(42);
        });

        it("does create inherited property descriptors on mock", () => {
            // given
            mockedFoo = mock(SampleAbstractClass);
            foo = instance(mockedFoo);

            // when

            // then
            expect((mockedFoo.sampleString as any) instanceof MethodToStub).toBe(true);
        });

        it("does create inherited property descriptors on instance", () => {
            // given
            mockedFoo = mock(SampleAbstractClass);
            foo = instance(mockedFoo);

            // when
            when(mockedFoo.sampleString).thenReturn("42");

            // then
            expect(foo.sampleString).toBe("42");
        });

        it("does not create then() descriptor", () => {
            // given
            mockedFoo = mock(SampleAbstractClass);
            const woof: any = instance(mockedFoo);

            // when

            // then
            expect(woof.then == null).toBe(true);
        });

        it("does create then() descriptor", () => {
            // given
            const mockedThenable = mock(SampleThenable);
            const thenable = instance(mockedThenable);

            // when
            when(mockedThenable.then()).thenReturn("42");

            // then
            expect(thenable.then()).toEqual("42");
        });

        it("does not create catch() descriptor", () => {
            // given
            mockedFoo = mock(SampleAbstractClass);
            const woof: any = instance(mockedFoo);

            // when

            // then
            expect(woof.catch == null).toBe(true);
        });

        it("does create catch() descriptor", () => {
            // given
            const mockedThenable = mock(SampleThenable);
            const thenable = instance(mockedThenable);

            // when
            when(mockedThenable.catch()).thenReturn("42");

            // then
            expect(thenable.catch()).toEqual("42");
        });

        it("formats as [object Object]", () => {
            // given
            const mockedThenable = mock(SampleThenable);
            const thenable = instance(mockedThenable);

            // when

            // then
            const str = `"${thenable}"`;
            expect(str).toEqual('"[object Object]"');
        });
    });

    describe("mocking class with hasOwnProperty", () => {
        let mockedFoo: SampleClassWithHasOwnProperty;

        it("does not attempt to mock hasOwnProperty (which would throw)", () => {
            // given

            // when
            mockedFoo = mock(SampleClassWithHasOwnProperty);

            // then

        });
    });

    describe("mocking generic class", () => {
        let mockedFoo: SampleGeneric<SampleInterface>;
        let foo: SampleGeneric<SampleInterface>;

        it("does not execute getter or setter code (not throwing null pointer exception)", () => {
            // given

            // when
            mockedFoo = mock(SampleGeneric);
            foo = instance(mockedFoo);

            // then

        });

        it("does create own property descriptors on mock", () => {
            // given

            // when
            mockedFoo = mock(SampleGeneric);

            // then
            expect((mockedFoo.twoPlusTwo as any) instanceof MethodToStub).toBe(true);
        });

        it("allows to mock method with generic return type value (with IDE completion)", () => {
            // given
            mockedFoo = mock(SampleGeneric);
            foo = instance(mockedFoo);
            const expectedResult = new SampleInterfaceImplementation();
            when(mockedFoo.getGenericTypedValue()).thenReturn(expectedResult);

            // when
            const result = foo.getGenericTypedValue();

            // then
            expect(expectedResult).toEqual(result);
        });

        it("does create own property descriptors on instance", () => {
            // given
            mockedFoo = mock(SampleGeneric);
            foo = instance(mockedFoo);

            // when
            when(mockedFoo.twoPlusTwo).thenReturn(42);

            // then
            expect(foo.twoPlusTwo).toBe(42);
        });

        it("does create inherited property descriptors on mock", () => {
            // given
            mockedFoo = mock(SampleGeneric);
            foo = instance(mockedFoo);

            // when

            // then
            expect((mockedFoo.sampleString as any) instanceof MethodToStub).toBe(true);
        });

        it("does create inherited property descriptors on instance", () => {
            // given
            mockedFoo = mock(SampleGeneric);
            foo = instance(mockedFoo);

            // when
            when(mockedFoo.sampleString).thenReturn("42");

            // then
            expect(foo.sampleString).toBe("42");
        });
    });

    describe("mocking object which doesn't inherit from anything", () => {
        it("does not execute getter or setter code (not throwing null pointer exception)", () => {
            // given
            const bareObject = Object.create(null);

            // when
            const mockedObject = mock(bareObject);
            instance(mockedObject);

            // then

        });
    });
});

abstract class SampleAbstractClass {
    public dependency: Bar;

    public get sampleString(): string {
        return "sampleString";
    }

    public sampleMethod(): number {
        return 4;
    }

    public get twoPlusTwo(): number {
        return this.dependency.sumTwoNumbers(2, 2);
    }

    public set twoPlusTwo(value: number) {
        this.dependency.sumTwoNumbers(value, 0);
    }
}

class SampleClassWithHasOwnProperty {
    public hasOwnProperty(name: string): boolean {
        return Object.prototype.hasOwnProperty.call(this, name);
    }
}

interface SampleInterface {
    dependency: Bar;

    sampleMethod(): number;
}

class SampleInterfaceImplementation implements SampleInterface {
    public dependency: Bar;

    public sampleMethod(): number {
        return 999;
    }
}

class SampleGeneric<T> {
    public dependency: Bar;

    public get sampleString(): string {
        return "sampleString";
    }

    public sampleMethod(): number {
        return 4;
    }

    public get twoPlusTwo(): number {
        return this.dependency.sumTwoNumbers(2, 2);
    }

    public set twoPlusTwo(value: number) {
        this.dependency.sumTwoNumbers(value, 0);
    }

    public getGenericTypedValue(): T {
        return null;
    }
}

abstract class SampleThenable {
    public then(): string {
        return "bob";
    }

    public catch(): string {
        return "bob";
    }
}
