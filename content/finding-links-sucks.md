+++
title = "Finding Links Sucks"
date = 2023-03-30
draft = true
+++

You've spent hours absorbing [[hacker news|incoming]] [[lobste.rs|bitstreams]], and a [[what is a digital garden|seed of an idea]] has germinated in your mind. You fire up your [[neovim|favorite text editor]], plant it down, and spend a couple hours letting the idea grow out. You've finished! You are about to publish your freshly-grown bitstream on the [[site:youtube.com let's go surfing on the internet 90s meme|interwebs]] when you get *that sinking feeling* in your gut: something's [[where's Rachel batman meme site:youtube.com|missing]]…

You scan over the post. Is anything wrong? Nope: argument is solid, formatting is A-Ok: [[wikipedia history of!oll korrect]]. But wait… what's that?

Where are all the links?

No [[wikipedia hyperlinks|links]], no game. It is the inter*webs* after all. Sighing, you stumble around with [[duckduckgo|Google]] for a bit before giving up. Maybe some other time. If only there were a better way…

Finding Links Sucks. 

It may be my lack of discipline, but keeping track of the references principally responsible for each little bit of text I write is *hard*. I have so many linkless posts waiting to be published. I could just publish them as-is, but by doing so I feel as though I'd be treating you, dear reader, unjustly.

I wish there was a faster way to link stuff. I want to [[Simon Willson Prompt injection what’s the worst that can happen
|write about things that are happening *now*]]. If I wait a week to hunt down references, things will have already moved on. [[Jeff Atwood on blogging and!Writing consistently]] requires rhythm, and nothing interrupts a consistent rhythm more effectively than haphazardly tumbling down [[wikipedia list of rabbit-holes on wikipedia|internet rabbit-holes]].

In a perfect world, I imagine a little companion reading everything alongside me. He records the references and key ideas of each piece. After I write a post, he'd comb through my post sentence by sentence, linking every important phrase to its source. Now, I haven't quite done this, but I've developed a quick-and-dirty [[wikipedia!first-order approximation]], which should hopefully let me link stuff with greater ease. Let's dive in.

*Linkoln*, no pun intended, is the name of my companion. It's a short super-hacky dumb [[Language!Python]] script I wrote this morning, so I could link and publish this post. All links in this post are Linkoln's fault, not mine.

Linkoln parses [[what are!wikilinks]] out of a [[commonmark spec!markdown]] document, and searches the [[wikipedia!world wide web]] to find a [[wikipedia!hyperlink]] for each one.

Here's what Linkoln does, on a more concrete level. Given a Markdown post with wikilinks:

``` 
# Thoughts on Rust

[[programming language!Rust]] is a [[systems programming language]] developed by [[Dreamwith Studios Blog "Rust"|Graydon Hoare]].
```

Linkoln normalizes the post, replacing each wikilink with the best corresponding hyperlink it could find on the web, using [[duckduckgo|Google]]:

```
```

Linkoln supports three types of wikilinks:

1. `[[literal]]` — Literal Links
2. `[[query|text]]` — Query Links
3. `[[query!concatenated]]` — Concatenated Links

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

*Concatenated Links* are useful when qualifying a search for an otherwise generic term. The two halves are [[wikipedia!concatenated]] to form the entire query:

```
[[wikipedia language!Python]]
```

Searches "wikipedia language Python" and becomes:

```
[Python][0]

[0]: https://en.wikipedia.org/wiki/Python_(programming_language)
```

Linkoln is really nice: I can keep all my link-searching activity in one place. Once I've finished a post, I can bracket off terms to link, qualifying searches as necessary with my advanced [[urban dictionary!google-foo]].

<details>
<summary>The script itself is, well, a little dumb…</summary>

But since you asked for it, here it is:

```python
# Linkoln by Anima Omnium
# Dedicated to the Public Domain
# Not proud of it, but it's the dumbest thing that works

# Hardcoded
with open("input.md", "r") as fin:
  INPUT = fin.read()

# Start link numbering here
OFFSET = 1

# No links in code or headings
IGNORE = [
  ("```", "```"),
  ("#", "\n"),
  ("`", "`"),
]

LINK_OPEN = "[["
LINK_CLOSE = "]]"

# Parser state enum
S_IGNORE = 0
S_SCANIN = 1
S_EATING = 2

state = S_SCANIN
rem = INPUT

closing = ""
inside = ""
colophon = []

def skip(r, amt):
  return r[amt:]

def eat(r, amt):
  print(r[:amt], end="")
  return skip(r, amt)

def check(r, against):
  return r[:len(against)] == against

def extract(inside):
  (link, text) = (inside, inside)
  if "|" in inside:
    (link, text) = inside.split("|")
  elif "!" in inside:
    (link, text) = inside.split("!")
    link = f"{link} {text}"
  return (link, text)

def emit_link(entry):
  (num, inside) = entry
  (_, inside) = extract(inside)
  print(f"[{inside}][{num}]", end="")

def emit_entry(entry):
  (num, inside) = entry
  (inside, _) = extract(inside)
  inside = google_it(inside)
  print(f"[{num}]: {inside}")

def google_it(query):
  # Dumbest most fragile hack ever
  import urllib.request
  query = urllib.parse.quote(query, safe='')
  contents = urllib.request.urlopen(f"https://lite.duckduckgo.com/lite/search&q={query}").read()
  top_result = contents.split(b"link-text")[1]
  top_link = top_result.split(b">")[1].split(b"<")[0]
  return "https://" + top_link.decode("utf-8")

# State machine driving loop
while rem != "":
  # print(state, rem.split("\n")[0])
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

  elif state == S_IGNORE:
    if check(rem, closing):
      rem = eat(rem, len(closing))
      state = S_SCANIN
    else:
      rem = eat(rem, 1)

  else:
    assert false, "Invalid state"

# Google all the links
print()
for entry in colophon:
  emit_entry(entry)
```

And there you have it. What you do with Linkoln is up to you.

</summary>

TODO…
