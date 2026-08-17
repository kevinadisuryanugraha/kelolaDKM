<?php

namespace Tests\Feature;

use App\Models\FinancialTransaction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CrudTest extends TestCase
{
    use RefreshDatabase;

    protected string $token;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(\Database\Seeders\RoleSeeder::class);
        $user = User::factory()->create(['role' => 'super_admin']);
        $user->assignRole('super_admin');
        $this->token = $user->createToken('test')->plainTextToken;
    }

    public function test_list_transactions(): void
    {
        FinancialTransaction::factory()->count(3)->create();

        $response = $this->withToken($this->token)
            ->getJson('/api/financial-transactions');

        $response->assertStatus(200)
            ->assertJsonCount(3, 'data.data');
    }

    public function test_create_transaction(): void
    {
        $response = $this->withToken($this->token)
            ->postJson('/api/financial-transactions', [
                'date' => '2026-07-27',
                'type' => 'Masuk',
                'account_code' => '401.1',
                'account_name' => 'Infaq Jumat',
                'description' => 'Test transaction',
                'amount' => 500000,
                'category' => 'Infaq',
                'recorded_by' => 'Test User',
            ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.description', 'Test transaction')
            ->assertJsonPath('data.amount', 500000);

        $this->assertDatabaseHas('financial_transactions', [
            'description' => 'Test transaction',
            'amount' => 500000,
        ]);
    }

    public function test_validation_rejects_invalid_data(): void
    {
        $response = $this->withToken($this->token)
            ->postJson('/api/financial-transactions', [
                'type' => 'InvalidType',
                'amount' => -100,
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['date', 'type', 'amount']);
    }

    public function test_public_endpoint_no_auth(): void
    {
        FinancialTransaction::factory()->create(['status' => 'Approved']);
        FinancialTransaction::factory()->create(['status' => 'Pending']);

        $response = $this->getJson('/api/financial-transactions/public');

        $response->assertStatus(200);
        // Only Approved transactions
        $data = $response->json('data');
        $this->assertCount(1, $data);
    }

    public function test_unique_letter_number_validation(): void
    {
        $response = $this->withToken($this->token)
            ->postJson('/api/official-letters', [
                'letter_number' => '001/TEST/VII/2026',
                'type' => 'Masuk',
                'sender_or_recipient' => 'Test Office',
                'subject' => 'First letter',
                'date' => '2026-07-27',
            ]);

        $response->assertStatus(201);

        // Duplicate should fail with validation error, not 500
        $response2 = $this->withToken($this->token)
            ->postJson('/api/official-letters', [
                'letter_number' => '001/TEST/VII/2026',
                'type' => 'Masuk',
                'sender_or_recipient' => 'Test Office',
                'subject' => 'Duplicate',
                'date' => '2026-07-27',
            ]);

        $response2->assertStatus(422)
            ->assertJsonValidationErrors(['letter_number']);
    }

    public function test_transaction_retry_on_unique_collision(): void
    {
        // Create 2 transactions concurrently to test retry logic
        $payload = [
            'date' => '2026-07-27',
            'type' => 'Masuk',
            'account_code' => '401.1',
            'account_name' => 'Infaq',
            'description' => 'Retry test',
            'amount' => 100000,
            'category' => 'Infaq',
            'recorded_by' => 'Test',
        ];

        $r1 = $this->withToken($this->token)->postJson('/api/financial-transactions', $payload);
        $r2 = $this->withToken($this->token)->postJson('/api/financial-transactions', $payload);

        $this->assertEquals(201, $r1->status());
        $this->assertEquals(201, $r2->status());
        $this->assertNotEquals(
            $r1->json('data.ref_number'),
            $r2->json('data.ref_number')
        );
    }

    public function test_unauthorized_role_gets_403(): void
    {
        $viewer = User::factory()->create(['role' => 'viewer']);
        $viewer->assignRole('viewer');
        $viewerToken = $viewer->createToken('viewer-test')->plainTextToken;

        $response = $this->withToken($viewerToken)
            ->postJson('/api/financial-transactions', [
                'date' => '2026-07-27',
                'type' => 'Masuk',
                'account_code' => '401.1',
                'account_name' => 'Infaq',
                'description' => 'Unauthorized attempt',
                'amount' => 100000,
                'category' => 'Infaq',
                'recorded_by' => 'Viewer',
            ]);

        $response->assertStatus(403)
            ->assertJsonPath('success', false);
    }
}
