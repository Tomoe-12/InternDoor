<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CompanyResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'role' => 'COMPANY',
            'companyName' => $this->company_name,
            'firstName' => null,
            'lastName' => null,
            'email' => $this->company_email,
            'profileImageUrl' => null,
            'verified' => (bool) $this->verified,
            'connectedAccounts' => [],
            'authorities' => ['ROLE_COMPANY'],
        ];
    }
}
