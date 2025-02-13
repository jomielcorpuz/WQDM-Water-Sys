<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Sites;


class SitesStatusController extends Controller
{
    public function getSiteData()
    {
        $sites = Sites::selectRaw('DATE(created_at) as date,
                SUM(CASE WHEN status COLLATE utf8_general_ci = "potable" THEN 1 ELSE 0 END) as potable,
                SUM(CASE WHEN status COLLATE utf8_general_ci = "non-potable" THEN 1 ELSE 0 END) as nonpotable')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return response()->json($sites);
    }

}
