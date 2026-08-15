<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['letter_number', 'type', 'sender_or_recipient', 'subject', 'date', 'disposition_to', 'status', 'file_url'])]
class OfficialLetter extends Model {}
