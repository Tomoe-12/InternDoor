<?php

namespace App\Console\Commands;

use App\Models\VerificationCode;
use App\Models\PasswordResetToken;
use Illuminate\Console\Command;

class CleanupExpiredTokens extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'tokens:cleanup';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Delete expired verification codes and password reset tokens';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $verificationCodesDeleted = VerificationCode::where('expires_at', '<', now())->delete();
        $passwordTokensDeleted = PasswordResetToken::where('expires_at', '<', now())->delete();

        $this->info("Deleted {$verificationCodesDeleted} expired verification codes");
        $this->info("Deleted {$passwordTokensDeleted} expired password reset tokens");
        $this->info('Token cleanup completed successfully!');
    }
}
