<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Request;

class Authenticate extends Middleware
{
    /**
     * Override redirect behavior for unauthenticated requests.
     * Return null to prevent redirects (so API returns 401 JSON).
     */
    protected function redirectTo(Request $request): ?string
    {
        return null;
    }
}
