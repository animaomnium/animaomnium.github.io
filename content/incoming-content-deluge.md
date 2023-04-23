+++
title = "Incoming Content Deluge"
date = 2023-04-23
draft = true
+++

*We don’t know what happens when the cost of content generation drops to zero, but we’re about to find out…*

## The dawn of GPT

*NB: Post was drafted on 2023-03-12, the day before the release of GPT-4.*

It was an unusually warm day in November of 2019 when I first stumbled upon [GPT-2][1]. It was a different world then—pre-pandemic, even—and there was a certain buzz in the air about the future that was unfolding.

OpenAI, at this time, still had a reputation for being, well, *open*. It wasn’t the ClosedAPI it is today. There was a time when the vast majority of OpenAI’s work was [open-sourced][2]: this built at least a baseline of trust.

It was surprising, then, that when GPT-2 was announced, it was not released to the public. OpenAI leaned heavily into the trust they had accumulated, and reassured the general public that delaying release was indeed a necessary-yet-unfortunate step, all in the name of [safety][3]. GPT-2 marked a turning point in OpenAI’s *modus operandi*, but this post is about LLMs; let’s leave OpenAI for another time.

Jump to March of 2023. Since GPT-2, language models have gone from bumbling drunk librarians to prodigal writers whose only flaw, perhaps, is a lack of grounding in reality (spooky foreshadowing). GPT-3 has shown that OpenAI’s initial safety concerns haven’t stopped them from pursuing further development (and [profit][4]) in the space.

## The race to scale…

At risk of repeating an explanation that has been given a thousand times, [GPT][5] stands for *General Procedural Transformer*. "Transformer" is the key word here: a *Transformer* is an [autoregressive][6] model trained on sequence prediction. The key innovation of the Transformer is the introduction of [multi-headed attention][7], which architecture is the first to practically capture the rich causal dependencies commonly found when modeling text.

A [race to scale models][8] had begun: it was thought that the more parameters, the better performance. Transformers have horrible quadratic scaling properties with respect to the size of the attention window, so much research was performed to deliver ever-larger models. In the end, though, we found that under the current paradigm it was not the sheer *scale* of the model that has the largest effect on model performance, but rather the volume of *data* pushed through the model while training.

## …is flipped on its head

With the release of Google’s [Chinchilla][9], the unknown relationship between model size, data, and performance was finally pinned down. Chinchilla proved, against the prevailing wisdom of the time, that better models needed more *data*, not more *parameters*. Collecting high-quality data is vastly more difficult than merely turning up the parameter knob. More data-efficient architectures were needed:

Enter [LLaMA][10].

## LLaMA runs locally

LLaMA (Large Language Model Meta AI) is a set of [foundation models][11] released by Facebook AI Research (FAIR). LLaMA is the first language model with performance "similar" to GPT-3 small enough to *run locally*. Although FAIR originally planned a limited rollout to trusted organizations and researchers, in an ironic twist of fate, the [model parameters were leaked][12], and the cat is now out of the bag.

Georgi Gerganov ([ggerganov][13]) has a reputation for packaging up released models so that they can be run by anyone possessing free time and a little grit. When the weights for [Whisper][14] (OpenAI’s speech transcription AI) were released, ggerganov developed [whisper.cpp][15], a self-contained program allowing anyone to run the model locally. With the release of LLaMA, [ggernov/llama.cpp][16] followed shortly thereafter. Now anyone with access to a decent GPU or M1 Macbook can run LLaMA locally.

Willison, in his post *[LLMs are having a Stable Diffusion Moment][17]* aptly comments that running LLaMA locally is more of a proof-of-concept than anything else. He was, however, able to get the 13B parameter model, with performance similar to GPT-3, running on his machine. With much faith in EleutherAI &co., I have no doubt that LLaMA—much after the pattern of Stable Diffusion before it—will soon be replicated and improved upon in an unceasing viral cycle.

A little at first, then all at once, Pandora’s box is now open. What happens when anyone can run a LLM on their laptop? On their [phone][18]? This is what keeps me up at night.

With this oversized introduction out of the way, let’s address the implications of the original question:

What happens when the cost of content generation drops to zero?

## A LLaMA for everything

First, I should clarify that by "content," I mean a lot more than just Text (LLaMA) and Images (Stable Diffusion). It would be silly to believe that there’s *not* a team of researchers at Google scraping YouTube trying to do the same for video. How long until GitHub releases *CodeMonkey*, “a one-click solution for turning issues into PRs”? We don’t know, but probably [sooner][19] than anyone expects.

