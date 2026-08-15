<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('qurban_participants', function (Blueprint $table) {
            $table->id();
            $table->string('participant_name');
            $table->enum('animal_type', ['Sapi', 'Kambing', 'Domba Super']);
            $table->string('group_name')->nullable();
            $table->string('phone', 20);
            $table->bigInteger('amount');
            $table->enum('payment_status', ['Lunas', 'DP', 'Belum Lunas'])->default('Lunas');
            $table->string('coupon_code', 30)->unique();
            $table->boolean('is_distributed')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('qurban_participants');
    }
};
