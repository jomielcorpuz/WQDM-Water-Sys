<?php

namespace App\Http\Controllers;

use App\Models\Sites;
use Illuminate\Http\Request;
use App\Http\Resources\DataResource;

class SpatialviewsController extends Controller
{
    public function index()
    {

        return inertia('Spatialviews/Index');
    }

    // public function index()
    // {
    //     // $sitesdata = Sites::select('name', 'ph_level', 'latitude', 'longitude')->get();

    //     $sites = Sites::get();
    //     if($sites)
    //     {
    //         return DataResource::collection($sites);

    //     }
    //     else
    //     {
    //         return response()->json(['message' => 'No record available'], 200);
    //     }

    //     // Transform data using DataResource
    //     // $siteDataTransformed = DataResource::collection($sitesdata);

    //     // return Inertia::render('Spatial', [
    //     //     'waterQualityData' => $siteDataTransformed,
    //     // ]);
    // }



}
