<?php

namespace App\Http\Controllers;

use App\Models\KajianEvent;

class KajianEventController extends BaseApiController
{
    protected $model = KajianEvent::class;

    protected $searchable = ['title', 'speaker', 'category'];

    protected $rules = [
        'title' => 'required|string',
        'speaker' => 'required|string',
        'speaker_title' => 'nullable|string',
        'speaker_avatar' => 'nullable|url',
        'date' => 'required|date',
        'time' => 'required',
        'location' => 'required|string',
        'category' => 'required|string',
        'description' => 'nullable|string',
        'live_stream_url' => 'nullable|url',
        'poster_url' => 'nullable|url',
        'is_live' => 'boolean',
    ];
}
