<?php

namespace App\Http\Controllers;

use App\Models\DonationCampaign;
use Illuminate\Http\Request;

class DonationCampaignController extends BaseApiController
{
    protected $model = DonationCampaign::class;

    protected $searchable = ['title', 'category'];

    protected $rules = [
        'title' => 'required|string',
        'category' => 'required|string',
        'target_amount' => 'required|integer|min:1',
        'deadline' => 'required|date',
        'description' => 'nullable|string',
        'image_url' => 'nullable|url',
        'is_urgent' => 'boolean',
    ];

    public function store(Request $request)
    {
        $data = $request->validate($this->rules);
        $data['collected_amount'] = 0;
        $data['donor_count'] = 0;
        $record = DonationCampaign::create($data);
        AuditLogController::log($request, 'CREATE_CAMPAIGN', 'Donasi',
            "Campaign: {$data['title']}");

        return $this->created($record);
    }
}
