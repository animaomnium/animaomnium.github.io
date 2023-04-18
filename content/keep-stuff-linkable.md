+++
title = "Keep Stuff Linkable"
date = 2023-04-17
+++

*2023-04-18 • Revised for clarity and style based on [feedback][0] from HN.*

You've spent hours reading, and a seed of an idea has germinated in your mind. You fire up your [favorite text editor][3], plant it down, and spend a couple hours letting the idea grow out. You've finished! You are about to publish your freshly-grown post on the web when you get *that sinking feeling* in your gut: something's missing…

You scan over the post. Is anything wrong? Nope: argument is solid, formatting is A-Ok. But wait… what's that?

Where are all the links?

No [links][1], no [game][2]. (It is the *web* you are publishing to, after all.) Sighing, you stumble around with [Google][6] for a bit before giving up. Maybe some other time. If only there were a better way…

## Finding links sucks

It's probably a lack of [discipline][4], but keeping track of the references principally responsible for each little bit of text I write is *hard*. I have so many linkless posts waiting to be published: I could go ahead and publish them as-is, but by doing so I feel as though I'd be treating you, dear reader, unjustly.

It's not that I don't know what I want to link to. Most of the posts I write are responses to things I've read. I know what I want to link to, but I don't want to lose flow to hunt down a link while writing. I could go back at the end and insert links retrospectively, but it takes more time than I'd like to hop between browser, editor, and what I was thinking about at that point. It would be nice if I could mark links as I write, while still being able to refine each link in-editor as I edit and revise later.

I wish there was a faster way to link the posts I write. I want to [write about things that are happening *now*][7]. If I wait a week to hunt down references, things will have already moved on. Writing consistently requires rhythm, and nothing interrupts a consistent rhythm more effectively than haphazardly tumbling down [internet rabbit-holes][9] while in search of the perfect link.

In a perfect world, I imagine a little robot reading everything alongside me. He records the references and key ideas of each piece. After I write a post, he'd comb through my post sentence by sentence, linking every important phrase to its source. Now, I haven't quite done this, but this morning I prototyped a quick-and-dirty [first-order approximation][10], which should hopefully let me link stuff with greater ease.

## Prototyping Linkoln

*Linkoln*, no pun intended, is the name of my robotic companion. It's a short hacky [Python][11] script I wrote this morning, which I tested against finding links for this post. It's far from perfect, but it fills the need I had and has validated building a fuller prototype. 

Linkoln parses [wikilinks][12] out of a [markdown][13] document, and searches the [world wide web][14] to find a [hyperlink][15] for each one. To limit the scope of this prototype, Linkoln just uses a full-web search engine. In the future, I plan to run it against my browser history, a database of articles I have saved, blogs I trust, and so on, only resorting to the public web as a last resort.

Here's what Linkoln does, on a more concrete level. Given a Markdown post with wikilinks:

``` 
# Thoughts on Rust

[[programming language:Rust]] is a [[systems programming language]] bootstrapped from [[rust prehistory|OCaml]].
```

Linkoln normalizes the post, replacing each wikilink with the best corresponding hyperlink it could find:

```
# Thoughts on Rust

[Rust][1] is a [systems programming language][2] bootstrapped from [OCaml][3].

[1]: https://www.rust-lang.org
[2]: https://en.wikipedia.org/wiki/System_programming_language
[3]: https://github.com/graydon/rust-prehistory
```

Through pragmatic experimentation while writing this post, Linkoln supports three types of wikilinks:

1. Literal Links: `[[text]]` 
2. Query Links: `[[query|text]]`
3. Context Links: `[[context:text]]`

Here's a quick breakdown of each link type:

*Literal Links* search the given query and include the query verbatim. For example:

```
[[GitHub]]
```

Searches "GitHub" and becomes:

```
[GitHub][0]

[0]: https://github.com
```

*Query Links* let you use a different query than the text of the link. For example:

```
[[notes on a smaller rust|Rust *could* be easier]]
```

Searches "notes on a smaller rust" and becomes:

```
[Rust *could* be easier][0]

[0]: https://boats.gitlab.io/blog/posts/notes-on-a-smaller-rust
```

*Context Links* are useful when qualifying a search for an otherwise generic term. The two halves are concatenated to form the entire query:

