import { COURSES, CULTURE_ARTICLES, LESSONS, UNITS } from '@/constants/content';
import { FREE_FEATURES, PREMIUM_BENEFITS, PRICING_PLANS } from '@/constants/pricing';

/**
 * The paywall is the screen someone reads before paying, so every claim on it
 * has to be checkable against the app.
 *
 * An audit found four that were not: recording your voice, TOPIK courses,
 * progress insights, and unlimited AI conversation. These tests exist so that
 * class of drift fails here rather than in a refund request.
 */

const premiumLessons = LESSONS.filter((lesson) => lesson.isPremium);

describe('premium claims match the app', () => {
  it('claims the real number of premium lessons', () => {
    const claim = PREMIUM_BENEFITS.find((benefit) => /lessons/i.test(benefit.title));
    expect(claim).toBeDefined();

    const claimed = Number(claim!.title.match(/\d+/)?.[0]);
    expect(claimed).toBe(premiumLessons.length);
  });

  it('names four premium courses, and there are four', () => {
    const premiumCourses = COURSES.filter((course) => course.isPremium);
    expect(premiumCourses).toHaveLength(4);

    const claim = PREMIUM_BENEFITS.find((benefit) => /lessons/i.test(benefit.title));
    for (const course of premiumCourses) {
      // The description lists them by their distinctive word, so a renamed
      // course has to update it. "Korean for Work" is listed as "Work".
      const shortName = course.title
        .replace(/^Korean\s+(for\s+)?/i, '')
        .replace(/\s+Korean$/i, '');
      expect(claim!.description).toContain(shortName);
    }
  });

  it('never promises to record the learner', () => {
    // The app captures no audio and does not request the microphone, so any
    // wording implying otherwise is false and a Play review risk.
    const text = PREMIUM_BENEFITS.map((b) => `${b.title} ${b.description}`).join(' ');
    expect(text).not.toMatch(/\brecord(ing|s)?\b/i);
  });

  it('does not advertise content that does not exist', () => {
    const text = PREMIUM_BENEFITS.map((b) => `${b.title} ${b.description}`).join(' ');
    const courseTitles = COURSES.map((course) => course.title.toLowerCase()).join(' ');

    for (const missing of ['topik', 'business korean']) {
      if (!courseTitles.includes(missing)) {
        expect(text.toLowerCase()).not.toContain(missing);
      }
    }
  });

  it('does not sell something that is already free', () => {
    const premiumText = PREMIUM_BENEFITS.map((b) => `${b.title} ${b.description}`).join(' ');
    const freeText = FREE_FEATURES.join(' ').toLowerCase();

    // The Progress tab is not gated, so it must not appear as a paid benefit.
    expect(premiumText.toLowerCase()).not.toContain('progress insight');
    expect(freeText).toContain('progress');
  });

  it('claims premium culture articles only if some are premium', () => {
    const claim = PREMIUM_BENEFITS.find((benefit) => /culture/i.test(benefit.title));
    if (claim) {
      expect(CULTURE_ARTICLES.some((article) => article.isPremium)).toBe(true);
    }
  });
});

describe('free claims match the app', () => {
  it('names the free courses that are actually free', () => {
    const freeCourses = COURSES.filter((course) => !course.isPremium);
    const text = FREE_FEATURES.join(' ');
    for (const course of freeCourses) expect(text).toContain(course.title);
  });

  it('claims the real number of free lessons', () => {
    const freeUnitIds = UNITS.filter((unit) =>
      COURSES.some((course) => course.id === unit.courseId && !course.isPremium),
    ).map((unit) => unit.id);

    const freeLessons = LESSONS.filter((lesson) => freeUnitIds.includes(lesson.unitId));
    const claim = FREE_FEATURES.find((feature) => /\d+ lessons/.test(feature));
    expect(claim).toBeDefined();
    expect(Number(claim!.match(/(\d+) lessons/)![1])).toBe(freeLessons.length);
  });
});

describe('pricing plans', () => {
  it('offers a trial on the recurring plans and not on the one-off', () => {
    for (const plan of PRICING_PLANS) {
      if (plan.id === 'lifetime') expect(plan.trialDays).toBe(0);
      else expect(plan.trialDays).toBeGreaterThan(0);
    }
  });

  it('highlights exactly one plan', () => {
    expect(PRICING_PLANS.filter((plan) => plan.highlighted)).toHaveLength(1);
  });

  it('uses product ids that are lowercase and underscore-separated', () => {
    // Play rejects anything else, and a mismatch fails silently at runtime.
    for (const plan of PRICING_PLANS) {
      expect(plan.productId).toMatch(/^[a-z][a-z0-9_]*$/);
    }
  });
});
