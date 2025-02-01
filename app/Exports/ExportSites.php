<?php

namespace App\Exports;

use App\Models\Sites;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class ExportSites implements FromCollection, WithHeadings
{
    protected $data;

    public function __construct(AnonymousResourceCollection  $data)
    {

        $this->data = $data;
        Log::info('Data received in ExportSites:', ['count' => $data->count()]);
    }

    public function collection()
    {
          // Convert the resource collection to an array and then map it
          $exportData = collect($this->data->toArray(request())['data'] ?? $this->data->toArray(request()))->map(function ($item) {
            // Debug log to check each row being processed
            Log::info('Processing row:', ['row' => $item]);

            return [
                'name' => $item['name'] ?? '',
                'ph_level' => $item['ph_level'] ?? '',
                'turbidity' => $item['turbidity'] ?? '',
                'total_dissolved_solids' => $item['total_dissolved_solids'] ?? '',
                'total_hardness' => $item['total_hardness'] ?? '',
                'salinity' => $item['salinity'] ?? '',
                'nitrate' => $item['nitrate'] ?? '',
                'sulfate' => $item['sulfate'] ?? '',
                'latitude' => $item['latitude'] ?? '',
                'longitude' => $item['longitude'] ?? '',
                'status' => $item['status'] ?? ''
            ];
        });

        // Debug log to check final export data
        Log::info('Final export data:', ['count' => $exportData->count()]);

        return $exportData;
    }
    public function headings(): array
    {
        return [
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
        'status'
        ];
    }
    public function styles(Worksheet $sheet)
    {
        return [
            1 => [
                'font' => ['bold' => true],
                'fill' => [
                    'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                    'startColor' => ['rgb' => 'E2E8F0']
                ]
            ]
        ];
    }
}
