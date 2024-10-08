/*
  33345 - Dynamic Route
  -------
  by 0753 (@0753Ljuc) #extreme

  ### Question

  Given below routes, infer its dynamic params.
  | Route                          | Params Type Definition                                                                                     |
  |--------------------------------|------------------------------------------------------------------------------------------------------------|
  | `/blog/[slug]/page.js`         | `{ slug: string }`                                                                                         |
  | `/shop/[...slug]/page.js`      | `{ slug: string[] }`                                                                                       |
  | `/shop/[[...slug]]/page.js`    | `{ slug?: string[] }`                                                                                      |
  | `/[categoryId]/[itemId]/page.js` | `{ categoryId: string, itemId: string }`                                                                 |
  | `/app/[...foo]/[...bar]`       | `never` - It's ambiguous as we cannot decide if `b` on `/app/a/b/c` is belongs to `foo` or `bar`.          |
  | `/[[...foo]]/[slug]/[...bar]`  | `never`                                                                                                    |
  | `/[first]/[[...foo]]/stub/[...bar]/[last]` | `{ first: string, foo?: string[], bar: string[], last: string }`                               |

  > View on GitHub: https://tsch.js.org/33345
*/

/* _____________ Your Code Here _____________ */

type Merge<T> = {
  [P in keyof T]: T[P];
};

type DynamicRoute<
  T extends string,
  Check extends boolean = false,
  Result = {}
> = T extends `${"/" | ""}[[...${infer P}]]${infer Rest}`
  ? Check extends true
    ? never
    : DynamicRoute<Rest, true, Merge<Result & { [K in P]?: string[] }>>
  : T extends `${"/" | ""}[...${infer P}]${infer Rest}`
  ? P extends ""
    ? DynamicRoute<Rest, Check, Merge<Result & { "...": string }>>
    : Check extends true
    ? never
    : DynamicRoute<
        Rest,
        true,
        Merge<Result & { [K in `${P}`]: P extends "" ? string : string[] }>
      >
  : T extends `${"/" | ""}[${infer P1}${infer P2}]${infer Rest}`
  ? DynamicRoute<Rest, Check, Merge<Result & { [K in `${P1}${P2}`]: string }>>
  : T extends `${"/" | ""}${infer _P1}${infer _P2}/${infer Rest}`
  ? DynamicRoute<Rest, false, Result>
  : Result;

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from "../util-types";

type cases = [
  Expect<Equal<DynamicRoute<"/shop">, {}>>,
  Expect<Equal<DynamicRoute<"/shop/[]">, {}>>,
  Expect<Equal<DynamicRoute<"/shop/[slug]">, { slug: string }>>,
  Expect<Equal<DynamicRoute<"/shop/[slug]/">, { slug: string }>>,
  Expect<
    Equal<DynamicRoute<"/shop/[slug]/[foo]">, { slug: string; foo: string }>
  >,
  Expect<
    Equal<
      DynamicRoute<"/shop/[slug]/stub/[foo]">,
      { slug: string; foo: string }
    >
  >,
  Expect<
    Equal<
      DynamicRoute<"/shop/[slug]/stub/[foo]">,
      { slug: string; foo: string }
    >
  >,
  Expect<
    Equal<
      DynamicRoute<"/shop/[slug]/stub/[...foo]">,
      { slug: string; foo: string[] }
    >
  >,
  Expect<
    Equal<
      DynamicRoute<"/shop/[slug]/stub/[[...foo]]">,
      { slug: string; foo?: string[] }
    >
  >,
  Expect<
    Equal<
      DynamicRoute<"/shop/[slug]/stub/[[...foo]]/[]">,
      { slug: string; foo?: string[] }
    >
  >,
  Expect<
    Equal<
      DynamicRoute<"/shop/[slug]/stub/[[...foo]]/[...]">,
      { slug: string; foo?: string[]; "...": string }
    >
  >,
  Expect<
    Equal<
      DynamicRoute<"/shop/[slug]/stub/[[...foo]]/[...]/[]index.html">,
      { slug: string; foo?: string[]; "...": string }
    >
  >,
  Expect<
    Equal<
      DynamicRoute<"/shop/[slug]/stub/[[...foo]]/[...]/[...]index.html">,
      { slug: string; foo?: string[]; "...": string }
    >
  >,
  Expect<Equal<DynamicRoute<"/[slug]/[[...foo]]/[...bar]">, never>>,
  Expect<Equal<DynamicRoute<"/[[...foo]]/[slug]/[...bar]">, never>>,
  Expect<Equal<DynamicRoute<"/[[...foo]]/[...bar]/static">, never>>,
  Expect<
    Equal<
      DynamicRoute<"[[...foo]]/stub/[...bar]">,
      { foo?: string[]; bar: string[] }
    >
  >,
  Expect<
    Equal<
      DynamicRoute<"[first]/[[...foo]]/stub/[...bar]/[last]">,
      { first: string; foo?: string[]; bar: string[]; last: string }
    >
  >
];

/* _____________ Further Steps _____________ */
/*
  > Share your solutions: https://tsch.js.org/33345/answer
  > View solutions: https://tsch.js.org/33345/solutions
  > More Challenges: https://tsch.js.org
*/
