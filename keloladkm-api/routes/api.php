<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\AuditLogController;
use App\Http\Controllers\BudgetPlanController;
use App\Http\Controllers\CMSArticleController;
use App\Http\Controllers\DonationCampaignController;
use App\Http\Controllers\DonorRecordController;
use App\Http\Controllers\FinancialAccountController;
use App\Http\Controllers\FinancialTransactionController;
use App\Http\Controllers\InventoryItemController;
use App\Http\Controllers\KajianEventController;
use App\Http\Controllers\OfficialLetterController;
use App\Http\Controllers\QurbanParticipantController;
use App\Http\Controllers\RoomBookingController;
use App\Models\AuditLog;
use App\Models\DonationCampaign;
use App\Models\DonorRecord;
use App\Models\FinancialTransaction;
use App\Models\InventoryItem;
use Illuminate\Support\Facades\Route;

// ── Public ──
Route::get('login', fn () => response()->json(['success' => false, 'message' => 'Unauthenticated.'], 401))->name('login');
Route::get('kajian-events', [KajianEventController::class, 'index']);
Route::get('donation-campaigns', [DonationCampaignController::class, 'index']);
Route::get('financial-transactions/public', [FinancialTransactionController::class, 'publicIndex']);
Route::get('cms-articles', [CMSArticleController::class, 'index']);
Route::get('cms-articles/{article}', [CMSArticleController::class, 'show']);

// ── Auth ──
Route::post('login', [AuthController::class, 'login'])->middleware('throttle:5,1');
Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::get('me', [AuthController::class, 'me'])->middleware('auth:sanctum');

// ── Protected (auth:sanctum) ──
Route::middleware('auth:sanctum')->group(function () {
    // 1. Financial & Budgets
    Route::middleware('role:super_admin|ketua_dkm|wakil_ketua|bendahara|admin_keuangan')->group(function () {
        Route::apiResource('financial-transactions', FinancialTransactionController::class);
        Route::apiResource('financial-accounts', FinancialAccountController::class);
        Route::apiResource('budget-plans', BudgetPlanController::class);
    });

    // 2. Donations & ZISWAF
    Route::middleware('role:super_admin|bendahara|admin_keuangan|relawan')->group(function () {
        Route::apiResource('donation-campaigns', DonationCampaignController::class)->except(['index']);
        Route::apiResource('donor-records', DonorRecordController::class);
        Route::apiResource('qurban-participants', QurbanParticipantController::class);
        Route::patch('qurban-participants/{participant}/toggle-distributed', [QurbanParticipantController::class, 'toggleDistributed']);
    });

    // 3. Inventory & Facilities (Sarpras)
    Route::middleware('role:super_admin|admin_inventaris')->group(function () {
        Route::apiResource('inventory-items', InventoryItemController::class);
        Route::apiResource('room-bookings', RoomBookingController::class);
    });

    // 4. Agenda & Events
    Route::middleware('role:super_admin|sekretaris|ketua_dkm|wakil_ketua|imam_muadzin')->group(function () {
        Route::apiResource('kajian-events', KajianEventController::class)->except(['index']);
    });

    // 5. Letters & Official Documents
    Route::middleware('role:super_admin|sekretaris|ketua_dkm|wakil_ketua')->group(function () {
        Route::apiResource('official-letters', OfficialLetterController::class);
    });

    // 6. Website CMS Articles (Create, Update, Delete)
    Route::middleware('role:super_admin|sekretaris')->group(function () {
        Route::apiResource('cms-articles', CMSArticleController::class)->except(['index', 'show']);
    });

    // 7. Audit Log (Read-only)
    Route::middleware('role:super_admin|ketua_dkm|wakil_ketua')->group(function () {
        Route::get('audit-logs', [AuditLogController::class, 'index']);
        Route::get('audit-logs/{log}', [AuditLogController::class, 'show']);
    });

    // 8. General Dashboard overview (accessible by any authenticated user)
    Route::get('dashboard/overview', function () {
        return response()->json([
            'success' => true,
            'data' => [
                'total_transactions' => FinancialTransaction::count(),
                'total_donations' => DonorRecord::sum('amount'),
                'total_campaigns' => DonationCampaign::count(),
                'total_inventory' => InventoryItem::count(),
                'recent_audit_logs' => AuditLog::latest()->take(10)->get(),
            ],
        ]);
    });
});
