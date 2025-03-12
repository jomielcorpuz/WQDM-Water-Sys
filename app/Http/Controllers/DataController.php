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

        // For archived feature, separate active and archived (Not yet implemented)
        $activeSites = Sites::whereNull('deleted_at')->get();
        $archivedSites = Sites::onlyTrashed()->get();

        // Sorting in table
        $sortField = request("sort_field", "id");
        $sortDirection = request("sort_direction", "asc");

        // Apply filters
        if (request("name")) {
            $query->where("name", "like", "%" . request("name") . "%");
        }
        if (request("id")) {
            $query->where("id", request("id"));
        }
        if (request("status") && request("status") !== "all") {
            $query->where("status", request("status"));
        }

        // Clone query before different sorting
        $exportQuery = clone $query;
        $allDataQuery = clone $query;
        $tableDataQuery = clone $query;

        // Fixed sorting for reports
        $sites_data_export = $exportQuery->orderBy("name", "asc")->get();

        // Sorting for other views based on user selection
        $sites_data_all = $allDataQuery->orderBy($sortField, $sortDirection)->get();
        $sites_data = $tableDataQuery->orderBy($sortField, $sortDirection)
            ->paginate(10)->onEachSide(1);

        return inertia("Sitesdata/Index", [
            "sites_data" => DataResource::collection($sites_data),
            "sites_data_all" => DataResource::collection($sites_data_all),
            "sites_data_export" => DataResource::collection($sites_data_export),
            "queryParams" => request()->query() ?: null,
            "success" => session("success"),
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

        // Debug log to check incoming data
        Log::info('Received data: ', $request->validated());

        // Check if the name already exists
        if (Sites::where('name', $request->name)->exists()) {
            return redirect()->back()->withErrors([
                'name' => 'The site name has already been taken.'
            ])->withInput();
        }

        // Create a new site instance
        $data = new Sites($request->validated());

        // Calculate the status
        $data->status = $data->calculateWaterStatus();

        $data->save();
        //Sites::create($data);
        // Debug log to confirm save
        Log::info('Site saved successfully: ', $data->toArray());

        return redirect()->route('sitesdata.store')->with('success',[
            'message' => "Site \"{$data->name}\" was successfully added.",
            'type' => 'create'
        ]);;
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
        Log::info('Incoming request data:', $request->all()); // Debugging: Log all request data

        $data = $request->validated();
        // Check if the name already exists but exclude the current record
        if (Sites::where('name', $data['name'])->where('id', '!=', $sitesdatum->id)->exists()) {
        return redirect()->back()->withErrors([
            'name' => 'The site name has already been taken.'
        ])->withInput();
        }
        $tempSite = new Sites($data);
        $data['status'] = $tempSite->calculateWaterStatus();
        $name = $sitesdatum->name;
        $sitesdatum->update($data);

        $redirectRoute = $request->input('redirect', 'sitesdata.index'); // Get redirect or fallback

        Log::info('Redirect route:', ['redirect' => $redirectRoute]); // Debugging log


       // Use the redirect parameter or fallback to 'sitesdata.index'
       return to_route($redirectRoute)->with('success', [
        'message' => "Site \"{$name}\" was successfully updated.",
        'type' => 'update'
    ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Sites $sitesdatum)
    {
        Log::info('Recieve destroy site:', ['name' => $sitesdatum->name, 'id' => $sitesdatum->id]);

        $name = $sitesdatum->name;
        $sitesdatum->delete();
        return to_route('sitesdata.index')->with('success', [
            'message' => "Site \"{$name}\" was successfully deleted.",
            'type' => 'delete'
        ]);;
    }

    public function restore($id)
    {
        $site = Sites::withTrashed()->findOrFail($id);
        $site->restore();

        return to_route('sitesdata.index')->with('success', [
            'message' => "Site \"{$site->name}\" was successfully restored.",
            'type' => 'restore'
        ]);;
    }
}
