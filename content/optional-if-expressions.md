+++
title = "Optional If Expressions"
date = 2023-04-13
draft = true
+++

A while back, [Robert Nystrom][1] published a post on [type-checking *if-expressions*][2]. If-expressions are generally a feature of [*expression-oriented* languages][3], in which all language constructs produce a value. An if-expression takes on the value produced by the selected branch:

```rust
// Using Rust for this post
let title = if favorite {
  "Best Muffin Recipe"
} else {
  "Decent Muffin Recipe"
};
```

Because if-expressions must produce a value, an `else` branch is needed; because either branch could be taken, both branches must produce a value of the same type.

In [*statement-oriented* languages][4], however, it is common to write if-statements without a trailing `else`, because they perform a [side effect][5] rather than a useful value:

```rust
let mersenne = 2.pow_i(n) - 1;
if is_prime(mersenne) {
  println!("Found prime: {}", mersenne);
}
```

This is a super common pattern in real-world code. Quoting Nystrom:

> [...] in imperative code, it’s obviously common to have `if`s whose main purpose is a side effect and where an `else` clause isn’t needed. In fact, when I analyzed a huge corpus of real-world Dart, I found that only about 20% of `if` statements had `else` branches.

It is possible, however, for an expression-oriented language to have if-expressions without `else` branches. If the `if` doesn't produce a 'value' (e.g. produces [Unit][6] or [Absurd][7]) or the value produced is never consumed, then an `else` branch is obviously not required.

Nystrom goes on to explain his approach for keeping track of whether the context will consume the value or not, so that it is possible to write single-branch if-expressions in non-expression contexts. (Nystrom goes a step further by relaxing the 'same-type' constraint in contexts where the value is not used.)

While keeping track of contexts works well in interpreted languages, there's a simple way to adapt if-expressions so that they work in expression context:

What if single-branch if-expressions just produced an [optionally-typed][8] value? To illustrate:

```rust
let quotient: Option<f64>;
quotient = if denominator != 0.0 {
  numerator / denominator
};
```

The above example would be equivalent to:

```rust
// …
quotient = if denominator != 0.0 {
  Some(numerator / denominator)
} else {
  None
}
```

This pattern could be useful for [look-before-you-leap][9] type contexts, where a potentially fallible expression needs to check some preconditions before running.

Currently, this feature is [available as a method][10] on `bool` in Rust:

```rust
// …
quotient = (denominator != 0.0)
  .then(|| { 
    numerator / denominator
  });
```

While this works, and composes well when [chaining methods][12], on its own, it's not that readable. (It suffices to say that I'm not a huge fan of passing closure callbacks a methods.)

Optional if-expressions are syntactically cleaner, neatly extend the semantics of if-expressions, are implicitly lazy, and read better in most contexts.

As a plus, they're also a lot simpler to implement, as they don't require keeping track of expression vs non-expression contexts. (Of course, if the compiler keeps track of context to figure out when it can relax the 'same-type' rule, as Nystrom does, limiting the context of single-branch if-expressions isn't much additional work.)

How to integrate imperative, statement-oriented if-statements in an expression-oriented language is an interesting question. Optional if-expressions are an unambiguous syntactic transformation, [sugar][13] for a common pattern often used. While they neatly resolve a couple problems, they're not perfect. For starters, I'm not a huge fan that the [Option][8] type is introduced implicitly. In a language with [nullable values][15], nullable if-expressions would be a total no-go.

Taking a step back, in all honesty, I'm not a huge fan of if-expressions and, well, [booleans][16] in general. In the long run, I think that [pattern-matching][17] on [structured data][18] is a much cleaner and less [error-prone][19] route. The issue of [deeply-nested pattern-matching][20] can be resolved with a little sugar (e.g. [`do`][21]/[`with`][22]/[`use`][23] notation in [Haskell][24]/[Koka][25]/[Gleam][26]): there's no reason not to `match`!

But until then, let's at least make the if-expressions we have now a little nicer! What do you think?

[1]: https://twitter.com/munificentbob
[2]: http://journal.stuffwithstuff.com/2023/01/03/type-checking-if-expressions/
[3]: https://en.wikipedia.org/wiki/Expression-oriented_programming_language
[4]: https://en.wikipedia.org/wiki/Imperative_programming
[5]: https://en.wikipedia.org/wiki/Side_effect_(computer_science)
[6]: https://en.wikipedia.org/wiki/Unit_type
[7]: https://en.wikipedia.org/wiki/Empty_type
[8]: https://en.wikipedia.org/wiki/Option_type
[9]: https://wiki.c2.com/?LookBeforeYouLeap
[10]: https://doc.rust-lang.org/std/primitive.bool.html#method.then
[12]: https://dhghomon.github.io/easy_rust/Chapter_35.html
[13]: https://en.wikipedia.org/wiki/Syntactic_sugar
[15]: https://en.wikipedia.org/wiki/Nullable_type
[16]: https://wiki.c2.com/?UseEnumsNotBooleans
[17]: https://en.wikipedia.org/wiki/Pattern_matching
[18]: https://en.wikipedia.org/wiki/Algebraic_data_type
[19]: https://tuacm.com/blog/switch-statements-wont-fix-yandere-simulator/
[20]: https://www.reddit.com/r/rust/comments/7m7rn8/avoiding_deeply_nested_matchstructures/
[21]: https://en.wikibooks.org/wiki/Haskell/do_notation
[22]: https://koka-lang.github.io/koka/doc/book.html#sec-with
[23]: https://gleam.run/news/v0.25-introducing-use-expressions/
[24]: https://www.haskell.org/
[25]: https://koka-lang.github.io/
[26]: https://gleam.run/
