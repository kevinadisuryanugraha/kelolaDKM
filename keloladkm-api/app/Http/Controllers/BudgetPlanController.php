<?php

namespace App\Http\Controllers;

use App\Models\BudgetPlan;

class BudgetPlanController extends BaseApiController
{
    protected $model = BudgetPlan::class;

    protected $rules = [
        'category' => 'required|string',
        'allocated_amount' => 'required|integer|min:1',
        'used_amount' => 'integer|min:0',
        'period' => 'required|string|max:20',
    ];
}
