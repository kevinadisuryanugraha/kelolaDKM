<?php

namespace App\Http\Controllers;

use App\Models\QurbanParticipant;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Http\Request;

class QurbanParticipantController extends BaseApiController
{
    protected $model = QurbanParticipant::class;

    protected $searchable = ['participant_name', 'coupon_code'];

    protected $rules = [
        'participant_name' => 'required|string',
        'animal_type' => 'required|in:Sapi,Kambing,Domba Super',
        'group_name' => 'nullable|string',
        'phone' => 'required|string|max:20',
        'amount' => 'required|integer|min:1',
        'payment_status' => 'in:Lunas,DP,Belum Lunas',
    ];

    public function store(Request $request)
    {
        $data = $request->validate($this->rules);
        $data['coupon_code'] = 'KPN-'.strtoupper(substr($data['animal_type'], 0, 2))
            .'-'.str_pad((QurbanParticipant::max('id') ?? 0) + 1, 2, '0', STR_PAD_LEFT);
        $data['is_distributed'] = false;
        $attempts = 0;
        while ($attempts < 5) {
            try {
                $record = QurbanParticipant::create($data);
                break;
            } catch (UniqueConstraintViolationException $e) {
                $attempts++;
                $data['coupon_code'] = 'KPN-'.strtoupper(substr($data['animal_type'], 0, 2))
                    .'-'.str_pad((QurbanParticipant::max('id') ?? 0) + 1 + $attempts, 2, '0', STR_PAD_LEFT);
            }
        }
        if (! isset($record)) {
            $record = QurbanParticipant::create($data);
        }
        AuditLogController::log($request, 'REGISTER_QURBAN', 'Qurban',
            "Qurban {$data['animal_type']} — {$data['participant_name']}");

        return $this->created($record);
    }

    public function toggleDistributed($id)
    {
        $q = QurbanParticipant::findOrFail($id);
        $q->update(['is_distributed' => ! $q->is_distributed]);

        return $this->ok($q, 'Status distribusi diperbarui');
    }
}