```
[[wikipedia language:Python]]
```

Searches "wikipedia language Python" and becomes:

```
[Python][0]

[0]: https://en.wikipedia.org/wiki/Python_(programming_language)
```

While the above examples link to basic popular pages, it's not much harder to embed longer queries inline to find exactly the reference you are looking for.

I've been enjoying fiddling around with Linkoln. Adding a link to a post while in the middle writing only requires wrapping the revelant text with a couple of brackets. Later, as I proof-read and vet the post, I can refine queries to make sure text links to the page I intended. I can keep my link-searching activity in one place (the buffer I'm writing the article in) and let Linkoln take care of the rest.

## Low-hanging fruit

<details>
<summary>The script itself is… pretty dumb.</summary>

But, since you asked for it, here it is:

```python
#!/usr/bin/python3

# Linkoln by Anima Omnium
# Dedicated to the Public Domain

# Just standard library for portability 
import sys
import urllib.request
import time

# Input from file, output to stdout
# Suggested usage:
# python linkoln.py INPUT.md > OUTPUT.md

# Read input file name
if len(sys.argv) != 2:
  print("Usage: linkoln FILE")
  exit(1)

# Read file
FILE = sys.argv[1]
with open(FILE, "r") as fin:
  INPUT = fin.read()

# Link numbering start
OFFSET = 1

# Ignore wikilinks in code, headings, frontmatter
IGNORE = [
  ("```", "```"),
  ("#", "\n"),
  ("`", "`"),
  ("+++", "+++"),
]

# Syntax for links
LINK_OPEN = "[["
LINK_CLOSE = "]]"
LINK_QUERY = "|"
LINK_CONTEXT = ":"

# Parser state enum
S_IGNORE = 0
S_SCANIN = 1
S_EATING = 2

# Initialize parser
state = S_SCANIN
rem = INPUT
closing = ""
inside = ""
colophon = []

# Skip amt chars
def skip(r, amt):
  return r[amt:]

# Skip amt, echo what was skipped
def eat(r, amt):
  print(r[:amt], end="")
  return skip(r, amt)

# Check r prefix matches against
def check(r, against):
  return r[:len(against)] == against

# Parse inside wikilink
def extract(inside):
  (link, text) = (inside, inside)
  if LINK_QUERY in inside:
    (link, text) = inside.split(LINK_QUERY)
  elif LINK_CONTEXT in inside:
    (link, text) = inside.split(LINK_CONTEXT)
    link = f"{link} {text}"
  return (link, text)

# Echo formatted link
def emit_link(entry):
  (num, inside) = entry
  (_, inside) = extract(inside)
  print(f"[{inside}][{num}]", end="")

# Echo formatted link reference
def emit_entry(entry):
  (num, inside) = entry
  (inside, _) = extract(inside)
  inside = google_it(inside)
  print(f"[{num}]: {inside}")

# Locate link matching given query
def google_it(query):
  # Dumbest most fragile hack ever
  quoted = urllib.parse.quote(query, safe='')
  # Don't hammer friends at DuckDuckGo
  time.sleep(0.5)
  try:
    contents = urllib.request.urlopen(f"https://lite.duckduckgo.com/lite/search&q={quoted}").read()
    # Parsing html is easy
    top_result = contents.split(b"link-text")[1]
    top_link = top_result.split(b">")[1].split(b"<")[0]
  except:
    # Leave for human to fix 
    return f"ERROR: {query}"
  return "https://" + top_link.decode("utf-8")

# State machine driving loop
while rem != "":
  # Scanning for next link or comment 
  if state == S_SCANIN:
    for (open, close) in IGNORE:
      try:
        if check(rem, open):
          rem = eat(rem, len(open))
          closing = close
          state = S_IGNORE
          break
      except:
        pass
    if state == S_IGNORE:
      continue
    try:
      if check(rem, LINK_OPEN):
        rem = skip(rem, len(LINK_OPEN))
        inside = ""
        state = S_EATING
        continue
    except:
      pass
    rem = eat(rem, 1)

  # Eating contents of wikilink
  elif state == S_EATING:
    if check(rem, LINK_CLOSE):
      rem = skip(rem, len(LINK_CLOSE))
      entry = (len(colophon) + OFFSET, inside)
      emit_link(entry)
      colophon.append(entry)
      state = S_SCANIN
    else:
      inside = inside + rem[:1]
      rem = skip(rem, 1)

  # Ignoring contents of comments
  elif state == S_IGNORE:
    if check(rem, closing):
      rem = eat(rem, len(closing))
      state = S_SCANIN
    else:
      rem = eat(rem, 1)

  # Frick your computer is on fire
  else:
    assert false, "Invalid state"

# Google all the queries
print()
for entry in colophon:
  emit_entry(entry)
```