The central hypothesis of this post, containing the points most amenable to discussion, is as follows:

1. Individuals are able to shape the realities they inhabit through experiences derived from the content they consume. When content is scarce, individuals share similar experiences, and inhabit similar realities. 

2. As the cost of content generation drops towards zero, content becomes a post-scarcity good, which may be tailored to each individual's taste. When content is post-scarce, the breadth of experience increases, as does the diversity of the realities each individual may inhabit.

3. This *fraying of reality*, so to speak, will make it much easier for individuals to be radicalized, believe false-yet-self-coherent narratives, feed infohazard-based addictions, and so on. This has been a long-time coming. Indeed, it is already happening today.

Let's break this argument down, one point at a time.

## Experience defines reality

> Individuals are able to shape the realities they inhabit through experiences derived from the content they consume.

It's first important to establish that the experiences people have define the *reality* they inhabit. In this context, I'm defining the word "reality" to describe, abstractly, the way an individual "makes sense of the world", or concretely, "the set of beliefs people hold against their subjective experiences". People with overlapping beliefs inhabit overlapping realities; it is only within this overlap that ideas can be clearly transmitted, but more on that later.

We can't help but process new experiences through the lens of old ones. It is only when we encounter a new experience that *does not* match our existing reality that we reweigh the set of beliefs we hold. 

> When content is scarce, individuals share similar experiences, and inhabit similar realities. 

Increasingly, for better or (likely) worse, more and more of the experiences we have happen online. Most people can navigate their desktop or homescreen about as well as they can navigate their own home. In terms of the mental energy used to maintain them, digital places are not any less *real* (using the above definition of *reality*) than the physical spaces we inhabit.

Digital experiences generally revolve around the production or consumption of *content*. Pre-GPT, there was a natural limit to how much digital content any one individual could produce. People, unlike tensors, can not be sliced up and run in parallel. What happens when any experience is an API call away?

## Content post-scarcity

A few years ago, Tim Urban published a [popular post on AGI and the future][20]. In his post, there's a graph showing *super-exponential growth*: the curve remains basically flat, until it goes *straight vertical*. There's a stick figure standing on the flat part of the curve, just before it goes vertical, seemingly unaware. "Seems like a pretty intense place to be standing", right?

> As the cost of content generation drops towards zero, content becomes a post-scarcity good, which may be tailored to each individual's taste.

Although Urban was using this graph to denote runaway intelligence in the context of self-improving AI, by adopting a lens more appropriate for this article, this curve could be said to represent "the amount of content reachable by an individual on the internet increasing over time". We're still standing on flat ground for now. Yet a few years from now, someone will look back at us and quip, "2023, eh? Seems like a pretty intense place to be standing."

We are standing at the edge of a *Cambrian Explosion* with respect to the depth and breadth of the type of content people are able to create and consume. Three years ago, had you told me that it took [4 Gigabytes to Draw Anything][21], I would have laughed and asked you to clarify. Now, when people [flirt][22] with the eventual reality of, say, procedurally generated Netflix, I laugh a little more nervously.

> When content is post-scarce, the breadth of experience increases, as does the diversity of the realities each individual may inhabit.

When content becomes a post-scarcity good, anything you can imagine can become your reality. This future, if true, is as terrifying as it sounds. 

## The fraying of reality

You've finally reached the section with the scary title. Dont worry, it's not as bad as it sounds.

> This *fraying of reality*, so to speak, will make it much easier for individuals to be radicalized, believe false-yet-self-coherent narratives, feed infohazard-based addictions, and so on.

People with overlapping beliefs have shared vocabulary of experiences: they inhabit similar realities because the lenses they use to process new experiences are mostly the same. In the absence of shared lenses, however, one's perceptions of events become distorted relative to another's. Without a shared vocabulary of experiences, it's not always easy to communicate what you intend to convey. Quite simply, communication breaks down when people use the same words to mean different things. 

For this reason, it is only within this overlap of realities that ideas can be clearly transmitted. When anyone can generate, anything they'd like to experience *on demand*, there is a risk of people "becoming lost in their own realities". We will be left with a *Milquetoast Culture*: The shared plains of collective consciousness ravaged by attention-grabbing yet senile memetic tofu, each thought allocated to the highest bidder.

Those who do not fall prey to the infohazards left to roam freely will have carved out their own protective bubbles. Within such a bubble, it will be easy for one to reinforce their existing interpretation of reality. When any argument against a given belief can be instantly countered with an essay, an infographic, or an automatically-generated award-winning documentary film, where does that leave us?

