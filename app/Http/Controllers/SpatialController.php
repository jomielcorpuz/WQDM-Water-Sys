<?php

namespace App\Http\Controllers;


use App\Models\Sites;
use Inertia\Inertia;
use App\Http\Resources\DataResource;

class SpatialController extends Controller
{
    /**
     * Display a map with spatial data.
     */
    public function spatial()
    {
        // $sitesdata = Sites::select('name', 'ph_level', 'latitude', 'longitude')->get();

        $sites = Sites::get();
        if($sites)
        {
            return DataResource::collection($sites);

        }
        else
        {
            return response()->json(['message' => 'No record available'], 200);
        }

        // Transform data using DataResource
        // $siteDataTransformed = DataResource::collection($sitesdata);

        // return Inertia::render('Spatial', [
        //     'waterQualityData' => $siteDataTransformed,
        // ]);
    }


    public function spatialIndex()
    {

        return inertia('Spatialviews/ViewSpatial', [
            'auth' => auth()->check(),
        ]);
    }
}
