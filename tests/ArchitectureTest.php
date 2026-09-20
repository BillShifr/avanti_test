<?php

declare(strict_types=1);

use App\Http\Controllers\Home\HomeController;

arch('строгие типы во всём коде')
    ->expect('App')
    ->toUseStrictTypes();

arch('контроллеры лежат в своём слое и являются invokable')
    ->expect('App\Http\Controllers')
    ->toBeFinal()
    ->toHaveSuffix('Controller')
    ->toOnlyBeUsedIn('App\Http');

it('HomeController имеет ровно одно публичное действие __invoke', function (): void {
    $publicMethods = (new ReflectionClass(HomeController::class))
        ->getMethods(ReflectionMethod::IS_PUBLIC);

    expect($publicMethods)->toHaveCount(1)
        ->and($publicMethods[0]->getName())->toBe('__invoke');
});

arch('DTO не зависит от HTTP-слоя и Eloquent')
    ->expect('App\Data')
    ->toBeReadonly()
    ->not->toUse([
        'Illuminate\Http',
        'Illuminate\Database\Eloquent',
        'Inertia\Inertia',
    ]);

arch('презентер Home не знает про Eloquent')
    ->expect('App\Services\Home')
    ->not->toUse('Illuminate\Database\Eloquent');

arch('в коде нет отладочных вызовов')
    ->expect(['dd', 'dump', 'ray', 'var_dump', 'print_r'])
    ->not->toBeUsed();
