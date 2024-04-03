import { error, ok, type OkParseResult, type ParseResult } from "./results.ts";

export type Parse<T> = (input: string, offset: number) => ParseResult<T>;

export const parser =
  <T>(parse: Parse<T>) =>
  (input: string, offset: number = 0) => {
    const isAboveBound = offset >= input.length;
    const isBelowBounds = offset < 0;

    if (isAboveBound || isBelowBounds) {
      return error(new Error("Parse offset is out of bounds."), offset);
    }

    try {
      return parse(input, offset);
    } catch (e) {
      return error(e, offset);
    }
  };

export type Map<T, U> = (result: OkParseResult<T>) => U;

export const map =
  <T, U>(parse: Parse<T>, fn: Map<T, U>): Parse<U> =>
  (input, offset) => {
    const result = parse(input, offset);

    if (result.ok) {
      return ok(fn(result), result.offset);
    }

    return result;
  };

export type Chain<T, U> = Map<T, Parse<U>>;

export const chain =
  <T, U>(parse: Parse<T>, fn: Chain<T, U>): Parse<T | U> =>
  (input, offset) => {
    const result = parse(input, offset);

    if (result.ok) {
      return fn(result)(input, result.offset);
    }

    return result;
  };
