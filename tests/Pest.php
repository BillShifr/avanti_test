<?php

declare(strict_types=1);

use Illuminate\Foundation\Testing\TestCase;

pest()
    ->extend(TestCase::class)
    ->beforeEach(function (): void {
        $this->withoutVite();
    })
    ->in('Feature');
