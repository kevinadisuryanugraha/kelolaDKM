<?php

namespace App\Http\Controllers;

use App\Traits\ApiResponses;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class BaseApiController extends Controller
{
    use ApiResponses;

    protected $model;

    protected $resourceClass;

    protected $rules = [];

    protected $searchable = [];

    public function index(Request $request)
    {
        $query = $this->model::query();

        if ($request->has('search') && $this->searchable) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                foreach ($this->searchable as $col) {
                    $q->orWhere($col, 'like', "%{$search}%");
                }
            });
        }

        $perPage = $request->input('per_page', 50);
        $results = $query->latest()->paginate(min($perPage, 200));

        return $this->ok($results);
    }

    public function store(Request $request)
    {
        $data = $request->validate($this->rules);
        $record = $this->model::create($data);

        return $this->created($record);
    }

    public function show($id)
    {
        $record = $this->model::findOrFail($id);

        return $this->ok($record);
    }

    public function update(Request $request, $id)
    {
        $record = $this->model::findOrFail($id);
        $rules = collect($this->rules)->map(fn ($rule) => str_replace('{id}', $id, $rule))->all();
        $data = $request->validate($rules);
        $record->update($data);

        return $this->ok($record, 'Updated');
    }

    public function destroy($id)
    {
        $record = $this->model::findOrFail($id);
        $record->delete();

        return $this->ok(null, 'Deleted');
    }
}
