<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kajian_events', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('speaker');
            $table->string('speaker_title')->nullable();
            $table->string('speaker_avatar')->nullable();
            $table->date('date');
            $table->time('time');
            $table->string('location');
            $table->string('category');
            $table->text('description')->nullable();
            $table->string('live_stream_url')->nullable();
            $table->string('poster_url')->nullable();
            $table->boolean('is_live')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kajian_events');
    }
};
