<?php

declare(strict_types=1);

namespace App\Http\Controllers\Home;

use App\Services\Home\HomePagePresenter;
use Illuminate\Support\Facades\Vite;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Единственное действие маршрута `home`.
 *
 * Контроллер только собирает URL-ы именованных маршрутов и отдаёт DTO в Inertia;
 * доменных вычислений и Eloquent-сериализации здесь нет.
 */
final class HomeController
{
    public function __invoke(): Response
    {
        $presenter = new HomePagePresenter(
            routes: [
                'home' => route('home'),
                'documents' => route('documents'),
                'profile' => route('profile'),
                'support' => route('support'),
                'platform' => route('platform'),
                'withdraw' => route('withdraw'),
                'signature' => route('signature'),
            ],
            avatarUrl: Vite::asset('resources/images/home/shared/profile_avatar.jpg'),
            chatAvatarUrl: Vite::asset('resources/images/home/mobile/chat_avatar.png'),
        );

        return Inertia::render('home/home_page', $presenter->present()->toArray());
    }
}
