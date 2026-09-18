<?php

declare(strict_types=1);

namespace App\Data\Home;

/**
 * Неизменяемая граница между приложением и Inertia-props страницы Home.
 *
 * Зеркало TypeScript-контракта `resources/js/types/home/home_page.types.ts`.
 * Eloquent-модели через эту границу не проходят.
 *
 * @phpstan-type HomeUserArray array{fullName: string, initials: string, email: string, avatarUrl: string}
 * @phpstan-type HomeNavigationArray list<array{key: string, label: string, href: string, isActive: bool}>
 * @phpstan-type HomeBreadcrumbArray list<array{label: string, href?: string}>
 * @phpstan-type HomeOnboardingArray array{currentStep: int, totalSteps: int, completedCount: int, steps: list<array{key: string, shortLabel: string, label: string, state: string}>}
 * @phpstan-type HomeBalanceArray array{amountMinor: int, currency: string, productLabel: string, interestRateLabel: string, availabilityMessage: string, statusLabel: string, withdrawUrl: string, isWithdrawEnabled: bool}
 * @phpstan-type HomeRowArray list<array{key: string, label: string, value: string}>
 * @phpstan-type HomeVerificationArray list<array{key: string, title: string, description: string, state: string, stateLabel: string, iconKey: string, href?: string}>
 * @phpstan-type HomeHeadingArray array{eyebrow: string, title: string}
 * @phpstan-type HomeBannerArray array{title: string, subtitle: string, badgeLabel: string, compactBadgeLabel: string, href: string, pendingSteps: list<array{key: string, label: string}>}
 * @phpstan-type HomeSupportArray array{href: string, unreadCount: int, label: string, avatarUrl: string}
 */
final readonly class HomePageData
{
    /**
     * @param  HomeUserArray  $user
     * @param  HomeNavigationArray  $navigation
     * @param  HomeBreadcrumbArray  $breadcrumbs
     * @param  HomeOnboardingArray  $onboarding
     * @param  HomeBalanceArray  $balance
     * @param  HomeRowArray  $personalData
     * @param  HomeVerificationArray  $verification
     * @param  HomeHeadingArray  $verificationHeading
     * @param  HomeBannerArray  $progressBanner
     * @param  HomeSupportArray  $support
     */
    public function __construct(
        public array $user,
        public int $notificationsCount,
        public array $navigation,
        public array $breadcrumbs,
        public array $onboarding,
        public array $balance,
        public array $personalData,
        public array $verification,
        public array $verificationHeading,
        public array $progressBanner,
        public array $support,
    ) {}

    /**
     * @return array{
     *     user: HomeUserArray,
     *     notificationsCount: int,
     *     navigation: HomeNavigationArray,
     *     breadcrumbs: HomeBreadcrumbArray,
     *     onboarding: HomeOnboardingArray,
     *     balance: HomeBalanceArray,
     *     personalData: HomeRowArray,
     *     verification: HomeVerificationArray,
     *     verificationHeading: HomeHeadingArray,
     *     progressBanner: HomeBannerArray,
     *     support: HomeSupportArray
     * }
     */
    public function toArray(): array
    {
        return [
            'user' => $this->user,
            'notificationsCount' => $this->notificationsCount,
            'navigation' => $this->navigation,
            'breadcrumbs' => $this->breadcrumbs,
            'onboarding' => $this->onboarding,
            'balance' => $this->balance,
            'personalData' => $this->personalData,
            'verification' => $this->verification,
            'verificationHeading' => $this->verificationHeading,
            'progressBanner' => $this->progressBanner,
            'support' => $this->support,
        ];
    }
}
