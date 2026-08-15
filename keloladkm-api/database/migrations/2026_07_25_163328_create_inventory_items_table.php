<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inventory_items', function (Blueprint $table) {
            $table->id();
            $table->string('code', 50)->unique();
            $table->string('name');
            $table->string('category');
            $table->string('location');
            $table->integer('quantity')->default(1);
            $table->string('unit', 30);
            $table->enum('condition', ['Sangat Baik', 'Baik', 'Perlu Perbaikan', 'Rusak']);
            $table->date('purchase_date');
            $table->bigInteger('purchase_price');
            $table->bigInteger('current_value');
            $table->string('qr_code')->nullable();
            $table->date('last_maintenance')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inventory_items');
    }
};
