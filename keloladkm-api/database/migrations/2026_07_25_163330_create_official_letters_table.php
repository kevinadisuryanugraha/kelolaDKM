<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('official_letters', function (Blueprint $table) {
            $table->id();
            $table->string('letter_number', 50);
            $table->enum('type', ['Masuk', 'Keluar']);
            $table->string('sender_or_recipient');
            $table->string('subject');
            $table->date('date');
            $table->string('disposition_to')->nullable();
            $table->enum('status', ['Diterima', 'Diproses', 'Selesai', 'Tersimpan'])->default('Diproses');
            $table->string('file_url')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('official_letters');
    }
};
