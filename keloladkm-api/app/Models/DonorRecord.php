<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['donor_name', 'phone', 'email', 'donation_campaign_id', 'amount', 'method', 'date', 'status', 'proof_url', 'is_anonymous'])]
class DonorRecord extends Model {}
