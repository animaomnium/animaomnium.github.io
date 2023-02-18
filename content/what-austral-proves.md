+++
title = "What Austral Proves"
date = 2023-02-15
+++

[Austral][0] is a novel systems programming language designed by [Fernando Borretti][3]:

> You can think of it as *Rust: The Good Parts* or a modernized, stripped-down Ada. It features a strong static type system, linear types, capability-based security, and strong modularity.

I've been thinking a lot about [Austral][2] recently. It bundles a lot of the right features together in one place.

Austral is designed for safety-critical systems software. Austral has the philosophy that, if a programmer looks at some code, they should be able to say exactly what it does, down to the functions it calls and the assembly it emits. This goal has informed a number of design decisions: the language is unambiguous, uses linear types to model resources, and library permissions are constrained using capabilities. It wouldn't be a stretch to say that Austral is a language Dijkstra would love: it guides you towards writing [perfect programs][52].

Austral is a simple language. Like [Go][53], it is designed to be small enough to fit in the mind of a single programmer. The language has a compact 100-page [specification][4]; it's [not a big language][5]:

> A central constraint in the design of Austral is the language should be easy to implement. Not just because I was the only person writing the compiler, but because I want Austral to be a hundred year language, where you can reliably run code from decades ago (Common Lisp is like this: it is possible). If, for whatever reason, the source code of the bootstrapping compiler was lost, it would be trivial to rewrite it again from the ~100 pages of spec (roughly half of which describes the rationale for various design decisions).

To help you cobble together a rough picture of Austral, I'll say it has a [Ada][8]-like syntax with [Rust][9]-like semantics. Like [Rust][10], it has [traits][11] for modeling interfaces. Austral also leverages the type system to model [resources][12], which it does through the use of [Linear Types][1]. (Rust uses [Affine Types][13], which are similar, but a little less restrictive.)

Austral divides values into two type [Universes][14]: *free* values, which are small and can be copied freely, and *linear* values, which must be used *exactly* once. This constraint ensures that there is one—and only one—handle to a linear value at any given point in the program.

Austral's power to model resources stems from its Linear type system. Most data—like bools, ints, and small structs—can be modeled using normal free values. Resources—like [memory][15], [file descriptors][16], and database connections—are modeled as *linear values*. Linear values use the type system to statically ensure that there is only one handle to a resource at any given point in the program. Modeling resources is essential in [systems programming][17], and Austral, like Rust, will catch [memory-safety][18] bugs (and other similar classes of errors) at compile-time.

Austral includes a few innovations over Rust, such as a novel [*borrow*][19] syntax for annotating regional lifetimes:

```
let x: Lin := make();
borrow x as ref in R do
   -- Here, we can refer to the region by
   -- its name, `R`.
   let ref2: &[T, R] := transform(ref);
end;
consume(x);
```

By design of being a simpler language, however, Austral is a bit more restrictive than Rust in a few areas. The largest restrictions that come to mind are:

1. Linear Types require explicit [destructors][20] to clean up resources, because all values must be used _exactly_ once. This can get a little verbose. Rust uses Affine Types (values must be used _at most_ once), meaning that resources are cleaned up automatically according to Rust's [Drop][21] semantics.

2.  Austral uses [lexical regions][22] to model [lifetimes][23], meaning that the lifetimes of values are processed at the lexical, i.e. block, level. Rust uses fine-grained non-lexical lifetimes, meaning there are some valid programs that Rust permits but Austral disallows.

3. Austral, like Rust, uses a [borrow checker][24]. As borrow checkers tie resources to the stack, and stacks map to the [one-hole context][25] of cycle-free [inductive datatypes][26], it is impossible to express data structures that _contain cycles_ in Rust or Austral. (Without an escape-hatch like *unsafe* or [another level of indirection][27].)

It's important to note that these restrictions are purposeful: Requiring explicit resource cleanup ensures that the [drop-order][29] is well-defined, and that there is no invisible performance impact due to automatically-inserted drop calls; lexical regions keep the compiler implementation, and thus the language itself, small and easy to reason about; and if you're reaching for cyclic data at the application-level, you're probably looking to model [relations][30], in which case just use (a linear handle to) a relational database.

Borretti has said that these restrictions exist to keep the language *simple*. By any metric, I'd say he's succeeded. Heck, the linear type inference engine at the core of the language is only [600 lines long][51]. No, seriously, [take a look][31].

Rust, on the other hand, is a huge, [complex][32] language. In my mind, I pinned a lot of this complexity on Rust's borrow checker and type system. Having worked with Rust for a while, I'd argue that a good amount of this complexity is [accidental][33]: when Rust took its first steps, no mainstream language sported a borrow-checker. The [dichotomy][34] for any new language at the time was *slow-but-memory-safe* or *fast-but-footgunned*. Rust proved this dichotomy false, but getting to that point wasn't an [easy road][35]. ([Polonius][36], anyone?)

While more restrictive than Rust, Austral, with its 600-line linear-type borrow-checker, proves that implementing compiler-enforced resource safety isn't as hard as it once was; with the benefit of hindsight, we can avoid some of the accidental complexity originally thought necessary. 

If you can express linear types in less code than a garbage collector, why not just use linear types to manage memory? A lot of impractical theoretical groundwork laid in decades past is finally becoming tractable and workable. We're in a [golden era][37] of programming language research. [LLVM][38], the [Language Server Protocol][39], better [resources][40], and bigger [communities][41] have turned designing a new compiler from a PhD thesis to a weekend project. There's no excuse to ignore recent innovations. Linear types in 600 lines of code is quite the accomplishment, but it's indicative of a larger trend.

