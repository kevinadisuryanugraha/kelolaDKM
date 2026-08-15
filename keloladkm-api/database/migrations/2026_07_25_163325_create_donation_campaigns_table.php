<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('donation_campaigns', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('category');
            $table->bigInteger('target_amount');
            $table->bigInteger('collected_amount')->default(0);
            $table->integer('donor_count')->default(0);
            $table->date('deadline');
            $table->text('description')->nullable();
            $table->string('image_url')->nullable();
            $table->boolean('is_urgent')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('donation_campaigns');
    }
};
