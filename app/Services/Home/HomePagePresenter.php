<?php

declare(strict_types=1);

namespace App\Services\Home;

use App\Data\Home\HomePageData;

/**
 * Собирает контракт страницы Home.
 *
 * В рамках тестового задания источником служат фиксированные данные онбординга,
 * но контракт и URL-ы уже строятся так, как их будет отдавать реальный репозиторий:
 * деньги — в минорных единицах, ссылки — из именованных маршрутов.
 */
final readonly class HomePagePresenter
{
    private const COMPLETE = 'complete';

    private const CURRENT = 'current';

    private const PENDING = 'pending';

    /**
     * @param  array<string, string>  $routes  карта key => URL именованного маршрута
     */
    public function __construct(
        private array $routes,
        private string $avatarUrl,
        private string $chatAvatarUrl,
    ) {}

    public function present(): HomePageData
    {
        $steps = $this->steps();
        $completed = count(array_filter($steps, static fn (array $step): bool => $step['state'] === self::COMPLETE));
        $total = count($steps);
        $current = $this->currentStepNumber($steps);

        return new HomePageData(
            user: [
                'fullName' => 'Marco Rossi',
                'initials' => 'MR',
                'email' => 'ikoei@09gmail.com',
                'avatarUrl' => $this->avatarUrl,
            ],
            notificationsCount: 4,
            navigation: [
                ['key' => 'home', 'label' => 'Home', 'href' => $this->route('home'), 'isActive' => true],
                ['key' => 'documents', 'label' => 'Documenti', 'href' => $this->route('documents'), 'isActive' => false],
                ['key' => 'profile', 'label' => 'Profilo', 'href' => $this->route('profile'), 'isActive' => false],
                ['key' => 'support', 'label' => 'Assistenza', 'href' => $this->route('support'), 'isActive' => false],
            ],
            breadcrumbs: [
                ['label' => 'Piattaforma', 'href' => $this->route('platform')],
                ['label' => 'Home'],
            ],
            onboarding: [
                'currentStep' => $current,
                'totalSteps' => $total,
                'completedCount' => $completed,
                'steps' => $steps,
            ],
            balance: [
                'amountMinor' => 1_200_000,
                'currency' => 'EUR',
                'productLabel' => 'Prestito personale',
                'interestRateLabel' => 'TAN 3,8%',
                'availabilityMessage' => "Fondi disponibili dopo l'approvazione dei documenti",
                'statusLabel' => 'Completa i passaggi',
                'withdrawUrl' => $this->route('withdraw'),
                'isWithdrawEnabled' => false,
            ],
            personalData: [
                ['key' => 'surname', 'label' => 'Cognome', 'value' => 'Intesa Sanpaolo S.p.A.'],
                ['key' => 'name', 'label' => 'Nome', 'value' => 'Marco Rossi'],
            ],
            verification: $this->verification(),
            verificationHeading: [
                'eyebrow' => 'Completa tutti gli step',
                'title' => 'Per il prelievo dei fondi, completa tutti gli step',
            ],
            progressBanner: [
                'title' => 'Per il prelievo dei fondi, completa tutti gli step',
                'subtitle' => 'Step ancora da completare',
                'badgeLabel' => sprintf('%d / %d Completati', $completed, $total),
                'compactBadgeLabel' => sprintf('%d / %d', $completed, $total),
                'href' => $this->route('documents'),
                'pendingSteps' => [
                    ['key' => 'documents', 'label' => 'Documenti'],
                    ['key' => 'signature', 'label' => 'Firma'],
                ],
            ],
            support: [
                'href' => $this->route('support'),
                'unreadCount' => 2,
                'label' => 'Assistenza',
                'avatarUrl' => $this->chatAvatarUrl,
            ],
        );
    }

    /**
     * @return list<array{key: string, shortLabel: string, label: string, state: string}>
     */
    private function steps(): array
    {
        return [
            ['key' => 'simulation', 'shortLabel' => 'Simul.', 'label' => 'Simulazione', 'state' => self::COMPLETE],
            ['key' => 'approval', 'shortLabel' => 'Approv.', 'label' => 'Approvazione', 'state' => self::COMPLETE],
            ['key' => 'account', 'shortLabel' => 'Account', 'label' => 'Account', 'state' => self::COMPLETE],
            ['key' => 'documents', 'shortLabel' => 'Docum.', 'label' => 'Documenti', 'state' => self::CURRENT],
            ['key' => 'signature', 'shortLabel' => 'Firma', 'label' => 'Firma', 'state' => self::PENDING],
        ];
    }

    /**
     * @return list<array{key: string, title: string, description: string, state: string, stateLabel: string, iconKey: string, href?: string}>
     */
    private function verification(): array
    {
        return [
            ['key' => 'simulation', 'title' => 'Simulazione completata', 'description' => 'Completato', 'state' => self::COMPLETE, 'stateLabel' => 'Completato', 'iconKey' => 'simulation'],
            ['key' => 'approval', 'title' => 'Credito approvato', 'description' => 'Completato', 'state' => self::COMPLETE, 'stateLabel' => 'Completato', 'iconKey' => 'approval'],
            ['key' => 'account', 'title' => 'Account creato', 'description' => 'Completato', 'state' => self::COMPLETE, 'stateLabel' => 'Completato', 'iconKey' => 'account'],
            ['key' => 'documents', 'title' => 'Documenti caricati', 'description' => 'Step attuale • Azione richiesta', 'state' => self::CURRENT, 'stateLabel' => 'Step attuale', 'iconKey' => 'documents', 'href' => $this->route('documents')],
            ['key' => 'signature', 'title' => 'Contratto firmato', 'description' => 'In attesa', 'state' => self::PENDING, 'stateLabel' => 'In attesa', 'iconKey' => 'signature', 'href' => $this->route('signature')],
        ];
    }

    /**
     * @param  list<array{key: string, shortLabel: string, label: string, state: string}>  $steps
     */
    private function currentStepNumber(array $steps): int
    {
        foreach ($steps as $index => $step) {
            if ($step['state'] === self::CURRENT) {
                return $index + 1;
            }
        }

        return count($steps);
    }

    private function route(string $key): string
    {
        return $this->routes[$key] ?? '/';
    }
}
