<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Batchupload;
use Illuminate\Support\Facades\Validator;

class BatchuploadController extends Controller
{
    public function showBatchUploadForm()
    {
        return view('batch-upload'); // Create a corresponding view
    }

    public function handleBatchUpload(Request $request)
    {
        $request->validate([
            'csv_file' => 'required|file|mimes:csv,txt|max:2048',
        ]);

        $file = $request->file('csv_file');
        $data = array_map('str_getcsv', file($file->getRealPath()));

        // Assuming the first row contains headers
        $headers = array_map('strtolower', $data[0]);
        unset($data[0]);

        $rules = [
            "name" => ['required', 'string', 'max:255'],
            "ph_level" => ['required', 'numeric', 'between:0,14'],
            "turbidity" => ['required', 'numeric', 'min:0'],
            "total_dissolved_solids" => ['required', 'numeric', 'min:0'],
            "total_hardness" => ['required', 'numeric', 'min:0'],
            "salinity" => ['required', 'numeric', 'min:0'],
            "nitrate" => ['required', 'numeric', 'min:0'],
            "sulfate" => ['required', 'numeric', 'min:0'],
            "latitude" => ['required', 'numeric', 'between:-90,90'],
            "longitude" => ['required', 'numeric', 'between:-180,180'],
        ];

        $errors = [];
        foreach ($data as $index => $row) {
            $rowData = array_combine($headers, $row);

            $validator = Validator::make($rowData, $rules);
            if ($validator->fails()) {
                $errors[$index + 1] = $validator->errors()->all();
                continue;
            }

            // Save to database
            Batchupload::create($rowData);
        }

        if (!empty($errors)) {
            return redirect()->back()->withErrors($errors);
        }

        return redirect()->route('batch.upload')->with('success', 'Data uploaded successfully!');
    }
}


