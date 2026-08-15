import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Linking, Pressable, StyleSheet, View } from 'react-native';

import { AppButton, AppText, Screen } from '@/components/ui';
import { PRIVACY_URL, TERMS_URL } from '@/constants/app';
import { PREMIUM_BENEFITS, PRICING_PLANS, type PricingPlan } from '@/constants/pricing';
import { colors, radius, spacing } from '@/constants/theme';
import { paymentService } from '@/services/payments';
import { useUserStore } from '@/store/useUserStore';

export default function PaywallScreen() {
  const router = useRouter();
  const setSubscription = useUserStore((state) => state.setSubscription);

  const [selected, setSelected] = useState<PricingPlan>(
    PRICING_PLANS.find((plan) => plan.highlighted) ?? PRICING_PLANS[0],
  );
  const [busy, setBusy] = useState(false);

  const handlePurchase = async () => {
    setBusy(true);
    const result = await paymentService.purchase(selected);
    setBusy(false);

    if (result.status === 'purchased' && result.subscription) {
      setSubscription(result.subscription);
      router.back();
      return;
    }

    Alert.alert('Premium', result.message);
  };

  const handleRestore = async () => {
    const result = await paymentService.restore();
    if (result.status === 'purchased' && result.subscription) {
      setSubscription(result.subscription);
      router.back();
      return;
    }
    Alert.alert('Restore Purchases', result.message);
  };

  return (
    <Screen
      footer={
        <View style={styles.footer}>
          <AppButton
            label={selected.trialDays > 0 ? 'Start Free Trial' : 'Get Lifetime Access'}
            size="lg"
            loading={busy}
            onPress={handlePurchase}
          />
          <AppText variant="micro" color={colors.textSubtle} center>
            {selected.trialDays > 0
              ? `${selected.trialDays} days free, then ${selected.priceLabel} ${selected.periodLabel}. Cancel anytime.`
              : 'One payment. Yours forever.'}
          </AppText>

          <View style={styles.legalRow}>
            <Pressable onPress={handleRestore} accessibilityRole="button" hitSlop={8}>
              <AppText variant="micro" color={colors.textMuted}>
                Restore Purchases
              </AppText>
            </Pressable>
            <Pressable onPress={() => Linking.openURL(TERMS_URL)} accessibilityRole="link" hitSlop={8}>
              <AppText variant="micro" color={colors.textMuted}>
                Terms
              </AppText>
            </Pressable>
            <Pressable onPress={() => Linking.openURL(PRIVACY_URL)} accessibilityRole="link" hitSlop={8}>
              <AppText variant="micro" color={colors.textMuted}>
                Privacy
              </AppText>
            </Pressable>
          </View>
        </View>
      }
    >
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Close"
          hitSlop={12}
          style={styles.close}
        >
          <Ionicons name="close" size={22} color={colors.textMuted} />
        </Pressable>
      </View>

      <LinearGradient
        colors={[colors.primary, '#8A6BFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <AppText variant="micro" color="rgba(255,255,255,0.8)">
          KOREANGO PREMIUM
        </AppText>
        <AppText variant="title" color={colors.white} style={styles.heroTitle}>
          Speak Korean With Confidence
        </AppText>
        <AppText variant="body" color="rgba(255,255,255,0.9)">
          Unlock your complete Korean learning experience.
        </AppText>
      </LinearGradient>

      <View style={styles.benefits}>
        {PREMIUM_BENEFITS.map((benefit) => (
          <View key={benefit.title} style={styles.benefit}>
            <View style={styles.benefitEmoji}>
              <AppText variant="body">{benefit.emoji}</AppText>
            </View>
            <View style={styles.benefitText}>
              <AppText variant="bodyStrong">{benefit.title}</AppText>
              <AppText variant="caption" color={colors.textMuted}>
                {benefit.description}
              </AppText>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.plans}>
        {PRICING_PLANS.map((plan) => {
          const isSelected = plan.id === selected.id;
          return (
            <Pressable
              key={plan.id}
              onPress={() => setSelected(plan)}
              accessibilityRole="radio"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={`${plan.title}, ${plan.priceLabel} ${plan.periodLabel}${
                plan.badge ? `, ${plan.badge}` : ''
              }`}
              style={[styles.plan, isSelected && styles.planSelected]}
            >
              <View style={styles.planLeft}>
                <View style={[styles.radio, isSelected && styles.radioSelected]}>
                  {isSelected ? <Ionicons name="checkmark" size={14} color={colors.white} /> : null}
                </View>
                <View>
                  <AppText variant="bodyStrong">{plan.title}</AppText>
                  {plan.perMonthLabel ? (
                    <AppText variant="micro" color={colors.textMuted}>
                      {plan.perMonthLabel}
                    </AppText>
                  ) : null}
                </View>
              </View>

              <View style={styles.planRight}>
                {plan.badge ? (
                  <View style={styles.badge}>
                    <AppText variant="micro" color={colors.white}>
                      {plan.badge}
                    </AppText>
                  </View>
                ) : null}
                <AppText variant="bodyStrong">{plan.priceLabel}</AppText>
                <AppText variant="micro" color={colors.textSubtle}>
                  {plan.periodLabel}
                </AppText>
              </View>
            </Pressable>
          );
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'flex-end', paddingTop: spacing.lg },
  close: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  hero: { borderRadius: radius.xl, padding: spacing.xl, gap: spacing.xs, marginTop: spacing.sm },
  heroTitle: { marginTop: spacing.xs },
  benefits: { gap: spacing.lg, marginTop: spacing.xxl },
  benefit: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  benefitEmoji: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefitText: { flex: 1, gap: 2 },
  plans: { gap: spacing.md, marginTop: spacing.xxl },
  plan: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    padding: spacing.lg,
    minHeight: 72,
  },
  planSelected: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  planLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  planRight: { alignItems: 'flex-end', gap: 2 },
  badge: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
    marginBottom: 2,
  },
  footer: { gap: spacing.sm },
  legalRow: { flexDirection: 'row', justifyContent: 'center', gap: spacing.xl, marginTop: spacing.sm },
});
