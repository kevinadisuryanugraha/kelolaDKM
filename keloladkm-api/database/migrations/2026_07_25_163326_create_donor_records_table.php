<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('donor_records', function (Blueprint $table) {
            $table->id();
            $table->string('donor_name');
            $table->string('phone', 20);
            $table->string('email')->nullable();
            $table->foreignId('donation_campaign_id')->constrained()->cascadeOnDelete();
            $table->bigInteger('amount');
            $table->enum('method', ['QRIS', 'Transfer BSI', 'Transfer Mandiri', 'Cash / Tunai']);
            $table->date('date');
            $table->enum('status', ['Verifikasi', 'Diterima', 'Ditolak'])->default('Diterima');
            $table->string('proof_url')->nullable();
            $table->boolean('is_anonymous')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('donor_records');
    }
};
