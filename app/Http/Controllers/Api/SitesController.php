<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Sites;
use App\Http\Resources\DataResource;


class SitesController extends Controller
{
    public function index()
    {

        $sites = Sites::get();
        if($sites)
        {
            return DataResource::collection($sites);

        }
        else
        {
            return response()->json(['message' => 'No record available'], 200);
        }

    }

    public function store()
    {

    }

    public function show()
    {

    }


    public function spatialPage()
    {
        return inertia('Spatial', [
        'auth' => auth()->check() ? auth()->user() : null, // Pass user info if authenticated, otherwise null
    ]);
    }

}
