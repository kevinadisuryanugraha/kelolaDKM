<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['title', 'category', 'author', 'date', 'summary', 'content', 'image_url', 'views', 'is_published'])]
class CMSArticle extends Model
{
    protected $table = 'cms_articles';
}