</details>

Linkoln, as rendered above, is far from perfect. In its original form, Linkoln did not search the web for links, but rather placed the query below the main text, quickly converting wikilinked markdown to a normalized reference format for later manual linking:

```
This is *not* [[CommonMark-flavored:Markdown]]
```

became:

```
This is *not* [Markdown][0]

[0]: CommonMark-flavored Markdown
```

After this, I got curiois and experimented with various kinds of queries, with different query types (e.g. web, reading list, history, etc.) disambiguated using standard DDG `bang!notation`, but decided to limit this post to web search to avoid steering the conversation into the technical weeds.

## Are links dead?

At this point, it should be obvious that Linkoln is, by no means, a silver bullet. It's not intended to be one. The point of this post is decidedly *not* to highlight some gimmicky throwaway python script. Instead, I hope to start a discussion on the importance of building and using tools to improve the process of writing for the web.

Despite Linkoln's meta-ironic reliance on them, the need for web-wide search engines could be said to be a failure in the organizational structure of the web. As the proliferation of [GPT-4][19]-like tools (some of which can be [run in your browser][22]) lead to the crystallization of the [Dead Internet][20], how will we find a single live page in a soup of procedurally generated web-gloop?

Perhaps links *are* dead. Why link when ChatGPT can explain? Why post and upvote when [attention-maximizing algorithms][21] can recommend? Perhaps we're at the end of the old-web, now a corner relegated to hobbyists, as all text ever written is absorbed in a single differentiable scream.

For us hobbyists, however, perhaps links *aren't* dead: they're vitally important. Links lend authority. Trace a hop away from your homepage, maybe two: can you still trust what you read?

So in this deluge, link *more*, not less. Don't link to stuff you don't trust. Black-boxes that spit out links, like Linkoln, will only become more common in the future. With that in mind, when using a tool like Linkoln—script, chatbot, or otherwise—make sure you *thoroughly* vet what you're linking to. Remember that you are not *just* linking, but building a *Web of Trust*. Links need to be a *signal* that cuts through the noise, not vice-versa.

Links aren't dead. And, despite the best efforts of the incoming *Content Deluge*, neither is the old web. Keep the dream of an open web alive: 

Keep on linking! 

[0]: https://news.ycombinator.com/item?id=35599363
[1]: https://www.w3.org/TR/html401/struct/links.html
[2]: https://www.w3.org/Provider/Style/URI
[3]: https://neovim.io
[4]: https://www.zotero.org
[5]: https://en.wikipedia.org/wiki/Hyperlink
[6]: https://duckduckgo.com
[7]: https://simonwillison.net/2023/Apr/16/web-llm/
[8]: https://blog.codinghorror.com/how-to-achieve-ultimate-blog-success-in-one-easy-step/
[9]: https://en.m.wikipedia.org/wiki/Wikipedia:Unusual_articles
[10]: https://en.wikipedia.org/wiki/Order_of_approximation
[11]: https://www.python.org
[12]: https://en.wikipedia.org/wiki/Help:Link
[13]: https://commonmark.org/help/
[14]: https://en.wikipedia.org/wiki/World_Wide_Web
[15]: https://en.wikipedia.org/wiki/Hyperlink
[16]: https://duckduckgo.com
[17]: https://en.wikipedia.org/wiki/Concatenation
[19]: https://openai.com/research/gpt-4
[20]: https://www.theatlantic.com/technology/archive/2021/08/dead-internet-theory-wrong-but-feels-true/619937/
[21]: https://gantry.io/blog/papers-to-know-20230110
[22]: https://mlc.ai/web-llm/
