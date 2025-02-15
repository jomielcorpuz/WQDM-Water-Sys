<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class DataResource extends JsonResource
{
    public static $wrap = false;

    public function toArray(Request $request): array
    {
        return [
            'id'=> $this->id,
            'name'=> $this->name,
            'ph_level'=> $this->ph_level,
            'turbidity'=> $this->turbidity,
            'total_dissolved_solids'=> $this->total_dissolved_solids,
            'total_hardness'=> $this->total_hardness,
            'salinity'=> $this->salinity,
            'nitrate'=> $this->nitrate,
            'sulfate'=> $this->sulfate,
            'latitude'=> $this->latitude,
            'longitude'=> $this->longitude,
            'status'=> $this->status,
            'active_status'=> $this->active_status,
            'address'=> $this->address,
        ];
    }
}
