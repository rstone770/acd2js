export type OkParseResult<T> = {
  ok: true;
  value: T;
  offset: number;
};

export type ErrorParseResult = {
  ok: false;
  error: unknown;
  offset: number;
};

export type ParseResult<T> = OkParseResult<T> | ErrorParseResult;

export const ok = <T>(value: T, offset: number): OkParseResult<T> => ({
  ok: true,
  value,
  offset
});

export const error = (error: unknown, offset: number): ErrorParseResult => ({
  ok: false,
  error,
  offset
});
