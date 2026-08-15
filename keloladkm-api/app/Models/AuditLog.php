<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['timestamp', 'user_name', 'user_role', 'action', 'module', 'details', 'ip_address'])]
class AuditLog extends Model {}
