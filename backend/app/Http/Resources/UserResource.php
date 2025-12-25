<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        $first = null; $last = null;
        if ($this->full_name) {
            $parts = preg_split('/\s+/', trim($this->full_name), 2);
            $first = $parts[0] ?? null; $last = $parts[1] ?? null;
        }
        $authorities = ['ROLE_'.($this->role ?? 'USER')];
        $profileComplete = (bool) ($this->profile_complete ?? false);
        return [
            'id' => $this->id,
            'role' => $this->role,
            'firstName' => $first,
            'lastName' => $last,
            'email' => $this->email,
            'profileImageUrl' => $this->profile_image_url,
            'connectedAccounts' => $this->connectedAccounts->map(fn($ca) => [
                'provider' => $ca->provider,
                'connectedAt' => $ca->connected_at,
            ])->values(),
            'authorities' => $authorities,
            'profileComplete' => $profileComplete,
        ];
    }
}
