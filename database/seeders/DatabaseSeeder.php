<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Sites;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password'=> bcrypt('123.321A'),
            'email_verified_at' => now(),
        ]);

        Sites::factory()->count(20)->create();

    }
}
