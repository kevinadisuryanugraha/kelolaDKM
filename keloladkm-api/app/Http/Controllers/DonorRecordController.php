<?php

namespace App\Http\Controllers;

use App\Models\DonationCampaign;
use App\Models\DonorRecord;
use Illuminate\Http\Request;

class DonorRecordController extends BaseApiController
{
    protected $model = DonorRecord::class;

    protected $searchable = ['donor_name', 'phone'];

    protected $rules = [
        'donor_name' => 'required|string',
        'phone' => 'required|string|max:20',
        'email' => 'nullable|email',
        'donation_campaign_id' => 'required|exists:donation_campaigns,id',
        'amount' => 'required|integer|min:1000',
        'method' => 'required|in:QRIS,Transfer BSI,Transfer Mandiri,Cash / Tunai',
        'status' => 'in:Verifikasi,Diterima,Ditolak',
        'proof_url' => 'nullable|string',
        'is_anonymous' => 'boolean',
    ];

    public function store(Request $request)
    {
        if (! $request->has('donation_campaign_id') && $request->has('campaign_id')) {
            $request->merge(['donation_campaign_id' => $request->input('campaign_id')]);
        }
        $data = $request->validate($this->rules);
        $data['date'] = now()->toDateString();
        $data['status'] = 'Diterima';
        $record = DonorRecord::create($data);

        // Auto-update campaign totals
        $campaign = DonationCampaign::find($data['donation_campaign_id']);
        if ($campaign) {
            $campaign->increment('collected_amount', $data['amount']);
            $campaign->increment('donor_count');
        }

        AuditLogController::log($request, 'DONATION_RECEIVED', 'Donasi',
            "Donasi dari {$data['donor_name']}: Rp ".number_format($data['amount'], 0, ',', '.'));

        return $this->created($record);
    }
}
