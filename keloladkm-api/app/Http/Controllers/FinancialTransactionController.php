<?php

namespace App\Http\Controllers;

use App\Models\FinancialTransaction;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Http\Request;

class FinancialTransactionController extends BaseApiController
{
    protected $model = FinancialTransaction::class;

    protected $searchable = ['description', 'ref_number', 'account_name', 'category'];

    protected $rules = [
        'date' => 'required|date',
        'type' => 'required|in:Masuk,Keluar',
        'account_code' => 'required|string|max:20',
        'account_name' => 'required|string',
        'description' => 'required|string',
        'amount' => 'required|integer|min:1',
        'category' => 'required|string',
        'recorded_by' => 'required|string',
        'status' => 'in:Pending,Approved,Rejected',
        'user_id' => 'nullable|exists:users,id',
    ];

    public function store(Request $request)
    {
        $data = $request->validate($this->rules);
        $data['ref_number'] = ($data['type'] === 'Masuk' ? 'INV/' : 'EXP/')
            .date('Ymd').'/'.str_pad((FinancialTransaction::max('id') ?? 0) + 1, 3, '0', STR_PAD_LEFT);
        // Retry on unique collision
        $attempts = 0;
        while ($attempts < 5) {
            try {
                $record = FinancialTransaction::create($data);
                break;
            } catch (UniqueConstraintViolationException $e) {
                $attempts++;
                $data['ref_number'] = ($data['type'] === 'Masuk' ? 'INV/' : 'EXP/')
                    .date('Ymd').'/'.str_pad((FinancialTransaction::max('id') ?? 0) + 1 + $attempts, 3, '0', STR_PAD_LEFT);
            }
        }
        if (! isset($record)) {
            $record = FinancialTransaction::create($data);
        }
        AuditLogController::log($request, 'CREATE_TRANSACTION', 'Keuangan',
            "Transaksi {$data['type']}: Rp ".number_format($data['amount'], 0, ',', '.'));

        return $this->created($record);
    }

    public function publicIndex()
    {
        return $this->ok(FinancialTransaction::where('status', 'Approved')->latest()->take(50)->get());
    }
}