> This *fraying of reality* has been a long-time coming. Indeed, it is already happening today.

On YouTube alone, more video is uploaded in an day than a human could possibly consume in their entire lifetime. A lot of this content, however, is subjectively garbage: how do we filter through the noise to find a diamond in the rough?

By grouping people by their interests, we can amplify any diamonds found. Indeed, people are *already* grouped by their interests, whether by algorithm or self-sortedly. 

As we read and write to shared communities, we develop a shared vocabulary, and use that vocabulary to make sense of the universe. To an outsider, this shared vocabulary may be nonsensical at best, or easily misinterpretable at worst.

We have already seen countless breakdowns in communication between communities with different vocabularies for the same terms. Perhaps this is most apparent in the political sphere, which (cynically-speaking) has always been about shaping interpretations of reality through the clever use of words. We need to be more flexible when adopting another's viewpoint: we need to criticize our own ideas to see where they break down, and avoid getting defensive when others do the same. There will be people who disagree with this post, and this is my hope: the future this post portrays is bleak, and I could not be happier to be wrong. 

## Picking up the pieces

So where does that leave us?

Frankly, I remain cautiously optimistic. The technology for a true *Content Deluge* is not quite here yet. In the meantime, I believe the *capacity* needed to develop the tools it will take to moderate the incoming deluge exists. Moderation has always been a hard problem, but increasing outside pressure is only going to make the existing systems we have to moderate content more resilient. 

Unlike GPT, as people, we all share the reality of *human experience*. This is a reality that can't be generated: it is a vocabulary we all share. I hope that the fundamental human need for *real* social connection—outside of the hollow digital realities we define—will drive people to seek more real-world friendships than the number of digital ones they prompt into existence. When they do, I hope that these friends look to expand the overlap between their respective vocabularies, working towards bridging the gap between their shared realities.

This argument presented in this post has at least one fatal flaw (among many): it assumes that the path of "getting lost in a private fractured reality" is the path most people will elect to follow. In practice, however, I think the novelty will soon wear off: most people will get sick of said *Content Deluge* after a while. There are only so many procedurally generated landscapes the eyes can handle before the body wants to step away and experience *real* nature. The curse of those forced to inhabit a fractured reality will likely be relegated to those who consider themselves members of the *[Eternally Online][24]*. I am grateful to not be counted among their ranks.

With that in mind, as you reach the end of this post, now might be a good time to stretch, take a break, and go outside.

I promise *Crash Lime* will be back to its regular programming in my next post. As much as I love waxing philosophical, I think it's *finally* time we break down some more code! 

In my next post, I hope to analyze the *[Compute Shaders][25] used in [Forma][26]*, or perhaps explain the elegance of the inversions of control present in *[Steven Witten's][27] excellent [Use.GPU][28]*. That's all for today, though…

Until next time!

[1]: https://openai.com/research/gpt-2-1-5b-release
[2]: https://github.com/openai/gym
[3]: https://www.scu.edu/ethics/focus-areas/technology-ethics/resources/open-source-ai-to-release-or-not-to-release-the-gpt-2-synthetic-text-generator/
[4]: https://openai.com/blog/openai-lp/
[5]: https://arxiv.org/abs/2005.14165
[6]: https://deepgenerativemodels.github.io/notes/autoregressive
[7]: https://arxiv.org/abs/1706.03762
[8]: http://www.incompleteideas.net/IncIdeas/BitterLesson.html
[9]: https://arxiv.org/abs/2203.15556
[10]: https://ai.facebook.com/blog/large-language-model-llama-meta-ai/
[11]: https://hai.stanford.edu/news/reflections-foundation-models
[12]: https://github.com/facebookresearch/llama/pull/73
[13]: https://github.com/ggerganov
[14]: https://openai.com/research/whisper
[15]: https://github.com/ggerganov/whisper.cpp
[16]: https://github.com/ggerganov/llama.cpp
[17]: https://simonwillison.net/2023/Mar/11/llama/
[18]: https://twitter.com/rgerganov/status/1635604465603473408
[19]: https://github.com/features/preview/copilot-x
[20]: https://waitbutwhy.com/2015/01/artificial-intelligence-revolution-1.html
[21]: https://andys.page/posts/how-to-draw/
[22]: https://research.nvidia.com/labs/toronto-ai/VideoLDM/
[24]: https://www.palladiummag.com/2022/11/04/i-do-not-want-to-be-an-internet-person/
[25]: https://www.w3.org/TR/WGSL/
[26]: https://github.com/google/forma
[27]: https://acko.net/about/
[28]: https://usegpu.live
