<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Sites>
 */
class SitesFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
           'name' => $this->faker->company,
            'ph_level' => $this->faker->randomFloat(2, 0, 14),  // Nullable float, random value between 0 and 14
            'turbidity' => $this->faker->randomFloat(2, 0, 100), // Nullable float
            'total_dissolved_solids' => $this->faker->randomFloat(2, 0, 1000), // Nullable float
            'total_hardness' => $this->faker->randomFloat(2, 0, 500), // Nullable float
            'salinity' => $this->faker->randomFloat(2, 0, 50), // Nullable float
            'nitrate' => $this->faker->randomFloat(2, 0, 50), // Nullable float
            'sulfate' => $this->faker->randomFloat(2, 0, 50), // Nullable float
            'latitude' => $this->faker->latitude, // Random latitude
            'longitude' => $this->faker->longitude, // Random longitude
            'status' => $this->faker->randomElement(['potable', 'non-potable']),
    ];

    }
}
