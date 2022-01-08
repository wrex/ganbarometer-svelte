# Ruminations

## The GanbarOmeter gauge

> The GanbarOmeter tells you whether to speed up or slow down doing _lessons_.

### Design goals

- The GanbarOmeter should be useful for users at any level. When conflicts
  arise, operation should target beginning to intermediate users (levels 5 to
  50). Users in the first few levels are still figuring out the basics, and
  users above level 50 have already figured out what works for them. Note, too,
  that there are **many** more early-stage than late-stage users (exponential
  decay).

  Notes:

  - In particular, level-60 users won't have any more lessons to perform!
    (Excepting new items that Wanikani adds). It would be nice if the
    GanbarOmeter could be configured to display something useful for level-60
    users, but they won't be doing fewer/more _lessons_ no matter what it says.

  - Users below level 10 or so will have few items if any in later stages, and
    few assignments if any scheduled more than two weeks out.

- It must support users with different preferences regarding desired levels of time
  and effort.

  Notes:

  - Some users want to work hard: lots of reviews-per-day with many unfamiliar
    items.

  - Others want it to feel easier: fewer reviews-per-day with a lower percentage
    of unfamiliar items.

  - Some users perform reviews multiple times per day, others only once daily or
    a few times a week.

- It should display a higher value (=> more effort required / slow down) as the
  distribution of assignments shifts toward earlier SRS stages (and vice versa).
  This indicates a higher percentage of less-familiar (more difficult) items.

- It should be able to support most "common wisdom" algorithms currently in use:

  - Keep the number of "apprentice" (stage 1-4) items around 100.

  - Keep apprentice + guru/10 around 150.

  - Rex's algorithm: "go slower when you have 10 or more kanji in stages 1 or
    2."

  - <span style="color: red">Kumi's algorithm: "keep the 'estimated daily reviews' number at a desired target."</span>

- <span style="color: red">It should _also_ display a higher value if the expected number of daily
  reviews increases (indicating a higher _workload_, not necessarily more
  difficult reviews).</span>

- It should allow different calculations/algorithms based on user settings
  without installing a new version of the script. This is why things are
  currently specified as "weights".

- New versions of the script should convert old user settings whenever possible
  instead of reverting to defaults (especially ganbarometer settings).

### Available data

