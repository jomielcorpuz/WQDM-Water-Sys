<?php

namespace App\Imports;

use App\Models\Sites;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithUpserts;
use Maatwebsite\Excel\Concerns\WithSkipDuplicates;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Concerns\SkipsEmptyRows;

class SitesImport implements ToModel, WithHeadingRow, WithUpserts, WithValidation, WithSkipDuplicates, SkipsEmptyRows
{
    /**
    * @param array $row
    *
    * @return \Illuminate\Database\Eloquent\Model|null
    */
    public function model(array $row)
    {
        Log::info('Parsed Row:', $row);

        if (empty($row['name']) || empty($row['ph_level']) || empty($row['latitude']) || empty($row['longitude'])) {
            return null; // Skip invalid rows
        }
        return new Sites([

            'name' => $row['name'],
            'ph_level' => $row['ph_level'],
            'turbidity' => $row['turbidity'],
            'total_dissolved_solids' => $row['total_dissolved_solids'],
            'total_hardness' => $row['total_hardness'],
            'salinity' => $row['salinity'],
            'nitrate' => $row['nitrate'],
            'sulfate' => $row['sulfate'],
            'latitude' => $row['latitude'],
            'longitude' => $row['longitude'],
        ]);


    }
    public function uniqueBy()
    {
        return 'name'; // Adjust to match your unique column, or use an array for composite keys
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'ph_level' => 'required|numeric|between:0,14',
            'turbidity' => 'nullable|numeric',
            'total_dissolved_solids' => 'nullable|numeric',
            'total_hardness' => 'nullable|numeric',
            'salinity' => 'nullable|numeric',
            'nitrate' => 'nullable|numeric',
            'sulfate' => 'nullable|numeric',
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
        ];
    }
}
