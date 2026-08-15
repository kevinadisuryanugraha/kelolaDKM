<?php

namespace App\Http\Controllers;

use App\Models\RoomBooking;

class RoomBookingController extends BaseApiController
{
    protected $model = RoomBooking::class;

    protected $searchable = ['room_name', 'applicant_name', 'event_name'];

    protected $rules = [
        'room_name' => 'required|string|max:255',
        'applicant_name' => 'required|string|max:255',
        'event_name' => 'required|string|max:255',
        'start_date' => 'required|date',
        'end_date' => 'required|date|after_or_equal:start_date',
        'status' => 'in:Disetujui,Menunggu,Ditolak',
    ];
}