Currently, the GanbarOmeter accomplishes its mission **solely** by analyzing the queue of upcoming
[assignments](https://docs.api.wanikani.com/20170710/#assignments).

Assignments have three attributes of primary interest:

1. The current `srs_stage` (controlling when it will be rescheduled based on
   correct/incorrect answers).

2. The `subject_type` (radical, kanji, or vocabulary).

3. The `availabile_at` date (when it will become available in a user's review
   queue).

A previous version of the GanbarOmeter also looked at the percentage of _reviews_
answered correctly in recent sessions, displaying a higher value as a higher
percentage of items were answered incorrectly.

### Thoughts and conclusions

- **The GanbarOmeter attempts to quantify both the _amount_ of reviews a user
  must perform each day (the workload) as well as the _character_ of that workload (a weighting
  based on the relative percentage of new/unfamiliar or incorrectly answered
  items).** This is why it's a unit-less "magic" number.

- Currently, it lets the user "weight" r/k/v in stages1-2, items in stages3-4
  (late apprentice),
  items in stages5-6 (guru), stage7 (master), and stage8 (enlightened). It
  probably makes the most sense to break out for each of the 8 stages
  explicitly.

- In addition to analyzing assignments based on SRS stage an type, I should
  allow users to consider **when** assignments become available.

  I could look at `available_at` directly (when things are currently
  scheduled). This presumes (incorrectly) that the distribution of stages stays
  the same.

  Alternately, I could base it on probabilities per stage (a'la Kumirei's Expected
  Daily Reviews calculation):

  - Each stage has a scheduling interval, correct answers will set
    `available_at` to some time in the future : 1 = 0.167
    days, 2 = 0.333 days, 3 = 1 day, 4 = 2 days, 5 = 7 days, 6 = 14 days, 7 = 30
    days, 8 = 120 days.

  - Each stage can also be assigned a "probability of correct answer".

# Note for Kumi

[quote="Rrwrex, post:270, topic:53579"]
I may go to a complete matrix of 24 possible weights
[/quote]

This is primarily intended for @Kumirei :

I'm coming to the alarming conclusion that the GanbarOmeter gauge **might** be trying to display something awfully close to what your (infinitely simpler!) [Expected Daily Reviews](https://community.wanikani.com/t/userscript-expected-daily-reviews/29206) script displays.

I've re-written your algorithm to calculate "Expected Daily Reviews" as follows:

```javascript
const srs_interval = [0, 0.5, 1, 1, 2, 7, 14, 30, 120, 0];

const reviewingStages = [1, 2, 3, 4, 5, 6, 7, 8];

const expectedDailyReviews = reviewingStages
  .map((stage) => counts[stage] / srs_interval[stage])
  .reduce((acc, count) => (acc += count));
```

If I understand correctly, the `srs_interval[]` array effectively contains the number of reviews that items in each stage are likely to contribute to any given daily review queue.

- Each item in stage 1 will likely contribute 1/0.5 = 2 reviews
- Each item in stage 2 will likely contribute 1/1 reviews
- Each item in stage 3 will likely contribute 1/1 reviews
- Each item in stage 4 will likely contribute 1/2 reviews
- Each item in stage 5 will likely contribute 1/7 reviews
- Each item in stage 6 will likely contribute 1/14 reviews
- Each item in stage 7 will likely contribute 1/30 reviews
- Each item in stage 8 will likely contribute 1/120 reviews

These numbers are very close to the scheduling interval for progressing (correctly answered) items.

I presume that `srs_schedule[1]` is 0.5 and `srs_schedule[2]` is 1 (instead of 1/6 and 1/3, respectively) because few of us perform more than two review sessions in a day, so schedules of less than 12 hours are kinda squashed?

Regardless, I've two remaining concerns with displaying "expected daily reviews" directly in the GanbarOmeter:

1. I'm still hung up on my desire to "go slower than usual if I've got a lot of kanji in stages 1 or 2 because they are harder (for me)".

2. If I don't do any reviews for a day or three, EDR doesn't change because the distribution of items in my review queue doesn't change. If I only do a few each day, the distribution will change only slightly. I'd definitely to account for slacking off! (This is also a concern with my existing weight-based algorithm, of course. :-) )

### Concern #1 (probability of correct answers)

I'd like to improve (or at least complicate!) your algorithm slightly to account for the probability of answering correctly. That is, your algorithm effectively reschedules each item assuming it progresses to the next stage.

I'd like to account for the possibility of _incorrect_ answers causing an item to be rescheduled sooner than it would otherwise.

Assume the user has provided 24 correct answer probabilities for
radicals/kanji/vocabulary in each stage. The default value should be 1.0, lower
for items that the user finds particularly difficult (I'd probably set it to 0.7
for kanji in stages 1 or 2).

```javascript
// Scheduling intervals for correct/incorrect answers
const srs_correct_i = [0, 0.167, 0.333, 1, 2, 7, 14, 30, 120, 0];
const srs_incorrect_i = [0, 0.5, 0.5, 0.5, 1, 1, 2, 7, 14, 30, 0];

const reviewingStages = [1, 2, 3, 4, 5, 6, 7, 8];

const expectedDailyRadicals = reviewingStages
  .map(
    (stage) =>
      (r_probability[stage] * radical_counts[stage]) / srs_correct_i[stage] +
      ((1 - r_probability[stage]) * radical_counts[stage]) /
        srs_incorrect_i[stage]
  )
  .reduce((acc, count) => (acc += count));

const expectedDailyKanji = reviewingStages
  .map(
    (stage) =>
      (k_probability[stage] * kanji_counts[stage]) / srs_correct_i[stage] +
      ((1 - k_probability[stage]) * kanji_counts[stage]) /
        srs_incorrect_i[stage]
  )
  .reduce((acc, count) => (acc += count));

const expectedDailyVocab = reviewingStages
  .map(
    (stage) =>
      (v_probability[stage] * vocab_counts[stage]) / srs_correct_i[stage] +
      ((1 - v_probability[stage]) * vocab_counts[stage]) /
        srs_incorrect_i[stage]
  )
  .reduce((acc, count) => (acc += count));

const expectedDailyReviews =
  expectedDailyRadicals + expectedDailyKanji + expectedDailyVocab;
```
