<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['title', 'category', 'target_amount', 'collected_amount', 'donor_count', 'deadline', 'description', 'image_url', 'is_urgent'])]
class DonationCampaign extends Model {}
