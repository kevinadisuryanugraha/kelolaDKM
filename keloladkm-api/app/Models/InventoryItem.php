<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['code', 'name', 'category', 'location', 'quantity', 'unit', 'condition', 'purchase_date', 'purchase_price', 'current_value', 'qr_code', 'last_maintenance', 'notes'])]
class InventoryItem extends Model {}
