<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['ref_number', 'date', 'type', 'account_code', 'account_name', 'description', 'amount', 'category', 'recorded_by', 'status', 'receipt_url', 'user_id'])]
class FinancialTransaction extends Model
{
    use HasFactory;
}
