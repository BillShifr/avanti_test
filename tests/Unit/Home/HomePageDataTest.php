<?php

declare(strict_types=1);

use App\Data\Home\HomePageData;
use App\Services\Home\HomePagePresenter;

function presenter(): HomePagePresenter
{
    return new HomePagePresenter(
        routes: [
            'home' => '/home',
            'documents' => '/documenti',
            'profile' => '/profilo',
            'support' => '/assistenza',
            'platform' => '/',
            'withdraw' => '/prelievo',
            'signature' => '/firma',
        ],
        avatarUrl: '/build/avatar.jpg',
        chatAvatarUrl: '/build/chat.png',
    );
}

it('собирает DTO с ключами контракта в неизменном порядке', function (): void {
    $data = presenter()->present();

    expect($data)->toBeInstanceOf(HomePageData::class)
        ->and(array_keys($data->toArray()))->toBe([
            'user',
            'notificationsCount',
            'navigation',
            'breadcrumbs',
            'onboarding',
            'balance',
            'personalData',
            'verification',
            'verificationHeading',
            'progressBanner',
            'support',
        ]);
});

it('выводит текущий шаг и счётчик завершённых из состояния шагов', function (): void {
    $onboarding = presenter()->present()->toArray()['onboarding'];

    expect($onboarding['currentStep'])->toBe(4)
        ->and($onboarding['completedCount'])->toBe(3)
        ->and($onboarding['totalSteps'])->toBe(5);
});

it('формирует подписи бейджа из тех же счётчиков', function (): void {
    $banner = presenter()->present()->toArray()['progressBanner'];

    expect($banner['badgeLabel'])->toBe('3 / 5 Completati')
        ->and($banner['compactBadgeLabel'])->toBe('3 / 5');
});

it('оставляет ровно один текущий шаг', function (): void {
    $steps = presenter()->present()->toArray()['onboarding']['steps'];
    $current = array_filter($steps, static fn (array $step): bool => $step['state'] === 'current');

    expect($current)->toHaveCount(1);
});

it('даёт ссылку только тем пунктам верификации, которые требуют действия', function (): void {
    foreach (presenter()->present()->toArray()['verification'] as $item) {
        if ($item['state'] === 'complete') {
            expect($item)->not->toHaveKey('href');

            continue;
        }

        expect($item['href'])->toBeString()->not->toBeEmpty();
    }
});

it('является неизменяемым', function (): void {
    expect((new ReflectionClass(HomePageData::class))->isReadOnly())->toBeTrue();
});
