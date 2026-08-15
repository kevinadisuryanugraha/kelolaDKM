<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('budget_plans', function (Blueprint $table) {
            $table->id();
            $table->string('category');
            $table->bigInteger('allocated_amount');
            $table->bigInteger('used_amount')->default(0);
            $table->string('period', 20); // e.g. "Tahun 2026"
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('budget_plans');
    }
};
