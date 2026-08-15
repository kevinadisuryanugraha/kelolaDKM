<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['room_name', 'applicant_name', 'event_name', 'start_date', 'end_date', 'status'])]
class RoomBooking extends Model
{
    protected $attributes = [
        'status' => 'Menunggu',
    ];
}
