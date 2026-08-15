<?php

namespace App\Http\Controllers;

use App\Models\OfficialLetter;

class OfficialLetterController extends BaseApiController
{
    protected $model = OfficialLetter::class;

    protected $searchable = ['letter_number', 'subject', 'sender_or_recipient'];

    protected $rules = [
        'letter_number' => 'required|string|max:50|unique:official_letters,letter_number,{id}',
        'type' => 'required|in:Masuk,Keluar',
        'sender_or_recipient' => 'required|string',
        'subject' => 'required|string',
        'date' => 'required|date',
        'disposition_to' => 'nullable|string',
        'status' => 'in:Diterima,Diproses,Selesai,Tersimpan',
        'file_url' => 'nullable|string',
    ];
}
