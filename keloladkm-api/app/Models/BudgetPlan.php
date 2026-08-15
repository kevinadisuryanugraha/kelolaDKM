<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['category', 'allocated_amount', 'used_amount', 'period'])]
class BudgetPlan extends Model {}
