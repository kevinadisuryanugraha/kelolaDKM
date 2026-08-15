<?php

namespace App\Http\Controllers;

use App\Models\InventoryItem;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Http\Request;

class InventoryItemController extends BaseApiController
{
    protected $model = InventoryItem::class;

    protected $searchable = ['name', 'code', 'category', 'location'];

    protected $rules = [
        'name' => 'required|string',
        'category' => 'required|string',
        'location' => 'required|string',
        'quantity' => 'required|integer|min:1',
        'unit' => 'required|string|max:30',
        'condition' => 'required|in:Sangat Baik,Baik,Perlu Perbaikan,Rusak',
        'purchase_date' => 'required|date',
        'purchase_price' => 'required|integer|min:1',
        'current_value' => 'integer',
        'notes' => 'nullable|string',
    ];

    public function store(Request $request)
    {
        $data = $request->validate($this->rules);
        $data['code'] = 'AST-'.strtoupper(substr($data['category'], 0, 3))
            .'-'.date('Y').'-'.((InventoryItem::max('id') ?? 0) + 1);
        $data['qr_code'] = 'QR-'.$data['code'];
        $data['current_value'] = $data['current_value'] ?? (int) ($data['purchase_price'] * 0.9);
        $attempts = 0;
        while ($attempts < 5) {
            try {
                $record = InventoryItem::create($data);
                break;
            } catch (UniqueConstraintViolationException $e) {
                $attempts++;
                $data['code'] = 'AST-'.strtoupper(substr($data['category'], 0, 3))
                    .'-'.date('Y').'-'.((InventoryItem::max('id') ?? 0) + 1 + $attempts);
                $data['qr_code'] = 'QR-'.$data['code'];
            }
        }
        if (! isset($record)) {
            $record = InventoryItem::create($data);
        }
        AuditLogController::log($request, 'ADD_INVENTORY', 'Inventaris', "Aset: {$data['name']}");

        return $this->created($record);
    }
}