I think we're finally starting to get a handle on software engineering as a discipline. Gone are the wild-west days of PHP and CGI, shotgun debugging and panic deploys. Linear types, capabilities, algebraic effects, and program verification are old tools—finally becoming tractable—that let us understand, limit, and shape a program's behavior, as Software *Engineers*. 

Dijkstra grew disillusioned with Computing Science as a discipline: the tools simply weren't there yet. Austral proves that this is no longer the case. The tools are on the table, what to build from here?

It's too early to say what will happen with Austral in the long-run, but in the least it has been designed for longevity. Like Rust before it, Austral started with a [bootstrapping compiler][42] written in [OCaml][43]; it seems that the goal is now to write out a [self-hosting][44] compiler in Austral itself. I hope the language finds its [niche][45] (safety-critical embedded?) and quickly grows to do much more.

There will be some growing pains. At some point, as Rust discovered, the [restrictions][46] imposed by lexical regions will have to be re-evaluated. The package ecosystem is nascent, so while I wouldn't quite build your next company in the language, it might be fun (and useful!) to port over a little low-level library. (Forget [Rust][47], Rewrite it in Austral!)

To recap: [Austral][0] is a [systems programming language][17] that uses [linear types][1] to model [resources][12]. It's [small][4], and is working proof that borrow checkers need [not][51] be complex. I hope that Austral continues to grow and build on its innovations; I hope that future languages continue the example Austral sets and build off of prior research in a way that makes it practically tractable. What's Austral for [dependent types][48]? [Automatic parallelization][49]? [Distributed computing][50]? Time will tell.

[0]: https://austral-lang.org
[1]: https://wiki.c2.com/LinearTypes
[2]: https://github.com/austral/austral
[3]: https://borretti.me
[4]: https://austral-lang.org/spec/spec.html
[5]: https://borretti.me/article/simplicity-and-survival
[6]: https://en.wikipedia.org/wiki/cobol
[7]: https://en.wikipedia.org/wiki/scheme
[8]: https://en.wikipedia.org/wiki/Ada_(programming_language)
[9]: https://en.wikipedia.org/wiki/rust
[10]: https://doc.rust-lang.org/book/ch10-02-traits.html
[11]: https://austral-lang.org/tutorial/modules
[12]: https://en.wikipedia.org/wiki/Resource_management_(computing)
[13]: https://en.wikipedia.org/wiki/Substructural_type_system#Affine_type_systems
[14]: https://en.wikipedia.org/wiki/Universe_(mathematics)
[15]: https://en.wikipedia.org/wiki/Memory_management
[16]: https://en.wikipedia.org/wiki/File_descriptor
[17]: https://en.wikipedia.org/wiki/Systems_programming
[18]: https://www.nsa.gov/Press-Room/News-Highlights/Article/Article/3215760/nsa-releases-guidance-on-how-to-protect-against-software-memory-safety-issues/
[19]: https://borretti.me/article/how-australs-linear-type-checker-works#borrow-long
[20]: https://en.wikipedia.org/wiki/Destructor_(computer_programming)
[21]: https://doc.rust-lang.org/nomicon/drop-flags.html
[22]: https://stackoverflow.com/questions/50251487/what-are-non-lexical-lifetimes
[23]: https://en.wikipedia.org/wiki/Object_lifetime
[24]: https://doc.rust-lang.org/1.8.0/book/references-and-borrowing.html
[25]: https://en.m.wikibooks.org/wiki/Haskell/Zippers#Differentiation_of_data_types
[26]: https://en.wikipedia.org/wiki/Inductive_type
[27]: https://en.wikipedia.org/wiki/Fundamental_theorem_of_software_engineering
[29]: https://doc.rust-lang.org/reference/destructors.html
[30]: https://www.cell-lang.net/relations.html
[51]: https://borretti.me/article/how-australs-linear-type-checker-works
[31]: https://github.com/austral/austral/blob/master/lib/LinearityCheck.ml
[32]: https://vorner.github.io/difficult.html
[33]: https://en.wikipedia.org/wiki/No_Silver_Bullet
[34]: https://www.sebastiansylvan.com/post/why-most-high-level-languages-are-slow/
[35]: https://github.com/graydon/rust-prehistory
[36]: https://github.com/rust-lang/polonius
[37]: https://devpoga.org/post/2019-11-03-golden-age-of-programming-language/
[38]: https://llvm.org
[39]: https://langserver.org/
[40]: https://craftinginterpreters.com/
[41]: https://proglangdesign.net
[42]: https://en.wikipedia.org/wiki/Bootstrapping_(compilers)
[43]: https://ocaml.org/
[44]: https://en.wikipedia.org/wiki/Self-hosting_(compilers)
[45]: https://ano.ee/blog/the-niche-programmer
[46]: https://rust-lang.github.io/rfcs/2094-nll.html
[47]: https://enet4.github.io/rust-tropes/#rewrite-in-rust
[48]: https://github.com/Kindelia/Kind
[49]: https://futhark-lang.org/
[50]: https://www.unison-lang.org/
[52]: https://www.cs.utexas.edu/~EWD/transcriptions/EWD01xx/EWD117.html
[53]: https://go.dev/
