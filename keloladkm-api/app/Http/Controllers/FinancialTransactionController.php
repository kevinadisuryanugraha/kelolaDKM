<?php

namespace App\Http\Controllers;

use App\Models\FinancialAccount;
use App\Models\FinancialTransaction;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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

        $record = DB::transaction(function () use ($request, $data) {
            $data['ref_number'] = ($data['type'] === 'Masuk' ? 'INV/' : 'EXP/')
                .date('Ymd').'/'.str_pad((FinancialTransaction::max('id') ?? 0) + 1, 3, '0', STR_PAD_LEFT);

            // Retry on unique collision
            $attempts = 0;
            $newRecord = null;
            while ($attempts < 5) {
                try {
                    $newRecord = FinancialTransaction::create($data);
                    break;
                } catch (UniqueConstraintViolationException $e) {
                    $attempts++;
                    $data['ref_number'] = ($data['type'] === 'Masuk' ? 'INV/' : 'EXP/')
                        .date('Ymd').'/'.str_pad((FinancialTransaction::max('id') ?? 0) + 1 + $attempts, 3, '0', STR_PAD_LEFT);
                }
            }

            if (! $newRecord) {
                $newRecord = FinancialTransaction::create($data);
            }

            // Sync account balance if account exists
            $account = FinancialAccount::where('code', $data['account_code'])->first();
            if ($account) {
                if ($data['type'] === 'Masuk') {
                    $account->increment('balance', $data['amount']);
                } else {
                    $account->decrement('balance', $data['amount']);
                }
            }

            AuditLogController::log(
                $request,
                'CREATE_TRANSACTION',
                'Keuangan',
                "Transaksi {$data['type']} ({$newRecord->ref_number}): Rp ".number_format($data['amount'], 0, ',', '.')
            );

            return $newRecord;
        });

        return $this->created($record);
    }

    public function publicIndex()
    {
        return $this->ok(FinancialTransaction::where('status', 'Approved')->latest()->take(50)->get());
    }
}
