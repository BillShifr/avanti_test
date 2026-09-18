<?php

declare(strict_types=1);

use Inertia\Testing\AssertableInertia;

it('отдаёт страницу home по именованному маршруту', function (): void {
    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page->component('home/home_page'));
});

it('редиректит корень на home', function (): void {
    $this->get('/')->assertRedirect(route('home'));
});

it('передаёт полный контракт props', function (): void {
    $this->get(route('home'))->assertInertia(
        fn (AssertableInertia $page) => $page
            ->has('user.fullName')
            ->has('user.initials')
            ->has('user.email')
            ->has('user.avatarUrl')
            ->has('notificationsCount')
            ->has('navigation', 4)
            ->has('breadcrumbs', 2)
            ->has('onboarding.steps', 5)
            ->has('balance.amountMinor')
            ->has('personalData', 2)
            ->has('verification', 5)
            ->has('verificationHeading.eyebrow')
            ->has('progressBanner.pendingSteps', 2)
            ->has('support.unreadCount')
    );
});

it('строит ссылки из именованных маршрутов', function (): void {
    $this->get(route('home'))->assertInertia(
        fn (AssertableInertia $page) => $page
            ->where('navigation.0.href', route('home'))
            ->where('navigation.0.isActive', true)
            ->where('navigation.1.href', route('documents'))
            ->where('navigation.2.href', route('profile'))
            ->where('navigation.3.href', route('support'))
            ->where('balance.withdrawUrl', route('withdraw'))
    );
});

it('держит деньги в минорных единицах и не склеивает строку суммы', function (): void {
    $this->get(route('home'))->assertInertia(function (AssertableInertia $page): void {
        $balance = $page->toArray()['props']['balance'];

        expect($balance['amountMinor'])->toBeInt()
            ->and($balance['currency'])->toBe('EUR')
            ->and($balance)->not->toHaveKey('formattedAmount');
    });
});

it('держит счётчики целыми и в допустимом диапазоне', function (): void {
    $this->get(route('home'))->assertInertia(function (AssertableInertia $page): void {
        $props = $page->toArray()['props'];

        expect($props['notificationsCount'])->toBeInt()->toBeGreaterThanOrEqual(0)
            ->and($props['onboarding']['completedCount'])->toBeInt()
            ->and($props['onboarding']['completedCount'])
            ->toBeLessThanOrEqual($props['onboarding']['totalSteps'])
            ->and($props['onboarding']['currentStep'])->toBeLessThanOrEqual($props['onboarding']['totalSteps']);
    });
});

it('не протаскивает во фронтенд чувствительные поля', function (): void {
    $response = $this->get(route('home'));
    $payload = json_encode($response->viewData('page')['props'], JSON_THROW_ON_ERROR);

    foreach (['password', 'remember_token', 'api_token', 'created_at', 'updated_at', 'id"'] as $forbidden) {
        expect($payload)->not->toContain($forbidden);
    }
});
