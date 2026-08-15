<?php

namespace App\Http\Controllers;

use App\Models\FinancialAccount;

class FinancialAccountController extends BaseApiController
{
    protected $model = FinancialAccount::class;

    protected $rules = [
        'code' => 'required|string|max:20|unique:financial_accounts,code,{id}',
        'name' => 'required|string',
        'type' => 'required|in:Aset,Kewajiban,Ekuitas,Penerimaan,Pengeluaran',
        'balance' => 'integer',
    ];
}
