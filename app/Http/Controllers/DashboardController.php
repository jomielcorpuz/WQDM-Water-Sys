<?php

namespace App\Http\Controllers;

use App\Models\Sites;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        // Fetch the count of active and inactive sites
        $activeSites = Sites::where('active_status', 'Active')->count();
        $inactiveSites = Sites::where('active_status', 'Inactive')->count();
        $totalSites = Sites::count();

        return inertia('Dashboard', [
            'summaryData' => [
                ['title' => 'Active Sites', 'value' => $activeSites, 'icon' => 'CircleCheck'],
                ['title' => 'Inactive Sites', 'value' => $inactiveSites, 'icon' => 'CircleMinus'],
                ['title' => 'Total Sites', 'value' => $totalSites, 'icon' => 'Globe'],
            ]
        ]);
    }
}
