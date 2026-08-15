<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['title', 'speaker', 'speaker_title', 'speaker_avatar', 'date', 'time', 'location', 'category', 'description', 'live_stream_url', 'poster_url', 'is_live'])]
class KajianEvent extends Model {}
