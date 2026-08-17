<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RbacAccessTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleSeeder::class);
    }

    private function createTokenForRole(string $role): string
    {
        $user = User::factory()->create(['role' => $role]);
        $user->assignRole($role);
        return $user->createToken('test-' . $role)->plainTextToken;
    }

    public function test_super_admin_can_access_all_endpoints(): void
    {
        $token = $this->createTokenForRole('super_admin');

        $this->withToken($token)->getJson('/api/financial-transactions')->assertStatus(200);
        $this->withToken($token)->getJson('/api/donor-records')->assertStatus(200);
        $this->withToken($token)->getJson('/api/inventory-items')->assertStatus(200);
        $this->withToken($token)->getJson('/api/official-letters')->assertStatus(200);
        $this->withToken($token)->getJson('/api/audit-logs')->assertStatus(200);
        $this->withToken($token)->getJson('/api/dashboard/overview')->assertStatus(200);
    }

    public function test_bendahara_can_access_finances_but_denied_letters_and_audit_logs(): void
    {
        $token = $this->createTokenForRole('bendahara');

        // Allowed: Finances & Donations
        $this->withToken($token)->getJson('/api/financial-transactions')->assertStatus(200);
        $this->withToken($token)->getJson('/api/donor-records')->assertStatus(200);
        $this->withToken($token)->getJson('/api/budget-plans')->assertStatus(200);

        // Denied: Letters & Audit logs
        $this->withToken($token)->getJson('/api/official-letters')->assertStatus(403);
        $this->withToken($token)->getJson('/api/audit-logs')->assertStatus(403);
        $this->withToken($token)->getJson('/api/inventory-items')->assertStatus(403);
    }

    public function test_sekretaris_can_access_letters_but_denied_finances_and_inventory(): void
    {
        $token = $this->createTokenForRole('sekretaris');

        // Allowed: Letters & Kajian Events (write)
        $this->withToken($token)->getJson('/api/official-letters')->assertStatus(200);

        // Denied: Financial Transactions & Inventory
        $this->withToken($token)->getJson('/api/financial-transactions')->assertStatus(403);
        $this->withToken($token)->getJson('/api/inventory-items')->assertStatus(403);
        $this->withToken($token)->getJson('/api/audit-logs')->assertStatus(403);
    }

    public function test_admin_inventaris_can_access_inventory_but_denied_finances_and_letters(): void
    {
        $token = $this->createTokenForRole('admin_inventaris');

        // Allowed: Inventory & Room Bookings
        $this->withToken($token)->getJson('/api/inventory-items')->assertStatus(200);
        $this->withToken($token)->getJson('/api/room-bookings')->assertStatus(200);

        // Denied: Financial Transactions, Letters & Audit logs
        $this->withToken($token)->getJson('/api/financial-transactions')->assertStatus(403);
        $this->withToken($token)->getJson('/api/official-letters')->assertStatus(403);
        $this->withToken($token)->getJson('/api/audit-logs')->assertStatus(403);
    }

    public function test_viewer_can_access_overview_but_denied_crud_endpoints(): void
    {
        $token = $this->createTokenForRole('viewer');

        // Allowed: Overview
        $this->withToken($token)->getJson('/api/dashboard/overview')->assertStatus(200);

        // Denied: Financial, Letters, Audit Logs, Inventory
        $this->withToken($token)->getJson('/api/financial-transactions')->assertStatus(403);
        $this->withToken($token)->getJson('/api/official-letters')->assertStatus(403);
        $this->withToken($token)->getJson('/api/inventory-items')->assertStatus(403);
        $this->withToken($token)->getJson('/api/audit-logs')->assertStatus(403);
    }
}
