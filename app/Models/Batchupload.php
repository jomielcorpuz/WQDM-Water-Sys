<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Batchupload extends Model
{


    protected $fillable = [
        'name',
        'ph_level',
        'turbidity',
        'total_dissolved_solids',
        'total_hardness',
        'salinity',
        'nitrate',
        'sulfate',
        'latitude',
        'longitude',
    ];
}
