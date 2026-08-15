<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['participant_name', 'animal_type', 'group_name', 'phone', 'amount', 'payment_status', 'coupon_code', 'is_distributed'])]
class QurbanParticipant extends Model {}
