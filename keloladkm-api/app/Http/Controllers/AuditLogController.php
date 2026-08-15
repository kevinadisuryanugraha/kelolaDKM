<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use Illuminate\Http\Request;

class AuditLogController extends BaseApiController
{
    protected $model = AuditLog::class;

    protected $searchable = ['user_name', 'action', 'module', 'details'];

    // Read-only — no store/update/delete via this controller
    public function store(Request $request)
    {
        return $this->error('Forbidden', 403);
    }

    public function update(Request $request, $id)
    {
        return $this->error('Forbidden', 403);
    }

    public function destroy($id)
    {
        return $this->error('Forbidden', 403);
    }

    /** Helper to be called from other controllers */
    public static function log(Request $request, string $action, string $module, string $details): void
    {
        AuditLog::create([
            'user_name' => $request->user()?->name ?? 'System',
            'user_role' => $request->user()?->role ?? 'system',
            'action' => $action,
            'module' => $module,
            'details' => $details,
            'ip_address' => $request->ip(),
        ]);
    }
}
