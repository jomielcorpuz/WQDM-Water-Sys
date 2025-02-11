<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithUpserts;

class Sites extends Model
{
    /** @use HasFactory<\Database\Factories\SitesFactory> */
    use HasFactory;

   // protected $table = 'sites';

    protected $fillable = [
        'id',
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
        'status',
        'active_status'
    ];

    // Define any custom casts for specific attributes
    protected $casts = [
        'latitude' => 'decimal:7',
        'longitude' => 'decimal:7',
    ];

    // Determine water potability
    public function calculateWaterStatus(): string
    {
        if (
            $this->ph_level >= 6.5 && $this->ph_level <= 8.5 &&
            $this->turbidity <= 5 &&
            $this->total_dissolved_solids <= 500
        ) {
            return 'Potable';
        }

        return 'Non-potable';
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
