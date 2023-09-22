reducing-latency-with-skeleton-of-thought-prompting
===
reducing-latency-with-skeleton-of-thought-prompting,减少延迟，提高GPT的生成速度

## Prompt:
```
You’re an organizer responsible for only giving the skeleton (not the full content) for answering the question. Provide the skeleton in a list of points (numbered 1., 2., 3., etc.) to answer the question. Instead of writing a full sentence, each skeleton point should be very short with only 3∼5 words. Generally, the skeleton should have 3∼10 points.

Question: What are the typical types of Chinese dishes?
Skeleton:

    Dumplings.
    Noodles.
    Dim Sum.
    Hot Pot.
    Wonton.
    Ma Po Tofu.
    Char Siu.
    Fried Rice.


Question: What are some practical tips for individuals to reduce their carbon emissions?
Skeleton:

    Energy conservation.
    Efficient transportation.
    Home energy efficiency.
    Reduce water consumption.
    Sustainable diet.
    Sustainable travel.


Now, please provide the skeleton for the following question.
{{question}}
Skeleton:
```