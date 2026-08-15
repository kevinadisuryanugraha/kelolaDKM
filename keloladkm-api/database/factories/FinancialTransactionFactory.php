<?php

namespace Database\Factories;

use App\Models\FinancialTransaction;
use Illuminate\Database\Eloquent\Factories\Factory;

class FinancialTransactionFactory extends Factory
{
    protected $model = FinancialTransaction::class;

    public function definition(): array
    {
        return [
            'ref_number' => 'INV/'.date('Ymd').'/'.fake()->unique()->numberBetween(100, 999),
            'date' => fake()->date(),
            'type' => fake()->randomElement(['Masuk', 'Keluar']),
            'account_code' => '401.1',
            'account_name' => 'Infaq Salat Jumat',
            'description' => fake()->sentence(3),
            'amount' => fake()->numberBetween(50000, 10000000),
            'category' => 'Infaq Jumat',
            'recorded_by' => 'H. Rahmat Hidayat',
            'status' => fake()->randomElement(['Approved', 'Pending']),
        ];
    }
}
