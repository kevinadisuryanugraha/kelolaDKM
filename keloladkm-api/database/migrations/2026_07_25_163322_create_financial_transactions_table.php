<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('financial_transactions', function (Blueprint $table) {
            $table->id();
            $table->string('ref_number', 50)->unique();
            $table->date('date');
            $table->enum('type', ['Masuk', 'Keluar']);
            $table->string('account_code', 20);
            $table->string('account_name');
            $table->string('description');
            $table->bigInteger('amount');
            $table->string('category');
            $table->string('recorded_by');
            $table->enum('status', ['Pending', 'Approved', 'Rejected'])->default('Approved');
            $table->string('receipt_url')->nullable();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('financial_transactions');
    }
};
