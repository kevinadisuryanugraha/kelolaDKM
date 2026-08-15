<?php

namespace App\Http\Controllers;

use App\Models\CMSArticle;

class CMSArticleController extends BaseApiController
{
    protected $model = CMSArticle::class;

    protected $searchable = ['title', 'author', 'category'];

    protected $rules = [
        'title' => 'required|string',
        'category' => 'required|string',
        'author' => 'required|string',
        'date' => 'required|date',
        'summary' => 'nullable|string',
        'content' => 'required|string',
        'image_url' => 'nullable|url',
        'views' => 'integer',
        'is_published' => 'boolean',
    ];
}
