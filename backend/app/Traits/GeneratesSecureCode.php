<?php

namespace App\Traits;

trait GeneratesSecureCode
{
    /**
     * Generate a secure verification code using URL-safe base64 encoding.
     * Results in a 43-character token with 256 bits of entropy.
     *
     * @return string
     */
    private function generateSecureCode(): string
    {
        // Generate 32 random bytes (256 bits of entropy)
        $randomBytes = random_bytes(32);
        
        // Convert to URL-safe base64 string (43 characters)
        // This results in a token like: "a7B9cD2eF5gH8iJ1kL4mN7oP0qR3sT6uV9wX2yZ5"
        return rtrim(strtr(base64_encode($randomBytes), '+/', '-_'), '=');
    }
}
