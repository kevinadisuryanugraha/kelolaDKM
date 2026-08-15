<?php

namespace Tests\Feature;

use App\Models\RoomBooking;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RoomBookingTest extends TestCase
{
    use RefreshDatabase;

    protected string $token;

    protected function setUp(): void
    {
        parent::setUp();
        $user = User::factory()->create();
        $this->token = $user->createToken('test')->plainTextToken;
    }

    public function test_list_room_bookings(): void
    {
        RoomBooking::create([
            'room_name' => 'Aula Lantai 2',
            'applicant_name' => 'H. Zamzami',
            'event_name' => 'Rapat DKM',
            'start_date' => '2026-08-16',
            'end_date' => '2026-08-16',
        ]);

        $response = $this->withToken($this->token)->getJson('/api/room-bookings');

        $response->assertStatus(200)->assertJsonCount(1, 'data.data');
    }

    public function test_create_room_booking(): void
    {
        $response = $this->withToken($this->token)->postJson('/api/room-bookings', [
            'room_name' => 'Ruang Utama',
            'applicant_name' => 'H. Rahmat',
            'event_name' => 'Kajian Subuh',
            'start_date' => '2026-08-20',
            'end_date' => '2026-08-20',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.room_name', 'Ruang Utama')
            ->assertJsonPath('data.status', 'Menunggu');

        $this->assertDatabaseHas('room_bookings', ['event_name' => 'Kajian Subuh']);
    }

    public function test_validation_rejects_invalid_booking(): void
    {
        $response = $this->withToken($this->token)->postJson('/api/room-bookings', [
            'start_date' => '2026-08-20',
            'end_date' => '2026-08-16', // end before start
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['room_name', 'applicant_name', 'event_name', 'end_date']);
    }

    public function test_requires_authentication(): void
    {
        $response = $this->getJson('/api/room-bookings');

        $response->assertStatus(401);
    }
}
