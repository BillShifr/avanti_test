<?php

declare(strict_types=1);

use App\Http\Controllers\Home\HomeController;
use Illuminate\Support\Facades\Route;

Route::get('/', static fn () => redirect()->route('home'))->name('platform');

Route::get('/home', HomeController::class)->name('home');

/*
 * Заглушки вне scope тестового задания: нужны только для того, чтобы
 * Home строил ссылки через именованные маршруты, а не через хардкод.
 */
Route::get('/documenti', static fn () => abort(404))->name('documents');
Route::get('/profilo', static fn () => abort(404))->name('profile');
Route::get('/assistenza', static fn () => abort(404))->name('support');
Route::get('/prelievo', static fn () => abort(404))->name('withdraw');
Route::get('/firma', static fn () => abort(404))->name('signature');
