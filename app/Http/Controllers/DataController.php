<?php

namespace App\Http\Controllers;

use App\Models\Sites;
use App\Http\Requests\StoreSitesRequest;
use App\Http\Requests\UpdateSitesRequest;
use App\Http\Resources\DataResource;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Imports\SitesImport;
use App\Exports\ExportSites;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Collection;



class DataController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = Sites::query();


        $sortField = request("sort_field", 'id');
        $sortDirection = request("sort_direction", "asc");

        if (request("name")) {
            $query->where("name", "like", "%" . request("name") . "%");
        }
        if (request("id")) {
            $query->where("id", request("id"));
        }
        if (request("status")) {
            $query->where("status", request("status"));
        }

        $sites_data_all = $query->orderBy($sortField, $sortDirection)->get();
        $sites_data = $query->orderBy($sortField,$sortDirection)
        ->paginate(10)->onEachSide(1);

        return inertia("Sitesdata/Index",[
            "sites_data" => DataResource::collection($sites_data),
            "sites_data_all" => DataResource::collection($sites_data_all),
            'queryParams' =>request()->query() ?: null,
            'success' => session('success'),
        ]);
    }

    public function showBatchUploadForm()
    {
        return Inertia::render('Sitesdata/BatchUpload');
    }

    public function handleBatchUpload(Request $request)
    {
        $request->validate([
            'csv_file' => 'required|file|mimes:csv,txt|max:2048',
        ]);

        $file = $request->file('csv_file');

        try {
            Excel::import(new SitesImport, $file);

            return to_route('sitesdata.index')
        ->with('success', 'Data uploaded successfuly');;
        } catch (\Maatwebsite\Excel\Validators\ValidationException $e) {
            $failures = $e->failures();

            return response()->json([
                'status' => 'error',
                'message' => 'Some rows failed to import.',
                'errors' => $failures,
            ]);
        } catch (\Exception $e) {
            return to_route('sitesdata.index')
        ->with('success', 'Data uploaded successfuly');;
        }
    }

    public function sitesExport(Request $request)
    {
        try {
            // Get all sites with explicit column selection
            $sites = Sites::select(
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
            )->get();

            // For debugging - log the raw data
            Log::info('Raw sites data:', ['data' => $sites->toArray()]);

            $transformedData = DataResource::collection($sites);

            // For debugging - log the transformed data
            Log::info('Transformed data:', ['data' => $transformedData->toArray($request)]);

            return Excel::download(
                new ExportSites($transformedData),
                'water_quality_sites_' . date('Y-m-d') . '.csv',
                \Maatwebsite\Excel\Excel::CSV,
                [
                    'Content-Type' => 'text/csv',
                ]
            );
        } catch (\Exception $e) {
            Log::error('Export failed: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => 'Export failed: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia("Sitesdata/Create");
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSitesRequest $request)
    {
        //$data = $request->validated();

        // Create a new site instance
        $data = new Sites($request->validated());
        // Calculate the status
        $data->status = $data->calculateWaterStatus();

        $data->save();
        //Sites::create($data);


        return to_route('sitesdata.index')
        ->with('success', 'Site was added');;
    }

    /**
     * Display the specified resource.
     */
    public function show(Sites $sites)
    {

    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Sites $sitesdatum)
    {
        Log::info('Recieve edit site:', ['name' => $sitesdatum->name, 'id' => $sitesdatum->id]);

        return inertia('Sitesdata/Edit', [
            'sites' => new DataResource($sitesdatum),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSitesRequest $request, Sites $sitesdatum)
    {
        $data = $request->validated();

        $tempSite = new Sites($data);
        $data['status'] = $tempSite->calculateWaterStatus();
        $name = $sitesdatum->name;
        $sitesdatum->update($data);

        return to_route('sitesdata.index')
        ->with('success', "Site \"$name\" was updated");;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Sites $sitesdatum)
    {
        Log::info('Recieve destroy site:', ['name' => $sitesdatum->name, 'id' => $sitesdatum->id]);

        $name = $sitesdatum->name;
        $sitesdatum->delete();
        return to_route('sitesdata.index')->with('success', "Site \"$name\" was deleted");
    }
}
